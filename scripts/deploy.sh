#!/bin/bash
# Auto-deploy: pull + build + restart PM2
# Chamado pelo webhook do GitHub ou manualmente

set -e
cd /root/video-worker

echo "$(date '+%Y-%m-%d %H:%M:%S') — Deploy iniciado"

git pull --ff-only origin main
npm install --omit=dev --quiet
npx tsc
pm2 restart video-worker

echo "$(date '+%Y-%m-%d %H:%M:%S') — Deploy concluído"
