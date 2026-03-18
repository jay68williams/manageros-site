# Station Command — Responsive Design Rules
## Mobile, Tablet, Desktop Specifications

---

## Breakpoints

| Name | Min Width | Max Width | Target Device |
|------|-----------|-----------|---------------|
| Mobile | 0px | 639px | Phones |
| Tablet | 640px | 1023px | Tablets, small laptops |
| Desktop | 1024px | 1439px | Laptops, monitors |
| Wide | 1440px | — | Large monitors |

---

## Layout Behaviour

### Global Layout Changes

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Sidebar | Hidden (drawer) | Collapsed (64px icons) | Expanded (280px) |
| Header | Single row, mobile menu | Single row | Full nav |
| Main padding | 16px | 20px | 24px |
| Content max-width | 100% | 100% | Full width |

### Station Cards Grid

| Breakpoint | Columns | Card size |
|------------|---------|-----------|
| Mobile | 1 | Full width |
| Tablet | 2 | 50% - gap |
| Desktop | 3 | 33% - gap |
| Wide | 3-4 | 33% or 25% - gap |

### Station Detail Page

| Breakpoint | Layout |
|------------|--------|
| Mobile | Single column, stacked |
| Tablet | 2 columns for some sections |
| Desktop | Multi-column grid |

---

## Component Responsive Rules

### Sidebar

**Mobile (hidden by default):**
```
┌─────────────────────────────────┐
│ ≡  [Menu button]    + Deploy    │
├─────────────────────────────────┤
│                                 │
│ ← Drawer slides in from left    │
│                                 │
│ ◉ Station 1                     │
│ ○ Station 2                     │
│ [+ Add]                         │
│                                 │
└─────────────────────────────────┘
```
- Full-screen overlay (280px)
- Backdrop: rgba(0,0,0,0.5)
- Swipe gesture to close
- [X] close button top-right

**Tablet (collapsed):**
```
┌──┐
│◉│  ← Icons only
│○│
│+│
└──┘
64px wide
```
- Hover/click to expand
- Show full card on expand
- Collapse on click outside

**Desktop (expanded):**
```
┌─────────────────────┐
│ ◉ Station Name      │
│   client.co.uk      │
│   🟢 Healthy        │
│   4 agents          │
├─────────────────────┤
│ ○ Other Station     │
└─────────────────────┘
280px wide
```

---

### Header

**Mobile:**
```
┌─────────────────────────────┐
│ ≡  Manager OS      [+] [👤] │
└─────────────────────────────┘
```
- Hidden hamburger menu
- Deploy button always visible
- Avatar only (no name)

**Tablet:**
```
┌─────────────────────────────────────┐
│ Manager OS   Stations About     [+] │
└─────────────────────────────────────┘
```
- Logo + 2-3 nav items
- Deploy button
- Avatar

**Desktop:**
```
┌─────────────────────────────────────────────────────────┐
│ Manager OS   Stations Blueprints Analytics Settings  [+]│
└─────────────────────────────────────────────────────────┘
```
- Full navigation
- All items visible
- Deploy button prominent

---

### Station Cards

**Mobile:**
```
┌──────────────────────────────┐
│ ◉ Kingsbrook M&A       [⋯] │
├──────────────────────────────┤
│ 🟢 Healthy                   │
│ Uptime: 99.9%               │
├──────────────────────────────┤
│ 🤖 4   │ 📧 1.2k            │
│ Agents │ Emails              │
│                        [→]   │
└──────────────────────────────┘
Metrics: 2 per row
Actions: View only (others hidden)
```

**Tablet:**
```
┌──────────────────────────────┐
│ ◉ Kingsbrook M&A       [⋯] │
├──────────────────────────────┤
│ 🟢 Healthy   Uptime: 99.9%   │
│                              │
│ 🤖 4 │ 📧 1.2k │ ✓ 89% │ ⚡12│
│                              │
│ [View] [Restart] [SSH]       │
└──────────────────────────────┘
Metrics: 4 in a row
Actions: All visible
```

**Desktop:** Same as tablet, slightly larger text

---

### Tables

**Mobile:**
```
┌──────────────────────────┐
│ ◉ Jane Smith      87 ⭐  │
│ ABC Corp • 2 min ago     │
│ [✓] [✗]                 │
├──────────────────────────┤
│ ◉ John Doe         64    │
│ XYZ Ltd • 5 min ago      │
│ [✓] [✗]                 │
└──────────────────────────┘
Card-based list, not table
Swipe to reveal actions
```

**Tablet+:**
```
┌────────┬────────┬──────┬───────┐
│ Name   │ Company│ Score│ Status│
├────────┼────────┼──────┼───────┤
│ J. Smth│ ABC    │ 87 ⭐│ ✓     │
│ J. Doe │ XYZ    │ 64   │ ⏳    │
└────────┴────────┴──────┴───────┘
Full table with horizontal scroll
```

---

### Modal

**Mobile:**
- Full screen (no border radius on sides)
- Max-width: 100%
- Padding: 20px
- Bottom sheet style (slide up from bottom)

**Tablet+:**
- Centered
- Max-width: 480px
- Border-radius: 12px
- Padding: 24px

---

### Forms

**Mobile:**
- Single column, full width
- Labels above inputs
- Larger touch targets (min 44px height)
- Keyboard pushes view up
- Submit button fixed at bottom

**Tablet+:**
- Can use 2-column layout
- Labels inline or above
- Standard 40px height inputs

---

## Touch Targets

| Element | Mobile | Desktop |
|---------|--------|---------|
| Button | 44px min | 36px min |
| Card click | 72px min | 64px |
| Sidebar item | 48px row height | 72px |
| Checkbox/radio | 24px | 16px |
| Link | 44px tall hit area | Text height |

---

## Responsive Typography

| Level | Mobile | Desktop |
|-------|--------|---------|
| H1 | 28px | 32px |
| H2 | 22px | 24px |
| H3 | 18px | 18px |
| Body | 15px | 14px |
| Small | 14px | 13px |
| Caption | 13px | 12px |

(Mobile slightly larger for readability on small screens)

---

## Responsive Animations

**Mobile:**
- Reduce motion: Use fade instead of slide
- Faster transitions: 150ms
- No hover effects (touch only)

**Desktop:**
- Full animations
- Hover effects on cards
- Smooth 200ms transitions

---

## Specific Rules

### Always Visible (Mobile)
These elements never hide:
- [+ Deploy Station] button (icon only on mobile)
- Current station name
- Health status indicator
- Logout/profile access

### Hidden on Mobile
These collapse or move:
- Sidebar nav (moves to drawer)
- Secondary actions in tables (swipe to reveal)
- Some metrics (show only critical)
- Footer links (move to menu)

### Touch-Specific
- Swipe to dismiss cards/modals
- Pull to refresh on lists
- Swipe left on table rows for actions
- Tap and hold for context menus

---

## Testing Checklist

| Scenario | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| Stations grid readable | ☑ | ☑ | ☑ |
| Can access all stations | ☑ | ☑ | ☑ |
| Sidebar accessible | ☑ | ☑ | ☑ |
| Deploy flow complete | ☑ | ☑ | ☑ |
| Station detail readable | ☑ | ☑ | ☑ |
| Logs scrollable | ☑ | ☑ | ☑ |
| Modals usable | ☑ | ☑ | ☑ |
| Forms completeable | ☑ | ☑ | ☑ |

---

## CSS Framework Hints

**Tailwind classes for responsive:**
```html
<!-- Sidebar -->
<div class="hidden md:flex md:w-16 lg:w-72">

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

<!-- Typography -->
<h1 class="text-2xl md:text-3xl">

<!-- Table -->
<div class="hidden md:block"> <!-- Desktop table -->
<div class="md:hidden"> <!-- Mobile card list -->

<!-- Modal -->
<div class="fixed inset-0 md:inset-auto md:relative
            md:max-w-lg md:rounded-xl">
```

---

END OF RESPONSIVE RULES