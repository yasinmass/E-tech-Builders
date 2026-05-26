import api from "./axios";

export interface Transaction {
  id: number;
  building: number;
  building_name: string;
  transaction_type: "income" | "expense";
  category: string;
  amount: number | string;
  notes: string;
  created_at: string;
  running_balance?: number;
}

export interface AccountSummary {
  total_income: number;
  total_expense: number;
  current_balance: number;
}

export interface CreateTransactionPayload {
  building: number;
  transaction_type: "income" | "expense";
  category: string;
  amount: number;
  notes: string;
}

export async function getTransactions(params: {
  building_id?: string;
  transaction_type?: string;
  category?: string;
}) {
  const { data } = await api.get<Transaction[]>("/accounts/", { params });
  return data;
}

export async function getAccountSummary(buildingId: string) {
  const { data } = await api.get<AccountSummary>(`/accounts/summary/${buildingId}/`);
  return data;
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const { data } = await api.post<Transaction>("/accounts/", payload);
  return data;
}

export async function deleteTransaction(id: number) {
  return api.delete(`/accounts/${id}/`);
}
