import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { ItemCard } from "../components/items/ItemCard";
import { ItemFilters } from "../components/items/ItemFilters";
import { ItemModal } from "../components/items/ItemModal";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { useApp } from "../context/AppContext";

export const HomePage = () => {
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    status: ""
  });
  const { selectedItem, setSelectedItem } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/items", { params: filters });
        setItems(data.items);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [filters]);

  const openItem = async (item) => {
    const { data } = await api.get(`/items/${item._id}`);
    setSelectedItem(data.item);
    setMatches(data.matches);
  };

  const contactOwner = async (item) => {
    try {
      const { data } = await api.post("/chat/conversations", { itemId: item._id });
      navigate("/chat", { state: { conversation: data.conversation } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start chat");
    }
  };

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-8 shadow-glow"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(11,143,240,0.28),transparent_30%)]" />
        <div className="relative max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Lost & Found Platform</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Recover valuables faster with realtime community support.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Publish lost and found posts, connect instantly with owners, and use AI-powered image similarity to surface likely matches.
          </p>
        </div>
      </motion.section>

      <ItemFilters
        filters={filters}
        onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : items.map((item) => <ItemCard key={item._id} item={item} onOpen={openItem} />)}
      </section>

      <ItemModal
        item={selectedItem}
        matches={matches}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onContact={contactOwner}
      />
    </div>
  );
};
