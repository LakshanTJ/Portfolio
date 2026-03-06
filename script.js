document.addEventListener('DOMContentLoaded', () => {

    /* ===== MOBILE NAVIGATION ===== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    /* ===== NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT ===== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar appearance
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 15px rgba(255, 106, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });

        // Back to top button visibility
        const backToTop = document.getElementById('back-to-top');
        if (window.scrollY > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    /* ===== BACK TO TOP BUTTON ===== */
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ===== TAB SWITCHING (ABOUT SECTION) ===== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    /* ===== SCROLL REVEAL ANIMATIONS ===== */
    const revealElements = document.querySelectorAll('.section-title, .about-grid, .skill-category, .project-card, .achievement-card, .contact-grid');

    // Set initial state
    revealElements.forEach(el => {
        el.classList.add('hidden');
    });

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('show');
            entry.target.classList.remove('hidden');

            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ===== FORM SUBMISSION WITH FETCH ===== */
    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        const formData = new FormData(this);

        // Indicate transmission start
        btn.innerHTML = 'Transmitting... <i class="fas fa-spinner fa-spin glow"></i>';

        // IMPORTANT: Direct Spreadsheet URLs do not work for submission.
        // You MUST use a Google Apps Script (see the instructions I provided).
        // Replace 'YOUR_APPS_SCRIPT_URL' with the Web App URL after you deploy it.
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzRxYOA2EKucityIGLb20Gq310d6pQyllTf6V7ka8IFbIwa90xEuMCP8CIbULHSuvQ/exec';

        fetch(scriptURL, {
            method: 'POST',
            body: formData
        }).then(response => {
            btn.innerHTML = 'Transmission Sent <i class="fas fa-check glow"></i>';
            btn.style.backgroundColor = 'var(--acc-color)';
            btn.style.color = 'var(--bg-color)';
            this.reset();
        }).catch(error => {
            btn.innerHTML = 'Transmission Failed <i class="fas fa-exclamation-triangle"></i>';
            btn.style.borderColor = '#ff0000';
            console.error('Submission Error:', error);
        }).finally(() => {
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--acc-color)';
                btn.style.borderColor = 'var(--acc-color)';
            }, 4000);
        });
    });
});
