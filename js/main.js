/* =============================================
   Pampered Pawz — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Sticky Nav Shadow ----- */
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('shadow-lg', window.scrollY > 80);
    }, { passive: true });
  }

  /* ----- Mobile Nav Toggle ----- */
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ----- Scroll Animations (Fade & Slide Up) ----- */
  if (!prefersReducedMotion) {
    const animElements = document.querySelectorAll('.anim-on-scroll');
    animElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    });

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (el.hasAttribute('data-stagger')) {
              const children = el.querySelectorAll('.stagger-child');
              children.forEach((child, i) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.style.transition = `opacity 0.4s ease-out ${i * 80}ms, transform 0.4s ease-out ${i * 80}ms`;
                setTimeout(() => {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                }, 10);
              });
            }
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            scrollObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    animElements.forEach(el => scrollObserver.observe(el));
  }

  /* ----- Hero Fade In ----- */
  if (!prefersReducedMotion) {
    const hero = document.querySelector('.hero-section');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transition = 'opacity 0.8s ease-out';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hero.style.opacity = '1';
        });
      });
    }
  }

  /* ----- FAQ Accordion ----- */
  const faqButtons = document.querySelectorAll('.faq-toggle');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all other FAQs
      faqButtons.forEach(otherBtn => {
        const otherContent = otherBtn.nextElementSibling;
        const otherIcon = otherBtn.querySelector('.faq-icon');
        if (otherContent !== content) {
          otherContent.style.maxHeight = '0px';
          otherContent.style.paddingTop = '0';
          otherContent.style.paddingBottom = '0';
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        content.style.maxHeight = '0px';
        content.style.paddingTop = '0';
        content.style.paddingBottom = '0';
        btn.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.style.maxHeight = content.scrollHeight + 32 + 'px';
        content.style.paddingTop = '16px';
        content.style.paddingBottom = '16px';
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* ============================================
     BEFORE/AFTER COMPARISON SLIDER
     ============================================ */
  function initSlider(container) {
    const handle = container.querySelector('.ba-handle');
    const beforeWrap = container.querySelector('.ba-before-wrap');
    if (!handle || !beforeWrap) return;

    let isDragging = false;

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      beforeWrap.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }

    function onPointerDown(e) {
      e.preventDefault();
      isDragging = true;
      container.classList.add('ba-active');
      setPosition(e.touches ? e.touches[0].clientX : e.clientX);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(e.touches ? e.touches[0].clientX : e.clientX);
    }

    function onPointerUp() {
      isDragging = false;
      container.classList.remove('ba-active');
    }

    // Mouse events
    container.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    // Touch events
    container.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);

    // Initialize at 50%
    beforeWrap.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';
  }

  // Init all sliders on the page
  document.querySelectorAll('.ba-slider').forEach(initSlider);


  /* ============================================
     GALLERY LIGHTBOX MODAL
     ============================================ */
  const galleryModal = document.getElementById('gallery-modal');
  const galleryOpenBtn = document.getElementById('gallery-open-btn');
  const galleryCloseBtn = document.getElementById('gallery-close-btn');

  if (galleryModal && galleryOpenBtn) {
    galleryOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      galleryModal.classList.remove('hidden');
      galleryModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      // Initialize sliders inside the modal
      galleryModal.querySelectorAll('.ba-slider').forEach(initSlider);
    });

    if (galleryCloseBtn) {
      galleryCloseBtn.addEventListener('click', () => {
        galleryModal.classList.add('hidden');
        galleryModal.classList.remove('flex');
        document.body.style.overflow = '';
      });
    }

    // Close on backdrop click
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        galleryModal.classList.add('hidden');
        galleryModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !galleryModal.classList.contains('hidden')) {
        galleryModal.classList.add('hidden');
        galleryModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================
     LOAD DYNAMIC CONTENT FROM VERECEL API
     ============================================ */
  
  async function loadDynamicContent() {
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) return;
      const data = await res.json();
      
      const gallery = data.gallery || [];
      const gotw = data.gotw || {};

      // --- Groom of the Week (booking.html) ---
      const gotwBeforeImg = document.querySelector('[data-gotw="before"]');
      const gotwAfterImg = document.querySelector('[data-gotw="after"]');
      if (gotwBeforeImg && gotw.before) gotwBeforeImg.src = gotw.before;
      if (gotwAfterImg && gotw.after) gotwAfterImg.src = gotw.after;

      // --- Dynamic Gallery (index.html) ---
      const validPairs = gallery.filter(p => p.before && p.after);
      if (validPairs.length > 0) {
        const galleryGrid = document.querySelector('#gallery .grid');
        const galleryModalGrid = document.querySelector('#gallery-modal .grid');

        function createSliderHTML(pair, classes = '') {
          return `
            <div class="${classes} ba-slider aspect-square">
              <div class="ba-after-wrap w-full h-full">
                <img src="${pair.after}" alt="Dog after grooming">
              </div>
              <div class="ba-before-wrap">
                <img src="${pair.before}" alt="Dog before grooming">
              </div>
              <div class="ba-handle"><div class="ba-handle-circle"><i class="fa-solid fa-arrows-left-right"></i></div></div>
              <span class="ba-label ba-label-before">Before</span>
              <span class="ba-label ba-label-after">After</span>
            </div>`;
        }

        if (galleryGrid) {
          galleryGrid.innerHTML = validPairs.map(p => createSliderHTML(p, 'stagger-child')).join('');
          galleryGrid.querySelectorAll('.ba-slider').forEach(initSlider);
        }

        if (galleryModalGrid) {
          galleryModalGrid.innerHTML = validPairs.map(p => createSliderHTML(p, 'rounded-2xl')).join('');
        }
      }
    } catch (e) {
      console.error('Failed to load dynamic content from API:', e);
    }
  }

  loadDynamicContent();

});
