import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { ItemForm } from "../components/items/ItemForm";
import { Loader } from "../components/shared/Loader";

export const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data.item);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load item");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, navigate]);

  if (loading) {
    return <Loader label="Loading item..." />;
  }

  const handleUpdate = async (payload) => {
    try {
      setSubmitting(true);
      await api.put(`/items/${id}`, payload);
      toast.success("Item updated");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Edit Post</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Update your report</h1>
      </div>
      <ItemForm initialValues={item} onSubmit={handleUpdate} submitting={submitting} />
    </div>
  );
};
