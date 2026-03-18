# Station Command — Component Library
## Complete UI Component Specifications

---

## Colour System

### Backgrounds
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| bg-page | #020617 | slate-950 | Page background |
| bg-card | #0f172a | slate-900 | Cards, panels |
| bg-elevated | #1e293b | slate-800 | Modals, menus |
| bg-input | #0f172a | slate-900 | Form fields |
| bg-hover | #334155 | slate-700 | Hover states |

### Text
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| text-primary | #f8fafc | slate-50 | Headings, primary |
| text-secondary | #94a3b8 | slate-400 | Body text |
| text-muted | #64748b | slate-500 | Meta, timestamps |
| text-disabled | #475569 | slate-600 | Disabled |

### Status Colours
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| status-success | #10b981 | emerald-500 | Healthy, success |
| status-warning | #f59e0b | amber-500 | Warning |
| status-error | #f43f5e | rose-500 | Critical, error |
| status-info | #3b82f6 | blue-500 | Info, primary |
| status-offline | #64748b | slate-500 | Offline |

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
| Level | Size | Weight | Line | Usage |
|-------|------|--------|------|-------|
| Display | 40px | 700 | 1.1 | Hero |
| H1 | 32px | 600 | 1.2 | Page titles |
| H2 | 24px | 600 | 1.3 | Sections |
| H3 | 18px | 600 | 1.4 | Card titles |
| H4 | 16px | 600 | 1.5 | Subsections |
| Body | 14px | 400 | 1.6 | Paragraphs |
| Small | 13px | 400 | 1.5 | Secondary |
| Caption | 12px | 500 | 1.4 | Labels, uppercase |
| Mono | 13px | 500 | 1.4 | Code, metrics |

---

## Component Library

### Button

**Primary**
```
Background: #3b82f6 (blue-500)
Hover: #2563eb (blue-600)
Text: white
Padding: 10px 16px
Radius: 6px
Font: 14px, weight 500
Shadow: none

States:
- Hover: darken 10%
- Active: translateY(1px)
- Disabled: bg-slate-700, text-slate-500
- Focus: ring-2 ring-blue-500/40
```

**Secondary**
```
Background: transparent
Border: 1px solid #334155 (slate-700)
Text: #e2e8f0 (slate-200)
Hover: bg-slate-800, border-slate-600
```

**Danger**
```
Background: #dc2626 (rose-600)
Hover: #b91c1c (rose-700)
```

**Ghost**
```
Background: transparent
Text: #94a3b8 (slate-400)
Hover: bg-white/5, text-white
```

---

### Input

**Text Field**
```
Background: #0f172a (slate-900)
Border: 1px solid #334155 (slate-700)
Radius: 6px
Padding: 10px 12px
Font: 14px
Color: #f8fafc

Placeholder: #64748b (slate-500)
Focus: border-blue-500, ring-2 ring-blue-500/20
Error: border-rose-500
Disabled: bg-slate-800, color-slate-500
```

**Label**
```
Font: 13px, weight 500
Color: #94a3b8 (slate-400)
Margin-bottom: 6px
```

---

### Card

**Standard Card**
```
Background: #0f172a (slate-900)
Border: 1px solid #1e293b (slate-800)
Radius: 12px
Padding: 20px
Shadow: none

Hover: border-slate-700, shadow-sm
```

**Card Header**
```
Title: 16px, weight 600, color-slate-50
Subtitle: 13px, color-slate-400
Padding-bottom: 16px
Border-bottom: 1px solid slate-800 (optional)
```

---

### Status Badge

```
Padding: 4px 10px
Radius: 9999px (pill)
Font: 12px, weight 500

Healthy:
  Background: emerald-500/10
  Border: 1px solid emerald-500/20
  Color: #10b981

Warning:
  Background: amber-500/10
  Border: amber-500/20
  Color: #f59e0b

Critical:
  Background: rose-500/10
  Border: rose-500/20
  Color: #f43f5e

Offline:
  Background: slate-500/10
  Border: slate-500/20
  Color: #64748b
```

---

### Progress Bar

```
Height: 8px
Background: #1e293b (slate-800)
Radius: 4px

Fill:
  Height: 100%
  Radius: 4px
  Transition: width 300ms ease

Colors:
  - Low: #10b981 emerald-500
  - Medium: #f59e0b amber-500
  - High: #f43f5e rose-500
  - Neutral: #3b82f6 blue-500
```

---

### Table

```
Width: 100%
Border-collapse: separate
Border-spacing: 0

Header (th):
  Padding: 12px 16px
  Font: 12px, weight 500, uppercase
  Letter-spacing: 0.05em
  Color: #94a3b8 (slate-400)
  Border-bottom: 1px solid #1e293b

Cell (td):
  Padding: 14px 16px
  Font: 14px
  Border-bottom: 1px solid #1e293b

Row hover (td):
  Background: #1e293b/50
```

---

### Modal

```
Background: #0f172a (slate-900)
Border: 1px solid #334155 (slate-700)
Radius: 12px
Shadow: 0 25px 50px rgba(0,0,0,0.5)
Max-width: 480px
Padding: 24px

Overlay:
  Background: rgba(2,6,23,0.8)
  Backdrop-filter: blur(4px)
```

---

### Dropdown/Select

```
Trigger:
  Background: slate-900
  Border: 1px solid slate-700
  Radius: 6px
  Padding: 10px 12px

Menu:
  Background: slate-800
  Border: 1px solid slate-700
  Radius: 8px
  Shadow: shadow-lg
  Padding: 4px

Item:
  Padding: 8px 12px
  Radius: 4px
  Hover: bg-slate-700

Active item:
  Background: blue-500/20
  Color: blue-400
```

---

### Tabs

```
Container:
  Border-bottom: 1px solid slate-800

Tab:
  Padding: 12px 16px
  Font: 14px, weight 500
  Color: slate-400
  Border-bottom: 2px solid transparent

Active:
  Color: slate-50
  Border-bottom: 2px solid blue-500

Hover (inactive):
  Color: slate-200
```

---

### Avatar

```
Circle:
  Size: 40px
  Radius: 50%
  Background: slate-800

Initials:
  Font: 14px, weight 600
  Color: white

Status indicator (small dot):
  Size: 10px
  Position: bottom-right
  Border: 2px solid slate-900
```

---

### Tooltip

```
Background: slate-800
Color: slate-200
Padding: 6px 10px
Radius: 6px
Font: 12px
Shadow: shadow-md

Arrow:
  Border: 1px solid slate-700
```

---

### Toast/Notification

```
Background: slate-800
Border: 1px solid slate-700
Radius: 8px
Padding: 14px 16px
Shadow: shadow-lg

Position: top-right
Gap between: 8px

Success accent:
  Border-left: 3px solid emerald-500

Error accent:
  Border-left: 3px solid rose-500
```

---

### Navigation Sidebar

```
Width: 280px (expanded)
Width: 64px (collapsed)
Background: slate-900
Border-right: 1px solid slate-800

Item:
  Padding: 12px 16px
  Radius: 6px
  Color: slate-400

Item hover:
  Background: slate-800
  Color: slate-200

Item active:
  Background: blue-500/10
  Color: blue-400

Icon:
  Size: 20px
  Margin-right: 12px
```

---

### Stats Card (Small)

```
Background: slate-900
Border: 1px solid slate-800
Radius: 10
Padding: 16

Icon:
  Size: 24
  Color: based on status

Value:
  Font: 24px, weight 600
  Color: slate-50
  Margin-top: 8

Label:
  Font: 13px
  Color: slate-400
  Margin-top: 4
```

---

## Animation Guidelines

### Durations
- Fast (hover): 150ms
- Standard: 200ms
- Slow (page transitions): 300ms

### Easing
- Standard: cubic-bezier(0.4, 0, 0.2, 1)
- Ease-out: cubic-bezier(0, 0, 0.2, 1)
- Ease-in: cubic-bezier(0.4, 0, 1, 1)
- Spring: cubic-bezier(0.34, 1.56, 0.64, 1)

### Common Transitions

**Fade in**
```css
opacity: 0 → 1
duration: 200ms
```

**Slide up**
```css
transform: translateY(8px) → translateY(0)
opacity: 0 → 1
duration: 200ms
```

**Scale**
```css
transform: scale(0.95) → scale(1)
duration: 150ms
```

---

## Spacing Reference

```
4px  - xs (tight gaps)
8px  - sm (icon gaps)
12px - md (button padding)
16px - lg (card padding)
24px - xl (page padding)
32px - 2xl (section gaps)
48px - 3xl (major sections)
```

---

## Shadow Reference

```
shadow-sm: 0 1px 2px rgba(0,0,0,0.3)
shadow-md: 0 4px 6px rgba(0,0,0,0.4)
shadow-lg: 0 10px 15px rgba(0,0,0,0.5)
shadow-xl: 0 20px 25px rgba(0,0,0,0.5)
shadow-focus: 0 0 0 3px rgba(59,130,246,0.15)
```

---

END OF COMPONENT LIBRARY
