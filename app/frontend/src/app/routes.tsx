import { createBrowserRouter } from "react-router";
import AdminLayout from "./components/AdminLayout";
import UserManagement from "./pages/UserManagement";
import UserDetail from "./pages/UserDetail";
import RoleManagement from "./pages/RoleManagement";
import RoleDetail from "./pages/RoleDetail";
import PermissionConfig from "./pages/PermissionConfig";
import AuditLog from "./pages/AuditLog";
import NotificationConfig from "./pages/NotificationConfig";
import SystemParams from "./pages/SystemParams";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AdminLayout,
    children: [
      { index: true, Component: UserManagement },
      { path: "users", Component: UserManagement },
      { path: "users/:id", Component: UserDetail },
      { path: "roles", Component: RoleManagement },
      { path: "roles/:id", Component: RoleDetail },
      { path: "permissions", Component: PermissionConfig },
      { path: "audit-log", Component: AuditLog },
      { path: "notifications", Component: NotificationConfig },
      { path: "system-params", Component: SystemParams },
      { path: "*", Component: NotFound },
    ],
  },
]);
