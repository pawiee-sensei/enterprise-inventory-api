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
    label: "Sales",
    path: "/sales",
    roles: [ROLES.ADMIN, ROLES.STAFF],
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
  {
  label: "Products",
  path: "/products",
  roles: [ROLES.STAFF],
  },
  {
    label: "Inventory Log",
    path: "/inventory",
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: "Stock Requests",
    path: "/stock-requests",
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
];