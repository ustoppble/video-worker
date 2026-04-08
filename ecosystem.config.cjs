module.exports = {
  apps: [{
    name: 'video-worker',
    script: 'dist/index.js',
    cwd: '/root/video-worker',
    env: {
      NODE_ENV: 'production',
      PORT: 3200,
    },
    max_memory_restart: '3G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/root/video-worker/logs/error.log',
    out_file: '/root/video-worker/logs/out.log',
  }],
}
