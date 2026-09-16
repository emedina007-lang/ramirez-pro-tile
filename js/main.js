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
    let isZoomed = false;
    let lastFocused = null;

    function setZoomed(next) {
      isZoomed = next;
      img.classList.toggle('is-zoomed', isZoomed);
      stage.classList.toggle('is-zoomed', isZoomed);
      if (isZoomed) {
        requestAnimationFrame(() => {
          stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
          stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
        });
      }
    }

    function render() {
      const photo = photos[currentIndex];
      setZoomed(false);
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
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.hidden = true;
      document.body.style.overflow = '';
      setZoomed(false);
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

    // Click-to-toggle zoom with drag-to-pan when zoomed
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    img.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = stage.scrollLeft;
      startScrollTop = stage.scrollTop;
      img.setPointerCapture(e.pointerId);
    });

    img.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) {
        moved = true;
        if (isZoomed) {
          img.classList.add('is-dragging');
          e.preventDefault();
          stage.scrollLeft = startScrollLeft - dx;
          stage.scrollTop = startScrollTop - dy;
        }
      }
    });

    function endDrag() {
      dragging = false;
      img.classList.remove('is-dragging');
      if (!moved) setZoomed(!isZoomed);
    }

    img.addEventListener('pointerup', endDrag);
    img.addEventListener('pointercancel', endDrag);
  }
})();
