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
| 图标 | lucide-react | 0.487.x | |
| Toast 通知 | sonner | 2.x | |
| 包管理 | npm | — | 锁文件 `package-lock.json` 提交仓库 |

### 前端目录约定

```
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

## 后端（`app/backend/`）—— 待定

> 后端技术选型尚未确定，待需求澄清后补充。占位字段如下：

| 类别 | 选型 | 版本 | 说明 |
|------|------|------|------|
| 语言/运行时 | — | — | 待定 |
| Web 框架 | — | — | 待定 |
| 数据库 | — | — | 待定 |
| ORM | — | — | 待定 |
| 鉴权 | — | — | 待定（JWT / Session） |
| 包管理 | — | — | 待定 |

---

## 共享约定

| 项目 | 约定 |
|------|------|
| API 风格 | RESTful（路径小写 + 连字符） |
| 鉴权方式 | JWT（Bearer Token，待后端实现） |
| 日期格式 | ISO 8601：`YYYY-MM-DDTHH:mm:ssZ` |
| 字符编码 | UTF-8 |
| 环境变量 | 前端用 `VITE_` 前缀；后端用 `.env`；均不提交仓库 |

---

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|---------|--------|
| 2026-03-20 | 初始化前端技术选型（Vite + React 18 + TS + TailwindCSS 4 + shadcn/ui） | AI |
