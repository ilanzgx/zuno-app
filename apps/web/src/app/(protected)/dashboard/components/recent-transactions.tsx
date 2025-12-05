"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Transaction } from "@/resources/transaction/transaction.entity";

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export function RecentTransactions({
  transactions,
  loading,
}: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Últimas Movimentações</h3>
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
        {loading ? (
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
          <div className="space-y-2">
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
                      <div className="font-semibold">{transaction.ticker}</div>
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
                        {formatCurrency(totalValue)}
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
  );
}
