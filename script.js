// script.js
// Aguarda carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // ========== MENU MOBILE ==========
    const mobileIcon = document.getElementById('mobileMenuIcon');
    const navMenu = document.getElementById('navMenu');
    if(mobileIcon && navMenu) {
        mobileIcon.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileIcon.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileIcon.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // ========== SCROLL SUAVE ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#" || targetId === "") return;
            const target = document.querySelector(targetId);
            if(target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== DARK MODE TOGGLE ==========
    const darkToggle = document.getElementById('darkModeToggle');
    if(darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkToggle.querySelector('i');
            if(document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // ========== CONTADORES ANIMADOS ==========
    const counters = document.querySelectorAll('[data-count]');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            current += increment;
            if(current < target) {
                el.innerText = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target;
            }
        };
        updateCounter();
    };
    const observerCounters = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateCounter(entry.target);
                observerCounters.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => observerCounters.observe(counter));

    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            const icon = question.querySelector('i');
            if(item.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // ========== CARROSSÉIS (SWIPER) ==========
    new Swiper('.blog-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
    new Swiper('.depo-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: '.swiper-pagination', clickable: true },
        autoplay: { delay: 4000 }
    });

    // ========== ANIMAÇÕES GSAP ==========
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero h1', { opacity: 0, y: 50, duration: 1 });
    gsap.from('.hero p', { opacity: 0, y: 30, duration: 1, delay: 0.3 });
    gsap.from('.hero-buttons', { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.6 });

    // ========== AOS INIT ==========
    AOS.init({ duration: 800, once: true, offset: 100 });

    // ========== DASHBOARD CHART.JS ==========
    const ctx = document.getElementById('agroChart')?.getContext('2d');
    if(ctx) {
        new Chart(ctx, {
            type: 'line',
            data: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], datasets: [{ label: 'Produtividade Soja (sc/ha)', data: [55, 60, 62, 68, 70, 72], borderColor: '#15803d', backgroundColor: 'rgba(34,197,94,0.1)', tension: 0.3, fill: true }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
        });
    }

    // ========== FORMULÁRIO DE CONTATO ==========
    const contactForm = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            feedback.innerHTML = '<span style="color:green;">✅ Mensagem enviada! Em breve retornamos.</span>';
            contactForm.reset();
            setTimeout(() => feedback.innerHTML = '', 3000);
        });
    }

    // ========== NEWSLETTER ==========
    const newsletterForm = document.getElementById('newsletterForm');
    const newsMsg = document.getElementById('newsMsg');
    if(newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsEmail').value;
            if(email) {
                newsMsg.innerHTML = '<span style="color:white;">📧 Inscrição confirmada! Obrigado.</span>';
                newsletterForm.reset();
                setTimeout(() => newsMsg.innerHTML = '', 3000);
            }
        });
    }

    // ========== LAZY LOADING (imagens nativas + suporte) ==========
    if('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => img.setAttribute('loading', 'lazy'));
    } else {
        // fallback simples
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ========== EFEITOS DE SCROLL (header shrink) ==========
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if(window.scrollY > 50) {
            header.style.padding = '0rem 0';
            header.style.backdropFilter = 'blur(16px)';
        } else {
            header.style.padding = '';
            header.style.backdropFilter = 'blur(12px)';
        }
    });
});