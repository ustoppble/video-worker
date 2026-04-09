# Video Worker — UI Design Spec

## Visão

Dashboard cyberpunk/neon para o Video Worker — máquina que transforma lives YouTube em Shorts automaticamente. O usuário cola o link do canal UMA vez, aperta play, e o sistema faz tudo: transcreve, analisa, corta, renderiza e publica.

## Usuários

- **Admin** (Laschuk) — uso principal, monitoramento do pipeline
- **Gestores** (usuários EmailHacker) — futuro, mesma interface

## Stack

- **Frontend:** Next.js (mesma stack do EmailHacker, SSR leve)
- **Backend:** Node.js 22 + BullMQ + Redis (já existe)
- **Deploy:** VPS 76.13.227.187, PM2 porta 3200, auto-deploy via GitHub webhook
- **Repo:** ustoppble/video-worker (projeto separado)

## Design System

Referência: `design-system/video-worker/MASTER.md`

| Token | Valor |
|-------|-------|
| Background | `#0F0F23` |
| Surface | `#1A1A3E` |
| Primary (neon roxo) | `#7C3AED` |
| Secondary | `#A78BFA` |
| CTA (rosa) | `#F43F5E` |
| Cyan (status) | `#06B6D4` |
| Text | `#E2E8F0` |
| Headings | Orbitron |
| Body | Exo 2 |
| Mono | Fira Code |
| Efeitos | Neon glow, scanlines, glitch hover, pulse status |

## Estrutura de Funil (copy + persuasão)

A landing page segue o modelo Schwartz (Problem-Aware → Solution-Aware):

1. **Headline (dor):** "Suas lives morrem em 24h. Os melhores 47 segundos nunca são vistos."
2. **Pipeline visual (mecanismo):** 8 agentes IA como circuito neon — cada um especialista
3. **Resultado (prova):** 3 clips de exemplo com Virality Score
4. **Números:** 1 live = 8 clips · ~4 min por clip · R$0,11 por clip
5. **CTA:** "Cole o link. Aperte ATIVAR. Vá dormir."

**Copy proibida:** Nada genérico ("solução inovadora", "potencialize", "ferramenta inteligente"). Só dados concretos.

## UX Detalhado por Página

Ver **`docs/specs/2026-04-08-ux-pages-detail.md`** — spec completa com:
- 4 páginas (Landing, Pipeline, Clips, Settings)
- Todos os componentes com classes Tailwind exatas
- Estados de cada elemento (idle, loading, success, error)
- Animações com duração e easing
- Data flow (quais endpoints cada página consome)
- Responsividade por breakpoint

## Arquitetura da UI (resumo)

### 4 páginas (não mais "página única")

```
┌─────────────────────────────────────────────────┐
│  HEADER — logo + status do worker               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ZONA 1 — SETUP                                 │
│  ┌─────────────────────────────┐  ┌──────────┐  │
│  │  Cole a URL do canal YouTube │  │ INICIAR  │  │
│  └─────────────────────────────┘  └──────────┘  │
│                                                 │
│  Canal: @emailhackerai · 47 vídeos · Último: 2h│
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ZONA 2 — PIPELINE (aparece após INICIAR)       │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ TRANSCREVER│  │ ANALISAR │  │ CORTAR   │      │
│  │  ████░░░  │  │  pendente│  │ pendente │      │
│  │  3/47     │  │          │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ RENDERIZAR│  │ LEGENDAR │  │ PUBLICAR │      │
│  │  pendente │  │  pendente│  │ pendente │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                 │
│  Log em tempo real (Fira Code, estilo terminal): │
│  [21:30:01] Transcrevendo "Dia 10 | Vibe..."   │
│  [21:30:45] 12.847 palavras extraídas           │
│  [21:31:02] Analisando com Haiku...             │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ZONA 3 — OUTPUT (aparece quando clips prontos) │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ thumb   │  │ thumb   │  │ thumb   │         │
│  │         │  │         │  │         │         │
│  │ Clip #1 │  │ Clip #2 │  │ Clip #3 │         │
│  │ 0:47    │  │ 1:02    │  │ 0:38    │         │
│  │ ★ 87/100│  │ ★ 74/100│  │ ★ 91/100│         │
│  │ ✓ YT ✓IG│  │ ⏳ YT   │  │ — — —   │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Fluxo do Usuário

### Estado 1: Setup (primeira visita)
1. Usuário vê campo de URL com placeholder "youtube.com/@canal"
2. Cola a URL do canal
3. Worker scrapa via lógica portada do yt-transcriber (emailhacker-ai/worker/src/youtube.js → adaptar pra video-worker). Sem OAuth, sem API key Google.
4. Exibe: nome do canal, total de vídeos, último upload
5. Botão "INICIAR" com glow neon rosa

### Estado 2: Pipeline (processando)
1. Após clicar INICIAR, a Zona 2 aparece com 6 etapas do pipeline
2. Cada etapa é um card com status: `pendente` | `processando` | `concluído` | `erro`
3. Cards processando têm borda neon cyan pulsando
4. Cards concluídos ficam com borda verde
5. Log em tempo real no estilo terminal (scroll automático, Fira Code)
6. Pipeline roda via BullMQ — frontend faz polling a cada 2s ou SSE

### Estado 3: Output (clips prontos)
1. Grid de cards 9:16 (vertical, formato Shorts)
2. Cada card mostra: thumbnail, título, duração, Virality Score (0-100)
3. Status de distribuição por plataforma (YT Shorts, IG Reels, TikTok)
4. Virality Score com cor: verde (>80), amarelo (50-80), vermelho (<50)
5. Click no card abre preview do vídeo

## Componentes

### Header
- Logo "VIDEO WORKER" em Orbitron com glow roxo
- Badge de status: "ONLINE" (cyan pulse) ou "OFFLINE" (vermelho)
- Uptime e jobs processados hoje

### ChannelInput
- Input com ícone YouTube (vermelho)
- Validação: aceita youtube.com/@handle, youtube.com/channel/ID, youtube.com/c/nome
- Estado de loading enquanto scrapa
- Após validar: mostra card com info do canal

### PipelineCard
- 6 cards representando as etapas: TRANSCREVER, ANALISAR, CORTAR, RENDERIZAR, LEGENDAR, PUBLICAR
- Cada um com: ícone Lucide, nome da etapa, progress bar, contagem (ex: 3/8)
- Animação de transição entre estados

### ClipCard
- Thumbnail 9:16 com overlay de duração
- Título truncado (max 2 linhas)
- Virality Score como badge com cor
- Ícones de plataforma com status (check, loading, dash)
- Hover: borda neon, preview play

### LogTerminal
- Fundo `#0A0A1A` com fonte Fira Code 13px
- Timestamps em cyan, mensagens em branco, erros em rosa
- Auto-scroll com botão "pausar" no canto
- Max 200 linhas visíveis

## Dados / API

### Endpoints necessários (adicionar ao server existente)

```
GET  /api/channel?url=...        → scrapa info do canal
GET  /api/channel/:id/videos     → lista vídeos do canal
POST /api/pipeline/start         → inicia pipeline pra um canal
GET  /api/pipeline/status        → status atual do pipeline
GET  /api/clips                  → lista clips gerados
GET  /api/clips/:id/preview      → preview do clip
SSE  /api/pipeline/events        → stream de eventos em tempo real
```

### Persistência
- Canal configurado salvo em Redis (key: `channel:config`)
- Jobs no BullMQ (já existe)
- Clips metadata em SQLite local (leve, sem Supabase)
- Arquivos de vídeo em disco local → cleanup após upload pro R2

## Fora de escopo (v1)

- Login/autenticação (acesso direto, protegido por IP/firewall na VPS)
- Multi-canal (um canal por vez)
- Edição manual dos clips
- Agendamento de publicação
- Analytics de performance dos Shorts

## Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Landing + Setup | Funil: dor → mecanismo → prova → CTA (campo URL + ATIVAR) |
| `/pipeline` | Pipeline | 8 etapas em tempo real + log terminal + vídeo atual |
| `/clips` | Gallery | Grid de clips com Virality Score, filtros, preview modal |
| `/settings` | Config | Canal, clips/live, plataformas, estilo legendas |

## Referências de Design

- **Opus Clip** — Virality Score gamificado (0-100 por clip)
- **Gling** — Waveform com trechos cortados em vermelho
- **Runway ML** — Dark mode sofisticado, interface modular tipo cockpit
- **Munch** — Dashboard escuro + justificativa de POR QUE cada clip foi selecionado
