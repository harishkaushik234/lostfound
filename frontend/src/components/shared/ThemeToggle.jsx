import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useApp } from "../../context/AppContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur transition hover:border-brand-400/50 hover:bg-brand-500/10"
    >
      {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
};
