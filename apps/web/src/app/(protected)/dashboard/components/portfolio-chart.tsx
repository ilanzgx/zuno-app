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
} from "recharts";
import { PortfolioHistory } from "@/resources/portfolio/portfolio.types";

interface PortfolioChartProps {
  history: PortfolioHistory[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

    return (
      <div className="bg-white/95 border border-gray-200 rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm">
        <p className="text-gray-600 text-xs font-medium mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-gray-900 text-sm font-semibold">
            Patrimônio {formattedValue}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function PortfolioChart({ history, loading }: PortfolioChartProps) {
  return (
    <Card className="col-span-2 bg-gradient-to-br from-white to-gray-50/50 border-gray-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-gray-900">Patrimônio</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="h-[350px] flex flex-col p-4 pt-2">
            {/* Chart area skeleton */}
            <div className="flex-1 flex flex-col justify-between">
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
                    <Skeleton className="h-[45%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[60%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[55%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[75%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[85%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[70%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[80%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[65%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[90%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-full w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[95%] w-[7%] rounded-t-sm bg-blue-100" />
                    <Skeleton className="h-[85%] w-[7%] rounded-t-sm bg-blue-100" />
                  </div>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-3 pl-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-8" />
                ))}
              </div>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-gray-500">Sem dados históricos disponíveis</p>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorPatrimonioGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.2} />
                    <stop
                      offset="100%"
                      stopColor="#93C5FD"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#E5E7EB"
                  strokeOpacity={0.8}
                />
                <XAxis
                  dataKey="label"
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    }
                    return `${(value / 1000).toFixed(0)}K`;
                  }}
                  dx={-10}
                  tick={{ fill: "#6B7280" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#colorPatrimonioGradient)"
                  dot={{
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    stroke: "#fff",
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#3B82F6",
                    strokeWidth: 2,
                    stroke: "#fff",
                    style: {
                      filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))",
                    },
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
