import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { login } from "../api/auth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      toast.error("请输入用户名和密码");
      return;
    }

    try {
      setSubmitting(true);
      const result = await login(username.trim(), password);
      if (result.user.must_change_password) {
        toast.warning("当前账号需要先修改密码，改密页暂未上线");
      }
      toast.success("登录成功");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">
      <Card className="w-full max-w-md border-[#e8e8e8] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-[#000000d9]">EasyCMS 后台管理</CardTitle>
          <CardDescription>请输入账号信息登录系统</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入用户名"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1890ff] hover:bg-[#40a9ff]"
              disabled={submitting}
            >
              {submitting ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
