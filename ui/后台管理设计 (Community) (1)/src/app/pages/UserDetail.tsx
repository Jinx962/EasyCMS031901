import { useParams, Link } from "react-router";
import { ArrowLeft, Edit, Power, PowerOff } from "lucide-react";
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

export default function UserDetail() {
  const { id } = useParams();

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
            <h1 className="text-xl font-medium text-[#000000d9]">用户详情</h1>
            <p className="text-sm text-[#00000073] mt-1">用户ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#d9d9d9]">
            <PowerOff className="h-4 w-4 mr-2" />
            停用账号
          </Button>
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
            <Edit className="h-4 w-4 mr-2" />
            编辑用户
          </Button>
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs defaultValue="basic" className="w-full">
          <div className="border-b border-[#e8e8e8] px-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="basic" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                基本信息
              </TabsTrigger>
              <TabsTrigger value="roles" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                角色信息
              </TabsTrigger>
              <TabsTrigger value="permissions" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                权限概览
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                通知设置
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                操作历史
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[#00000073] mb-1">用户名</div>
                  <div className="text-base text-[#000000d9]">admin001</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">姓名</div>
                  <div className="text-base text-[#000000d9]">张三</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">邮箱</div>
                  <div className="text-base text-[#000000d9]">
                    zhangsan@example.com
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">手机号</div>
                  <div className="text-base text-[#000000d9]">13800138000</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[#00000073] mb-1">所属组织</div>
                  <div className="text-base text-[#000000d9]">总部</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">账号状态</div>
                  <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                    启用
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">
                    最近登录时间
                  </div>
                  <div className="text-base text-[#000000d9]">
                    2026-03-19 14:30:25
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">创建时间</div>
                  <div className="text-base text-[#000000d9]">
                    2026-01-15 10:00:00
                  </div>
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
                  <TableCell className="font-mono text-xs">
                    SYSTEM_ADMIN
                  </TableCell>
                  <TableCell>拥有系统最高权限</TableCell>
                  <TableCell className="text-[#00000073]">
                    2026-01-15 10:00:00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#1890ff]">项目管理员</TableCell>
                  <TableCell className="font-mono text-xs">
                    PROJECT_ADMIN
                  </TableCell>
                  <TableCell>负责项目内用户管理</TableCell>
                  <TableCell className="text-[#00000073]">
                    2026-02-01 09:30:00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="permissions" className="p-6">
            <div className="space-y-4">
              <div className="border border-[#e8e8e8] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#000000d9] mb-3">
                  模块权限
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-[#1890ff] text-[#1890ff]">
                    工作台
                  </Badge>
                  <Badge variant="outline" className="border-[#1890ff] text-[#1890ff]">
                    内容中心
                  </Badge>
                  <Badge variant="outline" className="border-[#1890ff] text-[#1890ff]">
                    周期管理
                  </Badge>
                  <Badge variant="outline" className="border-[#1890ff] text-[#1890ff]">
                    报表中心
                  </Badge>
                  <Badge variant="outline" className="border-[#1890ff] text-[#1890ff]">
                    配置中心
                  </Badge>
                  <Badge variant="outline" className="border-[#1890ff] text-[#1890ff]">
                    后台管理
                  </Badge>
                </div>
              </div>

              <div className="border border-[#e8e8e8] rounded-lg p-4">
                <h4 className="text-sm font-medium text-[#000000d9] mb-3">
                  数据范围
                </h4>
                <div className="text-sm text-[#00000073]">
                  全部数据（不受限制）
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-[#e8e8e8] rounded">
                <div>
                  <div className="text-sm text-[#000000d9]">导出结果通知</div>
                  <div className="text-xs text-[#00000073] mt-1">
                    站内消息、邮件
                  </div>
                </div>
                <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                  已启用
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-[#e8e8e8] rounded">
                <div>
                  <div className="text-sm text-[#000000d9]">变更申请通知</div>
                  <div className="text-xs text-[#00000073] mt-1">站内消息</div>
                </div>
                <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                  已启用
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-[#e8e8e8] rounded">
                <div>
                  <div className="text-sm text-[#000000d9]">任务逾期提醒</div>
                  <div className="text-xs text-[#00000073] mt-1">
                    站内消息、邮件
                  </div>
                </div>
                <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                  已启用
                </Badge>
              </div>
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
                <TableRow>
                  <TableCell className="text-[#00000073]">
                    2026-03-19 14:30:25
                  </TableCell>
                  <TableCell>创建用户</TableCell>
                  <TableCell>新员工-孙七</TableCell>
                  <TableCell>
                    <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                      成功
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#00000073]">
                    2026-03-18 16:45:12
                  </TableCell>
                  <TableCell>修改角色</TableCell>
                  <TableCell>用户-李四</TableCell>
                  <TableCell>
                    <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                      成功
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#00000073]">
                    2026-03-17 10:20:30
                  </TableCell>
                  <TableCell>查看审计日志</TableCell>
                  <TableCell>配置修改日志</TableCell>
                  <TableCell>
                    <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                      成功
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}