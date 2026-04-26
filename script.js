/* ==========================================================
   Redline Garage — micro-interactions
   - Scroll-reveal via IntersectionObserver
   - rAF-throttled pointer-follow red key-light (desktop only)
   ========================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll reveals ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => io.observe(el));
  }

  /* ---------- 2. Pointer-follow red key-light ---------- */
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fineHover && !reduceMotion) {
    const root = document.documentElement;
    let tx = window.innerWidth * 0.5;
    let ty = window.innerHeight * 0.3;
    let cx = tx, cy = ty;
    let raf = null;
    let visible = false;

    function tick() {
      // ease toward target — ~0.12 lerp gives a soft, premium follow
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      root.style.setProperty('--mx', cx + 'px');
      root.style.setProperty('--my', cy + 'px');
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    function showLight() {
      if (!visible) {
        visible = true;
        root.style.setProperty('--cursor-opacity', '1');
      }
    }

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      showLight();
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      root.style.setProperty('--cursor-opacity', '0');
      visible = false;
    });
  }
})();
