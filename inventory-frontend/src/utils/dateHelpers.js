export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? 6 : day - 1; // treat Monday as the first day
  d.setDate(d.getDate() - diff);
  return d;
}

export function startOfMonth(date) {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function percentChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// sums total_amount and counts sales whose sale_date falls within [start, end)
export function sumSalesInRange(sales, start, end) {
  const matching = sales.filter((s) => {
    const date = new Date(s.sale_date);
    return date >= start && date < end;
  });

  return {
    revenue: matching.reduce((sum, s) => sum + Number(s.total_amount || 0), 0),
    count: matching.length,
  };
}