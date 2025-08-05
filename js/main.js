// =========================================================================
// ARQUIVO: js/main.js - VERSÃO FINAL COM TODAS AS FUNÇÕES, INCLUINDO O CONTADOR
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Carrega header e footer de forma segura
    const headerPromise = fetch('header.html').then(res => res.text());
    const footerPromise = fetch('footer.html').then(res => res.text());

    Promise.all([headerPromise, footerPromise])
        .then(([headerHtml, footerHtml]) => {
            document.querySelector('#main-header').innerHTML = headerHtml;
            document.querySelector('#main-footer').innerHTML = footerHtml;
            // Roda TODOS os scripts DEPOIS que os componentes estão no lugar
            runAllScripts();
        })
        .catch(error => console.error("ERRO CRÍTICO AO CARREGAR COMPONENTES:", error));
});

function runAllScripts() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const isHomePage = !filename || filename === 'index.html';

    // --- LÓGICA DE LINKS INTELIGENTES ---
    if (!isHomePage) {
        document.querySelectorAll('#main-header a[href^="#"]').forEach(link => {
            link.setAttribute('href', `index.html${link.getAttribute('href')}`);
        });
    }

    // --- EFEITO DE SCROLL NA NAVBAR ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // --- LÓGICA DO MENU MOBILE ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        const icon = mobileMenuButton.querySelector('i');
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            icon.className = isOpen ? 'mobile-menu-icon fas fa-times fa-lg' : 'mobile-menu-icon fas fa-bars fa-lg';
        });
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                icon.className = 'mobile-menu-icon fas fa-bars fa-lg';
            });
        });
    }

    // --- LÓGICA DE GRIFAR O LINK ATIVO (SCROLL SPY) ---
    const navLinks = document.querySelectorAll('#main-header .nav-link');
    if (filename.startsWith('obras')) {
        const obrasLink = document.querySelector('#main-header a[href="obras1.html"]');
        if (obrasLink) obrasLink.classList.add('active');
    } else if (isHomePage) {
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        if (sections.length > 0) {
            const activateLink = (id) => {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            };
            const handleScrollSpy = () => {
                const scrollPosition = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 200;
                let currentSectionId = sections[0].id;
                for (const section of sections) {
                    if (scrollPosition >= section.offsetTop) {
                        currentSectionId = section.id;
                    }
                }
                activateLink(currentSectionId);
            };
            window.addEventListener('scroll', handleScrollSpy);
            handleScrollSpy();
        }
    }

    // --- OUTROS SCRIPTS GERAIS DA PÁGINA ---
    AOS.init({ duration: 800, once: true, offset: 50 });

    const topBtn = document.getElementById('scrollToTopBtn');
    if (topBtn) {
        window.addEventListener('scroll', () => {
             // Controla a visibilidade com base na rolagem
             topBtn.classList.toggle('opacity-0', window.scrollY < window.innerHeight);
             topBtn.classList.toggle('invisible', window.scrollY < window.innerHeight);
        });
        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- CORREÇÃO: LÓGICA DO CONTADOR DE ANOS ---
    const experienceCounter = document.getElementById('experience-counter');
    if (experienceCounter) {
        const animateCounter = (el, start, end, duration) => {
            let current = start;
            const range = end - start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration / range));
            const timer = setInterval(() => {
                current += increment;
                el.textContent = `${current}+`;
                if (current === end) clearInterval(timer);
            }, stepTime);
        };

        // Usa IntersectionObserver para animar o contador apenas quando ele estiver visível
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // O valor final do contador. Altere '11' se necessário.
                    animateCounter(experienceCounter, 0, 11, 2000); 
                    observer.unobserve(entry.target); // Garante que a animação ocorra apenas uma vez
                }
            });
        }, { threshold: 0.8 }); // Inicia a animação quando 80% do elemento estiver visível

        counterObserver.observe(experienceCounter);
    }
}

// Lógica do Preloader (separada, pois usa o evento 'load')
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 600);
    }
    document.body.classList.add('loaded');
});