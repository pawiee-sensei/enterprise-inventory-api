import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-surface text-text-primary">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 pb-8 pt-32 sm:px-8 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;