# Video Worker UI — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a interface web cyberpunk/neon do Video Worker — landing page com funil + dashboard de pipeline + gallery de clips.

**Architecture:** Next.js 15 App Router rodando no mesmo server Node.js (porta 3200). Frontend consome API REST do backend existente. SSE pra eventos em tempo real do pipeline. SQLite pra metadata de clips.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Lucide React, Orbitron/Exo 2/Fira Code (Google Fonts)

**Design System:** `design-system/video-worker/MASTER.md`
**UX Spec:** `docs/specs/2026-04-08-ux-pages-detail.md`

**Repo:** ~/vibe-coding/video-worker (ustoppble/video-worker)

---

## Estrutura de Arquivos

```
video-worker/
├── src/                          # Backend existente (NÃO MEXER)
│   ├── index.ts                  # Server HTTP (health + webhook)
│   ├── config.ts                 # Configuração
│   ├── cli.ts                    # CLI manual
│   ├── types/job.ts              # Tipos (Segment, JobData, etc)
│   ├── processors/               # download, analyze, cut, compose
│   └── lib/ffmpeg.ts             # Wrapper ffmpeg
│
├── web/                          # NOVO — Frontend Next.js
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout (fonts, metadata, scanlines)
│   │   │   ├── page.tsx          # Landing + Setup (/)
│   │   │   ├── pipeline/
│   │   │   │   └── page.tsx      # Pipeline dashboard (/pipeline)
│   │   │   ├── clips/
│   │   │   │   └── page.tsx      # Gallery de clips (/clips)
│   │   │   └── settings/
│   │   │       └── page.tsx      # Configurações (/settings)
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PipelinePreview.tsx
│   │   │   ├── ResultPreview.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── ActivateSection.tsx
│   │   │   ├── ScanlineOverlay.tsx
│   │   │   ├── StatusDot.tsx
│   │   │   ├── NeonBorder.tsx
│   │   │   ├── pipeline/
│   │   │   │   ├── PipelineHeader.tsx
│   │   │   │   ├── PipelineGrid.tsx
│   │   │   │   ├── PipelineStageCard.tsx
│   │   │   │   ├── LogTerminal.tsx
│   │   │   │   └── CurrentVideoCard.tsx
│   │   │   └── clips/
│   │   │       ├── ClipsHeader.tsx
│   │   │       ├── ClipsGrid.tsx
│   │   │       ├── ClipCard.tsx
│   │   │       └── ClipModal.tsx
│   │   ├── lib/
│   │   │   ├── api.ts            # Fetch wrapper pro backend
│   │   │   └── types.ts          # Tipos compartilhados frontend
│   │   └── styles/
│   │       └── globals.css       # Tailwind + custom neon effects
│   └── public/
│       └── (vazio por enquanto)
│
├── src/api/                      # NOVO — Rotas API no backend
│   ├── channel.ts                # GET /api/channel?url=...
│   ├── pipeline.ts               # POST /api/pipeline/start + GET /api/pipeline/status
│   ├── pipeline-events.ts        # SSE /api/pipeline/events
│   ├── clips.ts                  # GET /api/clips + GET /api/clips/:id
│   └── settings.ts               # GET/PUT /api/settings
│
├── design-system/                # JÁ EXISTE
├── docs/specs/                   # JÁ EXISTE
└── package.json                  # Backend (JÁ EXISTE)
```

---

### Task 1: Scaffold Next.js no diretório `web/`

**Files:**
- Create: `web/package.json`
- Create: `web/next.config.ts`
- Create: `web/tsconfig.json`
- Create: `web/tailwind.config.ts`
- Create: `web/postcss.config.mjs`
- Create: `web/src/styles/globals.css`
- Create: `web/src/app/layout.tsx`
- Create: `web/src/app/page.tsx` (placeholder)

- [ ] **Step 1: Criar `web/package.json`**

```json
{
  "name": "video-worker-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3201",
    "build": "next build",
    "start": "next start --port 3201"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.487.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

- [ ] **Step 2: Criar `web/next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Proxy API calls pro backend na porta 3200
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3200/api/:path*',
      },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 3: Criar `web/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Criar `web/postcss.config.mjs`**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Step 5: Criar `web/tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F0F23',
        surface: '#1A1A3E',
        primary: '#7C3AED',
        secondary: '#A78BFA',
        cta: '#F43F5E',
        cyan: '#06B6D4',
        text: '#E2E8F0',
        muted: '#64748B',
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Criar `web/src/styles/globals.css`**

```css
@import 'tailwindcss';

@theme {
  --color-background: #0F0F23;
  --color-surface: #1A1A3E;
  --color-primary: #7C3AED;
  --color-secondary: #A78BFA;
  --color-cta: #F43F5E;
  --color-cyan: #06B6D4;
  --color-text: #E2E8F0;
  --color-muted: #64748B;
  --color-success: #10B981;
  --color-error: #EF4444;

  --font-heading: 'Orbitron', sans-serif;
  --font-body: 'Exo 2', sans-serif;
  --font-mono: 'Fira Code', monospace;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}

/* Neon text glow */
.neon-text {
  text-shadow: 0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.3);
}

/* Neon border glow */
.neon-border {
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.3), inset 0 0 15px rgba(124, 58, 237, 0.05);
}

/* CTA glow */
.cta-glow {
  box-shadow: 0 0 20px rgba(244, 63, 94, 0.3);
}

.cta-glow:hover {
  box-shadow: 0 0 30px rgba(244, 63, 94, 0.5);
}

/* Scanline overlay */
.scanlines {
  position: relative;
}

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
  z-index: 50;
}

/* Glow pulse animation pro botão ATIVAR */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(244, 63, 94, 0.3); }
  50% { box-shadow: 0 0 30px rgba(244, 63, 94, 0.5); }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-glow-pulse {
    animation: none;
  }
}
```

- [ ] **Step 7: Criar `web/src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Video Worker',
  description: 'Transforma lives YouTube em Shorts automaticamente',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-text font-body antialiased scanlines">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 8: Criar `web/src/app/page.tsx` (placeholder)**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-heading text-4xl text-primary neon-text">
        VIDEO WORKER
      </h1>
    </main>
  )
}
```

- [ ] **Step 9: Instalar dependências e verificar**

```bash
cd ~/vibe-coding/video-worker/web && npm install
```

- [ ] **Step 10: Rodar dev server e verificar**

```bash
cd ~/vibe-coding/video-worker/web && npm run dev
```

Esperado: Página com "VIDEO WORKER" em neon roxo no centro, fundo `#0F0F23`, scanlines sutis.

- [ ] **Step 11: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/
git commit -m "feat: scaffold Next.js com design system cyberpunk/neon

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 2: Componentes compartilhados + tipos

**Files:**
- Create: `web/src/lib/types.ts`
- Create: `web/src/lib/api.ts`
- Create: `web/src/components/StatusDot.tsx`
- Create: `web/src/components/NeonBorder.tsx`
- Create: `web/src/components/ScanlineOverlay.tsx`
- Create: `web/src/components/Header.tsx`

- [ ] **Step 1: Criar `web/src/lib/types.ts`**

```ts
export type PipelineStage = 'segment' | 'analyze' | 'edit' | 'direct' | 'render' | 'caption' | 'scout' | 'compose'

export type StageStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'error'

export interface StageInfo {
  stage: PipelineStage
  status: StageStatus
  progress: number      // 0-100
  count?: string        // ex: "3/8"
  eta?: string          // ex: "~2:15"
  error?: string
}

export interface ChannelInfo {
  id: string
  name: string
  handle: string
  thumbnail: string
  videoCount: number
  lastUpload: string
}

export interface Clip {
  id: string
  title: string
  duration: number       // segundos
  thumbnailUrl: string
  viralityScore: number  // 0-100
  reason: string         // justificativa do ANALYST
  sourceVideo: string    // título da live de origem
  platforms: {
    youtube: 'published' | 'pending' | 'error' | 'none'
    instagram: 'published' | 'pending' | 'error' | 'none'
    tiktok: 'published' | 'pending' | 'error' | 'none'
  }
  createdAt: string
}

export interface LogEntry {
  timestamp: string      // HH:MM:SS
  message: string
  level: 'info' | 'error' | 'highlight'
}

export interface PipelineStatus {
  active: boolean
  stages: StageInfo[]
  currentVideo?: {
    id: string
    title: string
    thumbnail: string
    duration: string
    index: number
    total: number
  }
  logs: LogEntry[]
}

export interface Settings {
  channelUrl: string
  clipsPerLive: number
  autoPublish: boolean
  platforms: {
    youtube: boolean
    instagram: boolean
    tiktok: boolean
  }
  captionStyle: 'tiktok' | 'karaoke' | 'none'
}
```

- [ ] **Step 2: Criar `web/src/lib/api.ts`**

```ts
const BASE = '/api'

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || 'Erro desconhecido')
  }
  return res.json()
}

export const api = {
  // Canal
  getChannel: (url: string) =>
    fetchAPI<{ channel: import('./types').ChannelInfo }>(`/channel?url=${encodeURIComponent(url)}`),

  // Pipeline
  startPipeline: () =>
    fetchAPI<{ ok: boolean }>('/pipeline/start', { method: 'POST' }),

  getPipelineStatus: () =>
    fetchAPI<import('./types').PipelineStatus>('/pipeline/status'),

  // Clips
  getClips: (filter?: string) =>
    fetchAPI<{ clips: import('./types').Clip[]; total: number }>(
      `/clips${filter ? `?filter=${filter}` : ''}`
    ),

  getClip: (id: string) =>
    fetchAPI<{ clip: import('./types').Clip }>(`/clips/${id}`),

  // Settings
  getSettings: () =>
    fetchAPI<import('./types').Settings>('/settings'),

  updateSettings: (data: Partial<import('./types').Settings>) =>
    fetchAPI<{ ok: boolean }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // SSE (retorna EventSource)
  subscribePipelineEvents: () =>
    new EventSource(`${BASE}/pipeline/events`),
}
```

- [ ] **Step 3: Criar `web/src/components/StatusDot.tsx`**

```tsx
type Status = 'online' | 'processing' | 'error' | 'offline'

export function StatusDot({ status }: { status: Status }) {
  return (
    <span
      className={[
        'w-2 h-2 rounded-full inline-block',
        status === 'online' && 'bg-cyan animate-pulse',
        status === 'processing' && 'bg-primary animate-pulse',
        status === 'error' && 'bg-error',
        status === 'offline' && 'bg-muted',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
```

- [ ] **Step 4: Criar `web/src/components/NeonBorder.tsx`**

```tsx
export function NeonBorder({
  children,
  className = '',
  active = false,
}: {
  children: React.ReactNode
  className?: string
  active?: boolean
}) {
  return (
    <div
      className={[
        'border rounded-xl transition-all duration-200',
        active
          ? 'border-primary/50 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
          : 'border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Criar `web/src/components/ScanlineOverlay.tsx`**

```tsx
export function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]"
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 6: Criar `web/src/components/Header.tsx`**

```tsx
import { Zap, Settings } from 'lucide-react'
import Link from 'next/link'
import { StatusDot } from './StatusDot'

export function Header({
  status = 'online',
  showNav = false,
}: {
  status?: 'online' | 'processing' | 'error' | 'offline'
  showNav?: boolean
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-background/90 backdrop-blur-sm border-b border-primary/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-cta" />
          <span className="font-heading font-bold text-sm text-primary neon-text tracking-wider">
            VIDEO WORKER
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {showNav && (
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/pipeline"
                className="text-muted hover:text-text transition-colors"
              >
                Pipeline
              </Link>
              <Link
                href="/clips"
                className="text-muted hover:text-text transition-colors"
              >
                Clips
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <span className="text-xs font-mono text-muted">
              {status === 'online' ? 'ONLINE' : status === 'processing' ? 'PROCESSANDO' : status.toUpperCase()}
            </span>
          </div>

          {showNav && (
            <Link href="/settings" className="text-muted hover:text-text transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 7: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/src/lib/ web/src/components/Header.tsx web/src/components/StatusDot.tsx web/src/components/NeonBorder.tsx web/src/components/ScanlineOverlay.tsx
git commit -m "feat: componentes compartilhados + tipos + API client

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 3: Landing page — Hero + Pipeline Preview + Stats

**Files:**
- Create: `web/src/components/HeroSection.tsx`
- Create: `web/src/components/PipelinePreview.tsx`
- Create: `web/src/components/StatsSection.tsx`
- Modify: `web/src/app/page.tsx`

- [ ] **Step 1: Criar `web/src/components/HeroSection.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <section className="pt-32 pb-16 text-center px-6">
      <h1
        className={[
          'font-heading font-bold text-4xl md:text-6xl text-text leading-tight',
          'transition-all duration-700 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3',
        ].join(' ')}
      >
        Suas lives morrem em 24h.
      </h1>

      <p
        className={[
          'font-heading font-medium text-xl md:text-2xl text-secondary mt-4',
          'transition-all duration-700 ease-out delay-200',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3',
        ].join(' ')}
      >
        Os melhores 47 segundos nunca são vistos.
      </p>

      <p
        className={[
          'text-lg text-muted mt-6 max-w-2xl mx-auto font-light',
          'transition-all duration-700 ease-out delay-500',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3',
        ].join(' ')}
      >
        Cole o link do canal. 8 Shorts prontos.
        <br />
        Sem editor. Sem timeline. Sem esforço.
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Criar `web/src/components/PipelinePreview.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Scissors, Brain, Film, Clapperboard,
  Sparkles, Captions, Hash, Layers,
} from 'lucide-react'

const AGENTS = [
  { name: 'Segmenter', icon: Scissors },
  { name: 'Analyst', icon: Brain },
  { name: 'Editor', icon: Film },
  { name: 'Director', icon: Clapperboard },
  { name: 'Renderer', icon: Sparkles },
  { name: 'Captioner', icon: Captions },
  { name: 'Scout', icon: Hash },
  { name: 'Composer', icon: Layers },
] as const

export function PipelinePreview() {
  const ref = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          AGENTS.forEach((_, i) => {
            setTimeout(() => setLit((prev) => [...prev, i]), i * 120)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 px-6">
      <h2 className="font-heading font-semibold text-2xl text-text text-center mb-12">
        8 agentes IA. Cada um especialista.
      </h2>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon
          const isLit = lit.includes(i)

          return (
            <div
              key={agent.name}
              className={[
                'bg-surface rounded-lg p-4 text-center border transition-all duration-300',
                isLit
                  ? 'border-primary/60 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                  : 'border-primary/10',
              ].join(' ')}
            >
              <Icon
                className={[
                  'w-5 h-5 mx-auto transition-colors duration-300',
                  isLit ? 'text-secondary' : 'text-muted',
                ].join(' ')}
                strokeWidth={1.5}
              />
              <span className="font-heading font-bold text-xl text-primary mt-2 block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-muted mt-1 block uppercase tracking-wider font-body font-medium">
                {agent.name}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Criar `web/src/components/StatsSection.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: string
  label: string
  numericValue?: number
  prefix?: string
  suffix?: string
}

const STATS: Stat[] = [
  { value: '8', label: 'clips por live', numericValue: 8 },
  { value: '~4', label: 'min por clip', numericValue: 4, prefix: '~' },
  { value: 'R$0,11', label: 'por clip', numericValue: 0.11, prefix: 'R$' },
]

function AnimatedNumber({ stat, animate }: { stat: Stat; animate: boolean }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!animate || !stat.numericValue) return
    const target = stat.numericValue
    const duration = 1500
    const start = Date.now()

    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCurrent(eased * target)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [animate, stat.numericValue])

  if (!animate) return <span>{stat.value}</span>

  const display = stat.numericValue && stat.numericValue < 1
    ? `${stat.prefix || ''}${current.toFixed(2).replace('.', ',')}`
    : `${stat.prefix || ''}${Math.round(current)}`

  return <span>{display}</span>
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 px-6">
      <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading font-bold text-4xl text-cyan">
              <AnimatedNumber stat={stat} animate={animate} />
            </div>
            <div className="text-sm text-muted mt-2 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Criar `web/src/components/ResultPreview.tsx`**

```tsx
import { Play, Star } from 'lucide-react'

const MOCK_CLIPS = [
  { title: 'Como eu automatizei meu email marketing do zero', duration: '0:47', score: 91 },
  { title: 'O erro que todo mundo comete no ActiveCampaign', duration: '1:02', score: 87 },
  { title: 'Receita subiu 40% com essa automação simples', duration: '0:38', score: 74 },
]

function scoreColor(score: number) {
  if (score >= 80) return 'bg-success/20 text-success border-success/30'
  if (score >= 50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  return 'bg-error/20 text-error border-error/30'
}

export function ResultPreview() {
  return (
    <section className="py-16 px-6">
      <h2 className="font-heading font-medium text-xl text-text text-center mb-8">
        De uma live de 2h47, esses foram os 3 melhores momentos.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {MOCK_CLIPS.map((clip) => (
          <div
            key={clip.title}
            className="bg-surface rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all duration-200 cursor-pointer group"
          >
            {/* Thumbnail placeholder */}
            <div className="aspect-[9/16] relative bg-gradient-to-br from-primary/20 to-cyan/10 flex items-center justify-center">
              <Play
                className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                strokeWidth={1.5}
              />

              {/* Duração */}
              <span className="absolute bottom-2 right-2 bg-black/80 text-text text-[11px] font-mono px-1.5 py-0.5 rounded">
                {clip.duration}
              </span>

              {/* Virality Score */}
              <span
                className={[
                  'absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold font-heading border',
                  scoreColor(clip.score),
                ].join(' ')}
              >
                <Star className="w-3 h-3" />
                {clip.score}
              </span>
            </div>

            <div className="p-4">
              <p className="text-sm text-text font-medium line-clamp-2 leading-snug">
                {clip.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Montar `web/src/app/page.tsx` com todos os componentes**

```tsx
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { PipelinePreview } from '@/components/PipelinePreview'
import { ResultPreview } from '@/components/ResultPreview'
import { StatsSection } from '@/components/StatsSection'
import { ActivateSection } from '@/components/ActivateSection'

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto">
        <HeroSection />
        <PipelinePreview />
        <ResultPreview />
        <StatsSection />
        <ActivateSection />
      </main>
    </>
  )
}
```

Nota: `ActivateSection` será criada na Task 4.

- [ ] **Step 6: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/src/components/HeroSection.tsx web/src/components/PipelinePreview.tsx web/src/components/ResultPreview.tsx web/src/components/StatsSection.tsx web/src/app/page.tsx
git commit -m "feat: landing page — hero, pipeline preview, resultado, stats

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 4: Landing page — ActivateSection (CTA com campo URL)

**Files:**
- Create: `web/src/components/ActivateSection.tsx`

- [ ] **Step 1: Criar `web/src/components/ActivateSection.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

const YT_REGEX = /youtube\.com\/(@[\w.-]+|channel\/UC[\w-]+|c\/[\w.-]+)/

type State = 'idle' | 'validating' | 'ready' | 'loading' | 'error'

export function ActivateSection() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  const [channelName, setChannelName] = useState('')

  const isValid = YT_REGEX.test(url)

  async function handleUrlChange(value: string) {
    setUrl(value)
    setError('')

    if (YT_REGEX.test(value)) {
      setState('validating')
      try {
        const { channel } = await api.getChannel(value)
        setChannelName(channel.name)
        setState('ready')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Canal não encontrado')
        setState('error')
      }
    } else {
      setState('idle')
      setChannelName('')
    }
  }

  async function handleActivate() {
    if (!isValid || state === 'loading') return
    setState('loading')
    setError('')

    try {
      await api.startPipeline()
      router.push('/pipeline')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar pipeline')
      setState('error')
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading font-semibold text-2xl text-text mb-8">
          Cole o link. Aperte ATIVAR. Vá dormir.
        </h2>

        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="youtube.com/@seucanal"
          className={[
            'w-full bg-background/80 rounded-lg px-4 py-4 text-text font-mono text-lg',
            'placeholder:text-muted/50 outline-none transition-all duration-200 border',
            state === 'error' ? 'border-error focus:border-error' :
            state === 'ready' ? 'border-success focus:border-success' :
            'border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20',
          ].join(' ')}
          aria-label="URL do canal YouTube"
        />

        {channelName && state === 'ready' && (
          <p className="text-sm text-success mt-2 font-mono">
            Canal encontrado: {channelName}
          </p>
        )}

        {error && (
          <p className="text-sm text-error mt-2 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        <button
          onClick={handleActivate}
          disabled={!isValid || state === 'loading' || state === 'validating'}
          className={[
            'mt-6 w-full md:w-auto px-12 py-4 bg-cta text-white',
            'font-heading font-bold text-lg uppercase tracking-widest rounded-lg',
            'cursor-pointer transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isValid && state !== 'loading' ? 'animate-glow-pulse hover:-translate-y-0.5' : '',
          ].join(' ')}
        >
          {state === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              CONECTANDO...
            </span>
          ) : state === 'validating' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              VERIFICANDO...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              ATIVAR
            </span>
          )}
        </button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar que a page.tsx já importa ActivateSection (Task 3 Step 5)**

A page.tsx já inclui o import. Verificar que compila:

```bash
cd ~/vibe-coding/video-worker/web && npx next build 2>&1 | tail -5
```

Esperado: Build sem erros (API calls vão falhar em runtime, mas build compila).

- [ ] **Step 3: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/src/components/ActivateSection.tsx
git commit -m "feat: CTA ActivateSection — campo URL + botão ATIVAR com glow

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 5: Página Pipeline — grid de etapas + log terminal

**Files:**
- Create: `web/src/components/pipeline/PipelineHeader.tsx`
- Create: `web/src/components/pipeline/PipelineStageCard.tsx`
- Create: `web/src/components/pipeline/PipelineGrid.tsx`
- Create: `web/src/components/pipeline/CurrentVideoCard.tsx`
- Create: `web/src/components/pipeline/LogTerminal.tsx`
- Create: `web/src/app/pipeline/page.tsx`

- [ ] **Step 1: Criar `web/src/components/pipeline/PipelineStageCard.tsx`**

```tsx
import type { LucideIcon } from 'lucide-react'
import { Check, AlertCircle } from 'lucide-react'
import type { StageStatus } from '@/lib/types'

interface Props {
  name: string
  icon: LucideIcon
  status: StageStatus
  progress: number
  count?: string
  eta?: string
  error?: string
}

const statusStyles: Record<StageStatus, { border: string; icon: string }> = {
  idle:       { border: 'border-primary/10',  icon: 'text-muted' },
  queued:     { border: 'border-primary/20',  icon: 'text-secondary' },
  processing: { border: 'border-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]', icon: 'text-cyan' },
  completed:  { border: 'border-success/50',  icon: 'text-success' },
  error:      { border: 'border-error',       icon: 'text-error' },
}

export function PipelineStageCard({ name, icon: Icon, status, progress, count, eta, error }: Props) {
  const style = statusStyles[status]

  return (
    <div className={`bg-surface rounded-xl p-6 border transition-all duration-300 ${style.border}`}>
      <div className="flex items-center justify-between">
        {status === 'completed' ? (
          <Check className="w-6 h-6 text-success" strokeWidth={1.5} />
        ) : status === 'error' ? (
          <AlertCircle className="w-6 h-6 text-error" strokeWidth={1.5} />
        ) : (
          <Icon className={`w-6 h-6 ${style.icon}`} strokeWidth={1.5} />
        )}
      </div>

      <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mt-3 text-text">
        {name}
      </h3>

      {count && (
        <p className="font-mono text-xs text-muted mt-1">{count}</p>
      )}

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-primary/10 mt-4">
        <div
          className="h-1 rounded-full bg-gradient-to-r from-primary to-cyan transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {eta && status === 'processing' && (
        <p className="font-mono text-[10px] text-muted mt-2">{eta}</p>
      )}

      {error && (
        <p className="font-mono text-[10px] text-error mt-2 line-clamp-2">{error}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Criar `web/src/components/pipeline/PipelineGrid.tsx`**

```tsx
import {
  Scissors, Brain, Film, Clapperboard,
  Sparkles, Captions, Hash, Layers,
} from 'lucide-react'
import { PipelineStageCard } from './PipelineStageCard'
import type { StageInfo, PipelineStage } from '@/lib/types'

const STAGE_META: Record<PipelineStage, { name: string; icon: typeof Scissors }> = {
  segment:  { name: 'Segmenter',  icon: Scissors },
  analyze:  { name: 'Analyst',    icon: Brain },
  edit:     { name: 'Editor',     icon: Film },
  direct:   { name: 'Director',   icon: Clapperboard },
  render:   { name: 'Renderer',   icon: Sparkles },
  caption:  { name: 'Captioner',  icon: Captions },
  scout:    { name: 'Scout',      icon: Hash },
  compose:  { name: 'Composer',   icon: Layers },
}

const STAGE_ORDER: PipelineStage[] = [
  'segment', 'analyze', 'edit', 'direct', 'render', 'caption', 'scout', 'compose',
]

export function PipelineGrid({ stages }: { stages: StageInfo[] }) {
  const stageMap = new Map(stages.map((s) => [s.stage, s]))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {STAGE_ORDER.map((key) => {
        const meta = STAGE_META[key]
        const info = stageMap.get(key)

        return (
          <PipelineStageCard
            key={key}
            name={meta.name}
            icon={meta.icon}
            status={info?.status ?? 'idle'}
            progress={info?.progress ?? 0}
            count={info?.count}
            eta={info?.eta}
            error={info?.error}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Criar `web/src/components/pipeline/CurrentVideoCard.tsx`**

```tsx
interface Props {
  title: string
  thumbnail: string
  duration: string
  index: number
  total: number
}

export function CurrentVideoCard({ title, thumbnail, duration, index, total }: Props) {
  return (
    <div className="bg-surface/50 rounded-xl border border-primary/10 p-4 flex items-center gap-4">
      <div className="w-[120px] h-[68px] rounded-lg bg-background overflow-hidden flex-shrink-0">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-text font-medium line-clamp-1">{title}</p>
        <p className="font-mono text-xs text-muted mt-1">{duration}</p>
      </div>

      <div className="text-xs text-cyan font-mono flex-shrink-0">
        Vídeo {index} de {total}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Criar `web/src/components/pipeline/LogTerminal.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Maximize2, Minimize2 } from 'lucide-react'
import type { LogEntry } from '@/lib/types'

const levelColors: Record<string, string> = {
  info: 'text-text',
  error: 'text-error',
  highlight: 'text-primary',
}

export function LogTerminal({ logs }: { logs: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, paused])

  return (
    <div className="bg-[#0A0A1A] rounded-xl border border-primary/10 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-primary/10">
        <span className="font-mono text-xs text-muted uppercase tracking-wider">Terminal</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!paused)}
            className="text-muted hover:text-text transition-colors cursor-pointer"
            aria-label={paused ? 'Continuar scroll' : 'Pausar scroll'}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted hover:text-text transition-colors cursor-pointer"
            aria-label={expanded ? 'Minimizar' : 'Expandir'}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Log area */}
      <div
        ref={scrollRef}
        className={[
          'px-4 py-3 font-mono text-[13px] leading-relaxed overflow-y-auto transition-all duration-300',
          expanded ? 'max-h-[60vh]' : 'max-h-48',
        ].join(' ')}
      >
        {logs.length === 0 ? (
          <p className="text-muted">Aguardando...</p>
        ) : (
          logs.slice(-500).map((log, i) => (
            <div key={i} className={levelColors[log.level] || 'text-text'}>
              <span className="text-cyan">[{log.timestamp}]</span>{' '}
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Criar `web/src/components/pipeline/PipelineHeader.tsx`**

```tsx
import { Square, Youtube } from 'lucide-react'
import Link from 'next/link'
import { StatusDot } from '@/components/StatusDot'

interface Props {
  channelName: string
  stats: string
  onStop?: () => void
}

export function PipelineHeader({ channelName, stats, onStop }: Props) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-background/90 backdrop-blur-sm border-b border-primary/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading font-bold text-sm text-primary neon-text tracking-wider">
            VIDEO WORKER
          </Link>

          <div className="flex items-center gap-2 text-text">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Youtube className="w-4 h-4 text-cta" />
            </div>
            <span className="font-medium text-sm">{channelName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StatusDot status="processing" />
            <span className="text-xs font-mono text-muted">{stats}</span>
          </div>

          {onStop && (
            <button
              onClick={onStop}
              className="text-xs text-error/70 hover:text-error border border-error/20 hover:border-error/50 rounded px-3 py-1 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Square className="w-3 h-3" />
              Parar
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 6: Criar `web/src/app/pipeline/page.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { PipelineHeader } from '@/components/pipeline/PipelineHeader'
import { PipelineGrid } from '@/components/pipeline/PipelineGrid'
import { CurrentVideoCard } from '@/components/pipeline/CurrentVideoCard'
import { LogTerminal } from '@/components/pipeline/LogTerminal'
import type { PipelineStatus, StageInfo, LogEntry } from '@/lib/types'
import { api } from '@/lib/api'

// Mock data pra desenvolvimento — remover quando API estiver pronta
const MOCK_STATUS: PipelineStatus = {
  active: true,
  stages: [
    { stage: 'segment', status: 'completed', progress: 100, count: '8/8' },
    { stage: 'analyze', status: 'completed', progress: 100, count: '8/8' },
    { stage: 'edit', status: 'processing', progress: 62, count: '5/8', eta: '~1:30' },
    { stage: 'direct', status: 'queued', progress: 0 },
    { stage: 'render', status: 'idle', progress: 0 },
    { stage: 'caption', status: 'idle', progress: 0 },
    { stage: 'scout', status: 'idle', progress: 0 },
    { stage: 'compose', status: 'idle', progress: 0 },
  ],
  currentVideo: {
    id: 'abc123',
    title: 'Dia 10 | Vibe Coding Até Vendermos R$1.000.000',
    thumbnail: '',
    duration: '2:47:33',
    index: 3,
    total: 47,
  },
  logs: [
    { timestamp: '21:30:01', message: 'Transcrevendo "Dia 10 | Vibe..."', level: 'info' },
    { timestamp: '21:30:45', message: '12.847 palavras extraídas', level: 'highlight' },
    { timestamp: '21:31:02', message: 'Analisando com Haiku...', level: 'info' },
    { timestamp: '21:31:15', message: '8 segmentos identificados', level: 'highlight' },
    { timestamp: '21:31:30', message: 'Cortando segmento 5/8...', level: 'info' },
  ],
}

export default function PipelinePage() {
  const [status, setStatus] = useState<PipelineStatus>(MOCK_STATUS)

  // TODO: substituir mock por SSE real
  // useEffect(() => {
  //   const es = api.subscribePipelineEvents()
  //   es.onmessage = (event) => {
  //     const data = JSON.parse(event.data)
  //     setStatus(prev => ({ ...prev, ...data }))
  //   }
  //   return () => es.close()
  // }, [])

  return (
    <>
      <PipelineHeader
        channelName="@emailhackerai"
        stats={`Processando ${status.currentVideo?.index ?? 0}/${status.currentVideo?.total ?? 0} · Pipeline ativo`}
      />

      <main className="pt-20 px-6 max-w-6xl mx-auto pb-12">
        <PipelineGrid stages={status.stages} />

        {status.currentVideo && (
          <div className="mt-6">
            <CurrentVideoCard
              title={status.currentVideo.title}
              thumbnail={status.currentVideo.thumbnail}
              duration={status.currentVideo.duration}
              index={status.currentVideo.index}
              total={status.currentVideo.total}
            />
          </div>
        )}

        <div className="mt-6">
          <LogTerminal logs={status.logs} />
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 7: Verificar build**

```bash
cd ~/vibe-coding/video-worker/web && npx next build 2>&1 | tail -10
```

Esperado: Build sem erros.

- [ ] **Step 8: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/src/components/pipeline/ web/src/app/pipeline/
git commit -m "feat: página Pipeline — grid de etapas + log terminal + vídeo atual

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 6: Página Clips — gallery + modal de preview

**Files:**
- Create: `web/src/components/clips/ClipsHeader.tsx`
- Create: `web/src/components/clips/ClipCard.tsx`
- Create: `web/src/components/clips/ClipModal.tsx`
- Create: `web/src/components/clips/ClipsGrid.tsx`
- Create: `web/src/app/clips/page.tsx`

- [ ] **Step 1: Criar `web/src/components/clips/ClipCard.tsx`**

```tsx
import { Play, Star, Youtube } from 'lucide-react'
import type { Clip } from '@/lib/types'

function scoreColor(score: number) {
  if (score >= 80) return 'bg-success/20 text-success border-success/30'
  if (score >= 50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  return 'bg-error/20 text-error border-error/30'
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function PlatformIcon({ status }: { status: string }) {
  const color =
    status === 'published' ? 'text-success' :
    status === 'pending' ? 'text-muted animate-pulse' :
    status === 'error' ? 'text-error' :
    'text-muted/30'

  return <Youtube className={`w-3.5 h-3.5 ${color}`} />
}

export function ClipCard({ clip, onClick }: { clip: Clip; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all duration-200 cursor-pointer group"
    >
      <div className="aspect-[9/16] relative bg-gradient-to-br from-primary/20 to-cyan/10">
        {clip.thumbnailUrl && (
          <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" strokeWidth={1.5} />
        </div>

        <span className="absolute bottom-2 right-2 bg-black/80 text-text text-[11px] font-mono px-1.5 py-0.5 rounded">
          {formatDuration(clip.duration)}
        </span>

        <span className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold font-heading border ${scoreColor(clip.viralityScore)}`}>
          <Star className="w-3 h-3" />
          {clip.viralityScore}
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm text-text font-medium line-clamp-2 leading-snug">{clip.title}</p>
        <p className="font-mono text-[11px] text-muted mt-1 line-clamp-1">{clip.sourceVideo}</p>

        <div className="flex items-center gap-2 mt-3">
          <PlatformIcon status={clip.platforms.youtube} />
          <PlatformIcon status={clip.platforms.instagram} />
          <PlatformIcon status={clip.platforms.tiktok} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Criar `web/src/components/clips/ClipModal.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { X, Star, Youtube, Check, Loader2, AlertCircle, Minus } from 'lucide-react'
import type { Clip } from '@/lib/types'

function scoreColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 50) return 'text-yellow-400'
  return 'text-error'
}

function PlatformStatus({ name, status }: { name: string; status: string }) {
  const icon =
    status === 'published' ? <Check className="w-4 h-4 text-success" /> :
    status === 'pending' ? <Loader2 className="w-4 h-4 text-muted animate-spin" /> :
    status === 'error' ? <AlertCircle className="w-4 h-4 text-error" /> :
    <Minus className="w-4 h-4 text-muted/30" />

  return (
    <div className="flex items-center gap-3 py-2">
      {icon}
      <span className="text-sm text-text">{name}</span>
      <span className="text-xs text-muted ml-auto font-mono">
        {status === 'published' ? 'Publicado' : status === 'pending' ? 'Na fila' : status === 'error' ? 'Erro' : '—'}
      </span>
    </div>
  )
}

export function ClipModal({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl max-w-lg w-full overflow-hidden border border-primary/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted hover:text-text transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Vídeo preview */}
        <div className="aspect-[9/16] max-h-[50vh] bg-black flex items-center justify-center">
          <p className="text-muted font-mono text-sm">Preview indisponível (v1)</p>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-heading font-semibold text-lg text-text">{clip.title}</h3>

          <div className="flex items-center gap-3 mt-3">
            <Star className={`w-5 h-5 ${scoreColor(clip.viralityScore)}`} />
            <span className={`font-heading font-bold text-3xl ${scoreColor(clip.viralityScore)}`}>
              {clip.viralityScore}
            </span>
            <span className="text-xs text-muted">Virality Score</span>
          </div>

          {clip.reason && (
            <p className="text-sm text-secondary mt-3 italic">{clip.reason}</p>
          )}

          <div className="mt-4 border-t border-primary/10 pt-4">
            <PlatformStatus name="YouTube Shorts" status={clip.platforms.youtube} />
            <PlatformStatus name="Instagram Reels" status={clip.platforms.instagram} />
            <PlatformStatus name="TikTok" status={clip.platforms.tiktok} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Criar `web/src/components/clips/ClipsHeader.tsx`**

```tsx
'use client'

interface Props {
  total: number
  published: number
  pending: number
  filter: string
  onFilterChange: (filter: string) => void
}

const FILTERS = [
  { key: '', label: 'Todos' },
  { key: 'published', label: 'Publicados' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'error', label: 'Erros' },
]

export function ClipsHeader({ total, published, pending, filter, onFilterChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <p className="font-mono text-xs text-muted">
        {total} clips · {published} publicados · {pending} em fila
      </p>

      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={[
              'px-3 py-1 rounded-full text-xs cursor-pointer transition-colors',
              filter === f.key
                ? 'bg-primary/20 text-primary'
                : 'text-muted hover:text-text',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Criar `web/src/app/clips/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ClipsHeader } from '@/components/clips/ClipsHeader'
import { ClipCard } from '@/components/clips/ClipCard'
import { ClipModal } from '@/components/clips/ClipModal'
import type { Clip } from '@/lib/types'

// Mock data — substituir por API
const MOCK_CLIPS: Clip[] = [
  {
    id: '1', title: 'Como eu automatizei meu email marketing do zero',
    duration: 47, thumbnailUrl: '', viralityScore: 91,
    reason: 'Hook forte nos primeiros 3 segundos + promessa clara de resultado',
    sourceVideo: 'Dia 10 | Vibe Coding', platforms: { youtube: 'published', instagram: 'pending', tiktok: 'none' },
    createdAt: '2026-04-08T21:00:00Z',
  },
  {
    id: '2', title: 'O erro que todo mundo comete no ActiveCampaign',
    duration: 62, thumbnailUrl: '', viralityScore: 87,
    reason: 'Conteúdo educacional com revelação surpreendente no meio',
    sourceVideo: 'Dia 10 | Vibe Coding', platforms: { youtube: 'published', instagram: 'published', tiktok: 'pending' },
    createdAt: '2026-04-08T21:05:00Z',
  },
  {
    id: '3', title: 'Receita subiu 40% com essa automação simples',
    duration: 38, thumbnailUrl: '', viralityScore: 74,
    reason: 'Dado concreto de resultado + demonstração visual',
    sourceVideo: 'Dia 9 | Vibe Coding', platforms: { youtube: 'pending', instagram: 'none', tiktok: 'none' },
    createdAt: '2026-04-08T20:30:00Z',
  },
]

export default function ClipsPage() {
  const [filter, setFilter] = useState('')
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)

  const filteredClips = filter
    ? MOCK_CLIPS.filter((c) => {
        const statuses = Object.values(c.platforms)
        if (filter === 'published') return statuses.includes('published')
        if (filter === 'pending') return statuses.includes('pending')
        if (filter === 'error') return statuses.includes('error')
        return true
      })
    : MOCK_CLIPS

  const published = MOCK_CLIPS.filter((c) => Object.values(c.platforms).includes('published')).length
  const pending = MOCK_CLIPS.filter((c) => Object.values(c.platforms).includes('pending')).length

  return (
    <>
      <Header showNav status="online" />

      <main className="pt-20 px-6 max-w-7xl mx-auto pb-12">
        <ClipsHeader
          total={MOCK_CLIPS.length}
          published={published}
          pending={pending}
          filter={filter}
          onFilterChange={setFilter}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredClips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onClick={() => setSelectedClip(clip)}
            />
          ))}
        </div>
      </main>

      {selectedClip && (
        <ClipModal clip={selectedClip} onClose={() => setSelectedClip(null)} />
      )}
    </>
  )
}
```

- [ ] **Step 5: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/src/components/clips/ web/src/app/clips/
git commit -m "feat: página Clips — gallery com ClipCard, filtros e modal de preview

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 7: Página Settings

**Files:**
- Create: `web/src/app/settings/page.tsx`

- [ ] **Step 1: Criar `web/src/app/settings/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Save, Loader2 } from 'lucide-react'
import type { Settings } from '@/lib/types'

const DEFAULT_SETTINGS: Settings = {
  channelUrl: 'youtube.com/@emailhackerai',
  clipsPerLive: 8,
  autoPublish: true,
  platforms: { youtube: true, instagram: true, tiktok: false },
  captionStyle: 'tiktok',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    // TODO: api.updateSettings(settings)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <Header showNav status="online" />

      <main className="pt-20 px-6 max-w-2xl mx-auto pb-12">
        <h1 className="font-heading font-bold text-2xl text-text mb-8">Configurações</h1>

        <div className="space-y-6">
          {/* Canal */}
          <div>
            <label className="block text-sm text-muted mb-2 font-medium">Canal YouTube</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.channelUrl}
                readOnly
                className="flex-1 bg-background/50 border border-primary/20 rounded-lg px-4 py-3 text-text font-mono text-sm"
              />
              <button className="px-4 py-3 border border-primary/20 rounded-lg text-sm text-secondary hover:text-text hover:border-primary/50 transition-colors cursor-pointer">
                Trocar
              </button>
            </div>
          </div>

          {/* Clips por live */}
          <div>
            <label className="block text-sm text-muted mb-2 font-medium">Clips por live</label>
            <input
              type="number"
              min={1}
              max={20}
              value={settings.clipsPerLive}
              onChange={(e) => setSettings({ ...settings, clipsPerLive: Number(e.target.value) })}
              className="w-20 text-center bg-background/50 border border-primary/20 rounded-lg px-4 py-3 text-text font-mono"
            />
          </div>

          {/* Auto publicar */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-text font-medium">Publicar automaticamente</label>
            <button
              onClick={() => setSettings({ ...settings, autoPublish: !settings.autoPublish })}
              className={[
                'w-12 h-6 rounded-full transition-colors cursor-pointer relative',
                settings.autoPublish ? 'bg-cyan' : 'bg-muted/30',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                  settings.autoPublish ? 'translate-x-6' : 'translate-x-0.5',
                ].join(' ')}
              />
            </button>
          </div>

          {/* Plataformas */}
          <div>
            <label className="block text-sm text-muted mb-3 font-medium">Plataformas</label>
            <div className="space-y-3">
              {(['youtube', 'instagram', 'tiktok'] as const).map((platform) => (
                <div key={platform} className="flex items-center justify-between">
                  <span className="text-sm text-text capitalize">{platform === 'youtube' ? 'YouTube Shorts' : platform === 'instagram' ? 'Instagram Reels' : 'TikTok'}</span>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        platforms: { ...settings.platforms, [platform]: !settings.platforms[platform] },
                      })
                    }
                    className={[
                      'w-12 h-6 rounded-full transition-colors cursor-pointer relative',
                      settings.platforms[platform] ? 'bg-cyan' : 'bg-muted/30',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                        settings.platforms[platform] ? 'translate-x-6' : 'translate-x-0.5',
                      ].join(' ')}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Estilo legendas */}
          <div>
            <label className="block text-sm text-muted mb-2 font-medium">Estilo de legendas</label>
            <select
              value={settings.captionStyle}
              onChange={(e) => setSettings({ ...settings, captionStyle: e.target.value as Settings['captionStyle'] })}
              className="bg-background/50 border border-primary/20 rounded-lg px-4 py-3 text-text text-sm cursor-pointer"
            >
              <option value="tiktok">TikTok (highlight palavra por palavra)</option>
              <option value="karaoke">Karaoke (scroll)</option>
              <option value="none">Sem legendas</option>
            </select>
          </div>

          {/* Salvar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={[
              'w-full py-3 rounded-lg font-heading font-semibold text-sm uppercase tracking-wider',
              'transition-all duration-200 cursor-pointer',
              saved
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]',
              saving ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
              </span>
            ) : saved ? (
              'Salvo!'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Salvar
              </span>
            )}
          </button>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 2: Verificar build final**

```bash
cd ~/vibe-coding/video-worker/web && npx next build 2>&1 | tail -10
```

Esperado: Build sem erros, 4 páginas compiladas.

- [ ] **Step 3: Commit**

```bash
cd ~/vibe-coding/video-worker
git add web/src/app/settings/
git commit -m "feat: página Settings — configurações de canal, clips, plataformas e legendas

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

### Task 8: Integrar frontend no PM2 da VPS

**Files:**
- Modify: `ecosystem.config.cjs`
- Modify: `scripts/deploy.sh` (se existir)

- [ ] **Step 1: Atualizar `ecosystem.config.cjs` pra rodar Next.js junto**

```js
module.exports = {
  apps: [
    {
      name: 'video-worker',
      script: 'dist/index.js',
      cwd: '/root/video-worker',
      env: {
        NODE_ENV: 'production',
        PORT: 3200,
      },
      max_memory_restart: '2G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/root/video-worker/logs/error.log',
      out_file: '/root/video-worker/logs/out.log',
    },
    {
      name: 'video-worker-web',
      script: 'node_modules/.bin/next',
      args: 'start --port 3201',
      cwd: '/root/video-worker/web',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/root/video-worker/logs/web-error.log',
      out_file: '/root/video-worker/logs/web-out.log',
    },
  ],
}
```

- [ ] **Step 2: Verificar/criar `scripts/deploy.sh` com build do frontend**

```bash
#!/bin/bash
set -e

echo "[deploy] Pulling latest..."
cd /root/video-worker
git pull origin main

echo "[deploy] Installing backend deps..."
npm install --production

echo "[deploy] Building backend..."
npx tsc

echo "[deploy] Installing frontend deps..."
cd web && npm install --production

echo "[deploy] Building frontend..."
npx next build

echo "[deploy] Restarting PM2..."
cd /root/video-worker
pm2 restart ecosystem.config.cjs

echo "[deploy] Done!"
```

- [ ] **Step 3: Commit**

```bash
cd ~/vibe-coding/video-worker
git add ecosystem.config.cjs scripts/deploy.sh
git commit -m "feat: PM2 config pra rodar backend (3200) + frontend (3201)

Co-Authored-By: claude-flow <ruv@ruv.net>"
```

---

## Resumo de Tasks

| Task | Descrição | Arquivos |
|------|-----------|----------|
| 1 | Scaffold Next.js | 8 arquivos (package, config, layout, css) |
| 2 | Componentes compartilhados + tipos | 6 arquivos (types, api, Header, StatusDot, NeonBorder, Scanline) |
| 3 | Landing: Hero + Pipeline + Stats + Result | 5 arquivos |
| 4 | Landing: ActivateSection (CTA) | 1 arquivo |
| 5 | Página Pipeline | 6 arquivos (grid, stages, log, header, video card, page) |
| 6 | Página Clips | 5 arquivos (card, modal, header, grid, page) |
| 7 | Página Settings | 1 arquivo |
| 8 | PM2 + deploy | 2 arquivos |

**Total: 8 tasks, ~34 arquivos, ~1500 linhas de código**

Todas as páginas usam mock data — a conexão com API real do backend é Task futura (endpoints em `src/api/`).
