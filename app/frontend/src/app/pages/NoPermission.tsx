import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function NoPermission() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-10 text-center">
      <h2 className="text-xl font-medium text-[#000000d9]">无权限访问</h2>
      <p className="mt-3 text-sm text-[#00000073]">
        当前账号没有此页面权限，请联系管理员分配后重试。
      </p>
      <Button asChild className="mt-6 bg-[#1890ff] hover:bg-[#40a9ff]">
        <Link to="/users">返回用户管理</Link>
      </Button>
    </div>
  );
}
