import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import issuesRouter from './routes/issues.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// 健康检查 + 当前配置状态
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    repo: config.owner && config.repo ? `${config.owner}/${config.repo}` : '未配置',
    configured: !!(config.token && config.owner && config.repo),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/issues', issuesRouter);

// 统一错误处理
app.use((err, req, res, _next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(config.port, () => {
  console.log(`\n🚀 GitHub Issues 管理服务已启动`);
  console.log(`   地址：http://localhost:${config.port}`);
  console.log(`   仓库：${config.owner || '未配置'}/${config.repo || '未配置'}`);
  console.log(`   健康检查：http://localhost:${config.port}/api/health\n`);
});
