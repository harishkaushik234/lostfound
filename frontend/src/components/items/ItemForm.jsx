import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";

const initialState = {
  title: "",
  description: "",
  location: "",
  category: "lost",
  status: "open"
};

export const ItemForm = ({ initialValues, onSubmit, submitting }) => {
  const [form, setForm] = useState(initialValues || initialState);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let imagePayload = {};

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const { data } = await api.post("/uploads/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      imagePayload = data;
    }

    if (!initialValues && !imagePayload.imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    await onSubmit({ ...form, ...imagePayload });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[32px] border border-white/10 bg-white/5 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <input
          value={form.title}
          onChange={(event) => handleChange("title", event.target.value)}
          placeholder="Item title"
          className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
          required
        />
        <input
          value={form.location}
          onChange={(event) => handleChange("location", event.target.value)}
          placeholder="Last seen or found at"
          className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
          required
        />
      </div>

      <textarea
        value={form.description}
        onChange={(event) => handleChange("description", event.target.value)}
        placeholder="Describe the item, identifying marks, and when it was lost or found"
        className="min-h-36 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
        required
      />

      <div className="grid gap-5 md:grid-cols-3">
        <select
          value={form.category}
          onChange={(event) => handleChange("category", event.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select
          value={form.status}
          onChange={(event) => handleChange("status", event.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
        >
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          className="rounded-2xl border border-dashed border-white/20 bg-slate-900/40 px-4 py-3 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-2xl bg-brand-500 px-5 py-3 font-medium text-white transition hover:bg-brand-400 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Item"}
      </button>
    </form>
  );
};
