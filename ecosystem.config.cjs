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
