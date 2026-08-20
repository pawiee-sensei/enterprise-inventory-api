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
  label: "Products",
  path: "/admin/products",
  roles: [ROLES.ADMIN], 
  },
  {
  label: "Purchases",
  path: "/admin/purchases",
  roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    path: "/admin/categories",
    roles: [ROLES.ADMIN],
  },
  {
  label: "Suppliers",
  path: "/admin/suppliers",
  roles: [ROLES.ADMIN],
  },
];