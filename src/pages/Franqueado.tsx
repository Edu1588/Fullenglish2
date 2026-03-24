import React, { useEffect, useState } from 'react';

export default function Franqueado() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    capital: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formParams = Object.fromEntries(new URLSearchParams(formData as any).entries());
    formParams.data_hora = new Date().toISOString();
    formParams.page_url = window.location.href;
    formParams.user_agent = navigator.userAgent;
    formParams.origem = 'Franqueado';

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: 'franqueado', formData: formParams })
    })
    .then(res => res.json())
    .then(() => {
      setFormStatus('success');
      setFormData({ nome: '', email: '', telefone: '', capital: '' });
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
      body: JSON.stringify({ page: 'franqueado' })
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

    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target as HTMLElement;
          const targetStr = counter.getAttribute('data-target');
          if (!targetStr) return;
          const target = +targetStr;
          const increment = target / 100;
          
          const updateCount = () => {
            const count = +counter.innerText.replace(/\./g, '');
            
            if (count < target) {
              counter.innerText = Math.ceil(count + increment).toLocaleString('pt-BR');
              setTimeout(updateCount, 25);
            } else {
              counter.innerText = target.toLocaleString('pt-BR');
            }
          };
          
          updateCount();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    return () => {
      obs1?.disconnect();
      obs2?.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <main id="top">
      <section className="hero" style={{ padding: '240px 0 160px 0' }}>
        <div className="hero-bg" style={{ background: 'url(https://fullenglish.com.br/wp-content/uploads/2026/03/BANNER_FULL_FRANQUIA2.png) center/cover no-repeat' }}></div>
        <div className="hero-overlay" style={{ background: 'radial-gradient(circle at 12% 80%, rgba(255, 0, 66, 0.20), transparent 28%), radial-gradient(circle at 86% 16%, rgba(0, 68, 192, 0.18), transparent 22%), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)' }}></div>
        
        <div className="container hero-split-layout">
          <div className="hero-left fade-in-up">
            <span className="eyebrow">Expansão Nacional</span>
            <h1 className="hero-split-title">
              SEJA DONO DE <br/>
              UMA <br/>
              FRANQUIA <br/>
              PREMIUM.
            </h1>
          </div>
          
          <div className="hero-right fade-in-up" style={{ transitionDelay: '0.2s' }}>
            <p className="hero-text-right">
              INVISTA EM UM <br/>NEGÓCIO<br/>SÓLIDO.
            </p>
          </div>
        </div>
      </section>

      <section className="trust-cards-section">
        <div className="container fade-in-up">
          
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 50px' }}>
            <p className="section-desc" style={{ margin: '0 auto', color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem' }}>
              com alta rentabilidade e foco no público adulto. 
              Uma marca consolidada, metodologia validada e suporte completo para o seu sucesso.
            </p>
          </div>

          <div className="hero-cards-grid">
            <article className="floating-card glass-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Público Adulto</h3>
              <p>Alunos com real necessidade de fluência. Maior ticket médio e menor taxa de evasão do mercado.</p>
            </article>
            
            <article className="floating-card glass-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <h3>Retorno Acelerado</h3>
              <p>Modelo de negócio validado com estrutura operacional enxuta, garantindo margens de lucro atrativas.</p>
            </article>
            
            <article className="floating-card glass-card">
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0042" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3>Posicionamento</h3>
              <p>Uma marca forte, com arquitetura premium e comunicação direta que atrai clientes qualificados.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="stats-section dark-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container fade-in-up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', textAlign: 'center' }}>
             
             <div>
                <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '3.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                   <span style={{ fontSize: '2rem', verticalAlign: 'middle' }}>+</span><span className="counter" data-target="15000">0</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, lineHeight: 1.5 }}>
                  Número de alunos e profissionais que já transformaram suas vidas
                </p>
             </div>

             <div>
                <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '3.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                   <span className="counter" data-target="4">0</span> a <span className="counter" data-target="10">0</span>
                   <span style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginLeft: '5px', color: '#fff' }}>meses</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, lineHeight: 1.5 }}>
                  Tempo médio de Payback
                </p>
             </div>

             <div>
                <div style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '3.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                   <span style={{ fontSize: '2rem', verticalAlign: 'middle' }}>+</span><span className="counter" data-target="12">0</span>
                   <span style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginLeft: '5px', color: '#fff' }}>anos</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, lineHeight: 1.5 }}>
                  Tempo de experiência dos especialistas que fundaram a rede
                </p>
             </div>

          </div>
        </div>
      </section>

      <section className="dark-section" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="split-grid">
             <div className="split-text fade-in-up">
                <h2 className="section-title">Um modelo de <span className="blue reveal-wrapper">sucesso</span></h2>
                <p className="section-desc" style={{ marginTop: '20px' }}>
                  A Full English se destaca pelo seu posicionamento premium e uma estrutura física inteligente. 
                  Nossas unidades são projetadas para criar um ambiente adulto, executivo e acolhedor, otimizando o custo de implantação e maximizando o retorno sobre o investimento.
                </p>
             </div>
             <div className="split-img fade-in-up" style={{ transitionDelay: '0.2s' }}>
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Modelo de Franquia" style={{ borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', width: '100%', height: 'auto', objectFit: 'cover' }} loading="lazy" />
             </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0', background: '#fff', color: '#000' }}>
        <div className="container">
          <div className="split-grid reverse">
             <div className="split-text fade-in-up">
                <h2 className="section-title" style={{ color: '#000' }}>Tecnologia a <span className="blue reveal-wrapper">seu favor</span></h2>
                <p className="section-desc" style={{ color: '#444', marginTop: '20px' }}>
                  Nossa plataforma exclusiva conecta alunos e professores, acompanhando o progresso em tempo real. 
                  Uma gestão acadêmica e comercial simplificada na palma da sua mão para facilitar a rotina do franqueado.
                </p>
             </div>
             <div className="split-img fade-in-up" style={{ transitionDelay: '0.2s' }}>
                <img src="https://fullenglish.com.br/wp-content/uploads/2025/09/mockup-laptop-1.png" alt="Plataforma Exclusiva" style={{ transform: 'scale(1.05)', width: '100%', height: 'auto', objectFit: 'cover' }} loading="lazy" />
             </div>
          </div>
        </div>
      </section>

      <section className="dark-section" style={{ padding: '100px 0' }}>
        <div className="container fade-in-up">
           <div className="video-head" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="section-title">Apresentação do <span className="blue reveal-blur">Negócio</span></h2>
              <p className="section-desc" style={{ margin: '0 auto', marginTop: '14px' }}>Descubra os bastidores e todo o potencial do modelo de franquias da Full English.</p>
           </div>
           <div className="video-shell glass-card" style={{ padding: '24px', borderRadius: '32px', maxWidth: '900px', margin: '0 auto' }}>
              <div className="video-embed" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '24px', overflow: 'hidden', background: '#000' }}>
                 <iframe src="https://www.youtube.com/embed/YI_jpA4qU4s" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}></iframe>
              </div>
           </div>
        </div>
      </section>

      <section className="about dark-section">
        <div className="container">
          <div className="about-head fade-in-up">
            <h2 className="section-title">Por que investir na <span className="blue reveal-blur">Full English?</span></h2>
            <p className="section-desc">
              Não somos apenas mais uma escola de idiomas. Somos uma marca desenhada exclusivamente para quem exige resultados rápidos. Conheça as vantagens de investir no nosso modelo.
            </p>
          </div>

          <div className="features-grid fade-in-up">
            
            <article className="feature-card fc-blue">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1170&auto=format&fit=crop" alt="Marketing Forte" loading="lazy" />
                </div>
                <div className="feature-content">
                  <h3>Máquina de Vendas</h3>
                  <p>Receba suporte completo de marketing digital, campanhas prontas e treinamento comercial para manter a captação de matrículas o ano todo.</p>
                </div>
              </div>
            </article>

            <article className="feature-card fc-darkred">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop" alt="Suporte Contínuo" loading="lazy" />
                </div>
                <div className="feature-content">
                  <h3>Suporte ao Franqueado</h3>
                  <p>Nossa equipe estará ao seu lado desde a escolha do ponto, projeto arquitetônico até o treinamento da sua equipe e gestão diária da escola.</p>
                </div>
              </div>
            </article>

            <article className="feature-card fc-brightred">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop" alt="Metodologia Exclusiva" loading="lazy" />
                </div>
                <div className="feature-content">
                  <h3>Metodologia Própria</h3>
                  <p>Entregue um ensino que realmente funciona, focado em conversação e vivência prática, garantindo a satisfação e fidelização dos seus alunos.</p>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      <section className="franchise dark-section" id="formulario" style={{ padding: '100px 0' }}>
        <div className="container fade-in-up">
          <div className="franchise-head" style={{ display: 'grid', gap: '16px', marginBottom: '50px', justifyItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title">Dê o primeiro <span className="blue reveal-blur">passo</span></h2>
            <p className="section-desc">Preencha o formulário abaixo. Nossa equipe de expansão entrará em contato para apresentar os números, viabilidade e próximos passos para você ter a sua Full English.</p>
          </div>

          <div className="franchise-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'start' }}>
            <article className="franchise-card glass-card" style={{ minHeight: '100%', padding: '40px', color: '#fff' }}>
              <h3 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#ffffff', margin: '0 0 14px 0' }}>Perfil do Franqueado</h3>
              <p className="section-desc" style={{ color: 'rgba(255,255,255,.78)', maxWidth: '100%', marginTop: '14px' }}>
                Buscamos parceiros com visão empreendedora e perfil de liderança.
              </p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '16px', marginTop: '30px', padding: '0', color: 'rgba(255,255,255,.85)', fontSize: '1.05rem' }}>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Capacidade de investimento compatível com o projeto.</li>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Dedicação ao negócio e foco em gestão comercial.</li>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Perfil de liderança para gerir times de alta performance.</li>
                <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>Identificação com o mercado de educação e a marca Full English.</li>
              </ul>
            </article>

            <article>
              <div className="contact-form-wrapper glass-card" style={{ padding: '40px' }}>
                <h3 style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '1.8rem', marginBottom: '24px', color: '#fff' }}>Fale com um Consultor</h3>
                {formStatus === 'success' ? (
                  <div className="form-success" style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Solicitação enviada!</h4>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Nossa equipe de expansão entrará em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="nome">Nome Completo</label>
                      <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">E-mail</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="seu@email.com" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone / WhatsApp</label>
                      <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="capital">Capital disponível para investimento</label>
                      <select id="capital" name="capital" value={formData.capital} onChange={handleChange} required style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', appearance: 'none' }}>
                        <option value="" disabled style={{ color: '#000' }}>Selecione uma opção</option>
                        <option value="Ate 150k" style={{ color: '#000' }}>Até R$ 150.000</option>
                        <option value="150k a 300k" style={{ color: '#000' }}>R$ 150.000 a R$ 300.000</option>
                        <option value="300k a 500k" style={{ color: '#000' }}>R$ 300.000 a R$ 500.000</option>
                        <option value="Acima de 500k" style={{ color: '#000' }}>Acima de R$ 500.000</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-arrow btn-shine" style={{ width: '100%', marginTop: '16px' }} disabled={formStatus === 'submitting'}>
                      {formStatus === 'submitting' ? 'Enviando...' : 'Quero ser um Franqueado'}
                    </button>
                  </form>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0', background: '#fff', color: '#000' }}>
        <div className="container">
          <div className="split-grid">
             <div className="split-text fade-in-up">
                <h2 className="section-title" style={{ color: '#000' }}>Expansão em todo o <span className="blue reveal-wrapper">Brasil</span></h2>
                <p className="section-desc" style={{ color: '#444', marginTop: '20px' }}>
                  Junte-se a uma rede sólida que não para de crescer. Leve o modelo de negócio mais eficiente do mercado para a sua região e domine o segmento de ensino de inglês para adultos com nosso suporte completo de ponta a ponta.
                </p>
                <div style={{ marginTop: '36px' }}>
                  <a href="#formulario" className="btn btn-primary btn-arrow btn-shine">Garantir Minha Região</a>
                </div>
             </div>
             <div className="split-img fade-in-up" style={{ transitionDelay: '0.2s', textAlign: 'center' }}>
                <div className="map-wrapper">
                  <img src="https://fullenglish.com.br/wp-content/uploads/2025/10/Design-sem-nome-5.png" alt="Mapa de Unidades Full English" style={{ maxWidth: '100%', display: 'inline-block' }} loading="lazy" />
                  
                  <div className="map-popup">
                    <h4>Nossas Unidades:</h4>
                    <ul>
                      <li>Alphaville</li>
                      <li>Angra dos Reis</li>
                      <li>Botafogo</li>
                      <li>Cachoeirinha</li>
                      <li>Centro</li>
                      <li>Divinópolis</li>
                      <li>Hortolândia</li>
                      <li>Jundiaí</li>
                      <li>Praça Capital</li>
                      <li>Rio de Janeiro</li>
                      <li>Santos</li>
                      <li>São José do Rio Preto</li>
                      <li>São José dos Campos</li>
                      <li>Sorocaba</li>
                      <li>Sumaré</li>
                    </ul>
                    <div style={{ marginTop: '24px' }}>
                      <a href="https://www.google.com/maps/d/edit?mid=1HyRQdJBtgwMF_4tXrEyNlbRkmFTwWMk&usp=sharing" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-shine" style={{ width: '100%', minHeight: '48px', fontSize: '0.9rem' }}>Ver localizações</a>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

    </main>
  );
}

