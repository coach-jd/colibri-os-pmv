// =================================================================================
// 18. JAVASCRIPT (Interactividad y Lógica)
// =================================================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---------------------------------------------------------------------------
    // 1. Control del Año en el Footer (Auto-actualizable)
    // ---------------------------------------------------------------------------
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ---------------------------------------------------------------------------
    // 2. LÓGICA DE NAVBAR (Fix Crítico Mobile + Scroll)
    // Controlamos dos estados: Scroll y Menú Móvil Abierto para legibilidad
    // ---------------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.getElementById('mainNavbar');

    // A) Evento Scroll: Añade fondo blanco al bajar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // B) Eventos del Menú Hamburguesa (Bootstrap 5 Events)
    if (navbarCollapse) {
        // Cuando el menú empieza a abrirse (show) -> Forzar fondo sólido
        navbarCollapse.addEventListener('show.bs.collapse', function () {
            navbar.classList.add('mobile-open');
        });

        // Cuando el menú termina de cerrarse (hidden) -> Quitar fondo sólido
        navbarCollapse.addEventListener('hidden.bs.collapse', function () {
            navbar.classList.remove('mobile-open');
        });
    }

    // ---------------------------------------------------------------------------
    // 3. Intersection Observer (Animaciones Fade-in)
    // Detecta cuando un elemento entra en pantalla para animarlo
    // ---------------------------------------------------------------------------
    const animatedElements = document.querySelectorAll('.fade-in-element');

    const observerOptions = {
        threshold: 0.1, // Se activa al ver el 10% del elemento
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, observerOptions);

    // Estado inicial y activación del observador
    animatedElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // ---------------------------------------------------------------------------
    // 4. Smooth Scroll y Cierre Automático de Menú Móvil
    // ---------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Evitar errores si el href es solo "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Cerrar menú móvil si está abierto (Usando API de Bootstrap)
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }

                // Cálculo de posición compensando el Header fijo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ---------------------------------------------------------------------------
    // 5. Validación de Formularios (Bootstrap 5 Boilerplate)
    // ---------------------------------------------------------------------------
    const forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Feedback visual de envío
                const btn = form.querySelector('button[type="submit"]');
                if(btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = 'Enviando...';
                    btn.disabled = true;
                    // Nota: Si usas Formspree, ellos redirigen, así que esto es solo visual
                }
            }
            form.classList.add('was-validated');
        }, false);
    });

});