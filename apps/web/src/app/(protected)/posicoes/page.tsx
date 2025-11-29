"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPositionsByUser } from "@/resources/position/position.service";
import { Position } from "@/resources/position/position.entity";
import Image from "next/image";

export default function PosicoesPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Posições</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as suas posições de investimento.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border bg-card">
          <div className="p-4 flex gap-4 border-b">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
              placeholder="Pesquise aqui..."
            />
          </div>
          {loading ? (
            <PositionsTableSkeleton />
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
        Nenhuma posição encontrada.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]"></TableHead>
          <TableHead>Ativo</TableHead>
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
          const longName = positionData?.longName || position.ticker;

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
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {longName}
                  </div>
                </div>
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

function PositionsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]"></TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead>Preço Médio</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Preço Atual</TableHead>
          <TableHead className="text-right">Total Investido</TableHead>
          <TableHead className="text-right">Valor Atual</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="w-10 h-10 rounded-full" />
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-24 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-24 ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-4" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
