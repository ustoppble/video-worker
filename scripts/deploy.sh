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
