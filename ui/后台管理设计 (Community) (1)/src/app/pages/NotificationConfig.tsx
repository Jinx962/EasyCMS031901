import { Plus, Edit, Eye, MoreHorizontal } from "lucide-react";
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
import { Switch } from "../components/ui/switch";

const mockNotifications = [
  {
    id: 1,
    eventName: "导出完成通知",
    eventCode: "EXPORT_COMPLETED",
    channels: ["站内消息", "邮件"],
    receivers: "导出发起人、项目管理员",
    enabled: true,
    updatedAt: "2026-03-15 10:00:00",
  },
  {
    id: 2,
    eventName: "导出失败通知",
    eventCode: "EXPORT_FAILED",
    channels: ["站内消息", "邮件"],
    receivers: "导出发起人、发布人员、系统管理员",
    enabled: true,
    updatedAt: "2026-03-15 10:00:00",
  },
  {
    id: 3,
    eventName: "配置签核通知",
    eventCode: "CONFIG_REVIEW",
    channels: ["站内消息"],
    receivers: "配置管理员、审核人员",
    enabled: true,
    updatedAt: "2026-03-10 14:30:00",
  },
  {
    id: 4,
    eventName: "配置解锁通知",
    eventCode: "CONFIG_UNLOCK",
    channels: ["站内消息", "邮件"],
    receivers: "配置管理员、发布人员",
    enabled: true,
    updatedAt: "2026-03-10 14:30:00",
  },
  {
    id: 5,
    eventName: "变更申请待审批",
    eventCode: "CHANGE_PENDING",
    channels: ["站内消息"],
    receivers: "审核人员、项目管理员",
    enabled: true,
    updatedAt: "2026-03-05 16:20:00",
  },
  {
    id: 6,
    eventName: "变更申请已通过",
    eventCode: "CHANGE_APPROVED",
    channels: ["站内消息"],
    receivers: "变更申请人",
    enabled: true,
    updatedAt: "2026-03-05 16:20:00",
  },
  {
    id: 7,
    eventName: "任务逾期提醒",
    eventCode: "TASK_OVERDUE",
    channels: ["站内消息", "邮件"],
    receivers: "任务负责人、项目管理员",
    enabled: true,
    updatedAt: "2026-03-01 09:00:00",
  },
  {
    id: 8,
    eventName: "账号创建通知",
    eventCode: "USER_CREATED",
    channels: ["邮件"],
    receivers: "新建用户",
    enabled: false,
    updatedAt: "2026-02-28 13:45:00",
  },
];

export default function NotificationConfig() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 筛选栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="搜索事件名称/编码"
            className="border-[#d9d9d9] focus-visible:ring-[#1890ff]"
          />
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="通知方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部方式</SelectItem>
              <SelectItem value="internal">站内消息</SelectItem>
              <SelectItem value="email">邮件</SelectItem>
              <SelectItem value="sms">短信</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="启用状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="enabled">已启用</SelectItem>
              <SelectItem value="disabled">已停用</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
            <Plus className="h-4 w-4 mr-2" />
            新建通知规则
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
              <TableHead className="text-[#000000d9]">事件名称</TableHead>
              <TableHead className="text-[#000000d9]">事件编码</TableHead>
              <TableHead className="text-[#000000d9]">通知方式</TableHead>
              <TableHead className="text-[#000000d9]">
                默认接收对象
              </TableHead>
              <TableHead className="text-[#000000d9]">启用状态</TableHead>
              <TableHead className="text-[#000000d9]">
                最近修改时间
              </TableHead>
              <TableHead className="text-[#000000d9] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNotifications.map((notification) => (
              <TableRow key={notification.id} className="hover:bg-[#fafafa]">
                <TableCell className="font-medium text-[#000000d9]">
                  {notification.eventName}
                </TableCell>
                <TableCell className="font-mono text-xs text-[#00000073]">
                  {notification.eventCode}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {notification.channels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="outline"
                        className="border-[#d9d9d9] text-[#000000d9]"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-[#00000073] max-w-xs">
                  {notification.receivers}
                </TableCell>
                <TableCell>
                  <Switch checked={notification.enabled} />
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {notification.updatedAt}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑规则
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
          共 {mockNotifications.length} 条记录
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="border-[#d9d9d9]"
          >
            上���页
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1890ff] text-white border-[#1890ff] hover:bg-[#40a9ff]"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="border-[#d9d9d9]">
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}