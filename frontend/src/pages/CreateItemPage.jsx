import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { ItemForm } from "../components/items/ItemForm";

export const CreateItemPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);
      await api.post("/items", payload);
      toast.success("Item posted successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Create Post</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Share a lost or found item</h1>
      </div>
      <ItemForm onSubmit={handleCreate} submitting={submitting} />
    </div>
  );
};
