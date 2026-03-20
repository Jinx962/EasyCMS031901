import { useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Download,
  Filter,
  MoreHorizontal,
  Edit,
  Power,
  PowerOff,
  Eye,
} from "lucide-react";
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
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";

const mockUsers = [
  {
    id: 1,
    username: "admin001",
    name: "张三",
    email: "zhangsan@example.com",
    mobile: "13800138000",
    organization: "总部",
    roles: 2,
    status: "启用",
    lastLogin: "2026-03-19 14:30:25",
    createdAt: "2026-01-15 10:00:00",
  },
  {
    id: 2,
    username: "editor001",
    name: "李四",
    email: "lisi@example.com",
    mobile: "13900139000",
    organization: "内容服务商A",
    roles: 1,
    status: "启用",
    lastLogin: "2026-03-18 16:45:12",
    createdAt: "2026-02-01 09:30:00",
  },
  {
    id: 3,
    username: "reviewer001",
    name: "王五",
    email: "wangwu@example.com",
    mobile: "13700137000",
    organization: "总部",
    roles: 1,
    status: "停用",
    lastLogin: "2026-03-10 11:20:00",
    createdAt: "2026-01-20 14:15:00",
  },
  {
    id: 4,
    username: "operator001",
    name: "赵六",
    email: "zhaoliu@example.com",
    mobile: "13600136000",
    organization: "项目组B",
    roles: 3,
    status: "启用",
    lastLogin: "2026-03-19 09:15:30",
    createdAt: "2026-02-10 16:00:00",
  },
  {
    id: 5,
    username: "viewer001",
    name: "孙七",
    email: "sunqi@example.com",
    mobile: "13500135000",
    organization: "总部",
    roles: 1,
    status: "未激活",
    lastLogin: "-",
    createdAt: "2026-03-15 13:25:00",
  },
];

export default function UserManagement() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 筛选栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="搜索用户名/姓名/邮箱/手机号"
            className="border-[#d9d9d9] focus-visible:ring-[#1890ff]"
          />
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="所属组织" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部组织</SelectItem>
              <SelectItem value="hq">总部</SelectItem>
              <SelectItem value="provider-a">内容服务商A</SelectItem>
              <SelectItem value="project-b">项目组B</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="账号状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">启用</SelectItem>
              <SelectItem value="inactive">停用</SelectItem>
              <SelectItem value="unactivated">未激活</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
                <Plus className="h-4 w-4 mr-2" />
                新建用户
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>新建用户</DialogTitle>
                <DialogDescription>
                  创建新用户账号并分配角色和权限
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">
                      用户名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      placeholder="请输入用户名"
                      className="border-[#d9d9d9]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      姓名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="请输入姓名"
                      className="border-[#d9d9d9]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入邮箱"
                      className="border-[#d9d9d9]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mobile">手机号</Label>
                    <Input
                      id="mobile"
                      placeholder="请输入手机号"
                      className="border-[#d9d9d9]"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">
                    所属组织 <span className="text-red-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="border-[#d9d9d9]">
                      <SelectValue placeholder="请选择所属组织" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hq">总部</SelectItem>
                      <SelectItem value="provider-a">内容服务商A</SelectItem>
                      <SelectItem value="project-b">项目组B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roles">
                    角色 <span className="text-red-500">*</span>
                  </Label>
                  <Select>
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
                  <Label htmlFor="status">账号状态</Label>
                  <Select defaultValue="active">
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
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="border-[#d9d9d9]"
                >
                  取消
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-[#1890ff] hover:bg-[#40a9ff]"
                >
                  确定
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="border-[#d9d9d9]">
            <Power className="h-4 w-4 mr-2" />
            批量启用
          </Button>
          <Button variant="outline" className="border-[#d9d9d9]">
            <PowerOff className="h-4 w-4 mr-2" />
            批量停用
          </Button>
          <Button variant="outline" className="border-[#d9d9d9]">
            <Download className="h-4 w-4 mr-2" />
            导出列表
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
              <TableHead className="text-[#000000d9]">用户名</TableHead>
              <TableHead className="text-[#000000d9]">姓名</TableHead>
              <TableHead className="text-[#000000d9]">邮箱</TableHead>
              <TableHead className="text-[#000000d9]">手机号</TableHead>
              <TableHead className="text-[#000000d9]">所属组织</TableHead>
              <TableHead className="text-[#000000d9]">角色数</TableHead>
              <TableHead className="text-[#000000d9]">账号状态</TableHead>
              <TableHead className="text-[#000000d9]">
                最近登录时间
              </TableHead>
              <TableHead className="text-[#000000d9]">创建时间</TableHead>
              <TableHead className="text-[#000000d9] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-[#fafafa]">
                <TableCell className="font-medium text-[#1890ff]">
                  {user.username}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="text-[#00000073]">
                  {user.email}
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {user.mobile}
                </TableCell>
                <TableCell>{user.organization}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-[#f0f0f0] text-[#000000d9]"
                  >
                    {user.roles}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "启用"
                        ? "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]"
                        : user.status === "停用"
                        ? "bg-[#fff1f0] text-[#ff4d4f] border-[#ffccc7]"
                        : "bg-[#fafafa] text-[#00000073] border-[#d9d9d9]"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {user.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/users/${user.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {user.status === "启用" ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            停用
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            启用
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e8e8]">
        <div className="text-sm text-[#00000073]">
          共 {mockUsers.length} 条记录
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-[#d9d9d9]"
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1890ff] text-white border-[#1890ff] hover:bg-[#40a9ff]"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#d9d9d9]"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#d9d9d9]"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}