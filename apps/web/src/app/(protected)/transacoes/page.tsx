"use client";

import { useEffect, useState } from "react";
import { getTransactionsByUser } from "@/resources/transaction/transaction.service";
import { Transaction } from "@/resources/transaction/transaction.entity";
import { TransactionsTable } from "./components/transactions-table";
import { TransactionsTableSkeleton } from "./components/transactions-table-skeleton";

export default function TransacoesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getTransactionsByUser();
        const sortedData = (data || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedData);
        setFilteredTransactions(sortedData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.ticker.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query)
    );
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as suas transações.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border bg-card">
          <div className="p-4 flex gap-4 border-b">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
              placeholder="Pesquise por ativo ou tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {loading ? (
            <TransactionsTableSkeleton />
          ) : (
            <TransactionsTable transactions={filteredTransactions} />
          )}
        </div>
      </div>
    </div>
  );
}
