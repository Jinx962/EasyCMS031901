import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Edit, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type UserStatus = "启用" | "停用" | "未激活" | "锁定";

interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  mobile: string;
  organization: string;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

// 与 UserManagement 共享的 mock 数据（实际项目中应从全局状态/API 获取）
const mockUsers: UserInfo[] = [
  { id: 1, username: "admin001", name: "张三", email: "zhangsan@example.com", mobile: "13800138000", organization: "总部", status: "启用", lastLogin: "2026-03-19 14:30:25", createdAt: "2026-01-15 10:00:00" },
  { id: 2, username: "editor001", name: "李四", email: "lisi@example.com", mobile: "13900139000", organization: "内容服务商A", status: "启用", lastLogin: "2026-03-18 16:45:12", createdAt: "2026-02-01 09:30:00" },
  { id: 3, username: "reviewer001", name: "王五", email: "wangwu@example.com", mobile: "13700137000", organization: "总部", status: "停用", lastLogin: "2026-03-10 11:20:00", createdAt: "2026-01-20 14:15:00" },
  { id: 4, username: "operator001", name: "赵六", email: "zhaoliu@example.com", mobile: "13600136000", organization: "项目组B", status: "启用", lastLogin: "2026-03-19 09:15:30", createdAt: "2026-02-10 16:00:00" },
  { id: 5, username: "viewer001", name: "孙七", email: "sunqi@example.com", mobile: "13500135000", organization: "总部", status: "未激活", lastLogin: "-", createdAt: "2026-03-15 13:25:00" },
  { id: 6, username: "locked001", name: "钱八", email: "qianba@example.com", mobile: "13400134000", organization: "项目组B", status: "锁定", lastLogin: "2026-03-01 08:00:00", createdAt: "2026-01-10 09:00:00" },
];

const statusBadge: Record<UserStatus, string> = {
  启用: "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]",
  停用: "bg-[#fff1f0] text-[#ff4d4f] border-[#ffccc7]",
  未激活: "bg-[#fafafa] text-[#00000073] border-[#d9d9d9]",
  锁定: "bg-[#fff7e6] text-[#fa8c16] border-[#ffd591]",
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find((u) => u.id === Number(id));

  const [currentUser, setCurrentUser] = useState<UserInfo | undefined>(user);
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    mobile: currentUser?.mobile ?? "",
    organization: currentUser?.organization ?? "",
  });

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <p className="text-[#00000073] text-lg">用户不存在（ID: {id}）</p>
        <Button variant="outline" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回用户列表
        </Button>
      </div>
    );
  }

  const handleToggleStatus = () => {
    const next: UserStatus = currentUser.status === "启用" ? "停用" : "启用";
    setCurrentUser((u) => u ? { ...u, status: next } : u);
    setDisableConfirmOpen(false);
    toast.success(`账号已${next}`);
  };

  const handleEdit = () => {
    setCurrentUser((u) => u ? { ...u, ...editForm } : u);
    setEditOpen(false);
    toast.success("用户信息已更新");
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-medium text-[#000000d9]">
              {currentUser.name}
              <span className="ml-2 text-sm text-[#00000073] font-normal">@{currentUser.username}</span>
            </h1>
            <p className="text-sm text-[#00000073] mt-0.5">用户ID: {currentUser.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#d9d9d9]"
            onClick={() => setDisableConfirmOpen(true)}
          >
            {currentUser.status === "启用" ? (
              <><PowerOff className="h-4 w-4 mr-2" />停用账号</>
            ) : (
              <><Power className="h-4 w-4 mr-2" />启用账号</>
            )}
          </Button>
          <Button
            className="bg-[#1890ff] hover:bg-[#40a9ff]"
            onClick={() => {
              setEditForm({ name: currentUser.name, email: currentUser.email, mobile: currentUser.mobile, organization: currentUser.organization });
              setEditOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            编辑用户
          </Button>
        </div>
      </div>

      {/* Tab 详情 */}
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs defaultValue="basic" className="w-full">
          <div className="border-b border-[#e8e8e8] px-6">
            <TabsList className="bg-transparent h-12 gap-2">
              {[
                { value: "basic", label: "基本信息" },
                { value: "roles", label: "角色信息" },
                { value: "permissions", label: "权限概览" },
                { value: "notifications", label: "通知设置" },
                { value: "history", label: "操作历史" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff] rounded-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="basic" className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-5">
                {[
                  { label: "用户名", value: currentUser.username },
                  { label: "姓名", value: currentUser.name },
                  { label: "邮箱", value: currentUser.email },
                  { label: "手机号", value: currentUser.mobile },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="text-sm text-[#00000073] mb-1">{row.label}</div>
                    <div className="text-base text-[#000000d9]">{row.value || "-"}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-5">
                <div>
                  <div className="text-sm text-[#00000073] mb-1">所属组织</div>
                  <div className="text-base text-[#000000d9]">{currentUser.organization}</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">账号状态</div>
                  <Badge className={statusBadge[currentUser.status]}>{currentUser.status}</Badge>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">最近登录时间</div>
                  <div className="text-base text-[#000000d9]">{currentUser.lastLogin}</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">创建时间</div>
                  <div className="text-base text-[#000000d9]">{currentUser.createdAt}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafa]">
                  <TableHead>角色名称</TableHead>
                  <TableHead>角色编码</TableHead>
                  <TableHead>角色说明</TableHead>
                  <TableHead>绑定时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-[#1890ff]">系统管理员</TableCell>
                  <TableCell className="font-mono text-xs">SYSTEM_ADMIN</TableCell>
                  <TableCell>拥有系统最高权限</TableCell>
                  <TableCell className="text-[#00000073]">2026-01-15 10:00:00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="permissions" className="p-6">
            <div className="space-y-4">
              <div className="border border-[#e8e8e8] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#000000d9] mb-3">模块权限</h4>
                <div className="flex flex-wrap gap-2">
                  {["工作台", "内容中心", "周期管理", "报表中心", "配置中心", "后台管理"].map((m) => (
                    <Badge key={m} variant="outline" className="border-[#1890ff] text-[#1890ff]">{m}</Badge>
                  ))}
                </div>
              </div>
              <div className="border border-[#e8e8e8] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#000000d9] mb-3">数据范围</h4>
                <div className="text-sm text-[#00000073]">全部数据（不受限制）</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            <div className="space-y-3">
              {[
                { name: "导出结果通知", channels: "站内消息、邮件" },
                { name: "变更申请通知", channels: "站内消息" },
                { name: "任务逾期提醒", channels: "站内消息、邮件" },
              ].map((n) => (
                <div key={n.name} className="flex items-center justify-between p-3 border border-[#e8e8e8] rounded">
                  <div>
                    <div className="text-sm text-[#000000d9]">{n.name}</div>
                    <div className="text-xs text-[#00000073] mt-1">{n.channels}</div>
                  </div>
                  <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">已启用</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafa]">
                  <TableHead>操作时间</TableHead>
                  <TableHead>操作类型</TableHead>
                  <TableHead>操作对象</TableHead>
                  <TableHead>操作结果</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { time: "2026-03-19 14:30:25", type: "创建用户", object: "新员工-孙七" },
                  { time: "2026-03-18 16:45:12", type: "修改角色", object: "用户-李四" },
                  { time: "2026-03-17 10:20:30", type: "查看审计日志", object: "配置修改日志" },
                ].map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-[#00000073]">{row.time}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.object}</TableCell>
                    <TableCell>
                      <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">成功</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>

      {/* 停用/启用确认弹窗 */}
      <AlertDialog open={disableConfirmOpen} onOpenChange={setDisableConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              确认{currentUser.status === "启用" ? "停用" : "启用"}账号？
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentUser.status === "启用"
                ? `停用后，用户「${currentUser.name}」将无法登录平台，但历史操作记录将保留。`
                : `启用后，用户「${currentUser.name}」可以正常登录平台。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className={currentUser.status === "启用" ? "bg-red-500 hover:bg-red-600" : "bg-[#1890ff] hover:bg-[#40a9ff]"}
              onClick={handleToggleStatus}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 编辑用户弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
            <DialogDescription>修改用户基础资料，角色调整请前往「角色信息」Tab</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>姓名 <span className="text-red-500">*</span></Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="border-[#d9d9d9]" />
            </div>
            <div className="grid gap-2">
              <Label>邮箱</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="border-[#d9d9d9]" />
            </div>
            <div className="grid gap-2">
              <Label>手机号</Label>
              <Input value={editForm.mobile} onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))} className="border-[#d9d9d9]" />
            </div>
            <div className="grid gap-2">
              <Label>所属组织 <span className="text-red-500">*</span></Label>
              <Select value={editForm.organization} onValueChange={(v) => setEditForm((f) => ({ ...f, organization: v }))}>
                <SelectTrigger className="border-[#d9d9d9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="总部">总部</SelectItem>
                  <SelectItem value="内容服务商A">内容服务商A</SelectItem>
                  <SelectItem value="项目组B">项目组B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-[#d9d9d9]">取消</Button>
            <Button onClick={handleEdit} className="bg-[#1890ff] hover:bg-[#40a9ff]">保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
