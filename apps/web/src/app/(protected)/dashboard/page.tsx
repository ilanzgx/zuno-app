"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
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
        setAllTransactions(sortedData);
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

  const getLargestAssetClass = () => {
    if (!summary || !summary.allocation || summary.allocation.length === 0) {
      return null;
    }
    const largest = summary.allocation.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
    return largest;
  };

  const getUniqueAssetsCount = () => {
    if (!allTransactions || allTransactions.length === 0) {
      return 0;
    }
    const uniqueTickers = new Set(allTransactions.map((t) => t.ticker));
    return uniqueTickers.size;
  };

  const assetTypeTranslation: Record<string, string> = {
    STOCK: "Ações",
    FII: "FIIs",
    BDR: "BDRs",
    CRYPTO: "Criptomoedas",
  };

  return (
    <div className="space-y-6">
      <div className="my-4">
        <h1 className="text-lg font-medium tracking-tight text-gray-900">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <Card>
          <CardContent>
            <CardTitle className="text-sm font-medium">Saldo Bruto</CardTitle>
            {loadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[140px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            ) : (
              <>
                <div className="text-lg font-bold">
                  {summary ? formatCurrency(summary.grossBalance) : "R$ 0,00"}
                </div>
                <Separator className="my-4" />
                {(() => {
                  const largestClass = getLargestAssetClass();
                  return largestClass ? (
                    <>
                      <p className="text-sm font-medium">
                        Maior classe de ativos:
                      </p>
                      <p className="text-sm">
                        <span className="text-[#549d8c] font-bold">
                          {formatCurrency(largestClass.value)}
                        </span>{" "}
                        em{" "}
                        <span className="text-[#549d8c] font-bold">
                          {assetTypeTranslation[largestClass.type] ||
                            largestClass.type}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma alocação disponível
                    </p>
                  );
                })()}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle className="text-sm font-medium">
              Valor Aplicado
            </CardTitle>
            {loadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[140px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            ) : (
              <>
                <div className="text-lg font-bold">
                  {summary ? formatCurrency(summary.appliedBalance) : "R$ 0,00"}
                </div>
                <Separator className="my-4" />
                <p className="text-sm font-medium">Lucro/Prejuízo:</p>
                <p className="text-sm">
                  <span className="text-[#549d8c] font-bold">
                    {summary && summary.profitOrLoss !== 0
                      ? formatCurrency(Math.abs(summary.profitOrLoss))
                      : "R$ 0,00"}
                  </span>{" "}
                  {summary && summary.profitOrLoss >= 0
                    ? "de lucro"
                    : "de prejuízo"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
            {loadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            ) : (
              <>
                <div className="text-lg font-bold">
                  {summary
                    ? formatPercentage(summary.percentageProfit)
                    : "0,00%"}
                </div>
                <Separator className="my-4" />
                <p className="text-sm font-medium">Ultimos 12 meses:</p>
                <p className="text-sm">
                  <span className="text-[#549d8c] font-bold">X.XX%</span> de
                  rentabilidade
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
