# 前端进度 — 阶段一

> **维护方**：前端开发者 / 负责前端的 AI
> **更新规则**：每次前端有实质进展或阻塞时更新本文件；阶段完成时通知整合方更新 `CURRENT_PROGRESS.md` 的状态列。
> 本阶段完整任务定义见 [`OVERVIEW.md`](./OVERVIEW.md)。

---

## 本阶段任务

| 状态 | 项 |
|------|----|
| 已完成 | Vite + React 18 + TypeScript 脚手架初始化（`app/frontend/`） |
| 已完成 | TailwindCSS 4 + shadcn/ui 组件库接入 |
| 已完成 | React Router 7 路由配置 |
| 已完成 | AdminLayout（顶部导航动态 active、面包屑、内容区布局） |
| 已完成 | 后台管理：用户列表、角色列表、用户详情、角色详情、权限配置、审计日志页面原型 |
| 待完成 | 登录页面（含 JWT Token 持久化） |
| 待完成 | 登出逻辑（清除 Token 并跳转登录页） |
| 待完成 | 路由守卫（未登录跳转登录页，已登录跳转首页） |
| 待完成 | 对接 `/api/v1/auth/*`、`/api/v1/admin/users`、`/api/v1/admin/roles`、`/api/v1/admin/menus/tree`、`/api/v1/admin/audit-logs` |
| 待完成 | 依据 `auth/menus` 实现菜单和按钮权限控制 |
| 存在问题 | 所有页面当前使用 mock 数据；通知配置、系统参数页已有原型，但不属于阶段一正式联调范围 |

---

*更新时请注明日期，例如：YYYY-MM-DD 完成 XXX 页面。当前阶段以 `technology/API_SPEC.md` 为接口基线。*
