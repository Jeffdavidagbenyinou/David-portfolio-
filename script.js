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

  const tagClassMap = { Web: 'tag-web', Formulaire: 'tag-form', Réseau: 'tag-network', Blog: 'tag-blog' };

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

  /* ---------- 6. FORMULAIRE DE CONTACT (validation en direct) ---------- */
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

});
