# 后端进度 — 阶段一

> **维护方**：后端开发者 / 负责后端的 AI
> **更新规则**：每次后端有实质进展或阻塞时更新本文件；阶段完成时通知整合方更新 `CURRENT_PROGRESS.md` 的状态列。
> 本阶段完整任务定义见 [`OVERVIEW.md`](./OVERVIEW.md)。

---

## 本阶段任务

| 状态 | 项 |
|------|----|
| 已完成 | |
| 待完成 | 后端项目脚手架初始化（`app/backend/`，Laravel 10） |
| 待完成 | 数据库 Schema：User、Role、Permission、Menu、AuditLog |
| 待完成 | Sanctum Bearer Token 鉴权（登录签发 Token、请求校验 Token） |
| 待完成 | 认证 API：`POST /api/v1/auth/login`、`POST /api/v1/auth/logout`、`POST /api/v1/auth/change-password`、`GET /api/v1/auth/me`、`GET /api/v1/auth/menus` |
| 待完成 | 用户管理 CRUD API：`/api/v1/admin/users` |
| 待完成 | 角色管理 CRUD / 复制 / 状态切换 API：`/api/v1/admin/roles` |
| 待完成 | 菜单管理 API：`/api/v1/admin/menus` 与菜单树接口 |
| 待完成 | 权限配置 API：`PUT /api/v1/admin/roles/{id}/permissions` |
| 待完成 | 审计日志列表与详情 API：`/api/v1/admin/audit-logs` |
| 待完成 | 接口级权限拦截与只读角色策略 |
| 存在问题 | 代码尚未开始，但需求、技术架构和接口基线已明确；当前应严格以 `technology/API_SPEC.md` 为准，不再使用旧的 JWT / `/api/auth/*` 口径 |

---

*更新时请注明日期，例如：YYYY-MM-DD 完成 User Schema 定义。*
