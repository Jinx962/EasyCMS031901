// ================================================
// GitHub 配置 - 修改此处设置你的 GitHub 连接信息
// ================================================

import { Octokit } from '@octokit/rest';

export const githubConfig = {
  // 你的 GitHub Personal Access Token
  // 生成地址：https://github.com/settings/tokens
  // 所需权限：repo（私有仓库）或 public_repo（公开仓库）
  auth: import.meta.env.VITE_GITHUB_TOKEN || '',

  // GitHub 用户名或组织名
  owner: 'Jinx962',

  // 仓库名称
  repo: 'issues-manager-test',
};

// ================================================
// Octokit 实例（前端直接调用 GitHub API）
// ================================================
export const octokit = new Octokit({
  auth: githubConfig.auth,
});

// ================================================
// 后端 API 地址（前端通过 vite proxy 调用后端）
// 后端负责的接口同样可以通过 /api/* 路径访问
// ================================================
export const API_BASE_URL = '/api';
