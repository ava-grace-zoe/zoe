const HOST = '43.153.50.117';
const USER = 'ubuntu';

module.exports = {
  apps: [
    {
      name: 'zoe',
      script: 'dist/main.js',
    },
  ],

  deploy: {
    production: {
      user: USER,
      host: HOST,
      ref: 'origin/feature',
      repo: 'git@github.com:ava-grace-zoe/zoe.git',
      path: '/home/ubuntu/project/zoe',
      'post-deploy': 'yarn && yarn build  && yarn inject-path && yarn pm2start',
    },
  },
};
