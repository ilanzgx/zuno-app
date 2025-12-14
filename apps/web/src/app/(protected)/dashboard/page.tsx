"use client";

import { useEffect, useState } from "react";
import { getTransactionsByUser } from "@/resources/transaction/transaction.service";
import { Transaction } from "@/resources/transaction/transaction.entity";
import {
  getSummary,
  getHistory,
} from "@/resources/portfolio/portfolio.service";
import {
  PortfolioSummary,
  PortfolioHistory,
} from "@/resources/portfolio/portfolio.types";
import { PortfolioChart } from "./components/portfolio-chart";
import { AssetDistributionChart } from "./components/asset-distribution-chart";
import { RecentTransactions } from "./components/recent-transactions";
import { SummaryCards } from "./components/summary-cards";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<PortfolioHistory[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transactionsData, summaryData, historyData] = await Promise.all([
          getTransactionsByUser(),
          getSummary(),
          getHistory(),
        ]);

        const sortedData = (transactionsData || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedData.slice(0, 5));
        setSummary(summaryData);
        setHistory(historyData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingTransactions(false);
        setLoadingSummary(false);
        setLoadingHistory(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="my-4">
        <h1 className="text-lg font-medium tracking-tight text-gray-900">
          Dashboard
        </h1>
      </div>

      <SummaryCards summary={summary} loading={loadingSummary} />

      <div className="grid gap-4 md:grid-cols-3">
        <PortfolioChart history={history} loading={loadingHistory} />
        <AssetDistributionChart summary={summary} loading={loadingSummary} />
      </div>

      <RecentTransactions
        transactions={transactions}
        loading={loadingTransactions}
      />
    </div>
  );
}
