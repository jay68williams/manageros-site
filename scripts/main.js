/* ============================================
   MANAGER OS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavToggle();
  initFaqAccordion();
  initScrollReveal();
  initNavScrollEffect();
  initSmoothScroll();
  initContactForm();
  initCardAnimations();
});

/* --- Theme Toggle (Day/Night Mode) --- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Check saved preference or system preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    if (next === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    localStorage.setItem('theme', next);

    // Re-render lucide icons for the toggle
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
}

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

/* ===== FEATURE CARD ANIMATIONS ===== */
function initCardAnimations() {
  animateChatMockup();
  animateHorizontalBars();
  animateVerticalBars();
  animateChecklist();
}

/* --- 1. Chat Mockup: Typewriter effect with looping --- */
function animateChatMockup() {
  const mockup = document.querySelector('.chat-mockup');
  if (!mockup) return;

  const userBubble = mockup.querySelector('.chat-bubble.user');
  const aiBubble = mockup.querySelector('.chat-bubble.ai');
  const typing = mockup.querySelector('.chat-typing');
  if (!userBubble || !aiBubble || !typing) return;

  const userText = "What's our pipeline value this quarter?";
  const aiFullHTML = aiBubble.innerHTML;
  // Extract just the text content after the icon
  const aiIcon = aiBubble.querySelector('i');
  const aiText = "Your pipeline stands at \u00a32.4M across 47 active deals. 12 are forecast to close this month.";

  function runChatLoop() {
    // Reset all elements
    userBubble.style.opacity = '0';
    aiBubble.style.opacity = '0';
    typing.style.opacity = '0';
    userBubble.textContent = '';
    userBubble.style.animation = 'none';
    aiBubble.style.animation = 'none';
    typing.style.animation = 'none';

    let charIndex = 0;

    // Step 1: Fade in user bubble then type
    setTimeout(() => {
      userBubble.style.opacity = '1';
      userBubble.style.transition = 'opacity 0.3s';

      const typeUser = setInterval(() => {
        charIndex++;
        userBubble.textContent = userText.slice(0, charIndex);
        if (charIndex >= userText.length) {
          clearInterval(typeUser);

          // Step 2: Show typing indicator
          setTimeout(() => {
            typing.style.opacity = '1';
            typing.style.transition = 'opacity 0.3s';

            // Step 3: After typing, show AI response
            setTimeout(() => {
              typing.style.opacity = '0';

              setTimeout(() => {
                aiBubble.style.opacity = '1';
                aiBubble.style.transition = 'opacity 0.3s';
                // Rebuild AI content with icon
                aiBubble.innerHTML = '';
                if (aiIcon) {
                  const iconClone = aiIcon.cloneNode(true);
                  aiBubble.appendChild(iconClone);
                  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [aiBubble] });
                }
                const textSpan = document.createElement('span');
                textSpan.className = 'ai-typewriter';
                aiBubble.appendChild(textSpan);

                let aiCharIndex = 0;
                const typeAI = setInterval(() => {
                  aiCharIndex++;
                  textSpan.textContent = aiText.slice(0, aiCharIndex);
                  if (aiCharIndex >= aiText.length) {
                    clearInterval(typeAI);
                    // Wait then loop
                    setTimeout(runChatLoop, 3000);
                  }
                }, 25);
              }, 300);
            }, 1500);
          }, 400);
        }
      }, 45);
    }, 500);
  }

  runChatLoop();
}

/* --- 2. Horizontal Bar Chart: Sequential fill from top --- */
function animateHorizontalBars() {
  const chart = document.querySelector('.bar-chart-graphic');
  if (!chart) return;

  const fills = chart.querySelectorAll('.bar-fill');
  const targets = [];
  fills.forEach(f => {
    targets.push(f.style.width);
    f.style.width = '0%';
    f.style.animation = 'none';
    f.style.transition = 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  function runBarLoop() {
    // Reset all bars
    fills.forEach(f => { f.style.width = '0%'; });

    // Fill one at a time
    fills.forEach((fill, i) => {
      setTimeout(() => {
        fill.style.width = targets[i];
      }, i * 300);
    });

    // After all filled, wait then restart
    setTimeout(runBarLoop, fills.length * 300 + 3000);
  }

  runBarLoop();
}

/* --- 3. Vertical Bar Chart: Animate bars up one by one --- */
function animateVerticalBars() {
  const chart = document.querySelector('.vbar-chart-graphic');
  if (!chart) return;

  const bars = chart.querySelectorAll('.vbar');
  const targets = [];
  bars.forEach(b => {
    targets.push(b.style.height);
    b.style.height = '0%';
    b.style.animation = 'none';
    b.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  function runVBarLoop() {
    // Reset all bars
    bars.forEach(b => { b.style.height = '0%'; });

    // Grow one at a time
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.height = targets[i];
      }, i * 200);
    });

    // After all grown, wait then restart
    setTimeout(runVBarLoop, bars.length * 200 + 3000);
  }

  runVBarLoop();
}

/* --- 4. Checklist: Animated cursor clicks checkboxes --- */
function animateChecklist() {
  const checklist = document.querySelector('.checklist-graphic');
  if (!checklist) return;

  const items = checklist.querySelectorAll('.checklist-item');
  if (!items.length) return;

  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'animated-cursor';
  cursor.innerHTML = '<svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M1 1l5.5 16.5L9 12l6 2L1 1z" fill="#111" stroke="#fff" stroke-width="1.2"/></svg>';
  checklist.style.position = 'relative';
  cursor.style.position = 'absolute';
  cursor.style.zIndex = '10';
  cursor.style.opacity = '0';
  cursor.style.pointerEvents = 'none';
  cursor.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  cursor.style.transform = 'translate(0, 0)';
  checklist.appendChild(cursor);

  function runChecklistLoop() {
    // Reset all items to unchecked
    items.forEach(item => {
      item.classList.remove('checked');
      const box = item.querySelector('.check-box');
      if (box) {
        box.classList.add('empty');
        box.innerHTML = '';
      }
    });

    cursor.style.opacity = '0';
    cursor.style.left = '0px';
    cursor.style.top = '0px';

    let stepIndex = 0;

    function clickNextItem() {
      if (stepIndex >= items.length) {
        // All checked, wait then restart
        setTimeout(() => {
          cursor.style.opacity = '0';
          setTimeout(runChecklistLoop, 800);
        }, 1500);
        return;
      }

      const item = items[stepIndex];
      const box = item.querySelector('.check-box');
      if (!box) { stepIndex++; clickNextItem(); return; }

      // Get box position relative to checklist
      const checklistRect = checklist.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const targetX = boxRect.left - checklistRect.left + boxRect.width / 2;
      const targetY = boxRect.top - checklistRect.top + boxRect.height / 2;

      // Move cursor to checkbox
      cursor.style.opacity = '1';
      cursor.style.left = targetX + 'px';
      cursor.style.top = targetY + 'px';

      // Click after arriving
      setTimeout(() => {
        // Scale cursor for click effect
        cursor.style.transform = 'scale(0.85)';

        setTimeout(() => {
          cursor.style.transform = 'scale(1)';
          // Check the item
          item.classList.add('checked');
          box.classList.remove('empty');
          box.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

          stepIndex++;
          setTimeout(clickNextItem, 600);
        }, 150);
      }, 700);
    }

    // Start after a brief delay
    setTimeout(clickNextItem, 800);
  }

  runChecklistLoop();
}
