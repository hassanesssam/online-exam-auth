import HeaderDahboard from "@/components/headerDashboard/page";
import Sidebar from "@/components/sidebar/page";

export default function Layout({ children } : any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[15%_85%] gap-[20px] overflow-x-hidden xs:p-0 lg:p-[40px] bg-[#FBF9F9]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div>
        <HeaderDahboard />
        {children}
      </div>
    </div>
  );
}
