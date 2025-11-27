"use client";

import { useEffect, useState } from "react";
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
import { getPositionsByUser } from "@/resources/position/position.service";
import { Position } from "@/resources/position/position.entity";
import Image from "next/image";

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
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPositions() {
      try {
        const data = await getPositionsByUser();
        setPositions(data?.positions || []);
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
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
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : (
            <TransactionsTable positions={positions} />
          )}
        </div>
      </div>
    </div>
  );
}

interface TransactionsTableProps {
  positions: Position[];
}

function TransactionsTable({ positions }: TransactionsTableProps) {
  const displayPositions = positions.slice(0, 10);

  if (displayPositions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhuma movimentação encontrada.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]"></TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead>Ordem</TableHead>
          <TableHead>Preço Médio</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Preço Atual</TableHead>
          <TableHead className="text-right">Total Investido</TableHead>
          <TableHead className="text-right">Valor Atual</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayPositions.map((position) => {
          const positionData = position.positionData?.results?.[0];
          const currentPrice = positionData?.regularMarketPrice || 0;
          const totalInvested = position.averagePrice * position.quantity;
          const currentValue = currentPrice * position.quantity;
          const logoUrl =
            positionData?.logourl || "https://icons.brapi.dev/icons/BRAPI.svg";
          const shortName = positionData?.shortName || position.ticker;

          return (
            <TableRow key={position.id}>
              <TableCell>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <Image
                    src={logoUrl}
                    alt={position.ticker}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-bold">{position.ticker}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {shortName}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="font-normal text-muted-foreground bg-secondary/50"
                >
                  Compra
                </Badge>
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(position.averagePrice)}
              </TableCell>
              <TableCell className="text-right">{position.quantity}</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(currentPrice)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalInvested)}
              </TableCell>
              <TableCell className="text-right font-medium">
                <div
                  className={
                    currentValue >= totalInvested
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(currentValue)}
                </div>
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
