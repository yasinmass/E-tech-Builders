import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Filter, HardHat, Menu, X, LogOut, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { logout } from "@/api/auth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buildings", label: "Builders", icon: Building2 },
  { to: "/etech", label: "E Tech", icon: HardHat },
  { to: "/members", label: "Members", icon: Users },
  { to: "/filter", label: "Filter", icon: Filter },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.navigate({ to: "/login" });
  };

  const nav = (
    <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to || (item.to === "/dashboard" && pathname === "/");
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className="relative group"
          >
            <motion.div
              whileHover={{ x: 2 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-primary-foreground shadow-soft"
                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="px-3 py-4 border-t border-sidebar-border">
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );

  const header = (
    <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-sm border border-sidebar-border/30">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
      </div>
      <div>
        <div className="text-sidebar-foreground font-display font-semibold leading-tight text-lg">
          E Tech
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-primary">Builders</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 z-40 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white p-1">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-semibold">E Tech Builders</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex-col z-30">
        {header}
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-foreground/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="md:hidden fixed top-14 left-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground z-50 border-r border-sidebar-border flex flex-col"
          >
            {nav}
            {footer}
          </motion.aside>
        </>
      )}
    </>
  );
}
