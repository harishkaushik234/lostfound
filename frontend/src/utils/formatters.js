export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export const getStatusBadge = (item) => {
  if (item.status === "resolved") {
    return { label: "Resolved", classes: "bg-emerald-500/20 text-emerald-300" };
  }

  return item.category === "lost"
    ? { label: "Lost", classes: "bg-rose-500/20 text-rose-200" }
    : { label: "Found", classes: "bg-sky-500/20 text-sky-200" };
};
