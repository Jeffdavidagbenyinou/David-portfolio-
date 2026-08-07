/* ============================================
   PORTFOLIO — David Jefferson AGBENYINOU
   Vanilla JS : menu, scroll reveal, filtres,
   modale projet, formulaire validé
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MENU BURGER + SCROLL FLUIDE ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2. NAV ACTIVE LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section, .hero');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- 3. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bar fill when its row becomes visible
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          const width = fill.dataset.width;
          requestAnimationFrame(() => { fill.style.width = width + '%'; });
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 4. FILTRE DE PROJETS ---------- */
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- 5. MODALE PROJET ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalTag = document.getElementById('modalTag');
  const modalDesc = document.getElementById('modalDesc');
  const modalStack = document.getElementById('modalStack');

  const tagClassMap = { Web: 'tag-web', Formulaire: 'tag-form', Réseau: 'tag-network', Blog: 'tag-blog', Club: 'tag-form', Certification: 'tag-network', Talent: 'tag-blog' };

  function openModal(card) {
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.details || card.dataset.desc;
    modalTag.textContent = card.dataset.tag;
    modalTag.className = 'project-tag ' + (tagClassMap[card.dataset.tag] || '');

    modalStack.innerHTML = '';
    (card.dataset.stack || '').split(',').forEach(item => {
      if (!item.trim()) return;
      const span = document.createElement('span');
      span.textContent = item.trim();
      modalStack.appendChild(span);
    });

    const existingLink = document.getElementById('modalLink');
    if (existingLink) existingLink.remove();
    if (card.dataset.url) {
      const link = document.createElement('a');
      link.id = 'modalLink';
      link.className = 'modal-link';
      link.href = card.dataset.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Voir le site ↗';
      modalStack.insertAdjacentElement('afterend', link);
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- 6. MODALE EXPÉRIENCE ---------- */
  const expModalOverlay = document.getElementById('expModalOverlay');
  const expModalClose = document.getElementById('expModalClose');
  const expModalDate = document.getElementById('expModalDate');
  const expModalTitle = document.getElementById('expModalTitle');
  const expModalRole = document.getElementById('expModalRole');
  const expModalDesc = document.getElementById('expModalDesc');
  const expModalPoints = document.getElementById('expModalPoints');

  function openExpModal(card) {
    expModalDate.textContent = card.dataset.date;
    expModalTitle.textContent = card.dataset.title;
    expModalRole.textContent = card.dataset.role;
    expModalDesc.textContent = card.dataset.desc;

    expModalPoints.innerHTML = '';
    (card.dataset.points || '').split(',').forEach(item => {
      if (!item.trim()) return;
      const li = document.createElement('li');
      li.textContent = item.trim();
      expModalPoints.appendChild(li);
    });

    expModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    expModalClose.focus();
  }

  function closeExpModal() {
    expModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.exp-clickable').forEach(card => {
    card.addEventListener('click', () => openExpModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openExpModal(card); }
    });
  });

  expModalClose.addEventListener('click', closeExpModal);
  expModalOverlay.addEventListener('click', (e) => { if (e.target === expModalOverlay) closeExpModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeExpModal(); });

  /* ---------- 6b. MODALE À PROPOS ---------- */
  const aboutTrigger = document.getElementById('aboutTrigger');
  const aboutModalOverlay = document.getElementById('aboutModalOverlay');
  const aboutModalClose = document.getElementById('aboutModalClose');

  function openAboutModal() {
    aboutModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    aboutModalClose.focus();
  }
  function closeAboutModal() {
    aboutModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (aboutTrigger) {
    aboutTrigger.addEventListener('click', openAboutModal);
    aboutTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAboutModal(); }
    });
  }
  aboutModalClose.addEventListener('click', closeAboutModal);
  aboutModalOverlay.addEventListener('click', (e) => { if (e.target === aboutModalOverlay) closeAboutModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAboutModal(); });

  /* ---------- 7. FORMULAIRE DE CONTACT (validation en direct) ---------- */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('cf-name');
  const emailInput = document.getElementById('cf-email');
  const messageInput = document.getElementById('cf-message');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Merci d\'indiquer ton nom (2 caractères min.)',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Adresse email invalide',
    message: (v) => v.trim().length >= 10 ? '' : 'Ton message doit contenir au moins 10 caractères',
  };

  function validateField(input, key) {
    const error = validators[key](input.value);
    const errorEl = document.getElementById('err-' + key);
    input.classList.toggle('error', !!error);
    errorEl.textContent = error;
    return !error;
  }

  [['name', nameInput], ['email', emailInput], ['message', messageInput]].forEach(([key, input]) => {
    input.addEventListener('blur', () => validateField(input, key));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input, key);
    });
  });

  form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('show');

  const validName = validateField(nameInput, 'name');
  const validEmail = validateField(emailInput, 'email');
  const validMessage = validateField(messageInput, 'message');

  if (!(validName && validEmail && validMessage)) return;

  const submitBtn = form.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-label').textContent = 'Envoi en cours...';

  emailjs.send('service_chv8yjb', 'template_29c0sll', {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  }).then(() => {
    formSuccess.textContent = 'Merci ! Votre message a été envoyé avec succès.';
    formSuccess.classList.remove('form-error');
    formSuccess.classList.add('show');
    form.reset();
  }).catch((error) => {
    console.error('Erreur EmailJS :', error);
    formSuccess.textContent = "Une erreur est survenue. Réessaie ou écris-moi directement à davidagbenyinou2007@gmail.com";
    formSuccess.classList.add('show', 'form-error');
  }).finally(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-label').textContent = 'Envoyer le message';
  });
});

  /* ---------- 8. ÉTINCELLES CARTE DISPONIBILITÉ ---------- */
  const availCard = document.getElementById('availCard');
  if (availCard) {
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.style.position = 'absolute';
      s.style.width = '3px';
      s.style.height = '3px';
      s.style.borderRadius = '50%';
      s.style.background = 'var(--cyan)';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.opacity = '0';
      s.style.animation = 'sparkFade ' + (2 + Math.random() * 2) + 's ease-in-out infinite';
      s.style.animationDelay = (Math.random() * 3) + 's';
      availCard.appendChild(s);
    }
  }

  /* ---------- 9. RÉSEAUX DE PARTICULES (Réalisations / Compétences / Expérience / Contact) ---------- */
  function initParticleNet(container) {
    const canvas = container.querySelector('canvas');
    const nctx = canvas.getContext('2d');
    let particles = [];

    function makeNetParticles() {
      particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.2 + 1,
      }));
    }

    function resizeNet() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      makeNetParticles();
    }
    resizeNet();
    window.addEventListener('resize', resizeNet);
    window.addEventListener('load', resizeNet);
    setTimeout(resizeNet, 300);

    function drawNet() {
      if (canvas.width && canvas.height) {
        nctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          nctx.beginPath();
          nctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          nctx.fillStyle = 'rgba(79,209,255,0.8)';
          nctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              nctx.beginPath();
              nctx.moveTo(particles[i].x, particles[i].y);
              nctx.lineTo(particles[j].x, particles[j].y);
              nctx.strokeStyle = 'rgba(79,209,255,' + (0.32 * (1 - dist / 130)) + ')';
              nctx.lineWidth = 0.9;
              nctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(drawNet);
    }
    drawNet();
  }

  document.querySelectorAll('.section-net').forEach(initParticleNet);

});
