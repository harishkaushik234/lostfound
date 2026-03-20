import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ItemCard } from "../components/items/ItemCard";
import { ItemModal } from "../components/items/ItemModal";
import { useApp } from "../context/AppContext";

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { selectedItem, setSelectedItem } = useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || ""
  });

  const loadItems = async () => {
    const { data } = await api.get("/items/me/list");
    setItems(data.items);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openItem = async (item) => {
    const { data } = await api.get(`/items/${item._id}`);
    setSelectedItem(data.item);
    setMatches(data.matches);
  };

  const markResolved = async (item) => {
    await api.put(`/items/${item._id}`, { status: item.status === "resolved" ? "open" : "resolved" });
    toast.success("Item updated");
    loadItems();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/items/${itemId}`);
    toast.success("Item deleted");
    loadItems();
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Profile</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">{user?.name}</h1>
          <p className="mt-3 text-slate-300">Manage your identity and keep your item posts updated.</p>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              await updateProfile(form);
            } catch (error) {
              toast.error(error.response?.data?.message || "Unable to update profile");
            }
          }}
          className="grid gap-4"
        >
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
            placeholder="Name"
          />
          <input
            value={form.avatar}
            onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
            placeholder="Avatar URL"
          />
          <textarea
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            className="min-h-28 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
            placeholder="Short bio"
          />
          <button type="submit" className="rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white">
            Save Profile
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Your posts</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">My lost & found reports</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="space-y-3">
              <ItemCard item={item} onOpen={openItem} />
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/items/${item._id}/edit`)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => markResolved(item)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {item.status === "resolved" ? "Reopen" : "Mark Resolved"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item._id)}
                className="w-full rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      <ItemModal
        item={selectedItem}
        matches={matches}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onContact={() => {}}
      />
    </div>
  );
};
