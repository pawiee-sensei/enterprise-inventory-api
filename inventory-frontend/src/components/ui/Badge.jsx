export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-surface text-text-secondary",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    danger: "bg-danger-bg text-danger",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}