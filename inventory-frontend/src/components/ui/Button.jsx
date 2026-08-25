export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-navy text-white hover:bg-navy-light",
    danger: "bg-danger-bg text-danger hover:bg-danger/20",
    secondary: "border border-border bg-card text-text-primary hover:bg-surface",
  };

  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}