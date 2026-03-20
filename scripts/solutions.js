/* ============================================
   SOLUTION DETAIL PAGES — Interactive Demos
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Detect which solution page we're on
  const page = document.body.dataset.solution;
  if (!page) return;

  switch(page) {
    case 'voice-agent': initVoiceDemo(); break;
    case 'meeting-assistant': initMeetingDemo(); break;
    case 'knowledge-base': initKBDemo(); break;
    case 'lead-generation': initLeadGenDemo(); break;
    case 'recruitment': initRecruitmentDemo(); break;
    case 'data-operator': initDataOperatorDemo(); break;
    case 'document-processing': initDocProcessingDemo(); break;
    case 'client-reporting': initClientReportingDemo(); break;
  }
});

/* --- Voice Agent Demo --- */
function initVoiceDemo() {
  const btn = document.getElementById('voiceCallBtn');
  const display = document.getElementById('voiceWaveDisplay');
  const status = document.getElementById('voiceStatus');
  const transcript = document.getElementById('voiceTranscript');
  if (!btn || !display) return;

  let isActive = false;
  const transcriptLines = [
    '<strong>AI Agent:</strong> Good morning! This is Manager OS calling on behalf of Jason Williams. How are you today?',
    '<strong>Client:</strong> Hi, yes I\'m good thanks. What can I help with?',
    '<strong>AI Agent:</strong> Jason wanted to follow up on the proposal sent last Thursday. Have you had a chance to review it?',
    '<strong>Client:</strong> Yes, we\'ve reviewed it internally. We have a few questions about the implementation timeline.',
    '<strong>AI Agent:</strong> Of course. I\'ll schedule a follow-up call between you and Jason to discuss the timeline in detail. Would Thursday at 2pm work?',
  ];

  btn.addEventListener('click', function() {
    if (!isActive) {
      isActive = true;
      btn.classList.add('active');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> End Call';
      display.classList.add('active');
      status.textContent = 'Call in progress...';
      status.classList.add('active');

      // Show transcript lines one by one
      let lineIdx = 0;
      transcript.innerHTML = '';
      transcript.classList.add('visible');

      function showLine() {
        if (lineIdx >= transcriptLines.length || !isActive) return;
        const div = document.createElement('div');
        div.style.cssText = 'padding:0.4rem 0;border-bottom:1px solid var(--border-grey);font-size:0.85rem;line-height:1.6;';
        div.innerHTML = transcriptLines[lineIdx];
        transcript.appendChild(div);
        transcript.scrollTop = transcript.scrollHeight;
        lineIdx++;
        if (lineIdx < transcriptLines.length) {
          setTimeout(showLine, 2800);
        }
      }
      setTimeout(showLine, 1200);
    } else {
      isActive = false;
      btn.classList.remove('active');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> Start Call';
      display.classList.remove('active');
      status.textContent = 'Call ended • Transcript saved';
      status.classList.remove('active');
    }
  });
}

/* --- Meeting Assistant Demo --- */
function initMeetingDemo() {
  const panel = document.getElementById('meetingTranscript');
  const actionsPanel = document.getElementById('meetingActions');
  if (!panel) return;

  const lines = [
    { speaker: 'Jason', text: 'Let\'s kick off. Sarah, can you update us on the Q2 deliverables?' },
    { speaker: 'Sarah', text: 'Sure. We\'ve completed the API integration and the dashboard is 80% done.' },
    { speaker: 'Jason', text: 'Great. What\'s left on the dashboard?' },
    { speaker: 'Sarah', text: 'Just the reporting module and final QA. Should be done by Friday.' },
    { speaker: 'Jason', text: 'Perfect. Tom, how\'s the client onboarding going?' },
    { speaker: 'Tom', text: 'Two new clients onboarded this week. One more scheduled for Thursday.' },
    { speaker: 'Jason', text: 'Excellent. Let\'s make sure we send the welcome packs before Thursday.' },
    { speaker: 'Sarah', text: 'I\'ll handle that. Also, we need to book the Q3 planning session.' },
  ];

  const actions = [
    'Complete reporting module by Friday',
    'Send welcome packs before Thursday',
    'Book Q3 planning session',
    'Schedule follow-up with new clients',
  ];

  let lineIdx = 0;
  let actionIdx = 0;

  function showNextLine() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    const div = document.createElement('div');
    div.className = 'transcript-line';
    div.innerHTML = '<span class="speaker">' + line.speaker + ':</span> ' + line.text;
    panel.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
    panel.scrollTop = panel.scrollHeight;

    // Show action items at certain points
    if (lineIdx === 3 || lineIdx === 5 || lineIdx === 6 || lineIdx === 7) {
      setTimeout(() => showNextAction(), 800);
    }

    lineIdx++;
    if (lineIdx < lines.length) {
      setTimeout(showNextLine, 2500);
    } else {
      // Check off items after all lines shown
      setTimeout(checkOffActions, 2000);
    }
  }

  function showNextAction() {
    if (actionIdx >= actions.length) return;
    const items = actionsPanel.querySelectorAll('.action-item');
    if (items[actionIdx]) {
      items[actionIdx].classList.add('visible');
    }
    actionIdx++;
  }

  function checkOffActions() {
    const items = actionsPanel.querySelectorAll('.action-item');
    let i = 0;
    function checkNext() {
      if (i >= items.length) {
        // Restart after a delay
        setTimeout(resetDemo, 3000);
        return;
      }
      items[i].classList.add('checked');
      const check = items[i].querySelector('.action-check');
      if (check) check.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
      i++;
      setTimeout(checkNext, 600);
    }
    checkNext();
  }

  function resetDemo() {
    panel.innerHTML = '<h4>📝 Live Transcript</h4>';
    const items = actionsPanel.querySelectorAll('.action-item');
    items.forEach(item => {
      item.classList.remove('visible', 'checked');
      const check = item.querySelector('.action-check');
      if (check) check.innerHTML = '';
    });
    lineIdx = 0;
    actionIdx = 0;
    setTimeout(showNextLine, 1000);
  }

  setTimeout(showNextLine, 1500);
}

/* --- Knowledge Base Demo --- */

// ⚡ SET YOUR CLOUDFLARE WORKER URL HERE AFTER DEPLOYMENT
// Leave as empty string to use mock/demo mode
const KB_API_URL = 'https://manageros-kb-proxy-worker.jason-williams140100.workers.dev';

function initKBDemo() {
  const input = document.getElementById('kbInput');
  const btn = document.getElementById('kbSearchBtn');
  const response = document.getElementById('kbResponse');
  const responseBody = document.getElementById('kbResponseBody');
  if (!input || !btn || !response) return;

  // Fallback mock answers (used when API is not configured)
  const mockAnswers = {
    default: {
      text: 'Based on your company documentation, the standard onboarding process takes 5-7 business days. This includes account setup (Day 1), system configuration (Days 2-3), team training (Days 4-5), and go-live support (Days 6-7). The process can be expedited to 3 days for urgent deployments with an additional setup fee.',
      sources: ['onboarding-guide.pdf', 'sla-terms.docx', 'training-manual.pdf']
    },
    leave: {
      text: 'According to the company handbook (Section 4.2), all full-time employees are entitled to 25 days of annual leave plus bank holidays. Leave requests must be submitted at least 2 weeks in advance through the HR portal. Carry-over of up to 5 days is permitted into the following year.',
      sources: ['employee-handbook.pdf', 'hr-policy-2024.pdf']
    },
    refund: {
      text: 'The refund policy states that customers are eligible for a full refund within 30 days of purchase. After 30 days, a prorated refund may be issued at the discretion of the account manager. All refund requests should be submitted through the support portal with the original order number.',
      sources: ['refund-policy.pdf', 'customer-terms.docx', 'support-procedures.pdf']
    }
  };

  let isLoading = false;

  async function search() {
    const query = input.value.trim();
    if (!query || isLoading) return;

    // Show loading state
    isLoading = true;
    btn.disabled = true;
    btn.textContent = 'Thinking...';
    responseBody.textContent = '';
    response.classList.add('visible');

    const sourcesDiv = response.querySelector('.kb-sources');
    if (sourcesDiv) sourcesDiv.innerHTML = '';

    // Add loading animation
    responseBody.innerHTML = '<span class="kb-loading-dots"><span>●</span><span>●</span><span>●</span></span>';

    // Try real API first, fall back to mock
    if (KB_API_URL) {
      try {
        const res = await fetch(KB_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: query, demo: 'knowledge-base' })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'API request failed');
        }

        const data = await res.json();
        responseBody.textContent = '';
        typewriterEffect(responseBody, data.answer, () => {
          if (sourcesDiv) {
            sourcesDiv.innerHTML = '<span class="kb-source-tag">✦ Powered by AI</span>';
          }
        });
      } catch (err) {
        console.warn('KB API error, falling back to mock:', err.message);
        responseBody.textContent = '';
        useMockAnswer(query, responseBody, sourcesDiv);
      }
    } else {
      // No API configured — use mock
      responseBody.textContent = '';
      useMockAnswer(query, responseBody, sourcesDiv);
    }

    // Reset button
    isLoading = false;
    btn.disabled = false;
    btn.textContent = 'Ask AI';
  }

  function useMockAnswer(query, bodyEl, sourcesEl) {
    const q = query.toLowerCase();
    let answer = mockAnswers.default;
    if (q.includes('leave') || q.includes('holiday') || q.includes('vacation')) answer = mockAnswers.leave;
    if (q.includes('refund') || q.includes('return') || q.includes('money back')) answer = mockAnswers.refund;

    typewriterEffect(bodyEl, answer.text, () => {
      if (sourcesEl) {
        sourcesEl.innerHTML = answer.sources.map(s => '<span class="kb-source-tag">📄 ' + s + '</span>').join('');
      }
    });
  }

  function typewriterEffect(el, text, onComplete) {
    let charIdx = 0;
    function typeChar() {
      if (charIdx >= text.length) {
        if (onComplete) onComplete();
        return;
      }
      el.textContent += text[charIdx];
      charIdx++;
      setTimeout(typeChar, 12);
    }
    typeChar();
  }

  btn.addEventListener('click', search);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') search();
  });
}

/* --- Lead Generation Demo --- */
function initLeadGenDemo() {
  const svg = document.getElementById('leadGenSvg');
  if (!svg) return;

  const counters = document.querySelectorAll('.counter-value');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    animateCounter(el, 0, target, 2000);
  });

  // Animate funnel dots
  function createDot() {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const startX = 100 + Math.random() * 500;
    dot.setAttribute('cx', startX);
    dot.setAttribute('cy', '20');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#c2031f');
    dot.setAttribute('opacity', '0.5');
    svg.appendChild(dot);

    let y = 20;
    const targetX = 350;
    let x = startX;
    function fall() {
      y += 1.5;
      x += (targetX - x) * 0.02;
      dot.setAttribute('cy', y);
      dot.setAttribute('cx', x);
      if (y < 250) {
        requestAnimationFrame(fall);
      } else {
        dot.remove();
      }
    }
    requestAnimationFrame(fall);
  }

  setInterval(createDot, 600);
}

/* --- Recruitment Demo --- */
function initRecruitmentDemo() {
  const cards = document.querySelectorAll('.pipeline-card');
  if (!cards.length) return;

  let current = 0;
  function moveNext() {
    if (current >= cards.length) {
      // Reset
      cards.forEach(card => {
        card.classList.remove('stage-screen', 'stage-offer', 'stage-hired');
        card.classList.add('stage-applied');
      });
      current = 0;
      setTimeout(moveNext, 2000);
      return;
    }
    const card = cards[current];
    if (card.classList.contains('stage-applied')) {
      card.classList.remove('stage-applied');
      card.classList.add('stage-screen');
    } else if (card.classList.contains('stage-screen')) {
      card.classList.remove('stage-screen');
      card.classList.add('stage-offer');
    } else if (card.classList.contains('stage-offer')) {
      card.classList.remove('stage-offer');
      card.classList.add('stage-hired');
    }
    current++;
    setTimeout(moveNext, 1200);
  }
  setTimeout(moveNext, 1500);
}

/* --- Data Operator Demo --- */
function initDataOperatorDemo() {
  const rawPanel = document.getElementById('dataRaw');
  const cleanPanel = document.getElementById('dataClean');
  if (!rawPanel || !cleanPanel) return;

  // Animate rows appearing
  const rows = cleanPanel.querySelectorAll('tr');
  rows.forEach((row, i) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(20px)';
    row.style.transition = 'all 0.5s ease';
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
    }, 800 + i * 400);
  });

  // Animate counters
  const counters = document.querySelectorAll('.counter-value');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    animateCounter(el, 0, target, 2000);
  });
}

/* --- Document Processing Demo --- */
function initDocProcessingDemo() {
  const highlights = document.querySelectorAll('.doc-highlight');
  const extracts = document.querySelectorAll('.extract-item');
  
  let hIdx = 0;
  function highlightNext() {
    if (hIdx >= highlights.length) {
      setTimeout(() => {
        highlights.forEach(h => h.classList.remove('active'));
        extracts.forEach(e => e.classList.remove('visible'));
        hIdx = 0;
        setTimeout(highlightNext, 1500);
      }, 3000);
      return;
    }
    highlights[hIdx].classList.add('active');
    if (extracts[hIdx]) {
      setTimeout(() => extracts[hIdx].classList.add('visible'), 500);
    }
    hIdx++;
    setTimeout(highlightNext, 1600);
  }
  setTimeout(highlightNext, 1000);
}

/* --- Client Reporting Demo --- */
function initClientReportingDemo() {
  const bars = document.querySelectorAll('.report-bar');
  bars.forEach((bar, i) => {
    const height = bar.dataset.height || '60%';
    bar.style.height = '0';
    bar.style.transition = 'height 0.8s ease';
    setTimeout(() => {
      bar.style.height = height;
    }, 500 + i * 200);
  });

  const counters = document.querySelectorAll('.counter-value');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    animateCounter(el, 0, target, 2000);
  });
}

/* --- Utility: Counter Animation --- */
function animateCounter(el, start, end, duration) {
  const startTime = performance.now();
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
