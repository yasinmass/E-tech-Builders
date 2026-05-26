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
  Wallet,
  TrendingDown,
  Search,
} from "lucide-react";
import api from "@/api/axios";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — E Tech Builders" },
      { name: "description", content: "Building supervisor dashboard." },
    ],
  }),
  component: DashboardPage,
});

interface Activity {
  type: "builder" | "transaction" | "etech";
  message: string;
  date: string;
  time: string;
}

interface Stats {
  builders: { count: number; total_assigned: number; sessions: number };
  etech: { count: number; total_assigned: number; sessions: number };
  finance: { total_income: number; total_expense: number; current_balance: number };
  recent_activity: Activity[];
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
  isCurrency = false,
}: {
  index: number;
  icon: any;
  label: string;
  value: number | string;
  sub?: number | string;
  subLabel?: string;
  gradient: string;
  to: string;
  isCurrency?: boolean;
}) {
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value))
    : value;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.015 }}
      className="relative h-full"
    >
      <Link to={to} className="block h-full">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-soft hover:shadow-lift transition-all h-full flex flex-col group relative overflow-hidden">
          <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity blur-2xl ${gradient}`} />
          
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              gradient === "bg-emerald-500" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              gradient === "bg-rose-500" ? "bg-rose-50 text-rose-600 border-rose-100" :
              "bg-blue-50 text-blue-600 border-blue-100"
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1">
            {label}
          </p>
          <div className="text-3xl font-bold text-gray-900 tracking-tight mb-auto">
            {formattedValue}
          </div>

          {sub !== undefined && (
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">{sub}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subLabel}</span>
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 pb-24">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5"
        >
          <div className="w-20 h-20 rounded-3xl bg-white border border-gray-100 shadow-soft p-3 flex-shrink-0 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                {greeting}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mt-1">
              E Tech Builders
            </h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <Link to="/accounts">
             <Button className="h-12 px-6 rounded-2xl bg-foreground text-background font-bold shadow-lift hover:bg-neutral-800 transition-all gap-2">
                <Wallet className="w-4 h-4" />
                Accounts
             </Button>
          </Link>
          <Link to="/buildings">
             <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold border-gray-200 hover:bg-gray-50 bg-white transition-all">
                Add Project
             </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Workforce */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Stats Grid */}
          <section className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Business Pulse</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard
                 index={0}
                 icon={Wallet}
                 label="Total Balance"
                 value={stats?.finance.current_balance ?? 0}
                 isCurrency
                 gradient="bg-blue-500"
                 to="/accounts"
               />
               <StatCard
                 index={1}
                 icon={TrendingUp}
                 label="Total Income"
                 value={stats?.finance.total_income ?? 0}
                 isCurrency
                 gradient="bg-emerald-500"
                 to="/accounts"
               />
               <StatCard
                 index={2}
                 icon={TrendingDown}
                 label="Total Expenses"
                 value={stats?.finance.total_expense ?? 0}
                 isCurrency
                 gradient="bg-rose-500"
                 to="/accounts"
               />
            </div>
          </section>

          {/* Module Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Builders Box */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-soft relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
               <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Builders Module</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stats?.builders.count ?? 0}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Sites</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stats?.builders.total_assigned ?? 0}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Labor Count</p>
                    </div>
                  </div>
                  <Link to="/buildings" className="mt-8 flex items-center justify-center w-full py-4 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500 hover:bg-primary/5 hover:text-primary transition-all gap-2">
                    Manage Building Sites <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>

            {/* E Tech Box */}
            <div className="border border-gray-100 rounded-[2.5rem] p-8 shadow-soft relative overflow-hidden group bg-neutral-900 text-white">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
               <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <HardHat className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">E Tech Module</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-3xl font-bold text-white">{stats?.etech.count ?? 0}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Projects</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">{stats?.etech.total_assigned ?? 0}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Members</p>
                    </div>
                  </div>
                  <Link to="/etech" className="mt-8 flex items-center justify-center w-full py-4 bg-white/5 rounded-2xl text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all gap-2">
                    Manage E Tech Lab <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <section className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Tools & Utilities</p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { to: "/filter", icon: Search, label: "Search History", color: "text-blue-500" },
                  { to: "/members", icon: Users, label: "Member List", color: "text-purple-500" },
                  { to: "/dashboard", icon: TrendingUp, label: "View Reports", color: "text-emerald-500" },
                  { to: "/dashboard", icon: Wrench, label: "Settings", color: "text-gray-500" },
                ].map((action, i) => (
                  <Link key={i} to={action.to} className="p-5 bg-white border border-gray-100 rounded-3xl flex flex-col items-center gap-3 hover:shadow-soft hover:border-primary/20 transition-all group">
                    <div className={`p-3 rounded-2xl bg-gray-50 group-hover:scale-110 transition-transform ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{action.label}</span>
                  </Link>
                ))}
             </div>
          </section>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-soft h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                   Recent Activity
                   <span className="w-2 h-2 rounded-full bg-emerald-500" />
                 </h3>
                 <span className="text-[10px] font-black text-primary p-2 bg-primary/5 rounded-lg uppercase tracking-tighter">Live Feed</span>
              </div>

              {isLoading ? (
                <div className="space-y-4 flex-1">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="h-16 w-full bg-gray-50 animate-pulse rounded-2xl" />
                   ))}
                </div>
              ) : (
                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {stats?.recent_activity.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex gap-4 relative"
                    >
                      {i !== (stats?.recent_activity.length - 1) && (
                        <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-100" />
                      )}
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                        item.type === 'transaction' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                         {item.type === 'transaction' ? <Wallet className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                         <p className="text-sm font-bold text-gray-900 leading-snug">{item.message}</p>
                         <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-bold text-gray-400 capitalize">{item.type}</span>
                           <span className="w-1 h-1 rounded-full bg-gray-200" />
                           <span className="text-[10px] font-bold text-gray-400">{item.time.slice(0, 5)}</span>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                  {stats?.recent_activity.length === 0 && (
                    <div className="text-center py-20 text-gray-400 italic text-sm">
                      No recent activity recorded.
                    </div>
                  )}
                </div>
              )}

              <Link to="/filter" className="mt-8 py-4 w-full border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:border-primary/30 transition-all text-center">
                 View Combined Logs
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
