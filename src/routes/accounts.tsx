import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuildings } from "@/hooks/useBuildings";
import { useTransactions, useAccountSummary } from "@/hooks/useAccounts";
import { AccountSummaryCard } from "@/components/accounts/AccountSummaryCard";
import { TransactionList } from "@/components/accounts/TransactionList";
import { AddTransactionModal } from "@/components/accounts/AddTransactionModal";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Wallet, 
  Building2, 
  LayoutDashboard,
  Search,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: buildings = [] } = useBuildings();
  const { data: transactions = [], isLoading: loadingTx } = useTransactions({ 
    building_id: selectedBuildingId 
  });
  const { data: summary } = useAccountSummary(selectedBuildingId);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Accounts</h1>
          </div>
          <p className="text-muted-foreground font-medium">Manage building-wise income, expenses and balance.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Building Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-5 rounded-2xl gap-3 border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold shadow-sm min-w-[200px] justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="truncate max-w-[150px]">
                    {selectedBuilding?.name || "Select Building"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px] rounded-2xl p-2 border-gray-100 shadow-xl" align="end">
              {buildings.map((building) => (
                <DropdownMenuItem
                  key={building.id}
                  onClick={() => setSelectedBuildingId(building.id)}
                  className="rounded-xl px-4 py-3 cursor-pointer focus:bg-primary/5 focus:text-primary font-bold group transition-all"
                >
                  <Building2 className="w-4 h-4 mr-3 text-gray-400 group-focus:text-primary" />
                  {building.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedBuildingId}
            className="h-12 px-6 rounded-2xl bg-foreground text-background font-bold shadow-lift active:scale-95 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedBuildingId ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-32 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
               <Building2 className="w-10 h-10 text-gray-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Building Selected</h2>
              <p className="text-gray-400 max-w-sm mx-auto font-medium">Please select a building from the dropdown above to manage its accounts and view transaction history.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AccountSummaryCard
                title="Total Received"
                amount={summary?.total_income || 0}
                type="income"
                index={0}
              />
              <AccountSummaryCard
                title="Total Expenses"
                amount={summary?.total_expense || 0}
                type="expense"
                index={1}
              />
              <AccountSummaryCard
                title="Current Balance"
                amount={summary?.current_balance || 0}
                type="balance"
                index={2}
              />
            </div>

            {/* Transactions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Transaction History
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest ml-2">Live</span>
                 </h2>
              </div>
              
              {loadingTx ? (
                 <div className="grid place-items-center py-20 bg-white rounded-[2.5rem] shadow-soft border border-gray-100">
                    <motion.div
                       animate={{ rotate: 360 }}
                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                       <LayoutDashboard className="w-8 h-8 text-primary/30" />
                    </motion.div>
                 </div>
              ) : (
                <TransactionList transactions={transactions} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddTransactionModal
        buildingId={selectedBuildingId}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
