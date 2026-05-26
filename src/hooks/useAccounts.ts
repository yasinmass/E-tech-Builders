import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getTransactions, 
  getAccountSummary, 
  createTransaction, 
  deleteTransaction,
  type CreateTransactionPayload 
} from "@/api/accounts";

export const ACCOUNTS_KEY = ["accounts"] as const;

export function useTransactions(filters: {
  building_id?: string;
  transaction_type?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: [...ACCOUNTS_KEY, "list", filters],
    queryFn: () => getTransactions(filters),
    staleTime: 5000,
  });
}

export function useAccountSummary(buildingId?: string) {
  return useQuery({
    queryKey: [...ACCOUNTS_KEY, "summary", buildingId],
    queryFn: () => (buildingId ? getAccountSummary(buildingId) : null),
    enabled: !!buildingId,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createTransaction(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...ACCOUNTS_KEY] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...ACCOUNTS_KEY] });
    },
  });
}
