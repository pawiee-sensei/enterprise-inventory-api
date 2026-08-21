export const formatDate = (isoString) => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};