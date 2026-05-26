import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, IndianRupee } from "lucide-react";

interface AccountSummaryCardProps {
  title: string;
  amount: number | string;
  type: "income" | "expense" | "balance";
  index: number;
}

export function AccountSummaryCard({ title, amount, type, index }: AccountSummaryCardProps) {
  const isIncome = type === "income";
  const isExpense = type === "expense";
  
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100 flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
        isIncome ? "bg-emerald-50 text-emerald-600" :
        isExpense ? "bg-rose-50 text-rose-600" :
        "bg-blue-50 text-blue-600"
      }`}>
        {isIncome ? <TrendingUp className="w-7 h-7" /> :
         isExpense ? <TrendingDown className="w-7 h-7" /> :
         <Wallet className="w-7 h-7" />}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{title}</p>
        <h4 className={`text-2xl font-bold tracking-tight ${
          isIncome ? "text-emerald-700" :
          isExpense ? "text-rose-700" :
          "text-gray-900"
        }`}>
          {formattedAmount}
        </h4>
      </div>
    </motion.div>
  );
}
