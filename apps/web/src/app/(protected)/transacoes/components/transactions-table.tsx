"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/resources/transaction/transaction.entity";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhuma transação encontrada.
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data de modificação</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Data da transação</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Preço</TableHead>
          <TableHead className="text-right">Valor total</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const totalValue = transaction.price * transaction.quantity;
          const isBuy = transaction.type === "BUY";

          return (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.createdAt)}</TableCell>
              <TableCell>
                <div className="font-bold">{transaction.ticker}</div>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell className="text-right">
                {transaction.quantity}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(transaction.price)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(totalValue)}
              </TableCell>
              <TableCell>
                <button className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-ellipsis-vertical"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
