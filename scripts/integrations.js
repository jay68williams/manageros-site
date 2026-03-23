/**
 * Manager OS — Integrations Page
 * Renders, filters, and searches integration cards with reliable brand-colour icons.
 */
(function () {
  'use strict';

  /* ─── Integration Data ─────────────────────────────────────────
     Each entry has a brand colour and a Lucide icon name so we
     never rely on external CDN logos that frequently 404.           */
  const integrations = [
    // Communication
    { name: 'Slack',            category: 'Communication',       color: '#4A154B', icon: 'hash' },
    { name: 'Microsoft Teams',  category: 'Communication',       color: '#6264A7', icon: 'users' },
    { name: 'Gmail',            category: 'Communication',       color: '#EA4335', icon: 'mail' },
    { name: 'Outlook',          category: 'Communication',       color: '#0078D4', icon: 'mail' },
    { name: 'WhatsApp',         category: 'Communication',       color: '#25D366', icon: 'message-circle' },
    { name: 'Twilio',           category: 'Communication',       color: '#F22F46', icon: 'phone' },
    { name: 'Discord',          category: 'Communication',       color: '#5865F2', icon: 'message-square' },
    { name: 'Telegram',         category: 'Communication',       color: '#0088CC', icon: 'send' },
    { name: 'Zoom',             category: 'Communication',       color: '#2D8CFF', icon: 'video' },
    { name: 'Google Meet',      category: 'Communication',       color: '#00897B', icon: 'video' },

    // CRM & Sales
    { name: 'Salesforce',       category: 'CRM & Sales',         color: '#00A1E0', icon: 'cloud' },
    { name: 'HubSpot',          category: 'CRM & Sales',         color: '#FF7A59', icon: 'target' },
    { name: 'Pipedrive',        category: 'CRM & Sales',         color: '#1B1B1B', icon: 'git-branch' },
    { name: 'Zoho CRM',        category: 'CRM & Sales',         color: '#D4382C', icon: 'briefcase' },
    { name: 'Close',            category: 'CRM & Sales',         color: '#2A2A2A', icon: 'phone-call' },
    { name: 'Monday Sales',    category: 'CRM & Sales',         color: '#FF3D57', icon: 'layout-grid' },
    { name: 'Freshsales',      category: 'CRM & Sales',         color: '#2C5CC5', icon: 'user-check' },
    { name: 'Copper',           category: 'CRM & Sales',         color: '#F8873A', icon: 'link' },

    // Marketing
    { name: 'Mailchimp',        category: 'Marketing',           color: '#FFE01B', icon: 'send' },
    { name: 'ActiveCampaign',   category: 'Marketing',           color: '#356AE6', icon: 'zap' },
    { name: 'Constant Contact', category: 'Marketing',           color: '#0076BE', icon: 'at-sign' },
    { name: 'Brevo',            category: 'Marketing',           color: '#0B996E', icon: 'mail-check' },
    { name: 'ConvertKit',       category: 'Marketing',           color: '#FB6970', icon: 'pen-tool' },
    { name: 'Klaviyo',          category: 'Marketing',           color: '#2A2A2A', icon: 'line-chart' },

    // Project Management
    { name: 'Asana',            category: 'Project Management',  color: '#F06A6A', icon: 'list-checks' },
    { name: 'Trello',           category: 'Project Management',  color: '#0079BF', icon: 'layout-grid' },
    { name: 'Monday.com',       category: 'Project Management',  color: '#FF3D57', icon: 'columns' },
    { name: 'Jira',             category: 'Project Management',  color: '#0052CC', icon: 'ticket' },
    { name: 'ClickUp',          category: 'Project Management',  color: '#7B68EE', icon: 'check-circle' },
    { name: 'Notion',           category: 'Project Management',  color: '#2A2A2A', icon: 'book-open' },
    { name: 'Linear',           category: 'Project Management',  color: '#5E6AD2', icon: 'arrow-up-right' },

    // Calendar
    { name: 'Google Calendar',  category: 'Calendar',            color: '#4285F4', icon: 'calendar' },
    { name: 'Outlook Calendar', category: 'Calendar',            color: '#0078D4', icon: 'calendar-days' },
    { name: 'Calendly',         category: 'Calendar',            color: '#006BFF', icon: 'clock' },
    { name: 'Cal.com',          category: 'Calendar',            color: '#292929', icon: 'calendar-check' },

    // Documents
    { name: 'Google Drive',     category: 'Documents',           color: '#4285F4', icon: 'hard-drive' },
    { name: 'OneDrive',         category: 'Documents',           color: '#0078D4', icon: 'cloud' },
    { name: 'Dropbox',          category: 'Documents',           color: '#0061FF', icon: 'box' },
    { name: 'SharePoint',       category: 'Documents',           color: '#0078D4', icon: 'share-2' },
    { name: 'Box',              category: 'Documents',           color: '#0061D5', icon: 'package' },
    { name: 'Google Docs',      category: 'Documents',           color: '#4285F4', icon: 'file-text' },

    // Finance
    { name: 'Xero',             category: 'Finance',             color: '#13B5EA', icon: 'receipt' },
    { name: 'QuickBooks',       category: 'Finance',             color: '#2CA01C', icon: 'calculator' },
    { name: 'Stripe',           category: 'Finance',             color: '#635BFF', icon: 'credit-card' },
    { name: 'PayPal',           category: 'Finance',             color: '#003087', icon: 'wallet' },
    { name: 'FreshBooks',       category: 'Finance',             color: '#0075DD', icon: 'file-spreadsheet' },
    { name: 'Sage',             category: 'Finance',             color: '#00D632', icon: 'bar-chart' },

    // Analytics
    { name: 'Google Analytics', category: 'Analytics',           color: '#E37400', icon: 'bar-chart-3' },
    { name: 'Mixpanel',         category: 'Analytics',           color: '#7856FF', icon: 'pie-chart' },
    { name: 'Amplitude',        category: 'Analytics',           color: '#1A237E', icon: 'trending-up' },
    { name: 'Looker',           category: 'Analytics',           color: '#4285F4', icon: 'eye' },
    { name: 'Power BI',         category: 'Analytics',           color: '#F2C811', icon: 'bar-chart-2' },

    // Support
    { name: 'Zendesk',          category: 'Support',             color: '#03363D', icon: 'headphones' },
    { name: 'Intercom',         category: 'Support',             color: '#286EFA', icon: 'message-circle' },
    { name: 'Freshdesk',        category: 'Support',             color: '#2C5CC5', icon: 'life-buoy' },
    { name: 'HelpScout',        category: 'Support',             color: '#1292EE', icon: 'help-circle' },

    // AI & Automation
    { name: 'Zapier',           category: 'AI & Automation',     color: '#FF4A00', icon: 'zap' },
    { name: 'Make',             category: 'AI & Automation',     color: '#6D00CC', icon: 'workflow' },
    { name: 'n8n',              category: 'AI & Automation',     color: '#EA4B71', icon: 'git-merge' },
    { name: 'OpenAI',           category: 'AI & Automation',     color: '#10A37F', icon: 'brain' },
  ];

  const categories = [
    'All',
    'Communication',
    'CRM & Sales',
    'Marketing',
    'Project Management',
    'Calendar',
    'Documents',
    'Finance',
    'Analytics',
    'Support',
    'AI & Automation',
  ];

  /* ─── State ─────────────────────────────────────────────────── */
  let activeCategory = 'All';
  let searchQuery = '';

  /* ─── DOM refs ──────────────────────────────────────────────── */
  const filtersEl = document.getElementById('integrationFilters');
  const gridEl    = document.getElementById('integrationsGrid');
  const countEl   = document.getElementById('integrationCount');
  const searchEl  = document.getElementById('integrationSearch');
  const emptyEl   = document.getElementById('integrationsEmpty');

  /* ─── Render filter pills ───────────────────────────────────── */
  function renderFilters() {
    filtersEl.innerHTML = '';
    categories.forEach(function (cat) {
      var count = cat === 'All'
        ? integrations.length
        : integrations.filter(function (i) { return i.category === cat; }).length;
      var btn = document.createElement('button');
      btn.className = 'int-filter-pill' + (cat === activeCategory ? ' active' : '');
      btn.setAttribute('data-category', cat);
      btn.innerHTML = cat + ' <span class="int-filter-count">(' + count + ')</span>';
      btn.addEventListener('click', function () {
        activeCategory = cat;
        renderFilters();
        renderGrid();
      });
      filtersEl.appendChild(btn);
    });
  }

  /* ─── Render integration cards ──────────────────────────────── */
  function renderGrid() {
    var filtered = integrations.filter(function (item) {
      var matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      var matchesSearch = !searchQuery || item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
      return matchesCategory && matchesSearch;
    });

    // Update count
    countEl.textContent = filtered.length + ' integration' + (filtered.length !== 1 ? 's' : '');

    // Show/hide empty state
    if (filtered.length === 0) {
      gridEl.style.display = 'none';
      emptyEl.style.display = 'flex';
    } else {
      gridEl.style.display = '';
      emptyEl.style.display = 'none';
    }

    // Render cards with data-lucide attributes, then let Lucide replace them
    gridEl.innerHTML = '';
    filtered.forEach(function (item, index) {
      var card = document.createElement('div');
      card.className = 'int-card';
      card.style.animationDelay = (index * 0.025) + 's';

      card.innerHTML =
        '<div class="int-card-logo" style="background:' + item.color + '">' +
          '<i data-lucide="' + item.icon + '" style="width:20px;height:20px;color:#fff"></i>' +
        '</div>' +
        '<h4 class="int-card-name">' + item.name + '</h4>' +
        '<div class="int-card-tag">' + item.category + '</div>';

      gridEl.appendChild(card);
    });

    // Tell Lucide to convert all data-lucide attributes to SVGs
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  /* ─── Search handler ────────────────────────────────────────── */
  var searchTimer;
  searchEl.addEventListener('input', function (e) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      searchQuery = e.target.value.trim();
      renderGrid();
    }, 150);
  });

  /* ─── FAQ accordion ─────────────────────────────────────────── */
  document.querySelectorAll('.int-faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.int-faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      document.querySelectorAll('.int-faq-question').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });

      // Toggle
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── Init ──────────────────────────────────────────────────── */
  renderFilters();
  renderGrid();

})();
