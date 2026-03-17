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

/* --- Lead Generation: Profile network animation --- */
function animateLeadNetwork() {
  const container = document.getElementById('lead-gen-anim');
  if (!container) return;
  const svg = container.querySelector('.solution-svg');
  const linesGroup = svg.querySelector('.network-lines');
  const nodesGroup = svg.querySelector('.network-nodes');
  const ns = 'http://www.w3.org/2000/svg';
  const cx = 150, cy = 90, radius = 65;
  const nodeCount = 10;
  const nodePositions = [];

  // Create 10 outer profile nodes
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    const nx = cx + Math.cos(angle) * radius;
    const ny = cy + Math.sin(angle) * radius;
    nodePositions.push({ x: nx, y: ny });

    // Node circle
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', nx);
    circle.setAttribute('cy', ny);
    circle.setAttribute('r', '9');
    circle.setAttribute('fill', 'var(--light-grey)');
    circle.setAttribute('stroke', 'var(--border-grey)');
    circle.setAttribute('stroke-width', '1');
    circle.setAttribute('opacity', '0');
    circle.classList.add('net-node');
    nodesGroup.appendChild(circle);

    // Tiny head
    const head = document.createElementNS(ns, 'circle');
    head.setAttribute('cx', nx);
    head.setAttribute('cy', ny - 2);
    head.setAttribute('r', '3');
    head.setAttribute('fill', 'none');
    head.setAttribute('stroke', 'var(--text-secondary)');
    head.setAttribute('stroke-width', '1');
    head.setAttribute('opacity', '0');
    head.classList.add('net-node');
    nodesGroup.appendChild(head);

    // Tiny body arc
    const body = document.createElementNS(ns, 'path');
    body.setAttribute('d', `M${nx - 4} ${ny + 4} a4 3 0 0 1 8 0`);
    body.setAttribute('fill', 'none');
    body.setAttribute('stroke', 'var(--text-secondary)');
    body.setAttribute('stroke-width', '1');
    body.setAttribute('opacity', '0');
    body.classList.add('net-node');
    nodesGroup.appendChild(body);
  }

  const netNodes = nodesGroup.querySelectorAll('.net-node');

  function runNetworkLoop() {
    // Reset: hide all nodes and lines
    linesGroup.innerHTML = '';
    netNodes.forEach(n => { n.setAttribute('opacity', '0'); });

    let idx = 0;
    function showNextNode() {
      if (idx >= nodeCount) {
        // All visible, pulse lines, then reset
        setTimeout(runNetworkLoop, 3000);
        return;
      }
      const pos = nodePositions[idx];

      // Draw line from center to node
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', cx);
      line.setAttribute('y2', cy);
      line.setAttribute('stroke', 'var(--cherry-red)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('opacity', '0.3');
      linesGroup.appendChild(line);

      // Animate line extending
      let progress = 0;
      const animLine = setInterval(() => {
        progress += 0.08;
        if (progress >= 1) { progress = 1; clearInterval(animLine); }
        line.setAttribute('x2', cx + (pos.x - cx) * progress);
        line.setAttribute('y2', cy + (pos.y - cy) * progress);
      }, 16);

      // Show node elements (3 per node: circle, head, body)
      const start = idx * 3;
      setTimeout(() => {
        for (let j = start; j < start + 3 && j < netNodes.length; j++) {
          netNodes[j].setAttribute('opacity', '1');
          netNodes[j].style.transition = 'opacity 0.3s ease';
        }
      }, 200);

      idx++;
      setTimeout(showNextNode, 250);
    }

    setTimeout(showNextNode, 500);
  }

  runNetworkLoop();
}

/* --- Document Processing: File burst animation --- */
function animateDocBurst() {
  const container = document.getElementById('doc-process-anim');
  if (!container) return;
  const svg = container.querySelector('.solution-svg');
  const burstGroup = svg.querySelector('.burst-files');
  const ns = 'http://www.w3.org/2000/svg';
  const cx = 150, cy = 80;
  const fileCount = 8;
  const burstRadius = 60;
  const fileEls = [];

  // Create burst file icons
  for (let i = 0; i < fileCount; i++) {
    const angle = (i / fileCount) * Math.PI * 2 - Math.PI / 2;
    const tx = cx + Math.cos(angle) * burstRadius;
    const ty = cy + Math.sin(angle) * burstRadius;

    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', `translate(${cx - 10}, ${cy - 12})`);
    g.setAttribute('opacity', '0');
    g.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('width', '20');
    rect.setAttribute('height', '24');
    rect.setAttribute('rx', '2');
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', 'var(--cherry-red)');
    rect.setAttribute('stroke-width', '1.2');
    rect.setAttribute('opacity', '0.6');
    g.appendChild(rect);

    // Corner fold
    const fold = document.createElementNS(ns, 'path');
    fold.setAttribute('d', 'M14 0 L14 6 L20 6');
    fold.setAttribute('fill', 'none');
    fold.setAttribute('stroke', 'var(--cherry-red)');
    fold.setAttribute('stroke-width', '0.8');
    fold.setAttribute('opacity', '0.4');
    g.appendChild(fold);

    // Lines on file
    for (let l = 0; l < 3; l++) {
      const ln = document.createElementNS(ns, 'line');
      ln.setAttribute('x1', '4');
      ln.setAttribute('y1', String(10 + l * 4));
      ln.setAttribute('x2', String(14 - l * 2));
      ln.setAttribute('y2', String(10 + l * 4));
      ln.setAttribute('stroke', 'var(--cherry-red)');
      ln.setAttribute('stroke-width', '0.8');
      ln.setAttribute('opacity', '0.35');
      g.appendChild(ln);
    }

    burstGroup.appendChild(g);
    fileEls.push({ el: g, targetX: tx - 10, targetY: ty - 12, originX: cx - 10, originY: cy - 12 });
  }

  function runDocLoop() {
    // Reset all to center
    fileEls.forEach(f => {
      f.el.setAttribute('transform', `translate(${f.originX}, ${f.originY})`);
      f.el.setAttribute('opacity', '0');
      f.el.style.transition = 'none';
    });

    // Phase 1: Burst outward
    setTimeout(() => {
      fileEls.forEach((f, i) => {
        setTimeout(() => {
          f.el.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.3, 1)';
          f.el.setAttribute('transform', `translate(${f.targetX}, ${f.targetY})`);
          f.el.setAttribute('opacity', '1');
        }, i * 80);
      });
    }, 300);

    // Phase 2: Return to center
    setTimeout(() => {
      fileEls.forEach((f, i) => {
        setTimeout(() => {
          f.el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          f.el.setAttribute('transform', `translate(${f.originX}, ${f.originY})`);
          f.el.setAttribute('opacity', '0');
        }, i * 60);
      });
    }, fileEls.length * 80 + 2500);

    // Restart loop
    setTimeout(runDocLoop, fileEls.length * 80 + 2500 + fileEls.length * 60 + 1500);
  }

  runDocLoop();
}

/* --- Client Reporting: Node tree consolidation --- */
function animateNodeTree() {
  const container = document.getElementById('client-report-anim');
  if (!container) return;
  const svg = container.querySelector('.solution-svg');
  const linesGroup = svg.querySelector('.tree-lines');
  const topGroup = svg.querySelector('.tree-top-nodes');
  const midGroup = svg.querySelector('.tree-mid-nodes');
  const ns = 'http://www.w3.org/2000/svg';

  // 7 top data source nodes
  const topNodes = [
    { x: 30, y: 25 }, { x: 70, y: 20 }, { x: 110, y: 28 },
    { x: 150, y: 18 }, { x: 190, y: 25 }, { x: 230, y: 22 }, { x: 270, y: 28 }
  ];
  // 3 middle merge nodes
  const midNodes = [
    { x: 80, y: 85 }, { x: 150, y: 80 }, { x: 220, y: 85 }
  ];
  // Client node at bottom
  const clientPos = { x: 150, y: 150 };

  // Labels for top nodes
  const labels = ['CRM', 'Email', 'Slack', 'API', 'Data', 'KPIs', 'Logs'];

  // Create top nodes
  topNodes.forEach((n, i) => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', 'var(--light-grey)');
    circle.setAttribute('stroke', 'var(--border-grey)');
    circle.setAttribute('stroke-width', '1');
    circle.setAttribute('opacity', '0');
    circle.classList.add('tree-top-node');
    topGroup.appendChild(circle);

    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y + 3);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '6');
    text.setAttribute('fill', 'var(--text-secondary)');
    text.setAttribute('font-weight', '500');
    text.setAttribute('opacity', '0');
    text.textContent = labels[i];
    text.classList.add('tree-top-node');
    topGroup.appendChild(text);
  });

  // Create mid nodes
  midNodes.forEach(n => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', '8');
    circle.setAttribute('fill', 'var(--cherry-red)');
    circle.setAttribute('opacity', '0');
    circle.classList.add('tree-mid-node');
    midGroup.appendChild(circle);
  });

  const topEls = topGroup.querySelectorAll('.tree-top-node');
  const midEls = midGroup.querySelectorAll('.tree-mid-node');

  // Map: which top nodes connect to which mid nodes
  const topToMid = [
    [0, 1, 2],  // mid[0] receives from top[0], top[1], top[2]
    [2, 3, 4],  // mid[1] receives from top[2], top[3], top[4]
    [4, 5, 6]   // mid[2] receives from top[4], top[5], top[6]
  ];

  function drawAnimatedLine(x1, y1, x2, y2, delay, color) {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x1);
    line.setAttribute('y2', y1);
    line.setAttribute('stroke', color || 'var(--border-grey)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('opacity', '0.4');
    linesGroup.appendChild(line);

    setTimeout(() => {
      let progress = 0;
      const anim = setInterval(() => {
        progress += 0.06;
        if (progress >= 1) { progress = 1; clearInterval(anim); }
        line.setAttribute('x2', x1 + (x2 - x1) * progress);
        line.setAttribute('y2', y1 + (y2 - y1) * progress);
      }, 16);
    }, delay);
  }

  function runTreeLoop() {
    linesGroup.innerHTML = '';
    topEls.forEach(n => n.setAttribute('opacity', '0'));
    midEls.forEach(n => n.setAttribute('opacity', '0'));

    // Phase 1: Show top nodes
    topNodes.forEach((n, i) => {
      setTimeout(() => {
        topEls[i * 2].setAttribute('opacity', '1');
        topEls[i * 2 + 1].setAttribute('opacity', '1');
      }, i * 150);
    });

    // Phase 2: Draw lines from top to mid, show mid nodes
    const phase2Start = topNodes.length * 150 + 300;
    topToMid.forEach((sources, midIdx) => {
      sources.forEach((topIdx, si) => {
        const delay = phase2Start + midIdx * 400 + si * 100;
        drawAnimatedLine(
          topNodes[topIdx].x, topNodes[topIdx].y + 10,
          midNodes[midIdx].x, midNodes[midIdx].y - 8,
          delay, 'var(--border-grey)'
        );
      });
      setTimeout(() => {
        midEls[midIdx].setAttribute('opacity', '0.2');
        setTimeout(() => midEls[midIdx].setAttribute('opacity', '1'), 100);
      }, phase2Start + midIdx * 400 + 300);
    });

    // Phase 3: Draw lines from mid to client
    const phase3Start = phase2Start + topToMid.length * 400 + 500;
    midNodes.forEach((n, i) => {
      drawAnimatedLine(
        n.x, n.y + 8,
        clientPos.x, clientPos.y - 14,
        phase3Start + i * 200, 'var(--cherry-red)'
      );
    });

    // Restart
    setTimeout(runTreeLoop, phase3Start + midNodes.length * 200 + 3000);
  }

  runTreeLoop();
}
