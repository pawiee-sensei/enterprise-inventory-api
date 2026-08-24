import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-surface text-text-primary">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-6 pt-32 sm:px-6 md:pt-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
