import { Download, Eye } from "lucide-react";
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
import { Badge } from "../components/ui/badge";

const mockLogs = [
  {
    id: 1,
    logId: "LOG20260319001",
    type: "内容编辑",
    module: "内容中心",
    operator: "张三",
    action: "编辑",
    objectType: "视频内容",
    objectName: "春节特别节目-片头",
    result: "成功",
    createdAt: "2026-03-19 14:30:25",
  },
  {
    id: 2,
    logId: "LOG20260319002",
    type: "签核",
    module: "内容中心",
    operator: "王五",
    action: "初始签核",
    objectType: "内容批次",
    objectName: "2026-Q1-Batch-001",
    result: "成功",
    createdAt: "2026-03-19 13:15:10",
  },
  {
    id: 3,
    logId: "LOG20260319003",
    type: "配置修改",
    module: "配置中心",
    operator: "李四",
    action: "编辑配置档",
    objectType: "配置档",
    objectName: "标准配置档-V1.2",
    result: "成功",
    createdAt: "2026-03-19 11:45:33",
  },
  {
    id: 4,
    logId: "LOG20260319004",
    type: "导出",
    module: "周期管理",
    operator: "赵六",
    action: "创建导出任务",
    objectType: "导出任务",
    objectName: "2026-03周期导出",
    result: "失败",
    createdAt: "2026-03-19 10:20:18",
  },
  {
    id: 5,
    logId: "LOG20260318001",
    type: "用户权限",
    module: "后台管理",
    operator: "系统管理员",
    action: "创建用户",
    objectType: "用户",
    objectName: "新员工-孙七",
    result: "成功",
    createdAt: "2026-03-18 16:30:00",
  },
  {
    id: 6,
    logId: "LOG20260318002",
    type: "变更审批",
    module: "内容中心",
    operator: "王五",
    action: "审批通过",
    objectType: "变更申请",
    objectName: "内容修正-CHANGE-2026-001",
    result: "成功",
    createdAt: "2026-03-18 15:10:45",
  },
  {
    id: 7,
    logId: "LOG20260318003",
    type: "导入",
    module: "内容中心",
    operator: "李四",
    action: "批量导入",
    objectType: "内容",
    objectName: "影视剧集-第二季",
    result: "成功",
    createdAt: "2026-03-18 14:25:22",
  },
];

export default function AuditLog() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 筛选栏 */}
      <div className="p-6 border-b border-[#e8e8e8]">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="搜索日志ID/对象名称"
            className="border-[#d9d9d9] focus-visible:ring-[#1890ff]"
          />
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="日志类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="content-edit">内容编辑</SelectItem>
              <SelectItem value="review">签核</SelectItem>
              <SelectItem value="config">配置修改</SelectItem>
              <SelectItem value="export">导出</SelectItem>
              <SelectItem value="import">导入</SelectItem>
              <SelectItem value="approval">变更审批</SelectItem>
              <SelectItem value="permission">用户权限</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="业务模块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部模块</SelectItem>
              <SelectItem value="content">内容中心</SelectItem>
              <SelectItem value="cycle">周期管理</SelectItem>
              <SelectItem value="config">配置中心</SelectItem>
              <SelectItem value="admin">后台管理</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-[#d9d9d9] focus:ring-[#1890ff]">
              <SelectValue placeholder="操作结果" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部结果</SelectItem>
              <SelectItem value="success">成功</SelectItem>
              <SelectItem value="failed">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#d9d9d9]">
            <Download className="h-4 w-4 mr-2" />
            导出日志
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
              <TableHead className="text-[#000000d9]">日志ID</TableHead>
              <TableHead className="text-[#000000d9]">时间</TableHead>
              <TableHead className="text-[#000000d9]">操作者</TableHead>
              <TableHead className="text-[#000000d9]">日志类型</TableHead>
              <TableHead className="text-[#000000d9]">业务模块</TableHead>
              <TableHead className="text-[#000000d9]">对象类型</TableHead>
              <TableHead className="text-[#000000d9]">对象名称</TableHead>
              <TableHead className="text-[#000000d9]">操作动作</TableHead>
              <TableHead className="text-[#000000d9]">结果</TableHead>
              <TableHead className="text-[#000000d9] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-[#fafafa]">
                <TableCell className="font-mono text-xs text-[#1890ff]">
                  {log.logId}
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {log.createdAt}
                </TableCell>
                <TableCell>{log.operator}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-[#d9d9d9] text-[#000000d9]"
                  >
                    {log.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {log.module}
                </TableCell>
                <TableCell className="text-[#00000073]">
                  {log.objectType}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {log.objectName}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      log.result === "成功"
                        ? "bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]"
                        : "bg-[#fff1f0] text-[#ff4d4f] border-[#ffccc7]"
                    }
                  >
                    {log.result}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    查看详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e8e8]">
        <div className="text-sm text-[#00000073]">
          共 {mockLogs.length} 条记录
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
          <Button variant="outline" size="sm" className="border-[#d9d9d9]">
            2
          </Button>
          <Button variant="outline" size="sm" className="border-[#d9d9d9]">
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}