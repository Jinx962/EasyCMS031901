import { Link } from "react-router";
import { Home } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1890ff] mb-4">404</h1>
        <h2 className="text-2xl text-[#000000d9] mb-2">页面未找到</h2>
        <p className="text-[#00000073] mb-6">
          抱歉，您访问的页面不存在或已被移除
        </p>
        <Link to="/">
          <Button className="bg-[#1890ff] hover:bg-[#40a9ff]">
            <Home className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}
