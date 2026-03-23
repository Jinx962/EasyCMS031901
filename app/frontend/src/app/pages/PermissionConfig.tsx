import { useState, useCallback } from "react";
import { ChevronRight, ChevronDown, Save, RotateCcw, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { ScrollArea } from "../components/ui/scroll-area";

interface PageNode {
  id: string;
  name: string;
}

interface ModuleNode {
  id: string;
  name: string;
  children: PageNode[];
}

const permissionTree: ModuleNode[] = [
  {
    id: "workbench", name: "工作台",
    children: [
      { id: "workbench-dashboard", name: "工作台首页" },
      { id: "workbench-status", name: "状态清单" },
    ],
  },
  {
    id: "content", name: "内容中心",
    children: [
      { id: "content-list", name: "内容列表" },
      { id: "content-detail", name: "内容详情" },
      { id: "content-import", name: "导入历史" },
      { id: "content-review", name: "签核管理" },
    ],
  },
  {
    id: "cycle", name: "周期管理",
    children: [
      { id: "cycle-list", name: "周期列表" },
      { id: "cycle-detail", name: "周期详情" },
      { id: "cycle-lock", name: "周期锁定" },
    ],
  },
  {
    id: "report", name: "报表中心",
    children: [
      { id: "report-content", name: "内容报表" },
      { id: "report-quality", name: "质量报表" },
      { id: "report-export", name: "导出报表" },
    ],
  },
  {
    id: "config", name: "配置中心",
    children: [
      { id: "config-profile", name: "配置档管理" },
      { id: "config-category", name: "分类集管理" },
      { id: "config-media", name: "媒体配置" },
    ],
  },
  {
    id: "admin", name: "后台管理",
    children: [
      { id: "admin-user", name: "用户管理" },
      { id: "admin-role", name: "角色管理" },
      { id: "admin-permission", name: "权限配置" },
      { id: "admin-audit", name: "审计日志" },
      { id: "admin-notification", name: "通知配置" },
    ],
  },
];

const actions = [
  { id: "view", name: "查看" },
  { id: "create", name: "新建" },
  { id: "edit", name: "编辑" },
  { id: "delete", name: "删除" },
  { id: "import", name: "导入" },
  { id: "export", name: "导出" },
  { id: "approve", name: "审批" },
  { id: "unlock", name: "解锁" },
];

// permissions 格式：{pageId}-{actionId}
type PermissionKey = string;

// 预置权限：内容运营角色
const defaultPermissions = new Set<PermissionKey>([
  "workbench-dashboard-view", "workbench-status-view",
  "content-list-view", "content-list-create", "content-list-edit",
  "content-detail-view", "content-detail-edit",
  "content-import-view", "content-import-import",
]);

export default function PermissionConfig() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["content", "admin"]));
  const [selectedRole, setSelectedRole] = useState("content-operator");
  const [permissions, setPermissions] = useState<Set<PermissionKey>>(new Set(defaultPermissions));
  const [selectedPage, setSelectedPage] = useState<string | null>("content-list");
  const [dataScope, setDataScope] = useState<Set<string>>(new Set(["scope-project"]));

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // 判断模块下是否所有页面都被访问权限勾选
  const isModuleAllChecked = (module: ModuleNode) =>
    module.children.every((p) => permissions.has(`${p.id}-view`));

  const isModuleSomeChecked = (module: ModuleNode) =>
    module.children.some((p) => permissions.has(`${p.id}-view`));

  // 模块级 checkbox：勾选/取消全部子页面的 view 权限
  const toggleModuleCheck = useCallback((module: ModuleNode) => {
    const allChecked = isModuleAllChecked(module);
    setPermissions((prev) => {
      const next = new Set(prev);
      module.children.forEach((p) => {
        if (allChecked) {
          // 取消模块：移除该模块所有页面的所有权限
          actions.forEach((a) => next.delete(`${p.id}-${a.id}`));
        } else {
          // 勾选模块：至少添加 view 权限
          next.add(`${p.id}-view`);
        }
      });
      return next;
    });
    // 展开模块
    if (!expandedModules.has(module.id)) {
      setExpandedModules((prev) => new Set([...prev, module.id]));
    }
  }, [permissions, expandedModules]);

  // 页面级 checkbox：勾选/取消单个页面的 view 权限（并联动右侧）
  const togglePageCheck = useCallback((pageId: string) => {
    const key = `${pageId}-view`;
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // 取消 view 时，清除该页面所有操作权限
        actions.forEach((a) => next.delete(`${pageId}-${a.id}`));
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // 操作权限 checkbox
  const toggleActionCheck = useCallback((pageId: string, actionId: string) => {
    const key = `${pageId}-${actionId}`;
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        // 勾选任何操作权限时，自动加上 view
        next.add(`${pageId}-view`);
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleDataScope = (scopeId: string) => {
    setDataScope((prev) => {
      const next = new Set(prev);
      if (next.has(scopeId)) next.delete(scopeId);
      else next.add(scopeId);
      return next;
    });
  };

  const handleSave = () => {
    toast.success("权限配置已保存");
  };

  const handleReset = () => {
    setPermissions(new Set(defaultPermissions));
    setDataScope(new Set(["scope-project"]));
    toast.info("已重置为默认配置");
  };

  // 右侧只展示已展开模块
  const visibleModules = permissionTree.filter((m) => expandedModules.has(m.id));

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 顶部工具栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#000000d9]">选择角色：</span>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-64 border-[#d9d9d9] focus:ring-[#1890ff]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system-admin">系统管理员</SelectItem>
                <SelectItem value="project-admin">项目管理员</SelectItem>
                <SelectItem value="content-operator">内容运营</SelectItem>
                <SelectItem value="reviewer">审核人员</SelectItem>
                <SelectItem value="publisher">发布人员</SelectItem>
                <SelectItem value="readonly">只读用户</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#d9d9d9]" onClick={() => toast.info("请选择要复制的来源角色")}>
              <Copy className="h-4 w-4 mr-2" />
              复制自其他角色
            </Button>
            <Button variant="outline" className="border-[#d9d9d9]" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
            <Button className="bg-[#1890ff] hover:bg-[#40a9ff]" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </Button>
          </div>
        </div>
      </div>

      {/* 权限配置区域 */}
      <div className="flex h-[calc(100vh-340px)]">
        {/* 左侧模块树 */}
        <div className="w-72 border-r border-[#e8e8e8] flex-shrink-0">
          <div className="p-4 bg-[#fafafa] border-b border-[#e8e8e8]">
            <h3 className="text-sm font-medium text-[#000000d9]">模块列表</h3>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-2">
              {permissionTree.map((module) => {
                const allChecked = isModuleAllChecked(module);
                const someChecked = isModuleSomeChecked(module);
                return (
                  <div key={module.id} className="mb-1">
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#f5f5f5] cursor-pointer select-none"
                      onClick={() => toggleModule(module.id)}
                    >
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="h-4 w-4 text-[#00000073] flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#00000073] flex-shrink-0" />
                      )}
                      <Checkbox
                        id={`module-${module.id}`}
                        checked={allChecked}
                        data-state={someChecked && !allChecked ? "indeterminate" : undefined}
                        onCheckedChange={(e) => { e.stopPropagation?.(); toggleModuleCheck(module); }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0"
                      />
                      <label
                        htmlFor={`module-${module.id}`}
                        className="text-sm cursor-pointer flex-1 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {module.name}
                      </label>
                    </div>
                    {expandedModules.has(module.id) && (
                      <div className="ml-7 mt-1 space-y-0.5">
                        {module.children.map((page) => {
                          const isChecked = permissions.has(`${page.id}-view`);
                          const isSelected = selectedPage === page.id;
                          return (
                            <div
                              key={page.id}
                              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer select-none ${
                                isSelected ? "bg-[#e6f4ff]" : "hover:bg-[#f5f5f5]"
                              }`}
                              onClick={() => setSelectedPage(page.id)}
                            >
                              <Checkbox
                                id={`page-${page.id}`}
                                checked={isChecked}
                                onCheckedChange={() => togglePageCheck(page.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-shrink-0"
                              />
                              <label
                                htmlFor={`page-${page.id}`}
                                className={`text-sm cursor-pointer flex-1 ${isChecked ? "text-[#000000d9]" : "text-[#00000073]"}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {page.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* 右侧权限矩阵 */}
        <div className="flex-1 min-w-0">
          <div className="p-4 bg-[#fafafa] border-b border-[#e8e8e8]">
            <h3 className="text-sm font-medium text-[#000000d9]">操作权限矩阵</h3>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-6">
              {visibleModules.length === 0 ? (
                <div className="text-center text-[#00000073] py-12">
                  请在左侧展开模块以配置操作权限
                </div>
              ) : (
                <div className="space-y-6">
                  {visibleModules.map((module) => (
                    <div key={module.id} className="border border-[#e8e8e8] rounded-lg">
                      <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8]">
                        <h4 className="text-sm font-medium text-[#000000d9]">{module.name}</h4>
                      </div>
                      <div className="p-4">
                        {module.children.map((page) => {
                          const hasView = permissions.has(`${page.id}-view`);
                          return (
                            <div
                              key={page.id}
                              className={`flex items-start gap-4 py-3 border-b border-[#f0f0f0] last:border-0 rounded px-2 transition-colors ${
                                selectedPage === page.id ? "bg-[#e6f4ff]" : ""
                              }`}
                              onClick={() => setSelectedPage(page.id)}
                            >
                              <div className="w-32 text-sm text-[#000000d9] pt-0.5 flex-shrink-0">
                                {page.name}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 flex-1">
                                {actions.map((action) => {
                                  const key = `${page.id}-${action.id}`;
                                  const checked = permissions.has(key);
                                  const disabled = !hasView && action.id !== "view";
                                  return (
                                    <div key={action.id} className="flex items-center gap-1.5">
                                      <Checkbox
                                        id={key}
                                        checked={checked}
                                        disabled={disabled}
                                        onCheckedChange={() => toggleActionCheck(page.id, action.id)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <label
                                        htmlFor={key}
                                        className={`text-xs cursor-pointer ${
                                          disabled ? "text-[#d9d9d9]" : checked ? "text-[#000000d9]" : "text-[#00000073]"
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {action.name}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 数据范围配置 */}
              <div className="mt-6 border border-[#e8e8e8] rounded-lg">
                <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8]">
                  <h4 className="text-sm font-medium text-[#000000d9]">数据范围</h4>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { id: "scope-all", label: "全部数据" },
                    { id: "scope-org", label: "所属组织数据" },
                    { id: "scope-project", label: "所属项目数据" },
                    { id: "scope-self", label: "本人创建数据" },
                  ].map((scope) => (
                    <div key={scope.id} className="flex items-center gap-2">
                      <Checkbox
                        id={scope.id}
                        checked={dataScope.has(scope.id)}
                        onCheckedChange={() => toggleDataScope(scope.id)}
                      />
                      <label htmlFor={scope.id} className="text-sm cursor-pointer">
                        {scope.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
