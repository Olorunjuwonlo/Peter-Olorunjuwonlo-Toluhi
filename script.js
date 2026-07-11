const toggleButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const year = document.getElementById('year');
const openContactButton = document.getElementById('open-contact-form');
const revealElements = document.querySelectorAll('.reveal');
const closeContactButton = document.getElementById('close-contact-form');
const contactModal = document.getElementById('contact-modal');
const contactForm = document.getElementById('contact-form');
const contactEndpoint = 'https://formsubmit.co/ajax/jayonepet12@gmail.com';

if (year) {
  year.textContent = new Date().getFullYear();
}

function openContactModal() {
  if (!contactModal) {
    return;
  }

  contactModal.classList.add('active');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeContactModal() {
  if (!contactModal) {
    return;
  }

  contactModal.classList.remove('active');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (revealElements.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

if (toggleButton && navLinks) {
  toggleButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggleButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

// Close mobile nav with Escape key when open
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    toggleButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
});

const sections = document.querySelectorAll('main section[id]');
if (sections.length && navItems.length) {
  const setActiveNavItem = () => {
    let currentId = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = section.id;
      }
    });

    navItems.forEach((link) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', targetId === currentId);
    });
  };

  setActiveNavItem();
  window.addEventListener('scroll', setActiveNavItem, { passive: true });
}

if (openContactButton) {
  openContactButton.addEventListener('click', openContactModal);
}

if (closeContactButton) {
  closeContactButton.addEventListener('click', closeContactModal);
}

if (contactModal) {
  contactModal.addEventListener('click', (event) => {
    if (event.target === contactModal) {
      closeContactModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal?.classList.contains('active')) {
    closeContactModal();
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name')?.toString().trim() || 'There';
    const email = formData.get('email')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';
    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    const status = document.createElement('p');
    status.className = 'form-status';
    status.textContent = 'Sending your message...';
    contactForm.appendChild(status);

    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Website enquiry from ${name}`,
          _captcha: 'false',
          _template: 'table'
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      contactForm.innerHTML = '<p class="form-status success">Thanks! Your message is on its way.</p>';
      window.setTimeout(closeContactModal, 1400);
    } catch (error) {
      if (status) {
        status.textContent = 'Something went wrong. Please try again or email me directly.';
        status.className = 'form-status error';
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}
