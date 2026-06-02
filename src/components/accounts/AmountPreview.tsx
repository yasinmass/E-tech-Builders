import { motion } from "framer-motion";
import { formatIndianCurrency, formatInLakhs, numberToWords } from "@/utils/currency";

interface AmountPreviewProps {
  amount: string | number;
}

export function AmountPreview({ amount }: AmountPreviewProps) {
  const num = parseFloat(amount.toString());
  
  if (isNaN(num) || amount === "" || num < 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 shadow-inner"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-black text-gray-900">
          {formatIndianCurrency(num)}
        </span>
        <span className="text-xs font-bold text-primary/70">
          {formatInLakhs(num)}
        </span>
      </div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-relaxed">
        {numberToWords(num)}
      </div>
    </motion.div>
  );
}
