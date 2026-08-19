import { ROLES } from "../context/AuthContext";

export const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [ROLES.STAFF],
  },
  {
    label: "Admin Dashboard",
    path: "/admin",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    path: "/admin/categories",
    roles: [ROLES.ADMIN],
  },
];