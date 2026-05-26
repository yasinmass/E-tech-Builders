import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTransaction } from "@/hooks/useAccounts";
import { toast } from "sonner";
import { Loader2, Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface AddTransactionModalProps {
  buildingId: string;
  isOpen: boolean;
  onClose: () => void;
}

const INCOME_CATEGORIES = [
  { value: "owner_payment", label: "Owner Payment" },
  { value: "advance", label: "Advance" },
  { value: "other", label: "Other" },
];

const EXPENSE_CATEGORIES = [
  { value: "sand", label: "Sand" },
  { value: "cement", label: "Cement" },
  { value: "steel", label: "Steel" },
  { value: "painting", label: "Painting" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "labour", label: "Labour" },
  { value: "other", label: "Other" },
];

export function AddTransactionModal({ buildingId, isOpen, onClose }: AddTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [notes, setNotes] = useState("");
  
  const mutation = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === "other" ? otherCategory : category;

    if (!amount || !finalCategory || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await mutation.mutateAsync({
        building: parseInt(buildingId),
        transaction_type: type,
        category: finalCategory,
        amount: parseFloat(amount),
        notes,
        date,
      });
      toast.success("Transaction recorded successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  };

  const reset = () => {
    setAmount("");
    setDate(new Date().toISOString().split('T')[0]);
    setCategory("");
    setOtherCategory("");
    setNotes("");
    setType("expense");
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className={`h-2 w-full ${type === "income" ? "bg-emerald-500" : "bg-rose-500"}`} />
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className={`p-2 rounded-xl ${type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <Plus className="w-6 h-6" />
              </div>
              Add Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => { setType("income"); setCategory(""); }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" /> Income
              </button>
              <button
                type="button"
                onClick={() => { setType("expense"); setCategory(""); }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  type === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowDownCircle className="w-4 h-4" /> Expense
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white text-lg font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-medium">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="rounded-xl py-3 px-4 focus:bg-gray-50">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {category === "other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Specify "Other"</label>
                <Input
                  placeholder="Enter custom category..."
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-medium"
                />
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description / Notes</label>
              <Textarea
                placeholder="Added for sand at site..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50 focus:bg-white resize-none py-4 px-5 font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className={`flex-1 h-14 rounded-2xl font-bold text-white shadow-lift transition-all active:scale-95 ${
                type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
