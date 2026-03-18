# Station Command — Dashboard UI Specification
## For Antigravity IDE

---

## Overview

**Product:** Station Command  
**Purpose:** Control tower for managing multiple AI client stations  
**Primary User:** Jay (agency owner) managing 10-30 client Mac Mini stations  
**Secondary User:** Individual station owners (limited view)

**Design Philosophy:**
- Dark mode professional (think Linear, Vercel, GitHub)
- Data density over whitespace (operators need info fast)
- Status at a glance (colour-coded health indicators)
- Actions one click away

---

## Layout Structure

### Global Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  LOGO    Stations  Blueprints  Analytics  Settings        [+ Deploy] │  ← Header (64px)
├────────┬────────────────────────────────────────────────────────────┤
│        │                                                            │
│   ◉    │                    MAIN CONTENT AREA                       │
│  ST-01 │                                                            │
│   ●    │         (changes based on route)                           │
│  ST-02 │                                                            │
│        │                                                            │
│  [+]   │                                                            │
│        │                                                            │
├────────┴────────────────────────────────────────────────────────────┤
│  Manager OS v1.0.0                              Connected ●         │  ← Footer (32px)
└─────────────────────────────────────────────────────────────────────┘
     ↑
  Sidebar (240px collapsed / 280px expanded)
```

### Header (64px height)

**Left Section:**
- Logo: "Manager OS" wordmark (text, no icon needed)
- Primary Nav: Stations | Blueprints | Analytics | Settings
- Text: 14px, font-weight 500, color slate-300
- Active state: color white, underline 2px blue-500

**Right Section:**
- [+ Deploy Station] button — primary CTA
- User avatar dropdown (Jay's profile)
- Notification bell with badge

### Sidebar (Station Navigator)

**Collapsed State (64px):**
- Station avatars only (coloured circles with initials)
- Hover expands to full
- Current station: ring-2 ring-blue-500

**Expanded State (280px):**
```
┌─────────────────────┐
│ ◉ Station Name      │ ← Station avatar + name
│   ● client.co.uk    │ ← Domain or IP
│   🟢 Healthy        │ ← Status pill
│   3 agents active   │ ← Agent count
├─────────────────────┤
│ ○ Another Station   │
│   ● other.co.uk     │
│   🟡 Warning        │
│   2 agents active   │
├─────────────────────┤
│ [+ Add Station]     │ ← Secondary button
└─────────────────────┘
```

**Station Card in Sidebar:**
- Height: 72px
- Padding: 12px 16px
- Avatar: 40px circle, coloured by status
- Status colours:
  - 🟢 Healthy: emerald-500
  - 🟡 Warning: amber-500
  - 🔴 Critical: rose-500
  - ⚪ Offline: slate-500

### Main Content Area

**Padding:** 24px (desktop) / 16px (mobile)  
**Max-width:** None (full width, data-heavy tool)  
**Background:** slate-950 (#020617)

---

## Page: Stations List (Dashboard Home)

### Page Header

```
┌─────────────────────────────────────────────────────────────────────┐
│ Stations                                        [+ Deploy Station]   │
│ 12 active stations across 8 clients                                  │
└─────────────────────────────────────────────────────────────────────┘
```

**Stats Bar (below header):**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   🟢 10     │ │   🟡 2      │ │   🔴 0      │ │   📊 247    │
│   Healthy   │ │   Warning   │ │   Critical  │ │   Agents    │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Station Grid

**Layout:** Responsive grid
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Station Card:**
```
┌──────────────────────────────────────────────────────────────┐
│ ◉ Kingsbrook M&A                                    [⋯] │  ← Menu
│    kingsbrook.manageros.uk                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🟢 Healthy                    Uptime: 99.9% (30 days)       │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  🤖 4    │ │  📧 1.2k │ │  ✓ 89%   │ │  ⚡ 12ms │        │
│  │  Agents  │ │  Emails  │ │  Qualify │ │  Latency │        │
│  │  active  │ │  sent    │ │  rate    │ │          │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  Last activity: 2 minutes ago                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ [View Dashboard]  [Restart]  [SSH]                          │
└──────────────────────────────────────────────────────────────┘
```

**Card Specifications:**
- Background: slate-900 (#0f172a)
- Border: 1px slate-800 (#1e293b)
- Border-radius: 12px
- Hover: border-slate-700, subtle shadow
- Height: auto (content-based)

**Card Menu (⋯):**
- View Dashboard
- Edit Configuration
- Restart Station
- View Logs
- Delete Station (with confirmation)

---

## Page: Single Station Detail

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to Stations    Kingsbrook M&A              [Actions ▼]      │
│                       kingsbrook.manageros.uk                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  HEALTH OVERVIEW (full width)                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐   │
│  │  AGENT STATUS            │  │  RECENT ACTIVITY             │   │
│  │  (left column)           │  │  (right column)              │   │
│  └──────────────────────────┘  └──────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  SYSTEM METRICS (full width)                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐   │
│  │  WORKFLOWS (n8n)         │  │  LOGS                        │   │
│  │  (left column)           │  │  (right column)              │   │
│  └──────────────────────────┘  └──────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Health Overview Section

```
┌─────────────────────────────────────────────────────────────────────┐
│  🟢 Healthy                    Uptime: 99.9%                       │
│                                                                           │
│  CPU: ████████████░░░░  78%    Memory: █████████░░░░░  62%         │
│  Disk: ██████░░░░░░░░░  34%    Network: ▓▓▓▓▓▓▓▓░░░░  45 Mbps     │
│                                                                           │
│  [View Real-time]  [Run Diagnostics]  [Reboot Station]             │
└─────────────────────────────────────────────────────────────────────┘
```

**Progress Bars:**
- Height: 8px
- Border-radius: 4px
- Background: slate-