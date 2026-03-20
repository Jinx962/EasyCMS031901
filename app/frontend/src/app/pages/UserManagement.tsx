import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Plus,
  Download,
  Power,
  PowerOff,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
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

type UserStatus = "启用" | "停用" | "未激活" | "锁定";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  mobile: string;
  organization: string;
  roles: number;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

const initialUsers: User[] = [
  { id: 1, username: "admin001", name: "张三", email: "zhangsan@example.com", mobile: "13800138000", organization: "总部", roles: 2, status: "启用", lastLogin: "2026-03-19 14:30:25", createdAt: "2026-01-15 10:00:00" },
  { id: 2, username: "editor001", name: "李四", email: "lisi@example.com", mobile: "13900139000", organization: "内容服务商A", roles: 1, status: "启用", lastLogin: "2026-03-18 16:45:12", createdAt: "2026-02-01 09:30:00" },
  { id: 3, username: "reviewer001", name: "王五", email: "wangwu@example.com", mobile: "13700137000", organization: "总部", roles: 1, status: "停用", lastLogin: "2026-03-10 11:20:00", createdAt: "2026-01-20 14:15:00" },
  { id: 4, username: "operator001", name: "赵六", email: "zhaoliu@example.com", mobile: "13600136000", organization: "项目组B", roles: 3, status: "启用", lastLogin: "2026-03-19 09:15:30", createdAt: "2026-02-10 16:00:00" },
  { id: 5, username: "viewer001", name: "孙七", email: "sunqi@example.com", mobile: "13500135000", organization: "总部", roles: 1, status: "未激活", lastLogin: "-", createdAt: "2026-03-15 13:25:00" },
  { id: 6, username: "locked001", name: "钱八", email: "qianba@example.com", mobile: "13400134000", organization: "项目组B", roles: 1, status: "锁定", lastLogin: "2026-03-01 08:00:00", createdAt: "2026-01-10 09:00:00" },
];

const PAGE_SIZE = 10;

const statusBadge: Record<UserStatus, string> = {
  启用: "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]",
  停用: "bg-[#fff1f0] text-[#ff4d4f] border-[#ffccc7]",
  未激活: "bg-[#fafafa] text-[#00000073] border-[#d9d9d9]",
  锁定: "bg-[#fff7e6] text-[#fa8c16] border-[#ffd591]",
};

const emptyForm = { username: "", name: "", email: "", mobile: "", organization: "", role: "", status: "active" as const };

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterOrg, setFilterOrg] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [batchAction, setBatchAction] = useState<"enable" | "disable" | null>(null);
  const [form, setForm] = useState(emptyForm);

  // 筛选
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.name.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.mobile.includes(q);
      const matchOrg = filterOrg === "all" || u.organization === filterOrg;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && u.status === "启用") ||
        (filterStatus === "inactive" && u.status === "停用") ||
        (filterStatus === "unactivated" && u.status === "未激活") ||
        (filterStatus === "locked" && u.status === "锁定");
      return matchSearch && matchOrg && matchStatus;
    });
  }, [users, search, filterOrg, filterStatus, filterRole]);

  // 分页
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 全选
  const allSelected = paged.length > 0 && paged.every((u) => selectedIds.includes(u.id));
  const someSelected = paged.some((u) => selectedIds.includes(u.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paged.map((u) => u.id).includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...paged.map((u) => u.id)])]);
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // 启用/停用
  const changeStatus = (ids: number[], status: UserStatus) => {
    setUsers((prev) => prev.map((u) => ids.includes(u.id) ? { ...u, status } : u));
    setSelectedIds([]);
    toast.success(`已${status === "启用" ? "启用" : "停用"} ${ids.length} 个用户`);
  };

  // 新建用户提交
  const handleCreate = () => {
    if (!form.username.trim() || !form.name.trim() || !form.organization) {
      toast.error("请填写必填项：用户名、姓名、所属组织");
      return;
    }
    const newUser: User = {
      id: Date.now(),
      username: form.username,
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      organization: form.organization,
      roles: form.role ? 1 : 0,
      status: form.status === "active" ? "启用" : "未激活",
      lastLogin: "-",
      createdAt: new Date().toLocaleString("zh-CN").replace(/\//g, "-"),
    };
    setUsers((prev) => [newUser, ...prev]);
    setForm(emptyForm);
    setCreateOpen(false);
    toast.success("用户创建成功");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 筛选栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="搜索用户名/姓名/邮箱/手机号"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border-[#d9d9d9] focus-visible:ring-[#1890ff]"
          />
          <Select value={filterOrg} onValueChange={(v) => { setFilterOrg(v); setPage(1); }}>
            <SelectTrigger className="border-[#d9d9d9]">
              <SelectValue placeholder="所属组织" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部组织</SelectItem>
              <SelectItem value="总部">总部</SelectItem>
              <SelectItem value="内容服务商A">内容服务商A</SelectItem>
              <SelectItem value="项目组B">项目组B</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="border-[#d9d9d9]">
              <SelectValue placeholder="账号状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">启用</SelectItem>
              <SelectItem value="inactive">停用</SelectItem>
              <SelectItem value="unactivated">未激活</SelectItem>
              <SelectItem value="locked">锁定</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={(v) => { setFilterRole(v); setPage(1); }}>
            <SelectTrigger className="border-[#d9d9d9]">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              <SelectItem value="admin">系统管理员</SelectItem>
              <SelectItem value="editor">内容运营</SelectItem>
              <SelectItem value="reviewer">审核人员</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建用户
          </Button>
          <Button
            variant="outline"
            className="border-[#d9d9d9]"
            disabled={selectedIds.length === 0}
            onClick={() => setBatchAction("enable")}
          >
            <Power className="h-4 w-4 mr-2" />
            批量启用
          </Button>
          <Button
            variant="outline"
            className="border-[#d9d9d9]"
            disabled={selectedIds.length === 0}
            onClick={() => setBatchAction("disable")}
          >
            <PowerOff className="h-4 w-4 mr-2" />
            批量停用
          </Button>
          <Button variant="outline" className="border-[#d9d9d9]">
            <Download className="h-4 w-4 mr-2" />
            导出列表
          </Button>
          {selectedIds.length > 0 && (
            <span className="text-sm text-[#1890ff]">已选 {selectedIds.length} 项</span>
          )}
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  data-state={someSelected && !allSelected ? "indeterminate" : undefined}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-[#000000d9]">用户名</TableHead>
              <TableHead className="text-[#000000d9]">姓名</TableHead>
              <TableHead className="text-[#000000d9]">邮箱</TableHead>
              <TableHead className="text-[#000000d9]">手机号</TableHead>
              <TableHead className="text-[#000000d9]">所属组织</TableHead>
              <TableHead className="text-[#000000d9]">角色数</TableHead>
              <TableHead className="text-[#000000d9]">账号状态</TableHead>
              <TableHead className="text-[#000000d9]">最近登录时间</TableHead>
              <TableHead className="text-[#000000d9]">创建时间</TableHead>
              <TableHead className="text-[#000000d9] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-[#00000073]">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              paged.map((user) => (
                <TableRow key={user.id} className="hover:bg-[#fafafa]">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onCheckedChange={() => toggleOne(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link to={`/users/${user.id}`} className="text-[#1890ff] hover:underline">
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="text-[#00000073]">{user.email}</TableCell>
                  <TableCell className="text-[#00000073]">{user.mobile}</TableCell>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#f0f0f0] text-[#000000d9]">
                      {user.roles}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadge[user.status]}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-[#00000073]">{user.lastLogin}</TableCell>
                  <TableCell className="text-[#00000073]">{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/users/${user.id}`} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            changeStatus([user.id], user.status === "启用" ? "停用" : "启用")
                          }
                        >
                          {user.status === "启用" ? (
                            <><PowerOff className="h-4 w-4 mr-2" />停用</>
                          ) : (
                            <><Power className="h-4 w-4 mr-2" />启用</>
                          )}
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
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            className="border-[#d9d9d9]"
            onClick={() => setPage((p) => p - 1)}
          >
            上一页
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className={
                p === page
                  ? "bg-[#1890ff] text-white border-[#1890ff] hover:bg-[#40a9ff]"
                  : "border-[#d9d9d9]"
              }
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            className="border-[#d9d9d9]"
            onClick={() => setPage((p) => p + 1)}
          >
            下一页
          </Button>
        </div>
      </div>

      {/* 新建用户弹窗 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新建用户</DialogTitle>
            <DialogDescription>创建新用户账号并分配角色和权限</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">用户名 <span className="text-red-500">*</span></Label>
                <Input id="username" placeholder="请输入用户名" value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="border-[#d9d9d9]" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">姓名 <span className="text-red-500">*</span></Label>
                <Input id="name" placeholder="请输入姓名" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="border-[#d9d9d9]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" placeholder="请输入邮箱" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="border-[#d9d9d9]" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">手机号</Label>
                <Input id="mobile" placeholder="请输入手机号" value={form.mobile}
                  onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                  className="border-[#d9d9d9]" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>所属组织 <span className="text-red-500">*</span></Label>
              <Select value={form.organization} onValueChange={(v) => setForm((f) => ({ ...f, organization: v }))}>
                <SelectTrigger className="border-[#d9d9d9]">
                  <SelectValue placeholder="请选择所属组织" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="总部">总部</SelectItem>
                  <SelectItem value="内容服务商A">内容服务商A</SelectItem>
                  <SelectItem value="项目组B">项目组B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>角色 <span className="text-red-500">*</span></Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="border-[#d9d9d9]">
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">系统管理员</SelectItem>
                  <SelectItem value="editor">内容运营</SelectItem>
                  <SelectItem value="reviewer">审核人员</SelectItem>
                  <SelectItem value="publisher">发布人员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>账号状态</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof f.status }))}>
                <SelectTrigger className="border-[#d9d9d9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="unactivated">未激活</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); setForm(emptyForm); }} className="border-[#d9d9d9]">取消</Button>
            <Button onClick={handleCreate} className="bg-[#1890ff] hover:bg-[#40a9ff]">确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量操作确认 */}
      <AlertDialog open={batchAction !== null} onOpenChange={(open) => !open && setBatchAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              确认批量{batchAction === "enable" ? "启用" : "停用"}？
            </AlertDialogTitle>
            <AlertDialogDescription>
              将对选中的 {selectedIds.length} 个用户执行
              {batchAction === "enable" ? "启用" : "停用"}操作，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className={batchAction === "disable" ? "bg-red-500 hover:bg-red-600" : "bg-[#1890ff] hover:bg-[#40a9ff]"}
              onClick={() => {
                changeStatus(selectedIds, batchAction === "enable" ? "启用" : "停用");
                setBatchAction(null);
              }}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
