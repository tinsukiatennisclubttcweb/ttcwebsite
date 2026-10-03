/* ============================================================
   TINSUKIA TENNIS CLUB — SHARED JS
   Lenis smooth scroll, nav, GSAP scroll reveals, mobile menu,
   lightbox, magnetic buttons, marquee doubling
   ============================================================ */

const TTC = (function () {
  'use strict';

  // ============================================================
  // LENIS SMOOTH SCROLL
  // ============================================================

  let lenis;

  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ============================================================
  // NAVBAR
  // ============================================================

  function initNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Scroll behavior
    function updateNav() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 80) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // Active page highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
      'index.html': 'home',
      '': 'home',
      'club.html': 'club',
      'coaching.html': 'coaching',
      'members.html': 'members',
      'talents.html': 'talents',
      'events.html': 'events',
      'event.html': 'events',
      'facilities.html': 'facilities',
      'gallery.html': 'gallery',
      'contact.html': 'contact',
      'membership.html': 'membership',
      'player.html': 'talents',
    };

    const activeId = pageMap[currentPage];
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop().split('#')[0].split('?')[0];
      const linkId = pageMap[linkPage];
      if (linkId && linkId === activeId) {
        link.classList.add('is-active');
      }
    });
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================

  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    let menuOpen = false;

    function toggleMenu() {
      menuOpen = !menuOpen;
      hamburger.classList.toggle('is-active', menuOpen);
      mobileMenu.classList.toggle('is-open', menuOpen);
      hamburger.setAttribute('aria-expanded', menuOpen);

      if (menuOpen) {
        lenis && lenis.stop();
        document.body.style.overflow = 'hidden';
      } else {
        lenis && lenis.start();
        document.body.style.overflow = '';
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        if (menuOpen) toggleMenu();
      });
    });
  }

  // ============================================================
  // GSAP SCROLL ANIMATIONS
  // ============================================================

  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // data-reveal elements
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const direction = el.getAttribute('data-reveal') || 'up';
      const delay = parseFloat(el.getAttribute('data-delay') || 0) / 1000;

      let fromVars = { y: 50, opacity: 0 };
      if (direction === 'left') fromVars = { x: -40, opacity: 0 };
      if (direction === 'right') fromVars = { x: 40, opacity: 0 };
      if (direction === 'scale') fromVars = { scale: 0.92, opacity: 0 };
      if (direction === 'fade') fromVars = { opacity: 0 };

      let toVars = { y: 0, x: 0, scale: 1, opacity: 1 };

      gsap.fromTo(el, fromVars, {
        ...toVars,
        duration: direction === 'scale' ? 1.2 : 1,
        ease: 'power3.out',
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    // Accent bars
    document.querySelectorAll('.accent-bar').forEach((bar) => {
      gsap.fromTo(bar,
        { width: 0 },
        {
          width: 64,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Section headings — clip reveal
    document.querySelectorAll('[data-clip-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0 0 0)', y: 30 },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Staggered card grids
    document.querySelectorAll('[data-stagger-grid]').forEach((grid) => {
      const cards = grid.children;
      if (!cards.length) return;

      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }

  // ============================================================
  // PARALLAX (hero backgrounds)
  // ============================================================

  function initParallax() {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed') || 0.3);
      gsap.to(el, {
        y: 120 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.page-hero') || el.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });
  }

  // ============================================================
  // HERO ENTRANCE ANIMATION (per-page)
  // ============================================================

  function initHeroEntrance() {
    const hero = document.querySelector('.page-hero');
    if (!hero) return;

    const label = hero.querySelector('.page-hero__label');
    const heading = hero.querySelector('.page-hero__heading');
    const desc = hero.querySelector('.page-hero__desc');
    const actions = hero.querySelector('.page-hero__actions');

    const tl = gsap.timeline({ delay: 0.2 });

    if (label) {
      tl.fromTo(label, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    }
    if (heading) {
      tl.fromTo(heading,
        { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.out' },
        label ? '-=0.35' : '0'
      );
    }
    if (desc) {
      tl.fromTo(desc, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5');
    }
    if (actions) {
      tl.fromTo(actions, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');
    }
  }

  // ============================================================
  // IMAGE HOVER ZOOM
  // ============================================================

  function initImageHovers() {
    document.querySelectorAll('[data-img-hover]').forEach((card) => {
      const img = card.querySelector('img');
      if (!img) return;

      card.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
      });
    });
  }

  // ============================================================
  // MAGNETIC BUTTONS
  // ============================================================

  function initMagneticButtons() {
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.btn').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.12, y: y * 0.12, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }
  }

  // ============================================================
  // MARQUEE
  // ============================================================

  function initMarquee() {
    document.querySelectorAll('.marquee__track').forEach((track) => {
      const content = track.innerHTML;
      track.innerHTML = content + content;
    });
  }

  // ============================================================
  // LIGHTBOX
  // ============================================================

  let lightboxImages = [];
  let lightboxIndex = 0;

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const image = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    // Collect all gallery items
    document.querySelectorAll('[data-lightbox]').forEach((item) => {
      const img = item.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('data-full') || img.src;
      lightboxImages.push(src);
      item.addEventListener('click', () => {
        lightboxIndex = lightboxImages.indexOf(src);
        openLightbox(src);
      });
    });

    function openLightbox(src) {
      image.src = src;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lenis && lenis.stop();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lenis && lenis.start();
    }

    function navigate(dir) {
      lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
      image.src = lightboxImages[lightboxIndex];
      gsap.fromTo(image, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    });
  }

  // ============================================================
  // UTILITY: Fetch JSON
  // ============================================================

  async function fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      return await res.json();
    } catch (err) {
      console.warn('TTC data load:', err.message);
      return null;
    }
  }

  // ============================================================
  // UTILITY: URL params
  // ============================================================

  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  // ============================================================
  // UTILITY: Format date
  // ============================================================

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ============================================================
  // UTILITY: Generate nav HTML (DRY across pages)
  // ============================================================

  function getNavHTML() {
    return `
    <nav class="nav nav--solid" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav__inner">
        <a href="index.html" class="nav__logo">Tinsukia Tennis Club</a>
        <div class="nav__links" id="navLinks">
          <a href="index.html" class="nav__link" data-page="home">Home</a>
          <a href="club.html" class="nav__link" data-page="club">The Club</a>
          <a href="coaching.html" class="nav__link" data-page="coaching">Coaching</a>
          <a href="members.html" class="nav__link" data-page="members">Members</a>
          <a href="talents.html" class="nav__link" data-page="talents">Talents</a>
          <a href="events.html" class="nav__link" data-page="events">Events</a>
          <a href="facilities.html" class="nav__link" data-page="facilities">Facilities</a>
          <a href="gallery.html" class="nav__link" data-page="gallery">Gallery</a>
          <a href="contact.html" class="nav__link" data-page="contact">Contact</a>
        </div>
        <div class="nav__cta-wrap">
          <a href="membership.html" class="btn btn--primary btn--sm">Join the Club <span class="btn__arrow">→</span></a>
        </div>
        <button class="nav__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Mobile navigation">
      <a href="index.html" class="mobile-menu__link" data-page="home">Home</a>
      <a href="club.html" class="mobile-menu__link" data-page="club">The Club</a>
      <a href="coaching.html" class="mobile-menu__link" data-page="coaching">Coaching</a>
      <a href="members.html" class="mobile-menu__link" data-page="members">Members</a>
      <a href="talents.html" class="mobile-menu__link" data-page="talents">Talents</a>
      <a href="events.html" class="mobile-menu__link" data-page="events">Events</a>
      <a href="facilities.html" class="mobile-menu__link" data-page="facilities">Facilities</a>
      <a href="gallery.html" class="mobile-menu__link" data-page="gallery">Gallery</a>
      <a href="contact.html" class="mobile-menu__link" data-page="contact">Contact</a>
      <div class="mobile-menu__cta">
        <a href="membership.html" class="btn btn--primary">Join the Club <span class="btn__arrow">→</span></a>
      </div>
    </div>`;
  }

  // ============================================================
  // UTILITY: Generate footer HTML
  // ============================================================

  function getFooterHTML() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer__main">
          <div class="footer__brand">
            <div class="footer__logo">Tinsukia Tennis Club</div>
            <p class="footer__tagline">Grassroots tennis in the heart of Upper Assam. A place to play, train, compete and belong.</p>
          </div>
          <div class="footer__nav">
            <div class="footer__nav-col">
              <span class="footer__nav-heading">Explore</span>
              <a href="club.html" class="footer__nav-link">The Club</a>
              <a href="coaching.html" class="footer__nav-link">Coaching</a>
              <a href="facilities.html" class="footer__nav-link">Facilities</a>
              <a href="gallery.html" class="footer__nav-link">Gallery</a>
            </div>
            <div class="footer__nav-col">
              <span class="footer__nav-heading">Community</span>
              <a href="members.html" class="footer__nav-link">Members</a>
              <a href="talents.html" class="footer__nav-link">Club Talents</a>
              <a href="events.html" class="footer__nav-link">Events</a>
              <a href="membership.html" class="footer__nav-link">Join</a>
            </div>
            <div class="footer__nav-col">
              <span class="footer__nav-heading">Connect</span>
              <a href="contact.html" class="footer__nav-link">Contact</a>
              <a href="https://wa.me/919435037032" class="footer__nav-link" target="_blank" rel="noopener">WhatsApp</a>
              <a href="tel:+919435037032" class="footer__nav-link">+91 94350 37032</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=27.4969755,95.3642571" class="footer__nav-link" target="_blank" rel="noopener">Directions</a>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__copyright">&copy; ${new Date().getFullYear()} Tinsukia Tennis Club. All rights reserved.</p>
          <div class="footer__socials">
            <a href="https://wa.me/919435037032" class="footer__social-link" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="tel:+919435037032" class="footer__social-link" aria-label="Phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  // ============================================================
  // LIGHTBOX HTML
  // ============================================================

  function getLightboxHTML() {
    return `
    <div class="lightbox" id="lightbox" role="dialog" aria-label="Image viewer" aria-hidden="true">
      <button class="lightbox__close" id="lightboxClose" aria-label="Close">&times;</button>
      <button class="lightbox__nav lightbox__nav--prev" id="lightboxPrev" aria-label="Previous">&#8249;</button>
      <button class="lightbox__nav lightbox__nav--next" id="lightboxNext" aria-label="Next">&#8250;</button>
      <img class="lightbox__image" id="lightboxImage" src="" alt="Full size image">
    </div>`;
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    initLenis();
    initNav();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initHeroEntrance();
    initImageHovers();
    initMagneticButtons();
    initMarquee();
    initLightbox();

    // Refresh ScrollTrigger after all images load
    window.addEventListener('load', () => ScrollTrigger.refresh());

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    lenis: () => lenis,
    fetchJSON,
    getParam,
    formatDate,
    formatDateShort,
    getNavHTML,
    getFooterHTML,
    getLightboxHTML,
  };
})();
