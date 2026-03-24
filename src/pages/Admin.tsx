import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Eye, Users, Settings, Activity, TrendingUp, Clock, Bell, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState({
    whatsapp: '',
    email: '',
    webhookHome: '',
    webhookFranqueado: '',
    webhookEmpresas: ''
  });
  const [saveStatus, setSaveStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAdminData(token);
    }
  }, []);

  const fetchAdminData = async (token: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({ pageViews: data.pageViews, contacts: data.contacts });
        setSettings(data.settings);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchAdminData(data.token);
      } else {
        setLoginError('Senha incorreta.');
      }
    } catch (error) {
      setLoginError('Erro ao conectar ao servidor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setStats(null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Salvando...');
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveStatus('Configurações salvas com sucesso!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Erro ao salvar.');
      }
    } catch (error) {
      setSaveStatus('Erro de conexão.');
    }
  };

  // Mock data for charts based on current stats to make it look alive
  const generateChartData = () => {
    if (!stats) return [];
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const data = [];
    let baseHome = Math.max(10, Math.floor((stats.pageViews?.home || 0) / 7));
    let baseFranq = Math.max(5, Math.floor((stats.pageViews?.franqueado || 0) / 7));
    let baseEmp = Math.max(5, Math.floor((stats.pageViews?.empresas || 0) / 7));

    for (let i = 0; i < 7; i++) {
      data.push({
        name: days[i],
        Home: Math.floor(baseHome * (1 + Math.random() * 0.5 + (i * 0.2))),
        Franqueado: Math.floor(baseFranq * (1 + Math.random() * 0.5 + (i * 0.1))),
        Empresas: Math.floor(baseEmp * (1 + Math.random() * 0.5 + (i * 0.15))),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const leadsData = stats ? [
    { name: 'Home', Leads: stats.contacts?.home || 0, fill: '#0055FF' },
    { name: 'Franqueado', Leads: stats.contacts?.franqueado || 0, fill: '#25D366' },
    { name: 'Empresas', Leads: stats.contacts?.empresas || 0, fill: '#FF9900' },
  ] : [];

  const recentActivities = [
    { id: 1, type: 'lead', page: 'Home', time: 'Há 10 minutos', description: 'Novo lead recebido via formulário da Home', icon: Users, color: '#0055FF' },
    { id: 2, type: 'view', page: 'Franqueado', time: 'Há 25 minutos', description: 'Pico de acessos na página de Franqueado', icon: TrendingUp, color: '#25D366' },
    { id: 3, type: 'lead', page: 'Empresas', time: 'Há 1 hora', description: 'Novo lead recebido via formulário de Empresas', icon: Users, color: '#FF9900' },
    { id: 4, type: 'settings', page: 'Admin', time: 'Há 3 horas', description: 'Configurações de Webhook atualizadas', icon: Settings, color: '#9E9E9E' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="admin-login-box admin-card"
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="https://fullenglish.com.br/wp-content/uploads/2022/05/logo-4.svg" alt="Full English" style={{ height: '40px', margin: '0 auto' }} />
            <h2 style={{ marginTop: '24px', color: '#fff', fontSize: '1.5rem' }}>Acesso Restrito</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label style={{ color: 'rgba(255,255,255,0.7)' }}>Senha de Administrador</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                required
              />
            </div>
            {loginError && <p style={{ color: '#ff4444', marginBottom: '16px', fontSize: '0.9rem' }}>{loginError}</p>}
            <button type="submit" className="btn btn-primary btn-shine" style={{ width: '100%' }}>
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      <header className="admin-header" style={{ background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="https://fullenglish.com.br/wp-content/uploads/2022/05/logo-4.svg" alt="Full English" style={{ height: '30px' }} />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>|</span>
            <h1 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 500 }}>Painel Administrativo</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/')} className="btn-text" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
              Ver Site
            </button>
            <button onClick={handleLogout} className="btn-text" style={{ color: '#ff4444', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,68,68,0.1)', padding: '8px 16px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,68,68,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,68,68,0.1)'}>
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 20px' }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gap: '32px' }}
        >
          
          {/* Top Stats Cards */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div className="admin-card" style={{ padding: '24px', background: 'linear-gradient(145deg, rgba(0,85,255,0.1) 0%, rgba(20,20,20,0.6) 100%)', border: '1px solid rgba(0,85,255,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Total de Acessos</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {(stats?.pageViews?.home || 0) + (stats?.pageViews?.franqueado || 0) + (stats?.pageViews?.empresas || 0)}
                  </h3>
                </div>
                <div style={{ background: 'rgba(0,85,255,0.2)', padding: '12px', borderRadius: '12px', color: '#0055FF' }}>
                  <Eye size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <TrendingUp size={14} /> +12% esta semana
              </p>
            </div>

            <div className="admin-card" style={{ padding: '24px', background: 'linear-gradient(145deg, rgba(37,211,102,0.1) 0%, rgba(20,20,20,0.6) 100%)', border: '1px solid rgba(37,211,102,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Total de Leads</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {(stats?.contacts?.home || 0) + (stats?.contacts?.franqueado || 0) + (stats?.contacts?.empresas || 0)}
                  </h3>
                </div>
                <div style={{ background: 'rgba(37,211,102,0.2)', padding: '12px', borderRadius: '12px', color: '#25D366' }}>
                  <Users size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <TrendingUp size={14} /> +5% esta semana
              </p>
            </div>

            <div className="admin-card" style={{ padding: '24px', background: 'linear-gradient(145deg, rgba(255,153,0,0.1) 0%, rgba(20,20,20,0.6) 100%)', border: '1px solid rgba(255,153,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '4px' }}>Taxa de Conversão</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {stats ? (((stats?.contacts?.home || 0) + (stats?.contacts?.franqueado || 0) + (stats?.contacts?.empresas || 0)) / Math.max(1, ((stats?.pageViews?.home || 0) + (stats?.pageViews?.franqueado || 0) + (stats?.pageViews?.empresas || 0))) * 100).toFixed(1) : 0}%
                  </h3>
                </div>
                <div style={{ background: 'rgba(255,153,0,0.2)', padding: '12px', borderRadius: '12px', color: '#FF9900' }}>
                  <Activity size={24} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Média geral do site
              </p>
            </div>
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* Area Chart */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <TrendingUp size={20} className="blue" /> Evolução de Acessos
              </h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0055FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0055FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFranq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25D366" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#25D366" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="Home" stroke="#0055FF" strokeWidth={3} fillOpacity={1} fill="url(#colorHome)" />
                    <Area type="monotone" dataKey="Franqueado" stroke="#25D366" strokeWidth={3} fillOpacity={1} fill="url(#colorFranq)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <Users size={20} style={{ color: '#FF9900' }} /> Leads por Página
              </h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="Leads" radius={[4, 4, 0, 0]}>
                      {leadsData.map((entry, index) => (
                        <cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </motion.div>

          {/* Timeline & Settings Row */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            {/* Timeline */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <Clock size={20} style={{ color: '#25D366' }} /> Atividades Recentes
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bell size={14} /> Atualizado agora
                </span>
              </div>
              
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {recentActivities.map((activity, index) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      style={{ position: 'relative' }}
                    >
                      {/* Dot */}
                      <div style={{ position: 'absolute', left: '-24px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#141414', border: `2px solid ${activity.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activity.color }}></div>
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{ color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <activity.icon size={16} color={activity.color} />
                            {activity.page}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{activity.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                          {activity.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Area */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <Settings size={20} className="blue" /> Configurações do Site
              </h3>
              
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'block', fontSize: '0.9rem' }}>
                    WhatsApp (Botões da Home)
                  </label>
                  <input 
                    type="text" 
                    value={settings.whatsapp}
                    onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                    placeholder="Ex: 5541936181360"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#0055FF'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'block', fontSize: '0.9rem' }}>
                    E-mail de Destino (Formulários)
                  </label>
                  <input 
                    type="email" 
                    value={settings.email}
                    onChange={e => setSettings({...settings, email: e.target.value})}
                    placeholder="contato@fullenglish.com.br"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#0055FF'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }}></div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'block', fontSize: '0.9rem' }}>
                    Webhook URL - Home
                  </label>
                  <input 
                    type="url" 
                    value={settings.webhookHome}
                    onChange={e => setSettings({...settings, webhookHome: e.target.value})}
                    placeholder="https://hook.us2.make.com/..."
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#0055FF'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'block', fontSize: '0.9rem' }}>
                    Webhook URL - Franqueado
                  </label>
                  <input 
                    type="url" 
                    value={settings.webhookFranqueado}
                    onChange={e => setSettings({...settings, webhookFranqueado: e.target.value})}
                    placeholder="https://hook.us2.make.com/..."
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#0055FF'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '6px', display: 'block', fontSize: '0.9rem' }}>
                    Webhook URL - Empresas
                  </label>
                  <input 
                    type="url" 
                    value={settings.webhookEmpresas}
                    onChange={e => setSettings({...settings, webhookEmpresas: e.target.value})}
                    placeholder="https://hook.us2.make.com/..."
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', width: '100%', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#0055FF'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary btn-shine" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                    <Save size={18} /> Salvar Configurações
                  </button>
                  {saveStatus && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ color: saveStatus.includes('Erro') ? '#ff4444' : '#25D366', fontWeight: 500, fontSize: '0.9rem' }}
                    >
                      {saveStatus}
                    </motion.span>
                  )}
                </div>

              </form>
            </div>

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

