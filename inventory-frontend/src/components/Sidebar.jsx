import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { navItems } from "../config/navConfig";

function Sidebar() {
  const { user } = useAuth();

  // only show links this user's role is allowed to see
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-10 border-b border-border bg-card px-4 py-3 md:hidden">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Inventory
          </p>
          <h2 className="text-base font-semibold text-text-primary">
            Management
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-navy text-white shadow-sm"
                    : "bg-surface text-text-secondary hover:text-text-primary",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <nav className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-navy px-4 py-6 text-white md:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/55">
            Inventory
          </p>
          <h2 className="mt-1 text-lg font-semibold">Management</h2>
        </div>

        <div className="space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "block rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-navy shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
