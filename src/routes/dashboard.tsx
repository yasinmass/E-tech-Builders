import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  HardHat,
  Users,
  Wrench,
  TrendingUp,
  ChevronRight,
  Calendar,
  UserCheck,
} from "lucide-react";
import api from "@/api/axios";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — E Tech Builders" },
      { name: "description", content: "Building supervisor dashboard." },
    ],
  }),
  component: DashboardPage,
});

interface Stats {
  builders: { count: number; total_assigned: number; sessions: number };
  etech: { count: number; total_assigned: number; sessions: number };
}

function useDashboardStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get<Stats>("/stats/");
      return data;
    },
    staleTime: 30_000,
  });
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

function StatCard({
  index,
  icon: Icon,
  label,
  value,
  sub,
  subLabel,
  gradient,
  to,
}: {
  index: number;
  icon: any;
  label: string;
  value: number | string;
  sub?: number | string;
  subLabel?: string;
  gradient: string;
  to: string;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.015 }}
      className="relative"
    >
      <Link to={to} className="block">
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft hover:shadow-lift transition-all overflow-hidden group">
          {/* Gradient accent blob */}
          <div
            className={`absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl ${gradient}`}
          />

          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
              {label}
            </p>
            <div className="text-4xl font-extrabold text-foreground tracking-tight">
              {value}
            </div>
          </div>

          {sub !== undefined && (
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-bold text-primary">{sub}</span>
              <span className="text-xs text-muted-foreground">{subLabel}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { members } = useAppStore();

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-white border border-border/40 shadow-soft p-2 flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary uppercase tracking-widest">{greeting}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            E Tech Builders
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground mb-4"
        >
          Overview
        </motion.p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-muted/50 rounded-3xl h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
              index={0}
              icon={Building2}
              label="Buildings"
              value={stats?.builders.count ?? 0}
              sub={stats?.builders.sessions ?? 0}
              subLabel="work sessions"
              gradient="bg-primary"
              to="/buildings"
            />
            <StatCard
              index={1}
              icon={Wrench}
              label="Workers Assigned"
              value={stats?.builders.total_assigned ?? 0}
              sub={stats?.builders.count ?? 0}
              subLabel="buildings covered"
              gradient="bg-primary"
              to="/filter"
            />
            <StatCard
              index={2}
              icon={HardHat}
              label="E Tech Projects"
              value={stats?.etech.count ?? 0}
              sub={stats?.etech.sessions ?? 0}
              subLabel="assignments"
              gradient="bg-primary"
              to="/etech"
            />
            <StatCard
              index={3}
              icon={UserCheck}
              label="Members Assigned"
              value={stats?.etech.total_assigned ?? 0}
              sub={stats?.etech.count ?? 0}
              subLabel="projects active"
              gradient="bg-primary"
              to="/filter"
            />
          </div>
        )}
      </div>

      {/* Members Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
            Workforce
          </p>
          <Link
            to="/members"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground">{members.length}</div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Members</p>
            </div>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.slice(0, 6).map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.phone}</p>
                  </div>
                </motion.div>
              ))}
              {members.length > 6 && (
                <Link
                  to="/members"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:text-primary transition-colors text-sm font-bold text-muted-foreground"
                >
                  +{members.length - 6} more <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No members yet</p>
              <Link to="/members" className="text-xs text-primary hover:underline">Add your first member →</Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/buildings", icon: Building2, label: "Manage Builders" },
            { to: "/etech", icon: HardHat, label: "E Tech Projects" },
            { to: "/members", icon: Users, label: "View Members" },
            { to: "/filter", icon: Calendar, label: "Assignment History" },
          ].map((action, i) => (
            <motion.div
              key={action.to}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -2 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center gap-3 p-5 bg-card border border-border/50 rounded-2xl shadow-soft hover:shadow-lift hover:border-primary/30 transition-all group text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <action.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
