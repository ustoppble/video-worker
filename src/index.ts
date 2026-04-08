import { createServer } from 'node:http'
import { config } from './config.js'

// Health check endpoint
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }))
    return
  }
  res.writeHead(404)
  res.end()
})

server.listen(config.port, () => {
  console.log(`[video-worker] Health check em http://localhost:${config.port}/health`)
  console.log(`[video-worker] Data dir: ${config.dataDir}`)
})
