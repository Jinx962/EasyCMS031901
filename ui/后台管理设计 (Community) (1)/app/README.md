# GitHub Issues 管理工具

## 目录结构

```
app/
├── src/                    # Node.js 后端（主要功能）
│   ├── index.js            # Express 服务入口
│   ├── config.js           # 读取 .env 配置
│   └── routes/
│       └── issues.js       # Issues 相关路由
├── client/                 # React 前端（快速查看）
│   ├── src/
│   │   ├── config.ts       # ← 在这里配置 Octokit
│   │   ├── App.tsx         # 主界面
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── index.html
├── .env                    # 后端环境变量（自行创建，不提交）
└── .env.example            # 环境变量模板
```

---

## 快速开始

### 第一步：配置后端 `.env`

```bash
cd app
cp .env.example .env
# 编辑 .env，填写你的 GitHub Token 和仓库信息
```

### 第二步：启动后端

```bash
cd app
npm install
npm run dev
# 服务运行在 http://localhost:3001
```

### 第三步：配置前端 `config.ts`

编辑 `app/client/src/config.ts`：

```ts
export const githubConfig = {
  auth: 'ghp_xxxxxxxx',    // 你的 Token
  owner: 'your-username',   // 你的 GitHub 用户名
  repo: 'your-repo',        // 仓库名
};
```

### 第四步：启动前端

```bash
cd app/client
npm install
npm run dev
# 页面运行在 http://localhost:5173
```

---

## 后端 API 一览

| 方法     | 路径                            | 说明                              |
| -------- | ------------------------------- | --------------------------------- |
| `GET`    | `/api/health`                   | 健康检查 + 配置状态               |
| `GET`    | `/api/issues`                   | 获取 Issue 列表                   |
| `GET`    | `/api/issues/:number`           | 获取单个 Issue                    |
| `PATCH`  | `/api/issues/:number`           | 更新 Issue（状态/标题/内容/标签） |
| `POST`   | `/api/issues/:number/close`     | 关闭 Issue                        |
| `POST`   | `/api/issues/:number/reopen`    | 重新打开 Issue                    |
| `GET`    | `/api/issues/:number/comments`  | 获取评论列表                      |
| `POST`   | `/api/issues/:number/comments`  | 添加评论                          |
| `GET`    | `/api/issues/meta/labels`       | 获取仓库所有 Label                |

### 查询参数（GET /api/issues）

| 参数        | 默认值      | 说明                              |
| ----------- | ----------- | --------------------------------- |
| `state`     | `open`      | `open` / `closed` / `all`        |
| `per_page`  | `30`        | 每页数量（最大 100）              |
| `page`      | `1`         | 页码                              |
| `labels`    | -           | 按标签过滤，逗号分隔              |
| `sort`      | `created`   | `created` / `updated` / `comments`|
| `direction` | `desc`      | `asc` / `desc`                   |

### 更新 Issue（PATCH /api/issues/:number）

```json
{
  "state": "closed",
  "title": "新标题",
  "body": "新内容",
  "labels": ["bug", "enhancement"],
  "assignees": ["username"]
}
```

---

## 注意事项

- **Token 安全**：后端的 `.env` 文件不要提交到 Git；前端的 `config.ts` 仅供本地开发使用，不要部署到生产环境。
- **前端代理**：前端通过 Vite 的 `proxy` 将 `/api/*` 请求转发到后端，开发时无需处理跨域问题。
- **前端直连**：`config.ts` 中也初始化了 `octokit` 实例，如果后端未启动，前端可直接调用 GitHub API（需要在 `App.tsx` 中切换调用方式）。
