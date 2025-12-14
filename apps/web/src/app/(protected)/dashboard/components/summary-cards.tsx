import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PortfolioSummary } from "@/resources/portfolio/portfolio.types";

interface SummaryCardsProps {
  summary: PortfolioSummary | null;
  loading: boolean;
}

const assetTypeTranslation: Record<string, string> = {
  STOCK: "Ações",
  FII: "FIIs",
  BDR: "BDRs",
  CRYPTO: "Criptomoedas",
};

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

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  const getLargestAssetClass = () => {
    if (!summary || !summary.allocation || summary.allocation.length === 0) {
      return null;
    }
    const largest = summary.allocation.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
    return largest;
  };

  return (
    <div className="grid gap-2 md:grid-cols-3">
      <Card>
        <CardContent>
          <CardTitle className="text-sm font-medium">Saldo Bruto</CardTitle>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-7 w-[140px]" />
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <>
              <div className="text-lg font-bold">
                {summary ? formatCurrency(summary.grossBalance) : "R$ 0,00"}
              </div>
              <Separator className="my-4" />
              {(() => {
                const largestClass = getLargestAssetClass();
                return largestClass ? (
                  <>
                    <p className="text-sm font-medium">
                      Maior classe de ativos:
                    </p>
                    <p className="text-sm">
                      <span className="text-[#549d8c] font-bold">
                        {formatCurrency(largestClass.value)}
                      </span>{" "}
                      em{" "}
                      <span className="text-[#549d8c] font-bold">
                        {assetTypeTranslation[largestClass.type] ||
                          largestClass.type}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma alocação disponível
                  </p>
                );
              })()}
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardTitle className="text-sm font-medium">Valor Aplicado</CardTitle>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-7 w-[140px]" />
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            </div>
          ) : (
            <>
              <div className="text-lg font-bold">
                {summary ? formatCurrency(summary.appliedBalance) : "R$ 0,00"}
              </div>
              <Separator className="my-4" />
              <p className="text-sm font-medium">Lucro/Prejuízo:</p>
              <p className="text-sm">
                <span className="text-[#549d8c] font-bold">
                  {summary && summary.profitOrLoss !== 0
                    ? formatCurrency(Math.abs(summary.profitOrLoss))
                    : "R$ 0,00"}
                </span>{" "}
                {summary && summary.profitOrLoss >= 0
                  ? "de lucro"
                  : "de prejuízo"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-7 w-[100px]" />
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            </div>
          ) : (
            <>
              <div className="text-lg font-bold">
                {summary ? formatPercentage(summary.percentageProfit) : "0,00%"}
              </div>
              <Separator className="my-4" />
              <p className="text-sm font-medium">Ultimos 12 meses:</p>
              <p className="text-sm">
                <span className="text-[#549d8c] font-bold">X.XX%</span> de
                rentabilidade
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
