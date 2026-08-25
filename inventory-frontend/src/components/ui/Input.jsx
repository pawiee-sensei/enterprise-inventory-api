export function Input(props) {
  return (
    <input
      {...props}
      className={`rounded-md border border-border bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-navy/30 ${props.className || ""}`}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={`rounded-md border border-border bg-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-navy/30 ${props.className || ""}`}
    >
      {children}
    </select>
  );
}