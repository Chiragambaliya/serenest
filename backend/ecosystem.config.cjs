/** PM2 config for production. Run: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [{
    name: 'serenest',
    script: 'server.js',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
