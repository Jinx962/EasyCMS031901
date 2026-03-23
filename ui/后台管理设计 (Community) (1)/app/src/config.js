import 'dotenv/config';

if (!process.env.GITHUB_TOKEN) {
  console.warn('[config] 警告：未设置 GITHUB_TOKEN，请复制 .env.example 为 .env 并填写配置');
}

export const config = {
  token: process.env.GITHUB_TOKEN || '',
  owner: process.env.GITHUB_OWNER || '',
  repo: process.env.GITHUB_REPO || '',
  port: Number(process.env.PORT) || 3001,
};
