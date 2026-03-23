# 技术选型（TECH_STACK）

> 本文件是项目技术决策的唯一基准。开发前必须阅读，变更时须同步更新并写入 `memory/`。

---

## 项目类型

**前后端分离**（Frontend + Backend 独立部署）

---

## 前端（`app/frontend/`）

| 类别 | 选型 | 版本 | 说明 |
|------|------|------|------|
| 框架 | React | 18.x | 函数式组件 + Hooks |
| 构建工具 | Vite | 6.x | 开发服务器与生产构建 |
| 语言 | TypeScript | 5.x | 严格模式 |
| 路由 | React Router | 7.x | Browser Router |
| 样式 | TailwindCSS | 4.x | Utility-first CSS |
| 组件库 | shadcn/ui（Radix UI） | latest | 可复制组件，不引入额外 CSS 框架 |
| 图标 | lucide-react | 0.487.x | 与设计稿一致 |
| Toast 通知 | sonner | 2.x | 轻量消息通知 |
| 包管理 | npm | — | 锁文件 `package-lock.json` 提交仓库 |

### 前端目录约定

```text
app/frontend/
├── src/
│   ├── app/
│   │   ├── components/     # 共享组件（含 ui/ shadcn 组件）
│   │   ├── pages/          # 页面组件（与路由一一对应）
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── styles/             # 全局样式
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

---

## 后端（`app/backend/`）

| 类别 | 选型 | 版本 | 说明 |
|------|------|------|------|
| 语言/运行时 | PHP | 8.2+ | 严格类型、Laravel 官方支持版本 |
| Web 框架 | Laravel | 10.x | 单体应用，提供认证、队列、调度、事件系统 |
| 数据库 | MySQL | 8.0 | 主业务数据存储 |
| ORM | Eloquent ORM | Laravel 10 内置 | 配合 Repository 分层使用 |
| 鉴权 | Laravel Sanctum | 3.x | Bearer Token 认证，8 小时有效期 |
| 权限 | spatie/laravel-permission | latest | RBAC 角色权限管理 |
| 审计 | spatie/laravel-activitylog | latest | 审计日志能力基础设施 |
| 缓存 / 队列 | Redis | 7.x | 缓存、限流、队列 |
| Web 服务器 | Nginx | 1.24+ | 反向代理与静态资源托管 |
| 进程管理 | Supervisor | — | 管理 Laravel Queue Worker |
| 容器化 | Docker + Docker Compose | — | 本地开发与部署统一 |
| 包管理 | Composer | 2.x | PHP 依赖管理 |

### 后端目录约定

```text
app/backend/
├── app/
│   ├── Actions/
│   ├── Events/
│   ├── Exceptions/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Jobs/
│   ├── Listeners/
│   ├── Models/
│   ├── Repositories/
│   │   ├── Contracts/
│   │   └── Eloquent/
│   ├── Services/
│   └── Providers/
├── bootstrap/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
└── tests/
```

---

## 共享约定

| 项目 | 约定 |
|------|------|
| API 风格 | RESTful（路径小写 + 连字符） |
| API 前缀 | `/api/v1` |
| 鉴权方式 | Bearer Token（Laravel Sanctum） |
| 权限标识 | `模块:资源:动作`，如 `admin:users:create` |
| 日期格式 | ISO 8601：`YYYY-MM-DDTHH:mm:ssZ` |
| 字符编码 | UTF-8 |
| 环境变量 | 前端用 `VITE_` 前缀；后端用 `.env`；均不提交仓库 |

---

## 当前阶段特殊约束

- 当前阶段仅允许开发后台管理一期能力：认证、用户、角色、菜单、权限、审计日志。
- `app/frontend/` 中通知配置页、系统参数页等原型页面暂不作为阶段一正式交付范围。
- 后端接口与字段以 `technology/API_SPEC.md` 为直接基线。
- UI 实现必须以 `ui/后台管理设计 (Community) (1)/` 的设计产物为准。

---

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|---------|--------|
| 2026-03-20 | 初始化前端技术选型（Vite + React 18 + TS + TailwindCSS 4 + shadcn/ui） | AI |
| 2026-03-23 | 根据阶段一技术架构文档补齐后端技术选型，明确 Laravel 10 + MySQL 8 + Redis 7 + Sanctum 的正式执行口径 | AI |
