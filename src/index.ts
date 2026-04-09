import { createServer, type IncomingMessage } from 'node:http'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { execFile } from 'node:child_process'
import { config } from './config.js'

let deploying = false

function verifySignature(payload: string, signature: string | undefined): boolean {
  if (!config.webhookSecret || !signature) return false
  const expected = 'sha256=' + createHmac('sha256', config.webhookSecret).update(payload).digest('hex')
  if (expected.length !== signature.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

function deploy() {
  if (deploying) return
  deploying = true
  console.log('[deploy] Iniciando auto-deploy...')

  execFile('bash', ['/root/video-worker/scripts/deploy.sh'], {
    cwd: '/root/video-worker',
    timeout: 120_000,
  }, (err, stdout, stderr) => {
    deploying = false
    if (err) {
      console.error('[deploy] Falhou:', err.message)
      if (stderr) console.error(stderr)
      return
    }
    console.log('[deploy] Concluído:', stdout.trim())
  })
}

const server = createServer(async (req, res) => {
  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      deploying,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }))
    return
  }

  // GitHub Webhook — auto-deploy
  if (req.url === '/webhook/deploy' && req.method === 'POST') {
    const body = await readBody(req)
    const sig = req.headers['x-hub-signature-256'] as string | undefined

    if (!verifySignature(body, sig)) {
      res.writeHead(401)
      res.end('Signature inválida')
      return
    }

    const event = req.headers['x-github-event']
    if (event === 'push') {
      const payload = JSON.parse(body)
      if (payload.ref === 'refs/heads/main') {
        console.log(`[webhook] Push em main por ${payload.pusher?.name}`)
        deploy()
        res.writeHead(200)
        res.end('Deploy iniciado')
        return
      }
    }

    res.writeHead(200)
    res.end('OK (ignorado)')
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(config.port, () => {
  console.log(`[video-worker] Rodando na porta ${config.port}`)
  console.log(`[video-worker] Health: http://localhost:${config.port}/health`)
  console.log(`[video-worker] Webhook: http://localhost:${config.port}/webhook/deploy`)
})
