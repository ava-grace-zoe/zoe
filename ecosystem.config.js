module.exports = {
  apps: [
    {
      name: 'zoe',
      script: 'dist/main.js',
    },
  ],

  deploy: {
    production: {
      env: {
        PATH:
          process.env.PATH + ':/home/ubuntu/.nvm/versions/node/v20.11.1/bin',
      },
      user: 'ubuntu',
      host: '43.153.50.117',
      ref: 'origin/feature',
      repo: 'git@github.com:ava-grace-zoe/zoe.git',
      path: '/home/ubuntu/project/zoe',
      'post-deploy': 'echo $PATH && yarn && yarn build && pm2 start',
    },
  },
};
