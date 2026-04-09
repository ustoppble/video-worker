# Video Worker — UX Detalhado por Página

> **Propósito:** Spec suficiente pra um agente de código implementar cada página sem perguntas.
> **Design System:** `design-system/video-worker/MASTER.md`
> **Stack:** Next.js 15 + Tailwind CSS v4 + Lucide React
> **Fonts:** Orbitron (headings), Exo 2 (body), Fira Code (mono/logs)

---

## Cores Tailwind (tailwind.config)

```ts
colors: {
  background: '#0F0F23',
  surface: '#1A1A3E',
  primary: '#7C3AED',    // neon roxo
  secondary: '#A78BFA',  // roxo claro
  cta: '#F43F5E',        // rosa/vermelho
  cyan: '#06B6D4',       // status/progresso
  text: '#E2E8F0',
  muted: '#64748B',
  success: '#10B981',
  error: '#EF4444',
}
```

---

## Página 1: Landing + Setup (`/`)

### Layout
- Single page scroll vertical
- `max-w-5xl mx-auto` centered
- Background `#0F0F23` com scanlines overlay sutil (opacity 0.03)
- Sem navbar — logo no topo inline

### Seção 1.1 — Header
```
Componente: <Header />
Arquivo: src/components/Header.tsx
```

| Elemento | Spec |
|----------|------|
| Logo | Texto "VIDEO WORKER" em Orbitron 700, 24px, `text-primary`, text-shadow neon roxo `0 0 10px rgba(124,58,237,0.5)` |
| Status badge | Pill `px-3 py-1 rounded-full text-xs font-mono`. Online = bg-cyan/10 text-cyan + pulse dot. Offline = bg-error/10 text-error |
| Layout | `flex justify-between items-center py-6` |

### Seção 1.2 — Hero (dor + promessa)
```
Componente: <HeroSection />
Arquivo: src/components/HeroSection.tsx
```

| Elemento | Spec |
|----------|------|
| Headline | `"Suas lives morrem em 24h."` — Orbitron 700, `text-4xl md:text-6xl`, `text-text`, `leading-tight` |
| Subheadline | `"Os melhores 47 segundos nunca são vistos."` — Exo 2 400, `text-xl md:text-2xl`, `text-secondary`, `mt-4` |
| Descrição | `"Cole o link do canal. 8 Shorts prontos. Sem editor. Sem timeline. Sem esforço."` — Exo 2 300, `text-lg`, `text-muted`, `mt-6 max-w-2xl` |
| Spacing | `pt-20 pb-16 text-center` |
| Animação | Headline aparece com fade-in + translateY(-10px), 600ms ease-out. Subheadline delay 200ms. Descrição delay 400ms. |

### Seção 1.3 — Pipeline Visual (mecanismo)
```
Componente: <PipelinePreview />
Arquivo: src/components/PipelinePreview.tsx
```

| Elemento | Spec |
|----------|------|
| Título seção | `"8 agentes IA. Cada um especialista."` — Orbitron 600, `text-2xl`, `text-text`, `text-center mb-12` |
| Cards | 8 cards em `grid grid-cols-4 md:grid-cols-8 gap-3` |
| Cada card | `bg-surface border border-primary/20 rounded-lg p-4 text-center` |
| Número | Orbitron 700, `text-2xl text-primary` (01, 02, ..., 08) |
| Nome | Exo 2 500, `text-xs text-muted mt-2 uppercase tracking-wider` |
| Ícone | Lucide 20px stroke-1.5 `text-secondary` acima do número |
| Conexão | Linha horizontal `border-t border-primary/30` entre cards (CSS pseudo-element) |
| Animação scroll | Cards se "acendem" em sequência ao entrar no viewport — border muda de `primary/20` pra `primary/60` + box-shadow neon, stagger 100ms entre cada |

**Os 8 agentes e ícones:**
1. SEGMENTER — `Scissors` (corta em blocos)
2. ANALYST — `Brain` (analisa potencial)
3. EDITOR — `Film` (corta silêncio)
4. DIRECTOR — `Clapperboard` (roteiro cenas)
5. RENDERER — `Sparkles` (motion design)
6. CAPTIONER — `Captions` (legendas)
7. SCOUT — `Hash` (copy + hashtags)
8. COMPOSER — `Layers` (composição final)

### Seção 1.4 — Resultado (prova)
```
Componente: <ResultPreview />
Arquivo: src/components/ResultPreview.tsx
```

| Elemento | Spec |
|----------|------|
| Título | `"De uma live de 2h47, esses foram os 3 melhores momentos."` — Orbitron 500, `text-xl text-text text-center mb-8` |
| Grid | `grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto` |
| Cada card | Aspecto 9:16 (`aspect-[9/16]`), `bg-surface rounded-xl overflow-hidden border border-primary/20` |
| Thumbnail | Placeholder gradient `from-primary/20 to-cyan/10` com ícone Play center |
| Badge duração | `absolute bottom-3 right-3 bg-black/70 text-text text-xs font-mono px-2 py-1 rounded` |
| Virality Score | `absolute top-3 left-3` — pill com estrela. Score > 80 = `bg-success/20 text-success`. 50-80 = `bg-yellow-500/20 text-yellow-400`. < 50 = `bg-error/20 text-error` |
| Título clip | Abaixo do thumb, Exo 2 500 `text-sm text-text mt-3 line-clamp-2` |
| Status plataformas | Ícones YT/IG/TT inline, 16px, `text-success` (publicado) ou `text-muted` (pendente) |

### Seção 1.5 — Números
```
Componente: <StatsSection />
Arquivo: src/components/StatsSection.tsx
```

| Elemento | Spec |
|----------|------|
| Layout | `grid grid-cols-3 gap-8 max-w-3xl mx-auto py-16` |
| Cada stat | `text-center` |
| Número | Orbitron 700, `text-4xl text-cyan` — counter animation ao entrar no viewport |
| Label | Exo 2 400, `text-sm text-muted mt-2 uppercase tracking-wider` |
| Stats | `1 live = 8 clips` / `~4 min por clip` / `R$0,11 por clip` |

### Seção 1.6 — CTA (campo URL + botão ATIVAR)
```
Componente: <ActivateSection />
Arquivo: src/components/ActivateSection.tsx
```

| Elemento | Spec |
|----------|------|
| Container | `max-w-2xl mx-auto text-center py-20` |
| Título | `"Cole o link. Aperte ATIVAR. Vá dormir."` — Orbitron 600, `text-2xl text-text mb-8` |
| Input URL | `w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-4 text-text font-mono text-lg placeholder:text-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200` |
| Placeholder | `"youtube.com/@seucanal"` |
| Validação | Client-side: regex `youtube\.com\/(@[\w-]+|channel\/UC[\w-]+|c\/[\w-]+)`. Borda fica `border-error` se inválido, `border-success` se válido |
| Botão ATIVAR | `mt-6 w-full md:w-auto px-12 py-4 bg-cta text-white font-heading font-bold text-lg uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-200` |
| Botão hover | `hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:-translate-y-0.5` |
| Botão disabled | `opacity-50 cursor-not-allowed` (quando URL vazia ou inválida) |
| Botão loading | Texto muda pra "CONECTANDO..." + `animate-pulse`, ícone `Loader2` com `animate-spin` à esquerda |
| Ícone botão | `Zap` Lucide 20px à esquerda do texto |

**Estados do botão ATIVAR:**

| Estado | Visual | Ação |
|--------|--------|------|
| Desabilitado | Opaco, sem glow | URL vazia/inválida |
| Pronto | Glow rosa sutil `shadow-[0_0_20px_rgba(244,63,94,0.3)]` | URL válida |
| Hover | Glow intenso + lift | — |
| Loading | Pulse + spinner + "CONECTANDO..." | POST /api/channel |
| Erro | Shake animation + mensagem abaixo em `text-error` | Retry |
| Sucesso | Redirect pra `/pipeline` | — |

---

## Página 2: Pipeline (`/pipeline`)

### Layout
- Full page, sem scroll (ou scroll mínimo)
- `min-h-screen bg-background`
- Header fixo com info do canal + botão voltar

### Seção 2.1 — Header Pipeline
```
Componente: <PipelineHeader />
Arquivo: src/components/pipeline/PipelineHeader.tsx
```

| Elemento | Spec |
|----------|------|
| Layout | `fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-sm border-b border-primary/10 px-6 py-4` |
| Logo | "VIDEO WORKER" — Orbitron 600 `text-sm text-primary` link pra `/` |
| Canal | Avatar placeholder (circle `bg-primary/20` com ícone `Youtube`) + nome do canal em Exo 2 500 `text-text` |
| Stats inline | `text-xs font-mono text-muted` — "47 vídeos · Processando 3/47 · Tempo: 12:34" |
| Botão parar | `text-xs text-error/70 hover:text-error border border-error/20 hover:border-error/50 rounded px-3 py-1` com ícone `Square` (stop) |

### Seção 2.2 — Pipeline Grid
```
Componente: <PipelineGrid />
Arquivo: src/components/pipeline/PipelineGrid.tsx
```

| Elemento | Spec |
|----------|------|
| Layout | `pt-20 px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto` |
| Cada card etapa | `bg-surface rounded-xl p-6 border transition-all duration-300` |

**Estados de cada PipelineStageCard:**

| Estado | Border | Ícone | Progress | Animação |
|--------|--------|-------|----------|----------|
| `idle` | `border-primary/10` | `text-muted` | Nenhuma | — |
| `queued` | `border-primary/20` | `text-secondary` | "Na fila" text | Pulse sutil |
| `processing` | `border-cyan` | `text-cyan` | Progress bar animada (gradient primary→cyan) | Border glow cyan `shadow-[0_0_15px_rgba(6,182,212,0.3)]` |
| `completed` | `border-success/50` | `text-success` | "Concluído" + check | Flash verde 300ms depois estabiliza |
| `error` | `border-error` | `text-error` | Mensagem de erro | Shake 300ms |

**Conteúdo de cada card:**

| Linha | Spec |
|-------|------|
| Ícone | Lucide 24px no topo, stroke-1.5 |
| Nome etapa | Orbitron 600 `text-sm uppercase tracking-wider mt-3` |
| Contagem | Fira Code `text-xs text-muted mt-1` — ex: "5/8 clips" |
| Progress bar | `h-1 rounded-full bg-primary/10 mt-4` com `h-1 rounded-full bg-gradient-to-r from-primary to-cyan transition-all duration-500` dentro |
| Tempo | Fira Code `text-[10px] text-muted mt-2` — ex: "~2:15 restante" |

### Seção 2.3 — Log Terminal
```
Componente: <LogTerminal />
Arquivo: src/components/pipeline/LogTerminal.tsx
```

| Elemento | Spec |
|----------|------|
| Container | `mt-8 mx-6 bg-[#0A0A1A] rounded-xl border border-primary/10 overflow-hidden` |
| Header | `flex justify-between items-center px-4 py-2 border-b border-primary/10` |
| Título header | `"Terminal"` — Fira Code 500 `text-xs text-muted uppercase` |
| Botão pause | `text-xs text-muted hover:text-text` — ícone `Pause` / `Play` toggle |
| Botão expand | `text-xs text-muted hover:text-text` — ícone `Maximize2` / `Minimize2` |
| Área de log | `px-4 py-3 font-mono text-[13px] leading-relaxed overflow-y-auto` |
| Altura | Default: `max-h-48`. Expandido: `max-h-[60vh]` |
| Linha de log | Cada linha é um `<div>` |
| Timestamp | `text-cyan` — formato `[HH:MM:SS]` |
| Mensagem | `text-text` |
| Erro | `text-error` — linha inteira |
| Destaque | `text-primary` — dados importantes (contagens, nomes de arquivo) |
| Auto-scroll | Scroll pro final automaticamente. Para ao clicar "Pause" ou scroll manual pra cima |
| Max linhas | Manter últimas 500 linhas no DOM, descartar as mais antigas |

### Seção 2.4 — Video being processed (card contextual)
```
Componente: <CurrentVideoCard />
Arquivo: src/components/pipeline/CurrentVideoCard.tsx
```

| Elemento | Spec |
|----------|------|
| Posição | Entre o PipelineGrid e o LogTerminal |
| Layout | `mx-6 mt-6 bg-surface/50 rounded-xl border border-primary/10 p-4 flex items-center gap-4` |
| Thumbnail | 120x68px (16:9) `rounded-lg object-cover` do vídeo sendo processado |
| Título | Exo 2 500 `text-sm text-text line-clamp-1` |
| Duração | Fira Code `text-xs text-muted` |
| Data | Fira Code `text-xs text-muted` |
| Progress global | `text-xs text-cyan font-mono` — "Vídeo 3 de 47" |

---

## Página 3: Clips / Output (`/clips`)

### Layout
- Scroll vertical
- Header fixo (mesmo do Pipeline)
- Grid de clips

### Seção 3.1 — Header Clips
```
Componente: <ClipsHeader />
Arquivo: src/components/clips/ClipsHeader.tsx
```

| Elemento | Spec |
|----------|------|
| Layout | Mesmo `<PipelineHeader />` mas com stats diferentes |
| Stats | `"24 clips · 18 publicados · 6 em fila"` — Fira Code `text-xs text-muted` |
| Filtros | Pills inline: "Todos" / "Publicados" / "Pendentes" / "Erros" — `px-3 py-1 rounded-full text-xs cursor-pointer transition-colors`. Ativo: `bg-primary/20 text-primary`. Inativo: `text-muted hover:text-text` |
| Ordenação | Dropdown: "Virality Score" / "Mais recentes" / "Duração" — styled select `bg-surface border-primary/20` |

### Seção 3.2 — Clips Grid
```
Componente: <ClipsGrid />
Arquivo: src/components/clips/ClipsGrid.tsx
```

| Elemento | Spec |
|----------|------|
| Layout | `pt-20 px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pb-12` |

### Seção 3.3 — ClipCard (componente principal)
```
Componente: <ClipCard />
Arquivo: src/components/clips/ClipCard.tsx
Props: { clip: Clip }
```

| Elemento | Spec |
|----------|------|
| Container | `bg-surface rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all duration-200 cursor-pointer group` |
| Thumbnail | `aspect-[9/16] relative bg-background` |
| Thumb image | `object-cover w-full h-full` |
| Play overlay | `absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center` — ícone `Play` 48px `text-white opacity-0 group-hover:opacity-100` |
| Badge duração | `absolute bottom-2 right-2 bg-black/80 text-text text-[11px] font-mono px-1.5 py-0.5 rounded` |
| Virality Score | `absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold font-heading` |
| Score > 80 | `bg-success/20 text-success border border-success/30` |
| Score 50-80 | `bg-yellow-500/20 text-yellow-400 border border-yellow-500/30` |
| Score < 50 | `bg-error/20 text-error border border-error/30` |
| Conteúdo abaixo | `p-4` |
| Título | Exo 2 500 `text-sm text-text line-clamp-2 leading-snug` |
| Fonte (live) | Fira Code `text-[11px] text-muted mt-1 line-clamp-1` — nome da live de origem |
| Plataformas | `flex items-center gap-2 mt-3` |
| Ícone plataforma | 14px cada. Publicado = `text-success`. Pendente = `text-muted animate-pulse`. Erro = `text-error`. Não enviado = `text-muted/30` |
| Plataformas | YouTube (ícone `Youtube`), Instagram (ícone custom SVG), TikTok (ícone custom SVG) |

### Seção 3.4 — Clip Modal (preview)
```
Componente: <ClipModal />
Arquivo: src/components/clips/ClipModal.tsx
```

| Elemento | Spec |
|----------|------|
| Overlay | `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center` |
| Modal | `bg-surface rounded-2xl max-w-lg w-[90vw] overflow-hidden border border-primary/20` |
| Vídeo | `aspect-[9/16] max-h-[70vh] bg-black` — `<video>` nativo com controls |
| Info abaixo | `p-6` |
| Título | Orbitron 600 `text-lg text-text` |
| Score | Grande — Orbitron 700 `text-3xl` com cor dinâmica + label "Virality Score" em `text-muted text-xs` |
| Justificativa | `text-sm text-secondary mt-2 italic` — frase do ANALYST explicando POR QUE esse trecho foi selecionado |
| Status distribuição | Lista vertical de plataformas com status detalhado |
| Cada plataforma | Ícone + nome + status (`Publicado em 08/04 14:32` ou `Na fila` ou `Erro: quota exceeded`) |
| Botão fechar | `absolute top-4 right-4 text-muted hover:text-text` — ícone `X` 24px |
| Click overlay | Fecha o modal |
| ESC | Fecha o modal |

---

## Página 4: Configurações (`/settings`)

### Layout
- Página simples, formulário vertical
- `max-w-2xl mx-auto pt-20 px-6`

### Campos
```
Componente: <SettingsPage />
Arquivo: src/app/settings/page.tsx
```

| Campo | Tipo | Spec |
|-------|------|------|
| Canal YouTube | Input readonly com URL do canal + botão "Trocar" | `bg-background/50 border-primary/20` |
| Clips por live | Number input (1-20, default 8) | `w-20 text-center font-mono` |
| Publicar automaticamente | Toggle switch | Cyan quando ativo |
| Plataformas | Checkboxes: YT Shorts / IG Reels / TikTok | Cada um com toggle independente |
| Estilo legendas | Select: "TikTok" / "Karaoke" / "Sem legendas" | Styled select |
| Botão salvar | `bg-primary text-white` com glow roxo | Disabled se nada mudou |

---

## Componentes Compartilhados

### StatusDot
```tsx
// Estados: online | processing | error | offline
<span className={cn(
  "w-2 h-2 rounded-full inline-block",
  status === 'online' && "bg-cyan animate-pulse",
  status === 'processing' && "bg-primary animate-pulse",
  status === 'error' && "bg-error",
  status === 'offline' && "bg-muted",
)} />
```

### NeonBorder (wrapper)
```tsx
<div className="border border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-200">
  {children}
</div>
```

### ScanlineOverlay
```tsx
<div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
```

---

## Navegação

| Rota | Página | Quando visível |
|------|--------|---------------|
| `/` | Landing + Setup | Sempre (estado inicial) |
| `/pipeline` | Pipeline em tempo real | Após ATIVAR (redirect) |
| `/clips` | Gallery de clips | Quando existem clips (link no header) |
| `/settings` | Configurações | Link no header (ícone gear) |

**Nav no header (após setup):** Logo (link /) | Pipeline | Clips | Settings (gear icon)

---

## Data Flow (pra cada agente saber de onde vêm os dados)

```
Landing (/)
  └→ POST /api/channel?url=...     → valida + scrapa info do canal
  └→ POST /api/pipeline/start      → inicia BullMQ jobs
  └→ redirect /pipeline

Pipeline (/pipeline)
  └→ SSE /api/pipeline/events       → stream de eventos (etapa, progresso, logs)
  └→ GET /api/pipeline/status        → polling fallback (2s)

Clips (/clips)
  └→ GET /api/clips                  → lista com paginação
  └→ GET /api/clips/:id              → detalhe + justificativa
  └→ GET /api/clips/:id/video        → serve arquivo de vídeo

Settings (/settings)
  └→ GET /api/settings               → config atual
  └→ PUT /api/settings               → salvar
```

---

## Responsividade

| Breakpoint | Landing grid (pipeline preview) | Clips grid | Pipeline stages |
|------------|-------------------------------|------------|-----------------|
| < 640px (mobile) | 4 cols (2 rows) | 1 col | 2 cols (3 rows) |
| 640-768px | 4 cols (2 rows) | 2 cols | 3 cols (2 rows) |
| 768-1024px | 8 cols | 3 cols | 3 cols (2 rows) |
| > 1024px | 8 cols | 4 cols | 6 cols (1 row) |

---

## Animações (resumo)

| Animação | Onde | Spec |
|----------|------|------|
| Fade-in stagger | Hero headline/sub/desc | translateY(-10px)→0, opacity 0→1, 600ms, stagger 200ms |
| Pipeline light-up | Landing pipeline cards | border-color + box-shadow transition ao entrar viewport, stagger 100ms |
| Counter | Stats section | Número sobe de 0 ao valor final, 1500ms, ease-out |
| Progress bar | Pipeline stages | width transition 500ms ease |
| Glow pulse | Botão ATIVAR pronto | box-shadow oscila entre 0.3 e 0.5 opacity, 2s infinite |
| Terminal scroll | Log | smooth scroll-behavior, debounced |
| Card hover | Clips | border-color 200ms + play overlay opacity 200ms |
| Modal enter | Clip preview | overlay opacity 200ms + modal scale(0.95→1) + opacity 300ms |

Todas respeitam `prefers-reduced-motion: reduce` — desabilitar animações e usar transições instantâneas.
