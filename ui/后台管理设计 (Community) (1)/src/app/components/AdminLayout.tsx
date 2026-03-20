import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  Users,
  Shield,
  Key,
  FileText,
  Bell,
  Settings,
  Menu,
  Search,
  ChevronRight,
  Home,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

const menuItems = [
  { path: "/users", label: "用户管理", icon: Users },
  { path: "/roles", label: "角色管理", icon: Shield },
  { path: "/permissions", label: "权限配置", icon: Key },
  { path: "/audit-log", label: "审计日志", icon: FileText },
  { path: "/notifications", label: "通知配置", icon: Bell },
  { path: "/system-params", label: "系统参数", icon: Settings },
];

const topNavItems = [
  { key: "workbench", label: "工作台" },
  { key: "content", label: "内容中心" },
  { key: "cycle", label: "周期管理" },
  { key: "report", label: "报表中心" },
  { key: "config", label: "配置中心" },
  { key: "admin", label: "后台管理", active: true },
  { key: "editor", label: "编排工具" },
  { key: "help", label: "帮助中心" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "后台管理", path: "/" }];

    if (paths.length > 0) {
      const menuItem = menuItems.find((item) => item.path.includes(paths[0]));
      if (menuItem) {
        breadcrumbs.push({ label: menuItem.label, path: menuItem.path });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-[#e8e8e8]">
        <div className="flex items-center h-12 px-6 gap-6">
          {topNavItems.map((item) => (
            <button
              key={item.key}
              className={`text-sm px-3 py-2 transition-colors ${
                item.active
                  ? "text-[#1890ff] border-b-2 border-[#1890ff] -mb-[1px]"
                  : "text-[#000000d9] hover:text-[#1890ff]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[calc(100vh-49px)]">
        {/* 左侧菜单 */}
        <div
          className={`bg-[#001529] transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#ffffff1a]">
            {!collapsed && (
              <h1 className="text-white text-lg font-medium">后台管理</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#ffffff1a]"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-113px)]">
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <Link key={item.path} to={item.path}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                        isActive
                          ? "bg-[#1890ff] text-white"
                          : "text-[#ffffffa6] hover:bg-[#ffffff1a] hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 面包屑和搜索栏 */}
          <div className="bg-white border-b border-[#e8e8e8] px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">
                        <Home className="h-4 w-4" />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00000073]" />
              <Input
                placeholder="搜索用户、角色、权限..."
                className="pl-10 bg-[#fafafa] border-[#d9d9d9] focus-visible:ring-[#1890ff]"
              />
            </div>
          </div>

          {/* 页面内容 */}
          <ScrollArea className="flex-1 bg-[#f5f5f5]">
            <div className="p-6">
              <Outlet />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
