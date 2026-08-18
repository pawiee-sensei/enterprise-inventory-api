import { ROLES } from "../context/AuthContext";

export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: "Admin Dashboard",
    path: "/admin",
    roles: [ROLES.ADMIN],
  },
];