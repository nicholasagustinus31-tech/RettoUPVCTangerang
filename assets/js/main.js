document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealElements.forEach(el => observer.observe(el));

  const tabs = document.querySelectorAll('[data-product-tab]');
  const cards = document.querySelectorAll('[data-product-category]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-product-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-product-category') === category) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.classList.remove('fade-out');
            card.classList.add('fade-in');
          });
        } else {
          card.classList.remove('fade-in');
          card.classList.add('fade-out');
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  initCaptcha();
  initFaq();
});

function initCaptcha() {
  const captchaBox = document.querySelector('[data-captcha]');
  const refreshBtn = document.querySelector('[data-refresh-captcha]');
  const form = document.querySelector('form[data-contact-form]');

  if (!captchaBox || !refreshBtn || !form) return;

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    captchaBox.textContent = code;
  };

  generateCode();

  refreshBtn.addEventListener('click', event => {
    event.preventDefault();
    generateCode();
  });

  form.addEventListener('submit', event => {
    const input = form.querySelector('input[name="captcha"]');
    const errorBox = form.querySelector('[data-captcha-error]');

    if (!input) return;

    if (input.value.trim().toUpperCase() !== captchaBox.textContent.trim().toUpperCase()) {
      event.preventDefault();
      errorBox.textContent = 'Kode keamanan tidak sesuai. Silakan coba lagi.';
      errorBox.style.display = 'block';
      generateCode();
    } else {
      errorBox.style.display = 'none';
    }
  });
}

function initFaq() {
  const toggles = document.querySelectorAll('[data-faq-toggle]');

  if (!toggles.length) return;

  const updateAnswerHeight = button => {
    const answer = button.nextElementSibling;
    if (!answer) return;

    if (button.getAttribute('aria-expanded') === 'true') {
      answer.classList.add('is-open');
      button.classList.add('is-open');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    } else {
      answer.style.maxHeight = '0px';
      answer.classList.remove('is-open');
      button.classList.remove('is-open');
    }
  };

  toggles.forEach(button => {
    const answer = button.nextElementSibling;
    if (!answer) return;

    answer.style.maxHeight = '0px';

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', (!isExpanded).toString());
      updateAnswerHeight(button);
    });
  });

  window.addEventListener('resize', () => {
    toggles.forEach(button => {
      if (button.getAttribute('aria-expanded') === 'true') {
        updateAnswerHeight(button);
      }
    });
  });
}
