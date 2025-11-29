"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { getTransactionsByUser } from "@/resources/transaction/transaction.service";
import { Transaction } from "@/resources/transaction/transaction.entity";
import { getSummary } from "@/resources/portfolio/portfolio.service";
import { PortfolioSummary } from "@/resources/portfolio/portfolio.types";

const dataPatrimonio = [
  { name: "Jan", valor: 10000 },
  { name: "Fev", valor: 12000 },
  { name: "Mar", valor: 11500 },
  { name: "Abr", valor: 15000 },
  { name: "Mai", valor: 18000 },
  { name: "Jun", valor: 22000 },
];

const COLORS = [
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

const translateAssetType = (type: string): string => {
  const translations: Record<string, string> = {
    STOCK: "Ações",
    FII: "Fundos imobiliários",
    BDR: "BDR",
  };
  return translations[type] || type;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transactionsData, summaryData] = await Promise.all([
          getTransactionsByUser(),
          getSummary(),
        ]);

        const sortedData = (transactionsData || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedData.slice(0, 5));
        setSummary(summaryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingTransactions(false);
        setLoadingSummary(false);
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
        <h1 className="text-3xl font-bold tracking-tight">
          Resumo da carteira
        </h1>
        <p className="text-muted-foreground">
          Visão geral da sua carteira de investimentos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Bruto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Aplicado
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Patrimonio histórico</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loadingSummary ? (
              <div className="h-[350px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </div>
            ) : (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dataPatrimonio}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 20,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) =>
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value)
                      }
                      labelStyle={{ color: "#374151", fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="valor"
                      stroke="#3B82F6"
                      strokeWidth={2.5}
                      fill="url(#colorValor)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#3B82F6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição de Ativos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loadingSummary ? (
              <div className="h-[350px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </div>
            ) : summary &&
              summary.allocation &&
              summary.allocation.length > 0 ? (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[...summary.allocation].sort(
                        (a, b) => b.percentage - a.percentage
                      )}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percent }) => `${(percent! * 100).toFixed(1)}%`}
                      labelLine={false}
                      fontSize={12}
                    >
                      {[...summary.allocation]
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ fontSize: "12px" }}
                      formatter={(value, entry: any) => {
                        const sortedAllocation = [...summary.allocation].sort(
                          (a, b) => b.percentage - a.percentage
                        );
                        const item = sortedAllocation.find(
                          (a) => a.value === entry.payload.value
                        );
                        return `${translateAssetType(
                          item?.type || value
                        )} - ${new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item?.value || 0)}`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Nenhum ativo na carteira
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Últimas Movimentações</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Suas 5 transações mais recentes
            </p>
          </div>
          <a
            href="/transacoes"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Ver todas
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </CardHeader>
        <CardContent>
          {loadingTransactions ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-6 w-20" />
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const isBuy = transaction.type === "BUY";
                const totalValue = transaction.price * transaction.quantity;

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          isBuy
                            ? "bg-green-100 dark:bg-green-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}
                      >
                        {isBuy ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {transaction.ticker}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(transaction.date))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge
                        variant={isBuy ? "default" : "destructive"}
                        className={
                          isBuy
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }
                      >
                        {isBuy ? "Compra" : "Venda"}
                      </Badge>
                      <div className="text-right min-w-[100px]">
                        <div className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(totalValue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.quantity}{" "}
                          {transaction.quantity === 1 ? "ação" : "ações"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
