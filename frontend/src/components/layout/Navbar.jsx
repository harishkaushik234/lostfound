import { Link, NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, PlusCircleIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../shared/ThemeToggle";

const linkClasses = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/10"
  }`;

export const Navbar = () => {
  const { user, logout, totalUnreadCount } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
          Lost<span className="text-brand-400">&</span>Found
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClasses}>
            Explore
          </NavLink>
          {user && (
            <>
              <NavLink to="/create" className={linkClasses}>
                Post Item
              </NavLink>
              <NavLink to="/chat" className={linkClasses}>
                <span className="inline-flex items-center gap-2">
                  Chats
                  {totalUnreadCount > 0 && (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                      +{totalUnreadCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink to="/profile" className={linkClasses}>
                Profile
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-brand-100"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900">
              Login
            </Link>
          )}
        </div>
      </nav>

      {user && (
        <div className="border-t border-white/5 md:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-4 px-4 py-2 text-xs text-slate-300">
            <NavLink to="/" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 hover:bg-white/5">
              <HomeIcon className="h-5 w-5" />
              Explore
            </NavLink>
            <NavLink to="/create" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 hover:bg-white/5">
              <PlusCircleIcon className="h-5 w-5" />
              Post
            </NavLink>
            <NavLink to="/chat" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 hover:bg-white/5">
              <div className="relative">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    +{totalUnreadCount}
                  </span>
                )}
              </div>
              Chat
            </NavLink>
            <NavLink to="/profile" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 hover:bg-white/5">
              <UserCircleIcon className="h-5 w-5" />
              Profile
            </NavLink>
          </div>
        </div>
      )}
    </motion.header>
  );
};
