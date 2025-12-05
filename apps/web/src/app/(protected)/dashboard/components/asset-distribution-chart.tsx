"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { PortfolioSummary } from "@/resources/portfolio/portfolio.types";

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

interface AssetDistributionChartProps {
  summary: PortfolioSummary | null;
  loading: boolean;
}

export function AssetDistributionChart({
  summary,
  loading,
}: AssetDistributionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Distribuição de Ativos</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-4 p-4">
            <div className="relative w-48 h-48">
              <Skeleton className="w-full h-full rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-background rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : summary && summary.allocation && summary.allocation.length > 0 ? (
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
                    )} - ${formatCurrency(item?.value || 0)}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum ativo na carteira</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
