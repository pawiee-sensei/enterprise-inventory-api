export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="bg-surface text-xs uppercase text-text-secondary">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, align = "left" }) {
  return (
    <th className={`px-5 py-3 font-semibold text-${align}`}>{children}</th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function Tr({ children }) {
  return <tr className="hover:bg-surface/70">{children}</tr>;
}


export function Td({ children, align = "left", className = "" }) {
  return (
    <td className={`px-5 py-3 text-${align} ${className}`}>{children}</td>
  );
}