module.exports = {
  apps: [
    {
      script: 'dist/main.js',
    },
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['192.168.0.13', '192.168.0.14', '192.168.0.15'],
      ref: 'origin/master',
      repo: 'git@github.com:Username/repository.git',
      path: '/var/www/my-repository',
      'post-deploy': 'npm install',
    },
  },
};
