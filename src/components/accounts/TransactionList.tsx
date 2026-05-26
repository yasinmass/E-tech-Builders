import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Trash2, 
  Calendar, 
  Tag, 
  FileText,
  Search,
  Filter as FilterIcon
} from "lucide-react";
import { type Transaction } from "@/api/accounts";
import { format } from "date-fns";
import { useDeleteTransaction } from "@/hooks/useAccounts";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [search, setSearch] = useState("");
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Transaction deleted");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  const filtered = transactions.filter(t => 
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.notes.toLowerCase().includes(search.toLowerCase()) ||
    t.amount.toString().includes(search) ||
    t.date.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search category, notes or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-2xl border-gray-200 bg-white/80 focus:bg-white text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-widest">
           <FilterIcon className="w-3 h-3" />
           {filtered.length} Entries
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Balance</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {format(new Date(t.date), "dd/MM/yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Tag className={`w-3 h-3 ${t.transaction_type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <span className="text-sm font-bold text-gray-900 capitalize">
                          {t.category.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500 truncate max-w-[200px] font-medium">
                          {t.notes || "No description"}
                        </span>
                      </div>
                    </td>
                    <td className={`px-8 py-6 text-right font-bold tabular-nums ${
                      t.transaction_type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.transaction_type === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 1,
                      }).format(Number(t.amount))}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-gray-900 tabular-nums">
                      {new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 1,
                      }).format(t.running_balance || 0)}
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button
                         onClick={() => handleDelete(t.id)}
                         className="p-2.5 rounded-xl text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic text-sm font-medium">
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
