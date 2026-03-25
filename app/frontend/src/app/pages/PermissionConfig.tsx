import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import {
  getRolePermissions,
  getRoles,
  updateRolePermissions,
  type RoleListItem,
} from "../api/admin";
import { getCurrentUserMenus, type CurrentUserMenu } from "../api/auth";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { ScrollArea } from "../components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

type OperationNode = {
  permission: string;
  name: string;
};

type PageNode = {
  id: string;
  name: string;
  operations: OperationNode[];
};

type ModuleNode = {
  id: string;
  name: string;
  pages: PageNode[];
};

function normalizeMenuTree(tree: CurrentUserMenu[]): ModuleNode[] {
  const modules: ModuleNode[] = [];

  const collectOperations = (nodes: CurrentUserMenu[]): OperationNode[] => {
    const items: OperationNode[] = [];
    nodes.forEach((node) => {
      if (node.permission && node.type === 3) {
        items.push({
          permission: node.permission,
          name: node.name,
        });
      }
      if (Array.isArray(node.children) && node.children.length > 0) {
        items.push(...collectOperations(node.children));
      }
    });
    return items;
  };

  tree.forEach((module) => {
    const pages: PageNode[] = [];
    if (Array.isArray(module.children) && module.children.length > 0) {
      module.children.forEach((page) => {
        const pageOperations = collectOperations([page]);
        pages.push({
          id: String(page.id),
          name: page.name,
          operations: pageOperations,
        });
      });
    } else {
      pages.push({
        id: String(module.id),
        name: module.name,
        operations: collectOperations([module]),
      });
    }
    modules.push({
      id: String(module.id),
      name: module.name,
      pages,
    });
  });

  return modules;
}

export default function PermissionConfig() {
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [modules, setModules] = useState<ModuleNode[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === selectedRoleId),
    [roles, selectedRoleId],
  );
  const isSystemAdminRole = useMemo(() => {
    if (!selectedRole) return false;
    return (
      selectedRole.name === "系统管理员" ||
      selectedRole.code === "system_admin" ||
      (selectedRole.is_system_preset && selectedRole.code.includes("system"))
    );
  }, [selectedRole]);

  const permissionCount = useMemo(() => {
    return modules.reduce(
      (total, module) => total + module.pages.reduce((count, page) => count + page.operations.length, 0),
      0,
    );
  }, [modules]);

  const selectedCount = permissions.size;

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
  };

  const togglePermission = (permission: string) => {
    if (isSystemAdminRole) return;
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
  };

  const togglePage = (page: PageNode) => {
    if (isSystemAdminRole) return;
    const allChecked =
      page.operations.length > 0 && page.operations.every((op) => permissions.has(op.permission));
    setPermissions((prev) => {
      const next = new Set(prev);
      page.operations.forEach((op) => {
        if (allChecked) {
          next.delete(op.permission);
        } else {
          next.add(op.permission);
        }
      });
      return next;
    });
  };

  const toggleModule = (module: ModuleNode) => {
    if (isSystemAdminRole) return;
    const moduleOperations = module.pages.flatMap((page) => page.operations);
    const allChecked =
      moduleOperations.length > 0 && moduleOperations.every((op) => permissions.has(op.permission));
    setPermissions((prev) => {
      const next = new Set(prev);
      moduleOperations.forEach((op) => {
        if (allChecked) {
          next.delete(op.permission);
        } else {
          next.add(op.permission);
        }
      });
      return next;
    });
  };

  const loadInitData = async () => {
    // 模块/操作权限来源：以当前账号的 `auth/menus` 为准（与后端菜单树结构一致）
    const [roleData, menus] = await Promise.all([
      getRoles({ page: 1, per_page: 100 }),
      getCurrentUserMenus(),
    ]);
    setRoles(roleData.list);
    if (roleData.list.length > 0) {
      setSelectedRoleId(String(roleData.list[0].id));
    }
    const normalized = normalizeMenuTree(menus);
    setModules(normalized);
    setExpandedModules(normalized.slice(0, 2).map((item) => item.id));
  };

  const loadRolePermissions = async (roleId: number) => {
    const data = await getRolePermissions(roleId);
    const next = new Set(data.permissions);
    setPermissions(next);
    setInitialPermissions(new Set(next));
  };

  useEffect(() => {
    setLoading(true);
    loadInitData()
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "权限配置初始化失败");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);
    loadRolePermissions(Number(selectedRoleId))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "角色权限加载失败");
      })
      .finally(() => setLoading(false));
  }, [selectedRoleId]);

  // 系统管理员角色由后端 `getRolePermissions` 返回全部 type=3 权限，不在此页面用模块列表覆盖

  const handleReset = () => {
    if (isSystemAdminRole) return;
    setPermissions(new Set(initialPermissions));
    toast.success("已重置为当前角色原始权限");
  };

  const handleSave = async () => {
    if (!selectedRoleId || isSystemAdminRole) return;
    try {
      setSaving(true);
      await updateRolePermissions(Number(selectedRoleId), Array.from(permissions));
      setInitialPermissions(new Set(permissions));
      toast.success("权限配置已保存");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "权限配置保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#000000d9]">选择角色：</span>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="w-64 border-[#d9d9d9] focus:ring-[#1890ff]">
                <SelectValue placeholder="请选择角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-[#d9d9d9]"
              onClick={handleReset}
              disabled={saving || loading || isSystemAdminRole}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
            <Button
              className="bg-[#1890ff] hover:bg-[#40a9ff]"
              onClick={handleSave}
              disabled={!selectedRoleId || saving || loading || isSystemAdminRole}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSystemAdminRole ? "系统管理员默认全权限" : saving ? "保存中..." : "保存配置"}
            </Button>
          </div>
        </div>
        {isSystemAdminRole && (
          <div className="mt-3 text-xs text-[#fa8c16]">
            系统管理员为内置最高权限角色，默认拥有全部权限，禁止在此页面修改。
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-340px)]">
        <div className="w-80 border-r border-[#e8e8e8]">
          <div className="p-4 bg-[#fafafa] border-b border-[#e8e8e8]">
            <h3 className="text-sm font-medium text-[#000000d9]">模块列表</h3>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-2">
              {modules.map((module) => {
                const moduleOperations = module.pages.flatMap((page) => page.operations);
                const moduleChecked =
                  moduleOperations.length > 0 && moduleOperations.every((op) => permissions.has(op.permission));
                return (
                  <div key={module.id} className="mb-1">
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#f5f5f5] cursor-pointer"
                      onClick={() => toggleModuleExpand(module.id)}
                    >
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="h-4 w-4 text-[#00000073]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#00000073]" />
                      )}
                      <Checkbox
                        checked={moduleChecked}
                        onCheckedChange={() => toggleModule(module)}
                        disabled={isSystemAdminRole}
                        onClick={(event) => event.stopPropagation()}
                      />
                      <span className="text-sm cursor-pointer flex-1">{module.name}</span>
                    </div>
                    {expandedModules.includes(module.id) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {module.pages.map((page) => {
                          const pageChecked =
                            page.operations.length > 0 && page.operations.every((op) => permissions.has(op.permission));
                          return (
                            <div key={page.id} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#f5f5f5]">
                              <Checkbox checked={pageChecked} onCheckedChange={() => togglePage(page)} disabled={isSystemAdminRole} />
                              <span className="text-sm text-[#00000073] cursor-pointer flex-1">{page.name}</span>
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

        <div className="flex-1">
          <div className="p-4 bg-[#fafafa] border-b border-[#e8e8e8] flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#000000d9]">操作权限</h3>
            <span className="text-xs text-[#00000073]">已选 {selectedCount} / {permissionCount}</span>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-6">
              {loading ? (
                <div className="text-[#00000073]">加载中...</div>
              ) : (
                <div className="space-y-6">
                  {modules
                    .filter((module) => expandedModules.includes(module.id))
                    .map((module) => (
                      <div key={module.id} className="border border-[#e8e8e8] rounded-lg">
                        <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8]">
                          <h4 className="text-sm font-medium text-[#000000d9]">{module.name}</h4>
                        </div>
                        <div className="p-4">
                          {module.pages.map((page) => (
                            <div key={page.id} className="flex items-start gap-4 py-3 border-b border-[#f0f0f0] last:border-0">
                              <div className="w-40 text-sm text-[#000000d9]">{page.name}</div>
                              <div className="flex items-center gap-6 flex-1 flex-wrap">
                                {page.operations.length === 0 ? (
                                  <span className="text-sm text-[#00000073]">暂无操作项</span>
                                ) : (
                                  page.operations.map((op) => (
                                    <div key={op.permission} className="flex items-center gap-2">
                                      <Checkbox
                                        id={op.permission}
                                        checked={permissions.has(op.permission)}
                                        onCheckedChange={() => togglePermission(op.permission)}
                                        disabled={isSystemAdminRole}
                                      />
                                      <label htmlFor={op.permission} className="text-sm text-[#00000073] cursor-pointer">
                                        {op.name}
                                      </label>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  <div className="border border-[#e8e8e8] rounded-lg">
                    <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e8e8e8]">
                      <h4 className="text-sm font-medium text-[#000000d9]">数据范围</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="scope-all" disabled />
                        <label htmlFor="scope-all" className="text-sm text-[#00000073]">全部数据</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="scope-org" disabled />
                        <label htmlFor="scope-org" className="text-sm text-[#00000073]">所属组织数据</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="scope-project" defaultChecked disabled />
                        <label htmlFor="scope-project" className="text-sm text-[#00000073]">所属项目数据</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="scope-self" disabled />
                        <label htmlFor="scope-self" className="text-sm text-[#00000073]">本人创建数据</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
