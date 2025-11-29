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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTransactionsByUser } from "@/resources/transaction/transaction.service";
import { Transaction } from "@/resources/transaction/transaction.entity";

const dataPatrimonio = [
  { name: "Jan", valor: 10000 },
  { name: "Fev", valor: 12000 },
  { name: "Mar", valor: 11500 },
  { name: "Abr", valor: 15000 },
  { name: "Mai", valor: 18000 },
  { name: "Jun", valor: 22000 },
];

const dataRentabilidade = [
  { name: "Jan", valor: 1.2 },
  { name: "Fev", valor: 2.5 },
  { name: "Mar", valor: -0.5 },
  { name: "Abr", valor: 3.0 },
  { name: "Mai", valor: 2.1 },
  { name: "Jun", valor: 4.5 },
];

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await getTransactionsByUser();
        const sortedData = (data || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTransactions(sortedData.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    }

    fetchTransactions();
  }, []);

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
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
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
            <div className="text-2xl font-bold">R$ 38.000,00</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+19,03%</div>
            <p className="text-xs text-muted-foreground">
              +4% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {isMounted && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Histórico Patrimonial</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dataPatrimonio}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="valor"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Rentabilidade Histórica</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dataRentabilidade}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
