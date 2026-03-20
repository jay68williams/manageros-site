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

/* --- Voice Agent Demo (Vapi.ai Integration) --- */

// ⚡ SET YOUR VAPI CREDENTIALS HERE
const VAPI_PUBLIC_KEY = '';   // Your Vapi Public Key
const VAPI_ASSISTANT_ID = ''; // Your Vapi Assistant ID
const VAPI_MAX_CALL_SECONDS = 180; // 3 minutes

function initVoiceDemo() {
  const gate = document.getElementById('voiceGate');
  const callActive = document.getElementById('voiceCallActive');
  const callEnded = document.getElementById('voiceCallEnded');
  const startBtn = document.getElementById('voiceStartBtn');
  const endBtn = document.getElementById('voiceEndBtn');
  const restartBtn = document.getElementById('voiceRestartBtn');
  const nameInput = document.getElementById('voiceGateName');
  const emailInput = document.getElementById('voiceGateEmail');
  const timerEl = document.getElementById('voiceCallTimer');
  const statusEl = document.getElementById('voiceStatus');
  const transcriptEl = document.getElementById('voiceTranscript');
  const transcriptFinalEl = document.getElementById('voiceTranscriptFinal');
  const waveDisplay = document.getElementById('voiceWaveDisplay');

  if (!gate || !startBtn) return;

  let vapiInstance = null;
  let callTimerInterval = null;
  let callSeconds = 0;
  let transcriptLines = [];

  // -- Validate email format --
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // -- Format seconds to M:SS --
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // -- Update timer display --
  function updateTimer() {
    callSeconds++;
    timerEl.textContent = formatTime(callSeconds) + ' / 3:00';

    // Auto-end at 3 minutes
    if (callSeconds >= VAPI_MAX_CALL_SECONDS) {
      endCall('Time limit reached');
    }
  }

  // -- Show a view (gate / active / ended) --
  function showView(view) {
    gate.style.display = view === 'gate' ? '' : 'none';
    callActive.style.display = view === 'active' ? '' : 'none';
    callEnded.style.display = view === 'ended' ? '' : 'none';
  }

  // -- Add transcript line --
  function addTranscriptLine(role, text) {
    const label = role === 'assistant' ? 'AI Agent' : 'You';
    const line = '<strong>' + label + ':</strong> ' + text;
    transcriptLines.push(line);

    const div = document.createElement('div');
    div.style.cssText = 'padding:0.4rem 0;border-bottom:1px solid var(--border-grey);font-size:0.85rem;line-height:1.6;';
    div.innerHTML = line;
    transcriptEl.appendChild(div);
    transcriptEl.classList.add('visible');
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
  }

  // -- Start the call --
  async function startCall() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name) { nameInput.focus(); nameInput.style.borderColor = 'var(--cherry-red)'; return; }
    if (!email || !isValidEmail(email)) { emailInput.focus(); emailInput.style.borderColor = 'var(--cherry-red)'; return; }

    // Reset styles
    nameInput.style.borderColor = '';
    emailInput.style.borderColor = '';

    // Switch to active view
    showView('active');
    callSeconds = 0;
    transcriptLines = [];
    transcriptEl.innerHTML = '';
    timerEl.textContent = '0:00 / 3:00';
    statusEl.textContent = 'Connecting...';

    // Start timer
    callTimerInterval = setInterval(updateTimer, 1000);

    // Use Vapi if configured, otherwise fall back to mock
    if (VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID && typeof Vapi !== 'undefined') {
      try {
        vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

        vapiInstance.on('call-start', () => {
          statusEl.textContent = 'Call in progress...';
          waveDisplay.classList.add('active');
        });

        vapiInstance.on('speech-start', () => {
          waveDisplay.classList.add('active');
        });

        vapiInstance.on('speech-end', () => {
          // Keep wave active during call
        });

        vapiInstance.on('message', (msg) => {
          if (msg.type === 'transcript' && msg.transcriptType === 'final') {
            addTranscriptLine(msg.role, msg.transcript);
          }
        });

        vapiInstance.on('call-end', () => {
          endCall('Call completed');
        });

        vapiInstance.on('error', (err) => {
          console.error('Vapi error:', err);
          statusEl.textContent = 'Connection error — please try again';
          setTimeout(() => endCall('Error'), 2000);
        });

        // Start the Vapi call
        await vapiInstance.start(VAPI_ASSISTANT_ID, {
          metadata: { userName: name, userEmail: email }
        });

      } catch (err) {
        console.error('Vapi start error:', err);
        statusEl.textContent = 'Could not start call — please try again';
        setTimeout(() => endCall('Error'), 2000);
      }
    } else {
      // -- Mock/demo mode (no Vapi credentials configured) --
      statusEl.textContent = 'Call in progress...';
      waveDisplay.classList.add('active');

      const mockLines = [
        { role: 'assistant', text: 'Good morning! This is the Manager OS AI assistant. I understand your name is ' + name + '. How can I help you today?' },
        { role: 'user', text: 'Hi, I\'d like to learn more about your voice agent solution.' },
        { role: 'assistant', text: 'Of course! Our voice agent handles calls 24/7 — qualifying leads, answering FAQs, and booking meetings. It sounds completely natural and integrates with your CRM.' },
        { role: 'user', text: 'That sounds great. How quickly can it be set up?' },
        { role: 'assistant', text: 'Typical setup is 2-4 weeks. We configure the agent\'s personality, connect your phone system, and train it on your specific business needs. Shall I book a call with Jason to discuss your requirements?' },
      ];

      let i = 0;
      function showMockLine() {
        if (i >= mockLines.length) return;
        addTranscriptLine(mockLines[i].role, mockLines[i].text);
        i++;
        if (i < mockLines.length) setTimeout(showMockLine, 3000);
        else setTimeout(() => endCall('Demo call completed'), 3000);
      }
      setTimeout(showMockLine, 1500);
    }
  }

  // -- End the call --
  function endCall(reason) {
    clearInterval(callTimerInterval);

    // Stop Vapi if running
    if (vapiInstance) {
      try { vapiInstance.stop(); } catch(e) {}
      vapiInstance = null;
    }

    waveDisplay.classList.remove('active');

    // Copy transcript to final view
    transcriptFinalEl.innerHTML = transcriptEl.innerHTML;
    if (!transcriptFinalEl.innerHTML) {
      transcriptFinalEl.innerHTML = '<div style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);">No transcript recorded.</div>';
    }

    showView('ended');
  }

  // -- Event listeners --
  startBtn.addEventListener('click', startCall);
  endBtn.addEventListener('click', () => endCall('Call ended by user'));
  restartBtn.addEventListener('click', () => showView('gate'));

  // Allow Enter key to submit
  emailInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') startCall(); });
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') emailInput.focus(); });
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
const KB_API_URL = 'https://manageros-kb-proxy-final.jason-williams140100.workers.dev';

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
