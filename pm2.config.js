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
      host: '43.153.50.117',
      ref: 'origin/feature',
      repo: 'git@github.com:ava-grace-zoe/zoe.git',
      path: '/home/ubuntu/project/pm2',
      'post-deploy': 'yarn && echo successfully!',
    },
  },
};
