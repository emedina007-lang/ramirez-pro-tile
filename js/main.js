(function () {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealTargets = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // ─── Gallery lightbox ───
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');

  if (galleryItems.length && lightbox) {
    const stage = document.getElementById('lightboxStage');
    const img = document.getElementById('lightboxImg');
    const tagEl = document.getElementById('lightboxTag');
    const countEl = document.getElementById('lightboxCount');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    const photos = galleryItems.map((item) => {
      const itemImg = item.querySelector('img');
      return {
        src: itemImg.getAttribute('src'),
        alt: itemImg.getAttribute('alt'),
        tag: item.querySelector('.tag').textContent
      };
    });

    let currentIndex = 0;
    let lastFocused = null;

    const MAX_SCALE = 4;
    let scale = 1;
    let panX = 0;
    let panY = 0;

    function applyTransform() {
      img.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      img.classList.toggle('is-zoomed', scale > 1.02);
    }

    // Clamp pan so the scaled image can't drift entirely off-stage.
    function clampPan() {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const fit = Math.min(stage.clientWidth / img.naturalWidth, stage.clientHeight / img.naturalHeight);
      const baseW = img.naturalWidth * fit;
      const baseH = img.naturalHeight * fit;
      const overflowX = Math.max(0, (baseW * scale - stage.clientWidth) / 2);
      const overflowY = Math.max(0, (baseH * scale - stage.clientHeight) / 2);
      panX = Math.max(-overflowX, Math.min(overflowX, panX));
      panY = Math.max(-overflowY, Math.min(overflowY, panY));
    }

    function resetZoom() {
      scale = 1;
      panX = 0;
      panY = 0;
      applyTransform();
      pointers.clear();
      pinchStartDist = 0;
    }

    // Zoom to newScale, keeping the point under (clientX, clientY) visually fixed.
    function zoomAt(clientX, clientY, newScaleRaw) {
      const newScale = Math.max(1, Math.min(MAX_SCALE, newScaleRaw));
      if (newScale === scale) return;
      const rect = stage.getBoundingClientRect();
      const qx = clientX - rect.left - rect.width / 2;
      const qy = clientY - rect.top - rect.height / 2;
      const k = newScale / scale;
      panX = qx * (1 - k) + k * panX;
      panY = qy * (1 - k) + k * panY;
      scale = newScale;
      clampPan();
      applyTransform();
    }

    function render() {
      const photo = photos[currentIndex];
      resetZoom();
      img.src = photo.src;
      img.alt = photo.alt;
      tagEl.textContent = photo.tag;
      countEl.textContent = `${currentIndex + 1} / ${photos.length}`;
    }

    function open(index) {
      lastFocused = document.activeElement;
      currentIndex = index;
      render();
      lightbox.hidden = false;
      lightbox.classList.add('is-open');
      document.body.classList.add('lightbox-open');
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      resetZoom();
      if (lastFocused) lastFocused.focus();
    }

    function next() {
      currentIndex = (currentIndex + 1) % photos.length;
      render();
    }

    function prev() {
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
      render();
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => open(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(index);
        }
      });
    });

    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === stage) close();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    // ─── Pinch (touch), wheel (desktop), drag-to-pan, and double-tap/click zoom ───
    const pointers = new Map();
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let panPointerStartX = 0;
    let panPointerStartY = 0;
    let panStartX = 0;
    let panStartY = 0;

    function dist(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function midpoint(a, b) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    function quickZoomToggle(clientX, clientY) {
      if (scale > 1.02) {
        resetZoom();
      } else {
        zoomAt(clientX, clientY, 2.5);
      }
    }

    img.addEventListener('pointerdown', (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        img.setPointerCapture(e.pointerId);
      } catch (err) {
        // Ignore: pointer capture is a robustness nicety, not required for the gesture math below.
      }

      if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values());
        pinchStartDist = dist(a, b);
        pinchStartScale = scale;
      } else if (pointers.size === 1) {
        panPointerStartX = e.clientX;
        panPointerStartY = e.clientY;
        panStartX = panX;
        panStartY = panY;
      }
    });

    img.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        e.preventDefault();
        const [a, b] = Array.from(pointers.values());
        const d = dist(a, b);
        const mid = midpoint(a, b);
        if (pinchStartDist > 0) {
          zoomAt(mid.x, mid.y, pinchStartScale * (d / pinchStartDist));
        }
      } else if (pointers.size === 1 && scale > 1.02) {
        const dx = e.clientX - panPointerStartX;
        const dy = e.clientY - panPointerStartY;
        if (Math.abs(dx) + Math.abs(dy) > 4) {
          e.preventDefault();
          img.classList.add('is-dragging');
          panX = panStartX + dx;
          panY = panStartY + dy;
          clampPan();
          applyTransform();
        }
      }
    });

    function endPointer(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      img.classList.remove('is-dragging');

      if (pointers.size === 1) {
        // Seamlessly continue panning with the remaining finger.
        const remaining = Array.from(pointers.entries())[0];
        panPointerStartX = remaining[1].x;
        panPointerStartY = remaining[1].y;
        panStartX = panX;
        panStartY = panY;
      }
    }

    img.addEventListener('pointerup', endPointer);
    img.addEventListener('pointercancel', endPointer);

    // Desktop: mouse wheel / trackpad zooms, anchored at the cursor.
    stage.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const factor = Math.pow(1.0015, -e.deltaY);
        zoomAt(e.clientX, e.clientY, scale * factor);
      },
      { passive: false }
    );

    // Double-click (desktop) / double-tap (touch, synthesized by the browser
    // from two quick taps) both fire this native event — single source of
    // truth for the zoom shortcut, avoiding double-handling with the pointer
    // gesture logic above.
    img.addEventListener('dblclick', (e) => {
      e.preventDefault();
      quickZoomToggle(e.clientX, e.clientY);
    });
  }
})();
