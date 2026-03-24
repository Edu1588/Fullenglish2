import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowTopBtn(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="siteHeader">
        <div className="container header-bar">
          <Link to="/" className="logo" aria-label="Full English">
            <img src="https://fullenglish.com.br/wp-content/uploads/2025/10/Logotipo-branco-1.svg" alt="Full English Logo" />
          </Link>
          
          <nav className="header-nav">
            <a href="/#historia">História</a>
            <Link to="/franqueado">Seja um Franqueado</Link>
            <Link to="/empresas">Para Empresas</Link>
          </nav>

          <div className="header-actions">
            <a href="https://student.fullenglish.com.br/" target="_blank" rel="noopener noreferrer" className="btn btn-aluno" style={{ minHeight: '44px', padding: '0 20px', fontSize: '0.85rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Área do Aluno
            </a>
          </div>

          <div className="menu-toggle" id="menuToggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} id="mobileMenu">
        <a href="/#historia" onClick={() => setIsMenuOpen(false)}>História</a>
        <Link to="/franqueado" onClick={() => setIsMenuOpen(false)}>Seja um Franqueado</Link>
        <Link to="/empresas" onClick={() => setIsMenuOpen(false)}>Para Empresas</Link>
        <a href="https://student.fullenglish.com.br/" style={{ color: 'var(--red)' }} onClick={() => setIsMenuOpen(false)}>Área do Aluno</a>
      </div>

      <Outlet />

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" className="logo" aria-label="Full English">
                <img src="https://fullenglish.com.br/wp-content/uploads/2025/10/Logotipo-branco-1.svg" alt="Full English Logo" height="26" loading="lazy" decoding="async" />
              </Link>
              <p>
                Transformando carreiras através do inglês prático e sem enrolação.
                O método mais direto para quem quer fluência real na vida adulta.
              </p>
            </div>

            <div className="footer-info">
              <span>contato@fullenglish.com.br</span>
              <span>Avenida Cambacica, 520 | Torre 4 – Sala 400</span>
              <span>Parque dos Resedás | Campinas – SP</span>
              <span>CEP: 13097-160</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Full English. Todos os direitos reservados.</span>
            <div className="footer-bottom-right">
              <div className="social-links" style={{ display: 'flex', gap: '16px', marginRight: '16px', alignItems: 'center' }}>
                <a href="https://www.instagram.com/fullenglishoficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://www.facebook.com/oficialfullenglish/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://www.linkedin.com/company/fullenglish/?originalSubdomain=br" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
              <a href="#">Privacidade</a>
              <span className="dev-credits">Desenvolvido por <a href="https://escom.eionstudio.com.br/" target="_blank" rel="noopener noreferrer">agência ESCOM</a></span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed-buttons">
        <a href="#top" className={`btn-float btn-up ${showTopBtn ? 'show' : ''}`} id="btnTop" aria-label="Voltar ao topo">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15L12 9L6 15" />
          </svg>
        </a>
        <a href="https://api.whatsapp.com/send/?phone=5541936181360&text=Ol%C3%A1%2C+estava+no+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="btn-float btn-wa" aria-label="Falar no WhatsApp">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
