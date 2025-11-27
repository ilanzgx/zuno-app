"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Movimentações</h2>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Exportar
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
              + Adicionar Ativo
            </button>
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <div className="p-4 flex gap-4 border-b">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
              placeholder="Pesquise aqui..."
            />
          </div>
          <TransactionsTableMock />
        </div>
      </div>
    </div>
  );
}

const mockTransactions = [
  {
    id: "1",
    category: "Ações",
    ticker: "CMN3",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "05/07/2022",
    quantity: 9,
    price: 3.56,
  },
  {
    id: "2",
    category: "Ações",
    ticker: "BRSR6",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "05/07/2022",
    quantity: 10,
    price: 9.0,
  },
  {
    id: "3",
    category: "FIIs",
    ticker: "TORD11",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "19/05/2022",
    quantity: 2,
    price: 9.32,
  },
  {
    id: "4",
    category: "FIIs",
    ticker: "VSLH11",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "17/05/2022",
    quantity: 7,
    price: 9.06,
  },
  {
    id: "5",
    category: "Ações",
    ticker: "CMN3",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "20/04/2022",
    quantity: 1,
    price: 5.67,
  },
  {
    id: "6",
    category: "FIIs",
    ticker: "TORD11",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "20/04/2022",
    quantity: 8,
    price: 8.94,
  },
  {
    id: "7",
    category: "FIIs",
    ticker: "MXRF11",
    order: "Compra",
    broker: "RICO INVESTIMENTOS",
    date: "16/03/2022",
    quantity: 9,
    price: 9.06,
  },
];

function TransactionsTableMock() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Categoria</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead>Ordem</TableHead>
          <TableHead>Broker</TableHead>
          <TableHead>Negociação</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Preço</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockTransactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1 h-4 rounded-full ${
                    tx.category === "Ações" ? "bg-red-500" : "bg-blue-500"
                  }`}
                ></div>
                {tx.category}
              </div>
            </TableCell>
            <TableCell className="font-bold">{tx.ticker}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className="font-normal text-muted-foreground bg-secondary/50"
              >
                {tx.order}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs uppercase">
              {tx.broker}
            </TableCell>
            <TableCell>{tx.date}</TableCell>
            <TableCell className="text-right">{tx.quantity}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(tx.price)}
            </TableCell>
            <TableCell className="text-right font-medium">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(tx.price * tx.quantity)}
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
        ))}
      </TableBody>
    </Table>
  );
}
