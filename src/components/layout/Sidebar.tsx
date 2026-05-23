import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Filter, HardHat, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buildings", label: "Buildings", icon: Building2 },
  { to: "/filter", label: "Filter", icon: Filter },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 px-3 py-4">
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

  const header = (
    <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
      <div className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center">
        <HardHat className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <div className="text-sidebar-foreground font-display font-semibold leading-tight">
          BuildOps
        </div>
        <div className="text-xs text-sidebar-muted">Supervisor Suite</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 z-40 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <HardHat className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold">BuildOps</span>
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
            className="md:hidden fixed top-14 left-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground z-50 border-r border-sidebar-border"
          >
            {nav}
          </motion.aside>
        </>
      )}
    </>
  );
}
