import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("lost-found-theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("lost-found-theme", nextTheme);
    setTheme(nextTheme);
  };

  const value = useMemo(
    () => ({ selectedItem, setSelectedItem, theme, toggleTheme }),
    [selectedItem, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
};
