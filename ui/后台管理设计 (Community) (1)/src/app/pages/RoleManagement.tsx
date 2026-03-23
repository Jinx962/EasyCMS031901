import { useState } from "react";
import { Link } from "react-router";
import { Plus, Copy, Edit, Eye, MoreHorizontal, Users } from "lucide-react";
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

const mockRoles = [
  {
    id: 1,
    name: "系统管理员",
    code: "SYSTEM_ADMIN",
    description: "拥有系统最高权限，负责用户、角色、权限管理",
    userCount: 3,
    status: "启用",
    isPreset: true,
    updatedAt: "2026-01-15 10:00:00",
  },
  {
    id: 2,
    name: "项目管理员",
    code: "PROJECT_ADMIN",
    description: "负责项目内用户管理和内容审核",
    userCount: 8,
    status: "启用",
    isPreset: true,
    updatedAt: "2026-02-01 09:30:00",
  },
  {
    id: 3,
    name: "内容运营",
    code: "CONTENT_OPERATOR",
    description: "负责内容编辑、导入和日常运营",
    userCount: 25,
    status: "启用",
    isPreset: true,
    updatedAt: "2026-02-10 14:15:00",
  },
  {
    id: 4,
    name: "审核人员",
    code: "REVIEWER",
    description: "负责内容签核和变更审批",
    userCount: 12,
    status: "启用",
    isPreset: true,
    updatedAt: "2026-02-15 16:00:00",
  },
  {
    id: 5,
    name: "发布人员",
    code: "PUBLISHER",
    description: "负责导出发布和完整性校验",
    userCount: 6,
    status: "启用",
    isPreset: true,
    updatedAt: "2026-02-20 11:20:00",
  },
  {
    id: 6,
    name: "只读用户",
    code: "READONLY_USER",
    description: "仅可查看内容，不允许任何修改操作",
    userCount: 15,
    status: "启用",
    isPreset: true,
    updatedAt: "2026-03-01 13:25:00",
  },
  {
    id: 7,
    name: "配置管理员",
    code: "CONFIG_ADMIN",
    description: "负责配置档、分类集等配置管理",
    userCount: 4,
    status: "启用",
    isPreset: false,
    updatedAt: "2026-03-10 15:30:00",
  },
];

export default function RoleManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 筛选栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="搜索角色名称/编码"
            className="border-[#d9d9d9] focus-visible:ring-[#1890ff]"
          />
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
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
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
            <Plus className="h-4 w-4 mr-2" />
            新建角色
          </Button>
          <Button variant="outline" className="border-[#d9d9d9]">
            <Copy className="h-4 w-4 mr-2" />
            复制角色
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
              <TableHead className="text-[#000000d9]">
                最近修改时间
              </TableHead>
              <TableHead className="text-[#000000d9] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRoles.map((role) => (
              <TableRow key={role.id} className="hover:bg-[#fafafa]">
                <TableCell className="font-medium text-[#1890ff]">
                  {role.name}
                </TableCell>
                <TableCell className="text-[#00000073] font-mono text-xs">
                  {role.code}
                </TableCell>
                <TableCell className="text-[#00000073] max-w-xs">
                  {role.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#00000073]" />
                    <span>{role.userCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                    {role.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {role.isPreset ? (
                    <Badge variant="secondary" className="bg-[#f0f0f0] text-[#000000d9]">
                      系统预置
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-[#d9d9d9] text-[#00000073]">
                      自定义
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {role.updatedAt}
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
                          to={`/roles/${role.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑角色
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        复制角色
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        查看用户
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
          共 {mockRoles.length} 条记录
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
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}