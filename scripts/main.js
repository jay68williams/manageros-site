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
  animateLeadNetwork();
  animateDocBurst();
  animateNodeTree();
  animatePlatformDemo();
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

/* ===== SOLUTION CARD ANIMATIONS ===== */

/* --- Lead Generation: Network with growing lines --- */
function animateLeadNetwork() {
  const container = document.getElementById('lead-gen-anim');
  if (!container) return;
  const svg = container.querySelector('.solution-svg');
  const linesGroup = svg.querySelector('.network-lines');
  const nodesGroup = svg.querySelector('.network-nodes');
  const ns = 'http://www.w3.org/2000/svg';
  const cx = 150, cy = 90, radius = 68;
  const nodeCount = 10;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    const nx = cx + Math.cos(angle) * radius;
    const ny = cy + Math.sin(angle) * radius;

    const g = document.createElementNS(ns, 'g');
    g.setAttribute('opacity', '0');

    // Background circle
    const bg = document.createElementNS(ns, 'circle');
    bg.setAttribute('cx', nx);
    bg.setAttribute('cy', ny);
    bg.setAttribute('r', '12');
    bg.setAttribute('fill', 'var(--cherry-red)');
    bg.setAttribute('opacity', '0.12');
    g.appendChild(bg);

    // Head
    const head = document.createElementNS(ns, 'circle');
    head.setAttribute('cx', nx);
    head.setAttribute('cy', ny - 3);
    head.setAttribute('r', '4');
    head.setAttribute('fill', 'none');
    head.setAttribute('stroke', 'var(--cherry-red)');
    head.setAttribute('stroke-width', '1.3');
    head.setAttribute('stroke-linecap', 'round');
    g.appendChild(head);

    // Shoulders
    const shoulders = document.createElementNS(ns, 'path');
    shoulders.setAttribute('d', `M${nx - 6} ${ny + 6} a6 5 0 0 1 12 0`);
    shoulders.setAttribute('fill', 'none');
    shoulders.setAttribute('stroke', 'var(--cherry-red)');
    shoulders.setAttribute('stroke-width', '1.3');
    shoulders.setAttribute('stroke-linecap', 'round');
    g.appendChild(shoulders);

    nodesGroup.appendChild(g);
    nodes.push({ x: nx, y: ny, el: g });
  }

  function runLoop() {
    linesGroup.innerHTML = '';
    nodes.forEach(n => n.el.setAttribute('opacity', '0'));

    let idx = 0;
    function connectNext() {
      if (idx >= nodeCount) {
        // Hold visible, then fade and restart
        setTimeout(() => {
          nodes.forEach(n => {
            n.el.style.transition = 'opacity 0.5s ease';
            n.el.setAttribute('opacity', '0');
          });
          linesGroup.querySelectorAll('line').forEach(l => {
            l.style.transition = 'opacity 0.5s ease';
            l.setAttribute('opacity', '0');
          });
          setTimeout(runLoop, 1200);
        }, 2500);
        return;
      }

      const target = nodes[idx];

      // Create line — only extends 60% of the way to avoid overlapping icons
      const lineEnd = 0.6;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', cx);
      line.setAttribute('y2', cy);
      line.setAttribute('stroke', 'var(--cherry-red)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0.25');
      line.setAttribute('stroke-linecap', 'round');
      linesGroup.appendChild(line);

      // Animate line growing from center to ~60% of distance
      const dx = target.x - cx;
      const dy = target.y - cy;
      let t = 0;
      const grow = setInterval(() => {
        t += 0.05;
        if (t >= lineEnd) {
          t = lineEnd;
          clearInterval(grow);
          // Show node when line arrives
          target.el.style.transition = 'opacity 0.3s ease';
          target.el.setAttribute('opacity', '1');
        }
        line.setAttribute('x2', cx + dx * t);
        line.setAttribute('y2', cy + dy * t);
      }, 16);

      idx++;
      setTimeout(connectNext, 300);
    }

    setTimeout(connectNext, 400);
  }

  runLoop();
}

/* --- Document Processing: Folder opens and spawns documents --- */
function animateDocBurst() {
  const container = document.getElementById('doc-process-anim');
  if (!container) return;
  const svg = container.querySelector('.solution-svg');
  const burstGroup = svg.querySelector('.burst-files');
  const ns = 'http://www.w3.org/2000/svg';
  const folderCx = 152, folderCy = 78;
  const docCount = 6;
  const docs = [];

  // Spawn positions in a fan around the folder
  const positions = [
    { x: 70,  y: 35 },
    { x: 110, y: 25 },
    { x: 195, y: 25 },
    { x: 235, y: 35 },
    { x: 80,  y: 125 },
    { x: 225, y: 125 },
  ];

  for (let i = 0; i < docCount; i++) {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('opacity', '0');

    // Page shape
    const page = document.createElementNS(ns, 'rect');
    page.setAttribute('x', '-12');
    page.setAttribute('y', '-15');
    page.setAttribute('width', '24');
    page.setAttribute('height', '30');
    page.setAttribute('rx', '2');
    page.setAttribute('fill', 'var(--cherry-red)');
    page.setAttribute('opacity', '0.15');
    page.setAttribute('stroke', 'var(--cherry-red)');
    page.setAttribute('stroke-width', '1.5');
    g.appendChild(page);

    // Corner fold
    const fold = document.createElementNS(ns, 'path');
    fold.setAttribute('d', 'M6 -15 L6 -9 L12 -9');
    fold.setAttribute('fill', 'none');
    fold.setAttribute('stroke', 'var(--cherry-red)');
    fold.setAttribute('stroke-width', '1');
    fold.setAttribute('opacity', '0.7');
    g.appendChild(fold);

    // Text lines
    for (let l = 0; l < 3; l++) {
      const ln = document.createElementNS(ns, 'line');
      ln.setAttribute('x1', '-7');
      ln.setAttribute('y1', String(-4 + l * 6));
      ln.setAttribute('x2', String(5 - l));
      ln.setAttribute('y2', String(-4 + l * 6));
      ln.setAttribute('stroke', 'var(--cherry-red)');
      ln.setAttribute('stroke-width', '1');
      ln.setAttribute('opacity', '0.5');
      ln.setAttribute('stroke-linecap', 'round');
      g.appendChild(ln);
    }

    g.setAttribute('transform', `translate(${folderCx}, ${folderCy})`);
    burstGroup.appendChild(g);

    docs.push({
      el: g,
      tx: positions[i].x,
      ty: positions[i].y,
      ox: folderCx,
      oy: folderCy
    });
  }

  function runLoop() {
    // Reset to center
    docs.forEach(d => {
      d.el.setAttribute('transform', `translate(${d.ox}, ${d.oy}) scale(0.3)`);
      d.el.setAttribute('opacity', '0');
    });

    // Phase 1: Documents fly out from folder
    setTimeout(() => {
      docs.forEach((d, i) => {
        setTimeout(() => {
          d.el.style.transition = 'all 0.7s cubic-bezier(0.2, 0.8, 0.3, 1)';
          d.el.setAttribute('transform', `translate(${d.tx}, ${d.ty}) scale(1)`);
          d.el.setAttribute('opacity', '1');
        }, i * 120);
      });
    }, 300);

    // Phase 2: Documents return to folder
    const outDuration = docs.length * 120 + 700 + 2000;
    setTimeout(() => {
      docs.forEach((d, i) => {
        setTimeout(() => {
          d.el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          d.el.setAttribute('transform', `translate(${d.ox}, ${d.oy}) scale(0.3)`);
          d.el.setAttribute('opacity', '0');
        }, i * 80);
      });
    }, outDuration);

    const totalCycle = outDuration + docs.length * 80 + 500 + 1000;
    setTimeout(runLoop, totalCycle);
  }

  runLoop();
}

/* --- Client Reporting: Icon sources flowing to report --- */
function animateNodeTree() {
  const container = document.getElementById('client-report-anim');
  if (!container) return;
  const svg = container.querySelector('.solution-svg');
  const linesGroup = svg.querySelector('.report-lines');
  const sourcesGroup = svg.querySelector('.report-sources');
  const ns = 'http://www.w3.org/2000/svg';

  const reportCenter = { x: 150, y: 145 };

  // 7 data sources arranged in an arc at the top
  const sources = [
    { x: 40,  y: 50, label: 'CRM',   icon: 'database' },
    { x: 80,  y: 35, label: 'Email',  icon: 'envelope' },
    { x: 120, y: 27, label: 'Slack',  icon: 'chat' },
    { x: 160, y: 25, label: 'API',    icon: 'globe' },
    { x: 200, y: 30, label: 'Data',   icon: 'chart' },
    { x: 240, y: 42, label: 'KPIs',   icon: 'gauge' },
    { x: 270, y: 60, label: 'Logs',   icon: 'list' },
  ];

  // SVG icon paths for each type
  function getIconPath(type, x, y) {
    const g = document.createElementNS(ns, 'g');
    switch(type) {
      case 'database':
        // Database cylinder
        g.innerHTML = `<ellipse cx="${x}" cy="${y-4}" rx="7" ry="3" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <path d="M${x-7} ${y-4} v8 a7 3 0 0 0 14 0 v-8" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>`;
        break;
      case 'envelope':
        // Email envelope
        g.innerHTML = `<rect x="${x-8}" y="${y-5}" width="16" height="12" rx="1.5" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <path d="M${x-8} ${y-5} l8 6 l8 -6" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>`;
        break;
      case 'chat':
        // Chat bubble
        g.innerHTML = `<rect x="${x-8}" y="${y-7}" width="16" height="11" rx="3" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <path d="M${x-3} ${y+4} l-2 4 l4 -3" fill="none" stroke="var(--cherry-red)" stroke-width="1.2" stroke-linejoin="round"/>`;
        break;
      case 'globe':
        // Globe
        g.innerHTML = `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <ellipse cx="${x}" cy="${y}" rx="3.5" ry="7" fill="none" stroke="var(--cherry-red)" stroke-width="0.8"/>
          <line x1="${x-7}" y1="${y}" x2="${x+7}" y2="${y}" stroke="var(--cherry-red)" stroke-width="0.8"/>`;
        break;
      case 'chart':
        // Bar chart
        g.innerHTML = `<line x1="${x-7}" y1="${y+6}" x2="${x+7}" y2="${y+6}" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <rect x="${x-6}" y="${y}" width="3" height="6" fill="var(--cherry-red)" opacity="0.5" rx="0.5"/>
          <rect x="${x-1.5}" y="${y-4}" width="3" height="10" fill="var(--cherry-red)" opacity="0.5" rx="0.5"/>
          <rect x="${x+3}" y="${y-1}" width="3" height="7" fill="var(--cherry-red)" opacity="0.5" rx="0.5"/>`;
        break;
      case 'gauge':
        // Gauge/speedometer
        g.innerHTML = `<path d="M${x-7} ${y+3} a7 7 0 0 1 14 0" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <line x1="${x}" y1="${y+3}" x2="${x+4}" y2="${y-3}" stroke="var(--cherry-red)" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="${x}" cy="${y+3}" r="1.5" fill="var(--cherry-red)" opacity="0.5"/>`;
        break;
      case 'list':
        // List/clipboard
        g.innerHTML = `<rect x="${x-6}" y="${y-7}" width="12" height="15" rx="1.5" fill="none" stroke="var(--cherry-red)" stroke-width="1.2"/>
          <line x1="${x-3}" y1="${y-3}" x2="${x+3}" y2="${y-3}" stroke="var(--cherry-red)" stroke-width="0.9" opacity="0.5"/>
          <line x1="${x-3}" y1="${y}" x2="${x+3}" y2="${y}" stroke="var(--cherry-red)" stroke-width="0.9" opacity="0.5"/>
          <line x1="${x-3}" y1="${y+3}" x2="${x+2}" y2="${y+3}" stroke="var(--cherry-red)" stroke-width="0.9" opacity="0.5"/>`;
        break;
    }
    return g;
  }

  const sourceEls = [];
  sources.forEach((s, i) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('opacity', '0');

    // Background circle
    const bg = document.createElementNS(ns, 'circle');
    bg.setAttribute('cx', s.x);
    bg.setAttribute('cy', s.y);
    bg.setAttribute('r', '14');
    bg.setAttribute('fill', 'var(--cherry-red)');
    bg.setAttribute('opacity', '0.1');
    g.appendChild(bg);

    // Icon
    const icon = getIconPath(s.icon, s.x, s.y);
    g.appendChild(icon);

    // Label below
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', s.x);
    label.setAttribute('y', s.y + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '7');
    label.setAttribute('fill', 'var(--cherry-red)');
    label.setAttribute('font-weight', '600');
    label.setAttribute('opacity', '0.6');
    label.textContent = s.label;
    g.appendChild(label);

    sourcesGroup.appendChild(g);
    sourceEls.push({ el: g, x: s.x, y: s.y });
  });

  function drawFlowLine(x1, y1, x2, y2, delay) {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x1);
    line.setAttribute('y2', y1);
    line.setAttribute('stroke', 'var(--cherry-red)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('opacity', '0.5');
    line.setAttribute('stroke-linecap', 'round');
    linesGroup.appendChild(line);

    setTimeout(() => {
      const dx = x2 - x1, dy = y2 - y1;
      let t = 0;
      const anim = setInterval(() => {
        t += 0.04;
        if (t >= 1) { t = 1; clearInterval(anim); }
        line.setAttribute('x2', x1 + dx * t);
        line.setAttribute('y2', y1 + dy * t);
      }, 16);
    }, delay);
  }

  function runLoop() {
    linesGroup.innerHTML = '';
    sourceEls.forEach(s => s.el.setAttribute('opacity', '0'));

    // Phase 1: Pop in source icons one by one
    sourceEls.forEach((s, i) => {
      setTimeout(() => {
        s.el.style.transition = 'opacity 0.4s ease';
        s.el.setAttribute('opacity', '1');
      }, i * 200);
    });

    // Phase 2: Draw flow lines from each source to center
    const phase2Start = sourceEls.length * 200 + 400;
    sourceEls.forEach((s, i) => {
      drawFlowLine(s.x, s.y + 14, reportCenter.x, reportCenter.y - 20, phase2Start + i * 180);
    });

    // Phase 3: Hold, then fade and restart
    const totalTime = phase2Start + sourceEls.length * 180 + 800 + 2500;
    setTimeout(() => {
      sourceEls.forEach(s => {
        s.el.style.transition = 'opacity 0.5s ease';
        s.el.setAttribute('opacity', '0');
      });
      linesGroup.querySelectorAll('line').forEach(l => {
        l.style.transition = 'opacity 0.5s ease';
        l.setAttribute('opacity', '0');
      });
      setTimeout(runLoop, 1200);
    }, totalTime);
  }

  runLoop();
}

/* --- Platform Demo: Cursor → Type → Results Popup --- */
function animatePlatformDemo() {
  const cursor = document.getElementById('demoCursor');
  const inputArea = document.getElementById('demoInputArea');
  const inputBox = document.getElementById('demoInputBox');
  const placeholder = document.getElementById('demoPlaceholder');
  const inputText = document.getElementById('demoInputText');
  const caret = document.getElementById('demoCaret');
  const sendBtn = document.getElementById('demoSendBtn');
  const popup = document.getElementById('demoResultsPopup');
  const suggestions = document.querySelector('.demo-suggestions');
  const pills = document.querySelector('.demo-pills');

  if (!cursor || !inputArea || !inputText) return;

  const typingText = "Show me this week's lead report";
  let loopTimer = null;

  function resetAll() {
    cursor.style.transition = 'none';
    cursor.style.opacity = '0';
    cursor.style.left = '30%';
    cursor.style.top = '55%';
    inputArea.classList.remove('focused');
    placeholder.style.opacity = '1';
    placeholder.style.display = '';
    inputText.textContent = '';
    caret.style.display = 'none';
    sendBtn.classList.remove('active');
    popup.classList.remove('visible');
    if (suggestions) { suggestions.style.opacity = '1'; suggestions.style.visibility = 'visible'; }
    if (pills) { pills.style.opacity = '1'; pills.style.visibility = 'visible'; }
  }

  function moveCursor(targetX, targetY, duration) {
    return new Promise(resolve => {
      cursor.style.transition = `left ${duration}ms cubic-bezier(0.4,0,0.2,1), top ${duration}ms cubic-bezier(0.4,0,0.2,1)`;
      cursor.style.left = targetX;
      cursor.style.top = targetY;
      setTimeout(resolve, duration);
    });
  }

  function typeText(text, charDelay) {
    return new Promise(resolve => {
      let i = 0;
      function addChar() {
        if (i < text.length) {
          inputText.textContent += text[i];
          i++;
          setTimeout(addChar, charDelay);
        } else {
          resolve();
        }
      }
      addChar();
    });
  }

  async function runLoop() {
    resetAll();

    // 1. Cursor fades in at starting position
    await new Promise(r => setTimeout(r, 800));
    cursor.style.transition = 'opacity 0.4s ease';
    cursor.style.opacity = '1';
    await new Promise(r => setTimeout(r, 500));

    // 2. Cursor moves to the input box
    const inputRect = inputBox.getBoundingClientRect();
    const uiRect = cursor.parentElement.getBoundingClientRect();
    const targetLeft = ((inputRect.left - uiRect.left) + 80) + 'px';
    const targetTop = ((inputRect.top - uiRect.top) + 12) + 'px';

    await moveCursor(targetLeft, targetTop, 900);
    await new Promise(r => setTimeout(r, 200));

    // 3. Click effect — input gains focus
    inputArea.classList.add('focused');
    placeholder.style.opacity = '0';
    setTimeout(() => { placeholder.style.display = 'none'; }, 200);
    caret.style.display = 'inline-block';
    await new Promise(r => setTimeout(r, 300));

    // 4. Cursor fades out while typing begins
    cursor.style.transition = 'opacity 0.3s ease';
    cursor.style.opacity = '0';

    // 5. Type out the text
    await typeText(typingText, 60);
    await new Promise(r => setTimeout(r, 300));

    // 6. Send button activates
    sendBtn.classList.add('active');
    await new Promise(r => setTimeout(r, 600));

    // 7. Caret disappears, results popup slides in
    caret.style.display = 'none';
    if (suggestions) { suggestions.style.opacity = '0'; suggestions.style.visibility = 'hidden'; }
    if (pills) { pills.style.opacity = '0'; pills.style.visibility = 'hidden'; }
    popup.classList.add('visible');
    await new Promise(r => setTimeout(r, 3500));

    // 8. Fade everything out
    popup.classList.remove('visible');
    inputArea.classList.remove('focused');
    sendBtn.classList.remove('active');

    await new Promise(r => setTimeout(r, 800));

    // 9. Loop
    loopTimer = setTimeout(runLoop, 500);
  }

  runLoop();
}
