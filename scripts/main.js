/* ============================================
   MANAGER OS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initFaqAccordion();
  initScrollReveal();
  initNavScrollEffect();
  initSmoothScroll();
  initContactForm();
});

/* --- Mobile Nav Toggle --- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  const body = document.body;

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    
    // Animate hamburger to X
    toggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      body.style.overflow = '';
      toggle.classList.remove('active');
    });
  });
}

/* --- FAQ Accordion --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      item.classList.toggle('active');
      if (!isActive) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
}

/* --- Scroll Reveal Animation --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Navbar Scroll Effect --- */
function initNavScrollEffect() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScrollY = currentScrollY;
  });
}

/* --- Smooth Scroll for anchor links --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- Contact Form (Web3Forms) --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        form.style.display = 'none';
        const successMsg = document.querySelector('.form-success');
        if (successMsg) successMsg.classList.add('visible');
      } else {
        submitBtn.innerHTML = '<span>Something went wrong. Try again.</span>';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }
    } catch (error) {
      submitBtn.innerHTML = '<span>Connection error. Try again.</span>';
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}
