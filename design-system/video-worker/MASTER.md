# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Video Worker
**Generated:** 2026-04-08 21:30:46
**Category:** Video Automation — Cyberpunk/Neon

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| Background | `#0F0F23` | `--color-background` | Fundo principal |
| Surface | `#1A1A3E` | `--color-surface` | Cards, panels |
| Primary | `#7C3AED` | `--color-primary` | Neon roxo — borders, highlights |
| Secondary | `#A78BFA` | `--color-secondary` | Roxo claro — texto secundário, hover |
| CTA/Accent | `#F43F5E` | `--color-cta` | Rosa/vermelho — botões, alertas |
| Neon Cyan | `#06B6D4` | `--color-cyan` | Status, progresso, sucesso |
| Text | `#E2E8F0` | `--color-text` | Texto principal |
| Muted | `#64748B` | `--color-muted` | Texto secundário, labels |

**Color Notes:** Cyberpunk neon — roxo dominante, rosa CTA, cyan status. Glow effects em borders e texto.

### Typography

- **Heading Font:** Orbitron (futurista, geométrica)
- **Body Font:** Exo 2 (legível, sci-fi)
- **Mono Font:** Fira Code (código, logs, status)
- **Mood:** cyberpunk, futurista, tech noir, automação
- **Google Fonts:** [Orbitron + Exo 2 + Fira Code](https://fonts.google.com/share?selection.family=Orbitron:wght@400;500;600;700|Exo+2:wght@300;400;500;600;700|Fira+Code:wght@400;500;600)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button — CTA rosa neon com glow */
.btn-primary {
  background: #F43F5E;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 0 30px rgba(244, 63, 94, 0.5);
  transform: translateY(-1px);
}

/* Secondary Button — borda neon roxo */
.btn-secondary {
  background: transparent;
  color: #A78BFA;
  border: 1px solid #7C3AED;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(124, 58, 237, 0.1);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
}
```

### Cards

```css
.card {
  background: #1A1A3E;
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 24px;
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  border-color: rgba(124, 58, 237, 0.5);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.15);
}
```

### Inputs

```css
.input {
  background: rgba(15, 15, 35, 0.8);
  color: #E2E8F0;
  padding: 12px 16px;
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #7C3AED;
  outline: none;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.2);
}
```

### Neon Glow Effects

```css
/* Text glow — usar em títulos e labels importantes */
.neon-text {
  text-shadow: 0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3);
}

/* Border glow — usar em cards ativos/selecionados */
.neon-border {
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.3), inset 0 0 15px rgba(124, 58, 237, 0.05);
}

/* Scanline overlay — sutil, background-only */
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
}
```

---

## Style Guidelines

**Style:** Cyberpunk UI

**Keywords:** Neon, dark mode, terminal, HUD, sci-fi, glitch, dystopian, futuristic, matrix, tech noir

**Best For:** Video automation, dev tools, content pipelines, AI dashboards

**Key Effects:**
- Neon glow (text-shadow + box-shadow com roxo/rosa)
- Glitch animations sutis (skew/offset em hover)
- Scanlines overlay (::before, opacity baixa)
- Progress bars com gradient neon (roxo → cyan)
- Status indicators com pulse animation (cyan = ativo, rosa = erro)

### Page Pattern

**Pattern Name:** Pipeline Dashboard

- **Layout:** Single page, 3 zonas verticais (Setup → Pipeline → Output)
- **Setup:** Campo URL + botão "INICIAR" com glow
- **Pipeline:** Cards verticais com status real-time (transcrição → análise → corte → render → publicação)
- **Output:** Grid de clips prontos com thumbnail, virality score, status de distribuição

---

## Anti-Patterns (Do NOT Use)

- ❌ Slow updates
- ❌ No automation

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
