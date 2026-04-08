#!/bin/bash
# Setup da VPS para o Video Worker
# Rodar como root: bash scripts/setup.sh

set -e

echo "=== Video Worker — Setup da VPS ==="

# Node.js 22
echo "[1/6] Instalando Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# ffmpeg
echo "[2/6] Instalando ffmpeg..."
apt-get install -y ffmpeg

# yt-dlp
echo "[3/6] Instalando yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp

# Redis
echo "[4/6] Instalando Redis..."
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Chromium (pra Remotion)
echo "[5/6] Instalando Chromium..."
apt-get install -y chromium-browser || apt-get install -y chromium

# PM2
echo "[6/6] Instalando PM2..."
npm install -g pm2

# Criar diretórios
mkdir -p /data/video-worker/jobs
mkdir -p /root/video-worker/logs

echo ""
echo "=== Setup completo ==="
echo "Próximo: git clone, npm install, configurar .env"
