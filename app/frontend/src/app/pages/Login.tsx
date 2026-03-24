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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      toast.error("请输入用户名和密码");
      return;
    }
    try {
      setSubmitting(true);
      const result = await login(username.trim(), password);
      if (result.user.must_change_password) {
        toast.warning("该账号需修改密码，改密页面暂未接入");
      }
      toast.success("登录成功");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">EasyCMS 登录</CardTitle>
          <CardDescription>请输入账号与密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="请输入用户名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="请输入密码"
              />
            </div>
            <Button className="w-full bg-[#1890ff] hover:bg-[#40a9ff]" disabled={submitting} type="submit">
              {submitting ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
