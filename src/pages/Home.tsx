import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [currentDay, setCurrentDay] = useState('');
  const [settings, setSettings] = useState({ whatsapp: '5541936181360' });
  const heroRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const scrollSequenceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Track page view
    fetch('/api/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'home' })
    }).catch(console.error);

    // Fetch settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.whatsapp) {
          setSettings(data);
        }
      })
      .catch(console.error);

    const diasDaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const diaAtual = new Date().getDay();
    setCurrentDay(diasDaSemana[diaAtual]);

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

    const handleMouseMove = (e: MouseEvent) => {
      if (heroBgRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        heroBgRef.current.style.transform = `scaleX(-1) scale(1.05) translate(${x}px, ${y}px)`;
      }
    };

    const handleMouseLeave = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `scaleX(-1) scale(1) translate(0, 0)`;
      }
    };

    const heroEl = heroRef.current;
    if (heroEl) {
      heroEl.addEventListener('mousemove', handleMouseMove);
      heroEl.addEventListener('mouseleave', handleMouseLeave);
    }

    // GSAP Scrollytelling
    const canvasContainer = scrollSequenceRef.current;
    const canvas = canvasRef.current;
    
    if (canvasContainer && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const frameCount = 132;
        const UPLOADS_URL = "https://fullenglish.com.br/wp-content/uploads/2026/03/";
        const extension = "png";
        const images: HTMLImageElement[] = [];
        const seq = { frame: 0 };
        let lastValidImage: HTMLImageElement | null = null;
        let isSequenceInitialized = false;

        const render = () => {
          const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(seq.frame)));
          const img = images[frameIndex];

          if (img && img.complete && img.naturalWidth > 0) {
            lastValidImage = img;
          }
          
          const imgToDraw = (img && img.complete && img.naturalWidth > 0) ? img : lastValidImage;

          if (!imgToDraw) return;

          const canvasRatio = canvas.width / canvas.height;
          const imgRatio = imgToDraw.width / imgToDraw.height;
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > canvasRatio) {
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
          } else {
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
          }

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(imgToDraw, offsetX, offsetY, drawWidth, drawHeight);
        };

        const setCanvasSize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          if (isSequenceInitialized) render(); 
        };
        
        window.addEventListener("resize", setCanvasSize, { passive: true });
        setCanvasSize();

        const initScrollytelling = () => {
          if(isSequenceInitialized) return;
          isSequenceInitialized = true;

          for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const baseName = `${UPLOADS_URL}efeitofull-${i + 1}`;
            
            img.src = `${baseName}-scaled.${extension}`;

            img.onerror = function() {
                if (img.src.indexOf('-scaled') !== -1) {
                    img.src = `${baseName}.${extension}`;
                }
            };

            if (i === 0) {
              img.onload = () => {
                render();
              }
            }
            images.push(img);
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "#scroll-sequence",
              start: "top top",
              end: "bottom bottom",
              scrub: 1
            }
          });

          tl.to(seq, {
            frame: frameCount - 1,
            ease: "none",
            onUpdate: render,
            duration: 4
          }, 0);

          tl.to(".card-1", { opacity: 1, y: 0, duration: 0.2 }, 0)
            .to(".card-1", { opacity: 1, duration: 0.6 }, 0.2)
            .to(".card-1", { opacity: 0, y: -30, duration: 0.2 }, 0.8)
            .to(".card-2", { opacity: 1, y: 0, duration: 0.2 }, 1)
            .to(".card-2", { opacity: 1, duration: 0.6 }, 1.2)
            .to(".card-2", { opacity: 0, y: -30, duration: 0.2 }, 1.8)
            .to(".card-3", { opacity: 1, y: 0, duration: 0.2 }, 2)
            .to(".card-3", { opacity: 1, duration: 0.6 }, 2.2)
            .to(".card-3", { opacity: 0, y: -30, duration: 0.2 }, 2.8)
            .to(".logo-container", { opacity: 1, y: 0, duration: 0.2 }, 3)
            .to(".logo-container", { opacity: 1, duration: 0.8 }, 3.2);
        };

        initScrollytelling();
        
        return () => {
          window.removeEventListener("resize", setCanvasSize);
          ScrollTrigger.getAll().forEach(t => t.kill());
        };
      }
    }

    return () => {
      obs1?.disconnect();
      obs2?.disconnect();
      if (heroEl) {
        heroEl.removeEventListener('mousemove', handleMouseMove);
        heroEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const toggleCard = (e: React.MouseEvent<HTMLElement>) => {
    if(window.innerWidth <= 820) {
      e.currentTarget.classList.toggle('active');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector('#btnSubmit') as HTMLButtonElement;
    const status = form.querySelector('#formStatus') as HTMLDivElement;
    
    if (!btn || !status) return;

    btn.disabled = true;
    btn.textContent = 'ENVIANDO...';
    status.textContent = '';
    status.className = 'form-status';

    const formData = new FormData(form);
    const formParams = Object.fromEntries(formData.entries());
    
    formParams.data_hora = new Date().toISOString();
    formParams.page_url = window.location.href;
    formParams.user_agent = navigator.userAgent;

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: 'home', formData: formParams })
    })
    .then(response => response.json())
    .then(data => {
      status.textContent = 'Mensagem enviada com sucesso! Redirecionando...';
      status.classList.add('status-success');
      setTimeout(() => {
        window.location.href = 'https://fullenglish.com.br/obrigado/';
      }, 500);
    })
    .catch(error => {
      console.error('Erro de submissão:', error);
      status.textContent = 'Ocorreu um erro ao enviar. Por favor, tente novamente ou contate via WhatsApp.';
      status.classList.add('status-error');
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'ENVIAR';
    });
  };

  return (
    <main id="top">
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" id="heroBg" ref={heroBgRef}></div>
        <div className="hero-overlay"></div>
        
        <div className="container hero-centered-layout">
          <div className="hero-copy fade-in-up">
            <span className="eyebrow">Matrículas abertas para adultos</span>
            <h1 className="hero-title">BEM VINDO A SUA ÚLTIMA <br/><span className="blue reveal-wrapper">ESCOLA DE INGLÊS.</span></h1>
            <p className="hero-text">
              Conheça a única escola do Brasil com 3 garantias em contrato. Fale inglês em 12 meses ou devolvemos o seu dinheiro.
            </p>
            <div className="hero-actions">
              <a href={`https://api.whatsapp.com/send/?phone=${settings.whatsapp}&text=Ol%C3%A1%2C+estava+no+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es&type=phone_number&app_absent=0`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-arrow btn-shine">Quero destravar minha fala</a>
            </div>
          </div>
          
          <div className="hero-cards-grid fade-in-up" style={{ transitionDelay: '0.1s' }}>
            <article className="glass-card expandable-card" onClick={toggleCard}>
              <div className="card-header">
                <h3>English made for grown ups.</h3>
                <span className="expand-icon">+</span>
              </div>
              <div className="card-body">
                <p>Uma escola moderna e disruptiva. Abordagem forte, direta e pensada para quem valoriza uma experiência premium.</p>
              </div>
            </article>
            
            <article className="glass-card expandable-card" onClick={toggleCard}>
              <div className="card-header">
                <h3>Menos teoria. Mais conversa.</h3>
                <span className="expand-icon">+</span>
              </div>
              <div className="card-body">
                <p>Aprendizado desenhado para quem precisa usar inglês de verdade, não só estudar.</p>
              </div>
            </article>
            
            <article className="glass-card expandable-card" onClick={toggleCard}>
              <div className="card-header">
                <h3>Prepare-se para descobrir o mundo.</h3>
                <span className="expand-icon">+</span>
              </div>
              <div className="card-body">
                <p>Confiança para reuniões, promoções, viagens, networking e oportunidades globais.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container fade-in-up" style={{ transitionDelay: '0.2s' }}>
          <div className="hero-trust-flex">
            <div className="trust-block">
              <div className="avatars" aria-hidden="true">
                <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/1.jpg" alt="Aluno 1" className="avatar" loading="lazy" decoding="async" />
                <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/2-1.jpg" alt="Aluno 2" className="avatar" loading="lazy" decoding="async" />
                <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/3.jpg" alt="Aluno 3" className="avatar" loading="lazy" decoding="async" />
                <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/4.jpg" alt="Aluno 4" className="avatar" loading="lazy" decoding="async" />
              </div>
              <div className="trust-text">
                <strong>+20.000 ALUNOS</strong>
                <span>JÁ DESTRAVARAM</span>
              </div>
            </div>

            <div className="trust-divider"></div>

            <div className="trust-block">
              <img src="https://fullenglish.com.br/wp-content/uploads/2025/09/reclameaqui.png" alt="Reclame Aqui Selo Ótimo" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} loading="lazy" decoding="async" />
            </div>

            <div className="trust-divider"></div>

            <div className="trust-block">
              <div className="trust-text">
                <strong>GARANTIA REAL</strong>
                <span>SELO DE QUALIDADE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about dark-section" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <div className="about-head fade-in-up">
            <h2 className="section-title">Por que escolher a <span className="blue reveal-blur">Full English?</span></h2>
            <p className="section-desc">
              A comparação definitiva para quem valoriza tempo, prática e resultado.
              Aqui o foco é falar com segurança e aplicar o idioma em situações reais.
            </p>
          </div>

          <div className="features-grid fade-in-up">
            <article className="feature-card fc-blue">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop" alt="Aulas Personalizadas" loading="lazy" decoding="async" />
                </div>
                <div className="feature-content">
                  <h3>Aulas Personalizadas</h3>
                  <p>App exclusivo com IA especializada em correção de pronúncia em tempo real e mais de 350h de conteúdos e exercícios</p>
                </div>
              </div>
            </article>

            <article className="feature-card fc-darkred">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1758685848174-e061c6486651?q=80&w=1632&auto=format&fit=crop" alt="Professores Especialistas" loading="lazy" decoding="async" />
                </div>
                <div className="feature-content">
                  <h3>Professores Especialistas</h3>
                  <p>Aprimore seu inglês com instrutores mais experientes, nativos e vivência real de mercado.</p>
                </div>
              </div>
            </article>

            <article className="feature-card fc-brightred">
              <div className="feature-card-inner">
                <div className="feature-img-wrap">
                  <img src="https://images.unsplash.com/photo-1548393488-ae8f117cbc1c?q=80&w=715&auto=format&fit=crop" alt="Flexibilidade" loading="lazy" decoding="async" />
                </div>
                <div className="feature-content">
                  <h3>Flexibilidade de Horários</h3>
                  <p>Estude no horário que for mais conveniente para você, ajustando as aulas à sua rotina profissional.</p>
                </div>
              </div>
            </article>
          </div>

          <div className="center-cta fade-in-up">
            <p className="cta-hint">Hoje, <strong id="current-day">{currentDay}</strong>, é um ótimo dia pra você dar este próximo passo.</p>
            <a href={`https://api.whatsapp.com/send/?phone=${settings.whatsapp}&text=Ol%C3%A1%2C+estava+no+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es&type=phone_number&app_absent=0`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-arrow btn-shine">Quero fazer a matrícula</a>
          </div>
        </div>
      </section>

      <section className="partners" style={{ backgroundColor: '#050811' }}>
        <div className="container fade-in-up">
          <h2 className="partners-title">NOSSOS ALUNOS OCUPAM CARGOS DE LIDERANÇA EM:</h2>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/bosch-logo-0-2048x2048-1.png" alt="Bosch" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/honda-carros-logo-1.png" alt="Honda" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/itau-logo-0-2048x2048-1.png" alt="Itaú" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/volkswagen-vw-logo-2-1.png" alt="Volkswagen" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/ambev-logo-1.png" alt="Ambev" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/vale-logo-0-2048x2048-1.png" alt="Vale" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/bayer-logo-0-scaled.png" alt="Bayer" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/ibm-logo-0-scaled.png" alt="IBM" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/bosch-logo-0-2048x2048-1.png" alt="Bosch" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/honda-carros-logo-1.png" alt="Honda" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/itau-logo-0-2048x2048-1.png" alt="Itaú" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/volkswagen-vw-logo-2-1.png" alt="Volkswagen" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/ambev-logo-1.png" alt="Ambev" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/vale-logo-0-2048x2048-1.png" alt="Vale" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/bayer-logo-0-scaled.png" alt="Bayer" loading="lazy" decoding="async" />
              <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/ibm-logo-0-scaled.png" alt="IBM" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <section className="method dark-section" id="metodo">
        <div className="container">
          <div className="method-head fade-in-up">
            <h2 className="section-title">Uma metodologia exclusiva <span className="blue">para resultados.</span></h2>
            <p className="section-desc">
              Nosso método foi desenhado para maximizar o seu tempo. Combinamos tecnologia de ponta com imersão prática para acelerar sua fluência, mantendo você engajado através de uma experiência visual e didática incomparável.
            </p>
          </div>

          <div className="method-grid fade-in-up">
            <article className="method-card glass-card">
              <div className="card-icon-svg">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3>Diagnóstico rápido</h3>
              <p>Entendemos seu nível atual, sua rotina e onde você quer chegar no inglês profissional e pessoal.</p>
            </article>
            <article className="method-card glass-card">
              <div className="card-icon-svg">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3>Plano de estudos</h3>
              <p>Um roteiro direto, sem enrolação, focado no seu objetivo e no uso prático do idioma no dia a dia.</p>
            </article>
            <article className="method-card glass-card">
              <div className="card-icon-svg">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3>Conversação guiada</h3>
              <p>Treino real, feedback frequente e construção de confiança para destravar sua fala semana após semana.</p>
            </article>
          </div>

          <div className="method-extra fade-in-up" style={{ transitionDelay: '0.2s' }}>
            <article className="mini-feature glass-card">
              <strong>⚡</strong>
              <h4>IA com feedback em tempo real</h4>
              <p>Correção, apoio e aceleração para consolidar sua evolução prática.</p>
            </article>
            <article className="mini-feature glass-card">
              <strong>🗣</strong>
              <h4>Ambiente que força a fala</h4>
              <p>Aulas ao vivo e situações reais para você usar o idioma desde cedo.</p>
            </article>
            <article className="mini-feature glass-card">
              <strong>🛡</strong>
              <h4>Garantia de aprendizado</h4>
              <p>Segurança e acompanhamento para manter constância e resultado.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="video-section dark-section">
        <div className="container fade-in-up">
          <div className="video-head">
            <h2 className="section-title">Veja a <span className="blue">Full English</span> em ação</h2>
            <p className="section-desc">Assista ao vídeo e descubra como transformamos a jornada de aprendizado em uma experiência dinâmica e focada na sua evolução real.</p>
          </div>
          <div className="video-shell glass-card">
            <div className="video-embed">
              <video
                src="https://fullenglish.com.br/wp-content/uploads/2026/03/De-um-FULL-na-sua-vida.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              ></video>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews" id="comentarios">
        <div className="container fade-in-up">
          
          <div className="reviews-head-centered">
            <h2 className="section-title">Comentários do <span className="blue">Google</span></h2>
            <img src="https://fullenglish.com.br/wp-content/uploads/2026/03/4.9_stars_-_Google_Reviews_wp5iuS0.max-855x1000-1.png" alt="Avaliações 4.9 Estrelas Google" className="google-score-img" loading="lazy" decoding="async" />
          </div>

          <div className="reviews-grid">
            <article className="review-card">
              <div>
                <div className="review-card-top">
                  <div className="stars">★★★★★</div>
                  <div className="google">G</div>
                </div>
                <p>“Superou minhas expectativas! Fui muito bem atendido e a metodologia é simplesmente incrível.”</p>
              </div>
              <div className="review-author">
                <img src="https://lh3.googleusercontent.com/a-/ALV-UjWg1maZKwdBVbHNjNC8bnxZcL-nGniejvb5yT2gCydD7PwuQUI=w72-h72-p-rp-mo-br100" alt="Wilson Nunes" className="reviewer-avatar" loading="lazy" decoding="async" />
                <div className="reviewer-info">
                  <strong>Wilson Nunes</strong>
                  <span>há 2 semanas</span>
                </div>
              </div>
            </article>

            <article className="review-card">
              <div>
                <div className="review-card-top">
                  <div className="stars">★★★★★</div>
                  <div className="google">G</div>
                </div>
                <p>“Melhor curso, aulas didáticas, professores atenciosos e atendimento transparente. Super indico.”</p>
              </div>
              <div className="review-author">
                <img src="https://lh3.googleusercontent.com/a-/ALV-UjWobb67D0eOkWTbTn5mumzoELs_ZKETTryn6j2cwATOOmpN8XbB=w72-h72-p-rp-mo-br100" alt="Maria Eduarda" className="reviewer-avatar" loading="lazy" decoding="async" />
                <div className="reviewer-info">
                  <strong>Maria Eduarda</strong>
                  <span>há 1 mês</span>
                </div>
              </div>
            </article>

            <article className="review-card">
              <div>
                <div className="review-card-top">
                  <div className="stars">★★★★★</div>
                  <div className="google">G</div>
                </div>
                <p>“Escola excepcional com entrega garantida. Os alunos formados representam a excelência no mercado.”</p>
              </div>
              <div className="review-author">
                <img src="https://lh3.googleusercontent.com/a-/ALV-UjUOsp5DyqBb_vSXf5p9yFJTz003lj2lHDLf0dXnaxfZjzEL27Q=w72-h72-p-rp-mo-br100" alt="Isabela França" className="reviewer-avatar" loading="lazy" decoding="async" />
                <div className="reviewer-info">
                  <strong>Isabela França</strong>
                  <span>há 2 meses</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="history dark-section" id="historia" style={{ padding: '0' }}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '20px' }}>
          <div className="history-head" style={{ marginBottom: '0' }}>
            <h2 className="section-title">Nossa <span className="blue reveal-wrapper">história</span></h2>
            <p className="section-desc">Conheça a nossa trajetória e os princípios que nos guiam na missão de transformar a comunicação profissional no Brasil, unindo inovação e excelência.</p>
          </div>
        </div>

        <div className="canvas-container" id="scroll-sequence" ref={scrollSequenceRef}>
          <div className="sticky-canvas">
            <canvas id="sequence-canvas" ref={canvasRef}></canvas>
            <div className="dark-overlay"></div>
            <div className="text-overlay">
              <div className="card-container">
                <div className="card card-1">
                  <h2 className="card-title">2020</h2>
                  <h3 className="card-subtitle">O COMEÇO</h3>
                  <p className="card-text">A Full English nasce com a proposta de ensinar adultos de forma prática, direta e sem enrolação.</p>
                </div>
                <div className="card card-2">
                  <h2 className="card-title">2022</h2>
                  <h3 className="card-subtitle">EVOLUÇÃO DO MÉTODO</h3>
                  <p className="card-text">App próprio ainda mais completo com IA.</p>
                </div>
                <div className="card card-3">
                  <h2 className="card-title">Hoje</h2>
                  <h3 className="card-subtitle">ESCALA E EXPANSÃO</h3>
                  <p className="card-text">Única escola no brasil com 3 garantias reais de ensino e mais de 20 mil alunos em 24 paises.</p>
                </div>
              </div>
              <div className="logo-container">
                <img src="https://fullenglish.com.br/wp-content/uploads/2022/05/logo-4.svg" alt="Full English Logo" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="impact" id="cta-final">
        <div className="container">
          <div className="impact-box fade-in-up">
            <div className="layered-title">
              <div className="bg-text" aria-hidden="true">Não espere, comece agora mesmo!</div>
              <h2 className="fg-text">Don't wait,<br/>get started now!</h2>
            </div>
            <p style={{ marginBottom: '32px !important', color: 'rgba(255,255,255,.85) !important', fontSize: '1.12rem !important' }}>
              Compre agora sem falar com ninguém e comece a falar inglês
            </p>
            <a href="https://clkdmg.site/subscribe/full-english-platinum-site-oficial" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-arrow btn-shine">Esta decidido a comprar?</a>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="container fade-in-up">
          <div className="contact-grid">
            <div className="contact-text">
              <h2 className="section-title"><span className="red">Ainda tem</span> <span className="blue">dúvidas?</span></h2>
              <p className="section-desc" style={{ marginTop: '20px !important' }}>
                Fale com um de nossos consultores especialistas. Estamos prontos para entender seu nível atual, seus objetivos profissionais e montar o plano de estudos perfeito para você alcançar a fluência no menor tempo possível.
              </p>
              <ul>
                <li>Atendimento personalizado e sem compromisso</li>
                <li>Avaliação rápida do seu nível de inglês</li>
                <li>Apresentação detalhada da metodologia</li>
              </ul>
            </div>
            
            <div className="contact-form-wrapper">
              <form id="leadForm" className="native-form" onSubmit={handleFormSubmit}>
                <input type="hidden" name="to_email" value="fullenglish@slever.com.br" />
                <input type="hidden" name="subject" value='Nova mensagem de "Full English"' />

                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input type="text" id="nome" name="nome" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Telefone / Whatsapp</label>
                  <input type="tel" id="telefone" name="telefone" required />
                </div>
                <div className="form-group">
                  <label htmlFor="profissao">Profissão</label>
                  <input type="text" id="profissao" name="profissao" required />
                </div>
                
                <button type="submit" className="btn-submit" id="btnSubmit">ENVIAR</button>
                <div id="formStatus" className="form-status"></div>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
