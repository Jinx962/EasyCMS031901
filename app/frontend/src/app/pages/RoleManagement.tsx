import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Plus, Copy, Edit, Eye, MoreHorizontal, Users, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  userCount: number;
  status: "启用" | "停用";
  isPreset: boolean;
  updatedAt: string;
}

const initialRoles: Role[] = [
  { id: 1, name: "系统管理员", code: "SYSTEM_ADMIN", description: "拥有系统最高权限，负责用户、角色、权限管理", userCount: 3, status: "启用", isPreset: true, updatedAt: "2026-01-15 10:00:00" },
  { id: 2, name: "项目管理员", code: "PROJECT_ADMIN", description: "负责项目内用户管理和内容审核", userCount: 8, status: "启用", isPreset: true, updatedAt: "2026-02-01 09:30:00" },
  { id: 3, name: "内容运营", code: "CONTENT_OPERATOR", description: "负责内容编辑、导入和日常运营", userCount: 25, status: "启用", isPreset: true, updatedAt: "2026-02-10 14:15:00" },
  { id: 4, name: "审核人员", code: "REVIEWER", description: "负责内容签核和变更审批", userCount: 12, status: "启用", isPreset: true, updatedAt: "2026-02-15 16:00:00" },
  { id: 5, name: "发布人员", code: "PUBLISHER", description: "负责导出发布和完整性校验", userCount: 6, status: "启用", isPreset: true, updatedAt: "2026-02-20 11:20:00" },
  { id: 6, name: "只读用户", code: "READONLY_USER", description: "仅可查看内容，不允许任何修改操作", userCount: 15, status: "启用", isPreset: true, updatedAt: "2026-03-01 13:25:00" },
  { id: 7, name: "配置管理员", code: "CONFIG_ADMIN", description: "负责配置档、分类集等配置管理", userCount: 4, status: "启用", isPreset: false, updatedAt: "2026-03-10 15:30:00" },
];

const emptyForm = { name: "", code: "", description: "" };

const PAGE_SIZE = 10;

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [copySource, setCopySource] = useState<Role | null>(null);
  const [disableTarget, setDisableTarget] = useState<Role | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return roles.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && r.status === "启用") ||
        (filterStatus === "inactive" && r.status === "停用");
      return matchSearch && matchStatus;
    });
  }, [roles, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast.error("请填写角色名称和角色编码");
      return;
    }
    const newRole: Role = {
      id: Date.now(),
      name: form.name,
      code: form.code.toUpperCase(),
      description: form.description,
      userCount: 0,
      status: "启用",
      isPreset: false,
      updatedAt: new Date().toLocaleString("zh-CN").replace(/\//g, "-"),
    };
    setRoles((prev) => [newRole, ...prev]);
    setForm(emptyForm);
    setCreateOpen(false);
    toast.success("角色创建成功");
  };

  const handleCopy = (role: Role) => {
    const copied: Role = {
      ...role,
      id: Date.now(),
      name: `${role.name}（副本）`,
      code: `${role.code}_COPY`,
      isPreset: false,
      userCount: 0,
      updatedAt: new Date().toLocaleString("zh-CN").replace(/\//g, "-"),
    };
    setRoles((prev) => [copied, ...prev]);
    setCopySource(null);
    toast.success(`已复制角色：${role.name}`);
  };

  const handleDisable = (role: Role) => {
    setRoles((prev) =>
      prev.map((r) => r.id === role.id ? { ...r, status: r.status === "启用" ? "停用" : "启用" } : r)
    );
    setDisableTarget(null);
    toast.success(`已${role.status === "启用" ? "停用" : "启用"}角色：${role.name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 筛选栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="搜索角色名称/编码"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border-[#d9d9d9] focus-visible:ring-[#1890ff]"
          />
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="border-[#d9d9d9]">
              <SelectValue placeholder="角色状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">启用</SelectItem>
              <SelectItem value="inactive">停用</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建角色
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
              <TableHead className="text-[#000000d9]">角色名称</TableHead>
              <TableHead className="text-[#000000d9]">角色编码</TableHead>
              <TableHead className="text-[#000000d9]">角色说明</TableHead>
              <TableHead className="text-[#000000d9]">用户数</TableHead>
              <TableHead className="text-[#000000d9]">状态</TableHead>
              <TableHead className="text-[#000000d9]">类型</TableHead>
              <TableHead className="text-[#000000d9]">最近修改时间</TableHead>
              <TableHead className="text-[#000000d9] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#00000073]">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              paged.map((role) => (
                <TableRow key={role.id} className="hover:bg-[#fafafa]">
                  <TableCell className="font-medium">
                    <Link to={`/roles/${role.id}`} className="text-[#1890ff] hover:underline">
                      {role.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[#00000073] font-mono text-xs">{role.code}</TableCell>
                  <TableCell className="text-[#00000073] max-w-xs truncate">{role.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#00000073]" />
                      <span>{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        role.status === "启用"
                          ? "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]"
                          : "bg-[#fff1f0] text-[#ff4d4f] border-[#ffccc7]"
                      }
                    >
                      {role.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {role.isPreset ? (
                      <Badge variant="secondary" className="bg-[#f0f0f0] text-[#000000d9]">系统预置</Badge>
                    ) : (
                      <Badge variant="outline" className="border-[#d9d9d9] text-[#00000073]">自定义</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-[#00000073]">{role.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/roles/${role.id}`} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑角色
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCopySource(role)}>
                          <Copy className="h-4 w-4 mr-2" />
                          复制角色
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDisableTarget(role)}
                          className={role.status === "启用" ? "text-red-500 focus:text-red-500" : ""}
                          disabled={role.isPreset && role.status === "启用" && role.code === "SYSTEM_ADMIN"}
                        >
                          <PowerOff className="h-4 w-4 mr-2" />
                          {role.status === "启用" ? "停用角色" : "启用角色"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e8e8]">
        <div className="text-sm text-[#00000073]">
          共 {filtered.length} 条记录，第 {page} / {totalPages} 页
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} className="border-[#d9d9d9]" onClick={() => setPage((p) => p - 1)}>
            上一页
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className={p === page ? "bg-[#1890ff] text-white border-[#1890ff] hover:bg-[#40a9ff]" : "border-[#d9d9d9]"}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button variant="outline" size="sm" disabled={page >= totalPages} className="border-[#d9d9d9]" onClick={() => setPage((p) => p + 1)}>
            下一页
          </Button>
        </div>
      </div>

      {/* 新建角色弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新建角色</DialogTitle>
            <DialogDescription>创建新角色并配置权限范围</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>角色名称 <span className="text-red-500">*</span></Label>
              <Input placeholder="请输入角色名称" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border-[#d9d9d9]" />
            </div>
            <div className="grid gap-2">
              <Label>角色编码 <span className="text-red-500">*</span></Label>
              <Input placeholder="请输入角色编码（如：CONTENT_OP）" value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                className="border-[#d9d9d9]" />
            </div>
            <div className="grid gap-2">
              <Label>角色说明</Label>
              <Textarea placeholder="请描述该角色的职责与权限范围" value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="border-[#d9d9d9] resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); setForm(emptyForm); }} className="border-[#d9d9d9]">取消</Button>
            <Button onClick={handleCreate} className="bg-[#1890ff] hover:bg-[#40a9ff]">确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 复制角色确认 */}
      <AlertDialog open={copySource !== null} onOpenChange={(open) => !open && setCopySource(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>复制角色</AlertDialogTitle>
            <AlertDialogDescription>
              将复制角色「{copySource?.name}」的所有权限配置，生成一个新的自定义角色，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-[#1890ff] hover:bg-[#40a9ff]" onClick={() => copySource && handleCopy(copySource)}>
              确认复制
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 停用角色确认 */}
      <AlertDialog open={disableTarget !== null} onOpenChange={(open) => !open && setDisableTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              确认{disableTarget?.status === "启用" ? "停用" : "启用"}角色？
            </AlertDialogTitle>
            <AlertDialogDescription>
              {disableTarget?.status === "启用"
                ? `停用后，「${disableTarget?.name}」将不允许继续分配给新用户，但已绑定用户的历史记录保留。`
                : `启用后，「${disableTarget?.name}」可继续分配给用户。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className={disableTarget?.status === "启用" ? "bg-red-500 hover:bg-red-600" : "bg-[#1890ff] hover:bg-[#40a9ff]"}
              onClick={() => disableTarget && handleDisable(disableTarget)}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
