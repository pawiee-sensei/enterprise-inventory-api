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
    <nav style={{ width: "200px", background: "#222", height: "100vh", padding: "16px" }}>
      {visibleItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: "block",
            padding: "10px",
            marginBottom: "4px",
            color: "#fff",
            textDecoration: "none",
            background: isActive ? "#4a5cf7" : "transparent",
            borderRadius: "6px",
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Sidebar;