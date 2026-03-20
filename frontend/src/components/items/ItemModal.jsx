import { Dialog, DialogPanel } from "@headlessui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatters";
import { StatusBadge } from "../shared/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export const ItemModal = ({ item, matches = [], open, onClose, onContact }) => {
  const { user } = useAuth();
  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            as={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl"
          >
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <img src={item.imageUrl} alt={item.title} className="h-full min-h-[320px] w-full object-cover" />
              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between">
                  <StatusBadge item={item} />
                  <button type="button" onClick={onClose} className="text-sm text-slate-400">
                    Close
                  </button>
                </div>
                <div>
                  <h2 className="font-display text-3xl font-bold text-white">{item.title}</h2>
                  <p className="mt-3 text-slate-300">{item.description}</p>
                </div>
                <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="inline-flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    {item.location}
                  </p>
                  <p>Posted by {item.user?.name}</p>
                  <p>Updated {formatDate(item.updatedAt)}</p>
                </div>

                {user && user._id !== item.user?._id && (
                  <button
                    type="button"
                    onClick={() => onContact(item)}
                    className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white transition hover:bg-brand-400"
                  >
                    Contact Owner
                  </button>
                )}

                {!user && (
                  <Link to="/login" className="block rounded-2xl bg-brand-500 px-4 py-3 text-center font-medium text-white">
                    Login to contact owner
                  </Link>
                )}

                <div>
                  <h3 className="font-display text-xl font-semibold text-white">AI Suggested Matches</h3>
                  <div className="mt-3 grid gap-3">
                    {matches.length ? (
                      matches.map(({ item: match, similarity }) => (
                        <div key={match._id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                          <img src={match.imageUrl} alt={match.title} className="h-16 w-16 rounded-2xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-white">{match.title}</p>
                            <p className="text-sm text-slate-400">{match.location}</p>
                          </div>
                          <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs text-brand-200">
                            {(similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No close visual matches yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
