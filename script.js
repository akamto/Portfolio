/* =====================================================
   PORTAFOLIO AKRAM AMGHIBECH - script.js
   Solo JavaScript puro (Vanilla JS), sin librerías.
   ===================================================== */

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initTheme();       // 1. Modo oscuro / claro
  const closeMenu = initMobileMenu();  // 2. Menú hamburguesa (devuelve cierre)
  initSmoothScroll(closeMenu);// 3. Scroll suave + cerrar menú
  initHeader();      // 4. Sombra header + botón volver arriba
  initReveal();      // 5. Animación al aparecer + link activo
  initYear();        // 6. Año automático en footer
  initServiceWorker(); // 7. Offline PWA (solo http/https)
});

/* ---------- Utilidades seguras para localStorage ---------- */
function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) { /* modo privado: ignorar */ }
}

/* ---------- Respeta movimiento reducido sin romper en navegadores viejos ---------- */
function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

/* ---------- 1. MODO OSCURO / CLARO ---------- */
function initTheme() {
  const root = document.documentElement; // <html data-theme="...">
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // El head ya aplicó el tema guardado para evitar flash.
  // Aquí solo sincronizamos por si el head no se ejecutó.
  const saved = safeGet('theme');
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  } else if (!root.getAttribute('data-theme')) {
    try {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
      }
    } catch (e) { /* sin matchMedia */ }
  }

  // Actualizar texto accesible del botón
  const updateLabel = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.title = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  };
  updateLabel();

  // Si el usuario no eligió tema, seguir al sistema en vivo (cambio OS claro/oscuro)
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e) => {
      if (safeGet('theme') === 'dark' || safeGet('theme') === 'light') return;
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateLabel();
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onSystemChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onSystemChange);
  } catch (e) { /* sin matchMedia */ }

  // Al hacer clic: alternar tema y guardarlo
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    safeSet('theme', next);
    updateLabel();
  });
}

/* ---------- 2. MENÚ HAMBURGUESA (móvil) ---------- */
/* Devuelve una función de cierre para reutilizarla (scroll suave, etc.). */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const noop = () => {};
  if (!toggle || !menu) return noop;

  const isMobile = () => window.innerWidth <= 860;

  const syncA11y = (open) => {
    // En escritorio el menú siempre es visible y operable
    if (!isMobile()) {
      menu.removeAttribute('inert');
      menu.removeAttribute('aria-hidden');
      if (overlay) overlay.classList.remove('show');
      return;
    }
    // En móvil: oculta de AT y teclado cuando está cerrado
    if (open) {
      menu.removeAttribute('inert');
      menu.removeAttribute('aria-hidden');
    } else {
      menu.setAttribute('aria-hidden', 'true');
      try { menu.setAttribute('inert', ''); } catch (e) { /* navegadores sin inert */ }
    }
    if (overlay) overlay.classList.toggle('show', open);
  };

  const setOpen = (open) => {
    menu.classList.toggle('active', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    // Bloquea el scroll de fondo cuando el menú está abierto
    document.body.classList.toggle('menu-open', open);
    syncA11y(open);
    if (open) {
      // Mueve el foco al primer enlace para teclado / lector de pantalla
      const first = menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }
  };

  // Estado inicial: cerrado + oculto en móvil
  syncA11y(false);

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('active'));
  });

  // Clic en overlay: cerrar
  if (overlay) overlay.addEventListener('click', () => setOpen(false));

  // Cerrar con tecla Escape y devolver el foco al botón.
  // Tab con menú abierto: trampa de foco real (cicla dentro del menú).
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('active')) return;
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus({ preventScroll: true });
      return;
    }
    if (e.key === 'Tab') {
      const focusables = menu.querySelectorAll('a[href], button:not([disabled])');
      if (focusables.length === 0) {
        e.preventDefault();
        toggle.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
  });

  // Si se agranda a escritorio, asegúrate de cerrar el menú móvil
  window.addEventListener('resize', () => {
    if (!isMobile() && menu.classList.contains('active')) {
      setOpen(false);
    } else {
      syncA11y(menu.classList.contains('active'));
    }
  });

  // Cierre reutilizable sin expansiones en el DOM
  return () => setOpen(false);
}

/* ---------- 3. SCROLL SUAVE + CIERRE DE MENÚ ---------- */
function initSmoothScroll(closeMenu) {
  const menu = document.getElementById('nav-menu');
  const close = typeof closeMenu === 'function' ? closeMenu : null;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id.length < 2) return;
      let target = null;
      try {
        target = document.querySelector(id);
      } catch (err) {
        return;
      }
      if (!target) return;

      e.preventDefault();
      // Scroll suave (CSS también lo apoya, esto asegura compatibilidad)
      // Respeta movimiento reducido
      const reduced = prefersReducedMotion();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      // Mueve el foco por accesibilidad sin hacer scroll extra
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      // Si el menú móvil estaba abierto, cerrarlo
      if (menu && menu.classList.contains('active')) {
        if (close) close();
        else {
          menu.classList.remove('active');
          const toggle = document.getElementById('nav-toggle');
          if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
          }
          document.body.classList.remove('menu-open');
        }
      }
    });
  });
}

/* ---------- 4. HEADER CON SOMBRA + BOTÓN VOLVER ARRIBA ---------- */
function initHeader() {
  const header = document.getElementById('header');
  const backTop = document.getElementById('back-top');
  if (!header || !backTop) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 10);
    backTop.classList.toggle('show', y > 600);
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    if ('requestAnimationFrame' in window) {
      window.requestAnimationFrame(update);
    } else {
      update();
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  backTop.addEventListener('click', () => {
    const reduced = prefersReducedMotion();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
}

/* ---------- 5. REVEAL AL HACER SCROLL + LINK ACTIVO ---------- */
function initReveal() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const reveals = document.querySelectorAll('.reveal');

  // Si no hay IntersectionObserver, mostrar todo directamente
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  // a) Animar .reveal cuando entra en pantalla (margen negativo: evita revelar antes de tiempo en móviles altos)
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target); // solo una vez
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => revealObs.observe(el));

  // b) Resaltar en el menú la sección visible + aria-current
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach((l) => {
          const on = l.getAttribute('href') === id;
          l.classList.toggle('active', on);
          if (on) l.setAttribute('aria-current', 'page');
          else l.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach((s) => secObs.observe(s));
}

/* ---------- 6. AÑO AUTOMÁTICO EN FOOTER ---------- */
function initYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
}

/* ---------- 7. SERVICE WORKER (offline, solo en http/https) ---------- */
function initServiceWorker() {
  try {
    if (!('serviceWorker' in navigator)) return;
    // En file:// el SW no funciona: solo http/https (local + Pages).
    if (!window.location.protocol.startsWith('http')) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        /* offline opcional: si falla, la web sigue 100% funcional */
      });
    });
  } catch (e) { /* navegadores viejos: ignorar */ }
}
