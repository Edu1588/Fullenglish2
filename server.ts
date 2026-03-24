import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(process.cwd(), 'data.json');

const defaultData = {
  pageViews: {
    home: 0,
    franqueado: 0,
    empresas: 0
  },
  contacts: {
    home: 0,
    franqueado: 0,
    empresas: 0
  },
  settings: {
    whatsapp: '5511999999999',
    email: 'contato@fullenglish.com',
    webhookHome: 'https://hook.us1.make.com/your-webhook-id-home',
    webhookFranqueado: 'https://hook.us1.make.com/your-webhook-id-franqueado',
    webhookEmpresas: 'https://hook.us1.make.com/your-webhook-id-empresas'
  }
};

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

function getData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultData;
  }
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/settings', (req, res) => {
  const data = getData();
  res.json(data.settings);
});

app.post('/api/track/view', (req, res) => {
  const { page } = req.body;
  if (page && ['home', 'franqueado', 'empresas'].includes(page)) {
    const data = getData();
    data.pageViews[page] = (data.pageViews[page] || 0) + 1;
    saveData(data);
  }
  res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
  const { source, formData } = req.body;
  const data = getData();
  
  if (source && ['home', 'franqueado', 'empresas'].includes(source)) {
    data.contacts[source] = (data.contacts[source] || 0) + 1;
    saveData(data);
  }

  // Forward to webhook
  try {
    let targetWebhook = '';
    if (source === 'home') targetWebhook = data.settings.webhookHome;
    else if (source === 'franqueado') targetWebhook = data.settings.webhookFranqueado;
    else if (source === 'empresas') targetWebhook = data.settings.webhookEmpresas;

    if (targetWebhook) {
      await fetch(targetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source, destEmail: data.settings.email })
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
  }

  res.json({ success: true });
});

// Admin APIs
const ADMIN_PASSWORD = 'cainanfullenglish2026';

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Senha incorreta' });
  }
});

const requireAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  if (token === 'Bearer admin-token-123') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Não autorizado' });
  }
};

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const data = getData();
  res.json({
    pageViews: data.pageViews,
    contacts: data.contacts,
    settings: data.settings
  });
});

app.post('/api/admin/settings', requireAdmin, (req, res) => {
  const { whatsapp, email, webhookHome, webhookFranqueado, webhookEmpresas } = req.body;
  const data = getData();
  
  if (whatsapp !== undefined) data.settings.whatsapp = whatsapp;
  if (email !== undefined) data.settings.email = email;
  if (webhookHome !== undefined) data.settings.webhookHome = webhookHome;
  if (webhookFranqueado !== undefined) data.settings.webhookFranqueado = webhookFranqueado;
  if (webhookEmpresas !== undefined) data.settings.webhookEmpresas = webhookEmpresas;
  
  saveData(data);
  res.json({ success: true, settings: data.settings });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
