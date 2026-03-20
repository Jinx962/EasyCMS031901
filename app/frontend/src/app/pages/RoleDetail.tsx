import { useParams, Link } from "react-router";
import { ArrowLeft, Edit, Users } from "lucide-react";
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

export default function RoleDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/roles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-medium text-[#000000d9]">角色详情</h1>
            <p className="text-sm text-[#00000073] mt-1">角色ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#d9d9d9]">
            <Users className="h-4 w-4 mr-2" />
            查看用户列表
          </Button>
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
            <Edit className="h-4 w-4 mr-2" />
            编辑角色
          </Button>
        </div>
      </div>

      {/* 角色信息卡片 */}
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs defaultValue="basic" className="w-full">
          <div className="border-b border-[#e8e8e8] px-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="basic" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                基本信息
              </TabsTrigger>
              <TabsTrigger value="pages" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                页面权限
              </TabsTrigger>
              <TabsTrigger value="operations" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                操作权限
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                数据范围
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:text-[#1890ff] data-[state=active]:border-b-2 data-[state=active]:border-[#1890ff]">
                用户列表
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[#00000073] mb-1">角色名称</div>
                  <div className="text-base text-[#000000d9]">系统管理员</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">角色编码</div>
                  <div className="text-base font-mono text-[#000000d9]">
                    SYSTEM_ADMIN
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">角色说明</div>
                  <div className="text-base text-[#000000d9]">
                    拥有系统最高权限，负责用户、角色、权限管理
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[#00000073] mb-1">状态</div>
                  <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                    启用
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">类型</div>
                  <Badge variant="secondary" className="bg-[#f0f0f0] text-[#000000d9]">
                    系统预置
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">用户数</div>
                  <div className="text-base text-[#000000d9]">3</div>
                </div>
                <div>
                  <div className="text-sm text-[#00000073] mb-1">
                    最近修改时间
                  </div>
                  <div className="text-base text-[#000000d9]">
                    2026-01-15 10:00:00
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="p-6">
            <div className="space-y-4">
              {[
                { module: "工作台", pages: ["工作台首页", "状态清单"] },
                {
                  module: "内容中心",
                  pages: ["内容列表", "内容详情", "导入历史", "签核管理"],
                },
                {
                  module: "周期管理",
                  pages: ["周期列表", "周期详情", "周期锁定"],
                },
                {
                  module: "后台管理",
                  pages: ["用户管理", "角色管理", "权限配置", "审计日志"],
                },
              ].map((item) => (
                <div
                  key={item.module}
                  className="border border-[#e8e8e8] rounded-lg p-4"
                >
                  <h4 className="text-sm font-medium text-[#000000d9] mb-3">
                    {item.module}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.pages.map((page) => (
                      <Badge
                        key={page}
                        variant="outline"
                        className="border-[#1890ff] text-[#1890ff]"
                      >
                        {page}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="operations" className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafa]">
                  <TableHead>页面</TableHead>
                  <TableHead>查看</TableHead>
                  <TableHead>新建</TableHead>
                  <TableHead>编辑</TableHead>
                  <TableHead>删除</TableHead>
                  <TableHead>导入</TableHead>
                  <TableHead>导出</TableHead>
                  <TableHead>审批</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>用户管理</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>角色管理</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>权限配置</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>审计日志</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="data" className="p-6">
            <div className="border border-[#e8e8e8] rounded-lg p-4">
              <div className="text-sm text-[#000000d9] mb-2">数据可见范围</div>
              <Badge className="bg-[#e6f7ff] text-[#1890ff] border-[#91d5ff]">
                全部数据（不受限制）
              </Badge>
              <p className="text-sm text-[#00000073] mt-3">
                系统管理员拥有全部数据的访问权限，可以查看和管理所有组织、项目的数据
              </p>
            </div>
          </TabsContent>

          <TabsContent value="users" className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafa]">
                  <TableHead>用户名</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>所属组织</TableHead>
                  <TableHead>账号状态</TableHead>
                  <TableHead>绑定时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-[#1890ff]">admin001</TableCell>
                  <TableCell>张三</TableCell>
                  <TableCell>总部</TableCell>
                  <TableCell>
                    <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                      启用
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#00000073]">
                    2026-01-15 10:00:00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#1890ff]">admin002</TableCell>
                  <TableCell>李明</TableCell>
                  <TableCell>总部</TableCell>
                  <TableCell>
                    <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                      启用
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#00000073]">
                    2026-02-10 14:30:00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#1890ff]">admin003</TableCell>
                  <TableCell>王芳</TableCell>
                  <TableCell>总部</TableCell>
                  <TableCell>
                    <Badge className="bg-[#f6ffed] text-[#52c41a] border-[#b7eb8f]">
                      启用
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#00000073]">
                    2026-03-01 09:15:00
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