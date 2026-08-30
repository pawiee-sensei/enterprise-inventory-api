export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-border/60 ${className}`} />;
}

export function SkeletonRow({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-16" />
    </div>
  );
}