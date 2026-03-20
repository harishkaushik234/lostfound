import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export const AuthPage = ({ mode = "login" }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-glow">
      <p className="text-sm uppercase tracking-[0.28em] text-brand-300">
        {isRegister ? "Create account" : "Welcome back"}
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-white">
        {isRegister ? "Join the community" : "Sign in"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {isRegister && (
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Full name"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
            required
          />
        )}
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email address"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none focus:border-brand-400"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white transition hover:bg-brand-400 disabled:opacity-50"
        >
          {submitting ? "Please wait..." : isRegister ? "Create account" : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-300">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          to={isRegister ? "/login" : "/register"}
          className="font-medium text-brand-300 transition hover:text-brand-200"
        >
          {isRegister ? "Login here" : "Sign up here"}
        </Link>
      </div>
    </div>
  );
};
