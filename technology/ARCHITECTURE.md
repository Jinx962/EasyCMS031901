# 阶段一技术架构摘要

## 1. 架构模式

当前阶段采用**前后端分离单体架构**：
- 前端：React SPA，通过 RESTful API 与后端通信
- 后端：Laravel 10 单体应用
- 数据层：MySQL 8 + Redis 7

架构目标：
- 安全：Bearer Token 鉴权 + 后端实时权限校验
- 可维护：Controller / Service / Repository / Action 分层
- 可追溯：关键后台操作写入审计日志
- 可扩展：后续内容中心、周期管理等模块可复用后台治理底座

## 2. 前端架构约束

- 继续使用 `app/frontend/` 现有工程
- 路由由 React Router 统一管理
- 页面放在 `src/app/pages/`
- 公共组件放在 `src/app/components/`
- UI 实现以 `ui/后台管理设计 (Community) (1)/` 为准
- 当前阶段前端以真实接口对接替换 mock 数据为主

## 3. 后端架构约束

后端目录按 Laravel 10 规范组织，并采用以下分层：
- Controller：接收请求、返回响应
- FormRequest：参数校验和权限预校验
- Service：业务编排和事务边界
- Action：单一原子动作
- Repository：数据访问封装
- Resource：响应格式化
- Event / Listener：审计日志等副作用解耦

当前阶段建议核心模块：
- `Auth`
- `Admin/User`
- `Admin/Role`
- `Admin/Menu`
- `Admin/AuditLog`

## 4. 认证与权限

- 认证：Laravel Sanctum Bearer Token
- Token 有效期：8 小时
- 权限模型：RBAC
- 权限标识统一采用 `模块:资源:动作`
- 后端每次请求都进行权限校验，不依赖前端显隐

## 5. 数据与基础设施

- MySQL：核心业务数据
- Redis：缓存、限流、队列
- Nginx：静态资源托管 + API 反向代理
- Docker Compose：本地开发环境统一
- Supervisor：后续异步任务进程管理

## 6. 当前阶段不落地的能力

- 消息中心
- 通知配置
- 系统参数页
- 数据范围过滤逻辑
- 忘记密码 / 邮件激活

这些能力可保留模型字段或界面原型，但不作为阶段一正式交付。
