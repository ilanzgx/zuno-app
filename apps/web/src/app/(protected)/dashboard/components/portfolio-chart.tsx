"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { PortfolioHistory } from "@/resources/portfolio/portfolio.types";

interface PortfolioChartProps {
  history: PortfolioHistory[];
  loading: boolean;
}

export function PortfolioChart({ history, loading }: PortfolioChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Patrimônio histórico</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="h-[350px] flex flex-col p-4 pt-2">
            {/* Legend skeleton */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Chart area skeleton */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Y-axis labels */}
              <div className="flex items-start">
                <div className="flex flex-col justify-between h-[240px] mr-2">
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-3 w-6" />
                </div>

                {/* Mountain chart skeleton */}
                <div className="flex-1 relative h-[240px]">
                  <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
                    <Skeleton className="h-[45%] w-[14%] rounded-t-sm bg-gray-400" />
                    <Skeleton className="h-[60%] w-[14%] rounded-t-sm bg-gray-400" />
                    <Skeleton className="h-[55%] w-[14%] rounded-t-sm bg-gray-400" />
                    <Skeleton className="h-[75%] w-[14%] rounded-t-sm bg-gray-400" />
                    <Skeleton className="h-[85%] w-[14%] rounded-t-sm bg-gray-400" />
                    <Skeleton className="h-full w-[14%] rounded-t-sm bg-gray-400" />
                  </div>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-3 pl-8">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Sem dados históricos disponíveis
            </p>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorPatrimonio"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="label"
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
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="line"
                  wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
                  formatter={() => "Patrimônio"}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#colorPatrimonio)"
                  opacity={1}
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
  );
}
