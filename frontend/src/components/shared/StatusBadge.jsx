import { getStatusBadge } from "../../utils/formatters";

export const StatusBadge = ({ item }) => {
  const badge = getStatusBadge(item);

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge.classes}`}>
      {badge.label}
    </span>
  );
};
