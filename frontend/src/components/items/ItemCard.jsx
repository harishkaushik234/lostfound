import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatters";
import { StatusBadge } from "../shared/StatusBadge";

export const ItemCard = ({ item, onOpen }) => (
  <motion.button
    type="button"
    whileHover={{ y: -6 }}
    onClick={() => onOpen(item)}
    className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 text-left shadow-glow transition hover:border-brand-400/40"
  >
    <div className="relative overflow-hidden">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute left-4 top-4">
        <StatusBadge item={item} />
      </div>
    </div>

    <div className="space-y-4 p-5">
      <div>
        <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-300">{item.description}</p>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <MapPinIcon className="h-4 w-4" />
          {item.location}
        </span>
        <span>{formatDate(item.createdAt)}</span>
      </div>
    </div>
  </motion.button>
);
