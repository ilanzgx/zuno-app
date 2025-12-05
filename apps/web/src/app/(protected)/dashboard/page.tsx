"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Resumo da carteira
        </h1>
        <p className="text-muted-foreground">
          Visão geral da sua carteira de investimentos.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Saldo Bruto</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>

            {loadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[140px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summary ? formatCurrency(summary.grossBalance) : "R$ 0,00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary && summary.profitOrLoss !== 0
                    ? `${formatCurrency(Math.abs(summary.profitOrLoss))} ${
                        summary.profitOrLoss >= 0 ? "de lucro" : "de prejuízo"
                      }`
                    : "Sem variação"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Valor Aplicado
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            {loadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[140px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summary ? formatCurrency(summary.appliedBalance) : "R$ 0,00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total investido em ativos
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Rentabilidade
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            {loadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {summary
                    ? formatPercentage(summary.percentageProfit)
                    : "0,00%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Retorno sobre o valor aplicado
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
