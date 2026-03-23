/**
 * Manager OS — Integrations Page
 * Renders, filters, and searches integration cards with inline SVG icons.
 * Zero CDN dependency — all icons are embedded SVG paths.
 */
(function () {
  'use strict';

  /* ─── Inline SVG icon paths (Lucide-based) ─────────────────────
     Each icon is an SVG path string at 24x24 viewBox.
     This eliminates the Lucide CDN race condition entirely.        */
  var icons = {
    hash:            '<path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18"/>',
    users:           '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    mail:            '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    phone:           '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'message-square':'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    send:            '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    video:           '<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>',
    cloud:           '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    target:          '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'git-branch':    '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    briefcase:       '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'phone-call':    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/>',
    'layout-grid':   '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'user-check':    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    link:            '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    zap:             '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'at-sign':       '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    'mail-check':    '<path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/>',
    'pen-tool':      '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
    'line-chart':    '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    'list-checks':   '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    columns:         '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/>',
    ticket:          '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
    'check-circle':  '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'book-open':     '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'arrow-up-right':'<line x1="7" x2="17" y1="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
    calendar:        '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    'calendar-days': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    clock:           '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'calendar-check':'<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>',
    'hard-drive':    '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
    box:             '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    'share-2':       '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    package:         '<line x1="16.5" x2="7.5" y1="9.4" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/>',
    'file-text':     '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
    receipt:         '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    calculator:      '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
    'credit-card':   '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    wallet:          '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
    'file-spreadsheet':'<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/>',
    'bar-chart':     '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
    'bar-chart-3':   '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    'pie-chart':     '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    'trending-up':   '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    eye:             '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    'bar-chart-2':   '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
    headphones:      '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    'life-buoy':     '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" x2="9.17" y1="4.93" y2="9.17"/><line x1="14.83" x2="19.07" y1="14.83" y2="19.07"/><line x1="14.83" x2="19.07" y1="9.17" y2="4.93"/><line x1="14.83" x2="9.17" y1="9.17" y2="4.93"/><line x1="4.93" x2="9.17" y1="19.07" y2="14.83"/>',
    'help-circle':   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    workflow:        '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
    'git-merge':     '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
    brain:           '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
    folder:          '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    plug:            '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/>',
    'refresh-cw':    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    database:        '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    search:          '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'search-x':      '<path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'chevron-down':  '<path d="m6 9 6 6 6-6"/>',
    code:            '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    webhook:         '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8H12"/>',
    'file-json':     '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/>',
    cpu:             '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
    'shield-check':  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    wrench:          '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    sun:             '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon:            '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    linkedin:        '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'
  };

  /** Build an inline SVG string */
  function svg(name, size) {
    var s = size || 20;
    var paths = icons[name] || '';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s +
           '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  /* ─── Integration Data ─────────────────────────────────────────
     Each entry has a brand colour and an icon key from the map above. */
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

  /* ─── Render integration cards with INLINE SVGs ─────────────── */
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

    // Render cards with inline SVGs — no Lucide dependency
    gridEl.innerHTML = '';
    filtered.forEach(function (item, index) {
      var card = document.createElement('div');
      card.className = 'int-card';
      card.style.animationDelay = (index * 0.025) + 's';

      card.innerHTML =
        '<div class="int-card-logo" style="background:' + item.color + '">' +
          svg(item.icon, 20) +
        '</div>' +
        '<h4 class="int-card-name">' + item.name + '</h4>' +
        '<div class="int-card-tag">' + item.category + '</div>';

      gridEl.appendChild(card);
    });
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

  /* ─── Replace ALL data-lucide icons on the page with inline SVGs ── */
  function replaceAllLucideIcons() {
    document.querySelectorAll('[data-lucide]').forEach(function (el) {
      var name = el.getAttribute('data-lucide');
      var w = parseInt(el.style.width) || 20;
      var svgStr = svg(name, w);
      var temp = document.createElement('span');
      temp.innerHTML = svgStr;
      var svgEl = temp.firstChild;
      // Copy classes
      el.classList.forEach(function(c) { svgEl.classList.add(c); });
      el.parentNode.replaceChild(svgEl, el);
    });
  }

  /* ─── Init ──────────────────────────────────────────────────── */
  replaceAllLucideIcons();
  renderFilters();
  renderGrid();

})();
