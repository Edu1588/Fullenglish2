import React, { useEffect, useState } from 'react';

export default function Empresas() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    funcionarios: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formParams = Object.fromEntries(new URLSearchParams(formData as any).entries());
    formParams.data_hora = new Date().toISOString();
    formParams.page_url = window.location.href;
    formParams.user_agent = navigator.userAgent;
    formParams.origem = 'Empresas';

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: 'empresas', formData: formParams })
    })
    .then(res => res.json())
    .then(() => {
      setFormStatus('success');
      setFormData({ nome: '', email: '', telefone: '', empresa: '', funcionarios: '' });
      setTimeout(() => {
        window.location.href = 'https://fullenglish.com.br/obrigado/';
      }, 1500);
    })
    .catch(error => {
      console.error('Erro de submissão:', error);
      setFormStatus('error');
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Track page view
    fetch('/api/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'empresas' })
    }).catch(console.error);

    const observeElements = (selector: string, className: string, options = { threshold: 0.1, rootMargin: "0px" }) => {
      const els = document.querySelectorAll(selector);
      if (!els || !els.length) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add(className);
        });
      }, options);
      els.forEach(el => observer.observe(el));
      return observer;
    };

    const obs1 = observeElements('.reveal-wrapper, .reveal-blur', 'animated', { threshold: 0.5, rootMargin: "0px" });
    const obs2 = observeElements('.fade-in-up', 'is-visible', { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    return () => {
      obs1?.disconnect();
      obs2?.disconnect();
    };
  }, []);

  return (
    <main id="top">
      <section className="hero" style={{ padding: '240px 0 160px 0' }}>
        <div className="hero-bg" style={{ 
          background: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80) center/cover no-repeat' 
        }}></div>
        <div className="hero-overlay" style={{ background: 'radial-gradient(circle at 12% 80%, rgba(255, 0, 66, 0.20), transparent 28%), radial-gradient(circle at 86% 16%, rgba(0, 68, 192, 0.18), transparent 22%), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)' }}></div>
        
        <div className="container hero-centered-layout">
          <div className="hero-copy fade-in-up">
            <span className="eyebrow">Inglês Corporativo</span>
            <h1 className="hero-title">FULL ENGLISH <br/><span className="blue reveal-wrapper">PARA EMPRESAS</span></h1>
            <p className="hero-text">
              Capacite sua equipe com um inglês focado em negócios. Aumente a produtividade e expanda globalmente.
            </p>
            <div className="hero-actions">
              <a href="#contato" className="btn btn-primary btn-arrow btn-shine">Falar com Consultor</a>
            </div>
          </div>
        </div>
      </section>

      <section className="about dark-section" style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="about-head fade-in-up">
            <h2 className="section-title">Acelere o crescimento da sua <span className="blue reveal-blur">empresa</span></h2>
            <p className="section-desc">
              Programas customizados para as necessidades do seu time, com relatórios de acompanhamento de performance.
            </p>
          </div>

          <div className="features-grid fade-in-up">
            <article className="feature-card fc-blue">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop" alt="Aulas In-Company" loading="lazy" />
                </div>
                <div className="feature-content">
                  <h3>Aulas In-Company</h3>
                  <p>Nossos professores vão até a sua empresa, presencialmente ou online, para otimizar o tempo da sua equipe.</p>
                </div>
              </div>
            </article>

            <article className="feature-card fc-darkred">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop" alt="Foco em Negócios" loading="lazy" />
                </div>
                <div className="feature-content">
                  <h3>Foco em Negócios</h3>
                  <p>Vocabulário e situações práticas do mundo corporativo: reuniões, apresentações e negociações.</p>
                </div>
              </div>
            </article>

            <article className="feature-card fc-brightred">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop" alt="Dashboard de RH" loading="lazy" />
                </div>
                <div className="feature-content">
                  <h3>Dashboard de RH</h3>
                  <p>Acompanhe a frequência, engajamento e evolução de cada colaborador em tempo real.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="franchise dark-section" id="contato" style={{ padding: '100px 0' }}>
        <div className="container fade-in-up">
          <div className="franchise-head" style={{ display: 'grid', gap: '16px', marginBottom: '50px', justifyItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title">Transforme sua <span className="blue reveal-blur">equipe</span></h2>
            <p className="section-desc">Preencha o formulário abaixo para que nossos consultores entendam as necessidades da sua empresa e montem uma proposta personalizada.</p>
          </div>

          <div className="franchise-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'start' }}>
            <article className="franchise-card glass-card" style={{ minHeight: '100%', padding: '40px', color: '#fff' }}>
              <h3 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#ffffff', margin: '0 0 14px 0' }}>Vantagens Corporativas</h3>
              <p className="section-desc" style={{ color: 'rgba(255,255,255,.78)', maxWidth: '100%', marginTop: '14px' }}>
                Benefícios exclusivos para parceiros B2B.
              </p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '16px', marginTop: '30px', padding: '0', color: 'rgba(255,255,255,.85)', fontSize: '1.05rem' }}>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Planos flexíveis de acordo com o tamanho da equipe.</li>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Acompanhamento dedicado de um Gerente de Sucesso (CS).</li>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Relatórios mensais de desempenho e frequência.</li>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Certificação de proficiência para os colaboradores.</li>
              </ul>
            </article>

            <article>
              <div className="contact-form-wrapper glass-card" style={{ padding: '40px' }}>
                <h3 style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '1.8rem', marginBottom: '24px', color: '#fff' }}>Solicite uma Proposta</h3>
                {formStatus === 'success' ? (
                  <div className="form-success" style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Solicitação enviada!</h4>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Nossa equipe entrará em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="nome">Nome do Responsável</label>
                      <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">E-mail Corporativo</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="seu@empresa.com.br" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone / WhatsApp</label>
                      <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="empresa">Nome da Empresa</label>
                      <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} required placeholder="Sua empresa" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="funcionarios">Número de Colaboradores</label>
                      <select id="funcionarios" name="funcionarios" value={formData.funcionarios} onChange={handleChange} required style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', appearance: 'none' }}>
                        <option value="" disabled style={{ color: '#000' }}>Selecione uma opção</option>
                        <option value="1 a 10" style={{ color: '#000' }}>1 a 10</option>
                        <option value="11 a 50" style={{ color: '#000' }}>11 a 50</option>
                        <option value="51 a 200" style={{ color: '#000' }}>51 a 200</option>
                        <option value="Mais de 200" style={{ color: '#000' }}>Mais de 200</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-arrow btn-shine" style={{ width: '100%', marginTop: '16px' }} disabled={formStatus === 'submitting'}>
                      {formStatus === 'submitting' ? 'Enviando...' : 'Solicitar Proposta'}
                    </button>
                  </form>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
