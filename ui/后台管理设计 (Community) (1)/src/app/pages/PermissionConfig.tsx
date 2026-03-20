import { useState } from "react";
import { ChevronRight, ChevronDown, Save, RotateCcw } from "lucide-react";
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

const permissionTree = [
  {
    id: "workbench",
    name: "工作台",
    children: [
      { id: "workbench-dashboard", name: "工作台首页" },
      { id: "workbench-status", name: "状态清单" },
    ],
  },
  {
    id: "content",
    name: "内容中心",
    children: [
      { id: "content-list", name: "内容列表" },
      { id: "content-detail", name: "内容详情" },
      { id: "content-import", name: "导入历史" },
      { id: "content-review", name: "签核管理" },
    ],
  },
  {
    id: "cycle",
    name: "周期管理",
    children: [
      { id: "cycle-list", name: "周期列表" },
      { id: "cycle-detail", name: "周期详情" },
      { id: "cycle-lock", name: "周期锁定" },
    ],
  },
  {
    id: "report",
    name: "报表中心",
    children: [
      { id: "report-content", name: "内容报表" },
      { id: "report-quality", name: "质量报表" },
      { id: "report-export", name: "导出报表" },
    ],
  },
  {
    id: "config",
    name: "配置中心",
    children: [
      { id: "config-profile", name: "配置档管理" },
      { id: "config-category", name: "分类集管理" },
      { id: "config-media", name: "媒体配置" },
    ],
  },
  {
    id: "admin",
    name: "后台管理",
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

export default function PermissionConfig() {
  const [expandedModules, setExpandedModules] = useState<string[]>(["content", "admin"]);
  const [selectedRole, setSelectedRole] = useState("content-operator");

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

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
            <Button variant="outline" className="border-[#d9d9d9]">
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
            <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </Button>
          </div>
        </div>
      </div>

      {/* 权限配置区域 */}
      <div className="flex h-[calc(100vh-340px)]">
        {/* 左侧模块树 */}
        <div className="w-80 border-r border-[#e8e8e8]">
          <div className="p-4 bg-[#fafafa] border-b border-[#e8e8e8]">
            <h3 className="text-sm font-medium text-[#000000d9]">模块列表</h3>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-2">
              {permissionTree.map((module) => (
                <div key={module.id} className="mb-1">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#f5f5f5] cursor-pointer"
                    onClick={() => toggleModule(module.id)}
                  >
                    {expandedModules.includes(module.id) ? (
                      <ChevronDown className="h-4 w-4 text-[#00000073]" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#00000073]" />
                    )}
                    <Checkbox id={`module-${module.id}`} />
                    <label
                      htmlFor={`module-${module.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {module.name}
                    </label>
                  </div>
                  {expandedModules.includes(module.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {module.children.map((page) => (
                        <div
                          key={page.id}
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#f5f5f5]"
                        >
                          <Checkbox id={`page-${page.id}`} />
                          <label
                            htmlFor={`page-${page.id}`}
                            className="text-sm text-[#00000073] cursor-pointer flex-1"
                          >
                            {page.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 右侧权限矩阵 */}
        <div className="flex-1">
          <div className="p-4 bg-[#fafafa] border-b border-[#e8e8e8]">
            <h3 className="text-sm font-medium text-[#000000d9]">操作权限</h3>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-6">
              <div className="space-y-6">
                {permissionTree
                  .filter((module) => expandedModules.includes(module.id))
                  .map((module) => (
                    <div key={module.id} className="border border-[#e8e8e8] rounded-lg">
                      <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8]">
                        <h4 className="text-sm font-medium text-[#000000d9]">
                          {module.name}
                        </h4>
                      </div>
                      <div className="p-4">
                        {module.children.map((page) => (
                          <div
                            key={page.id}
                            className="flex items-center gap-4 py-3 border-b border-[#f0f0f0] last:border-0"
                          >
                            <div className="w-40 text-sm text-[#000000d9]">
                              {page.name}
                            </div>
                            <div className="flex items-center gap-6 flex-1">
                              {actions.map((action) => (
                                <div
                                  key={action.id}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox id={`${page.id}-${action.id}`} />
                                  <label
                                    htmlFor={`${page.id}-${action.id}`}
                                    className="text-sm text-[#00000073] cursor-pointer"
                                  >
                                    {action.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* 数据范围配置 */}
              <div className="mt-6 border border-[#e8e8e8] rounded-lg">
                <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8]">
                  <h4 className="text-sm font-medium text-[#000000d9]">
                    数据范围
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="scope-all" />
                    <label htmlFor="scope-all" className="text-sm cursor-pointer">
                      全部数据
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="scope-org" />
                    <label htmlFor="scope-org" className="text-sm cursor-pointer">
                      所属组织数据
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="scope-project" defaultChecked />
                    <label
                      htmlFor="scope-project"
                      className="text-sm cursor-pointer"
                    >
                      所属项目数据
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="scope-self" />
                    <label htmlFor="scope-self" className="text-sm cursor-pointer">
                      本人创建数据
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}