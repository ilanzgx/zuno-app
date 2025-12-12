"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface Position {
  id: string;
  ticker: string;
  assetType: "STOCK" | "FII" | "BDR";
  averagePrice: number;
  quantity: number;
  positionData?: {
    results?: Array<{
      regularMarketPrice?: number;
      logourl?: string;
      longName?: string;
    }>;
  };
}

interface PositionsTableProps {
  positions: Position[];
}

const ASSET_TYPE_LABELS = {
  STOCK: "Ações",
  FII: "Fundos Imobiliários",
  BDR: "BDRs",
};

export function PositionsTable({ positions }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhuma posição encontrada.
      </div>
    );
  }

  const groupedPositions = useMemo(() => {
    const groups: Record<string, Position[]> = {
      STOCK: [],
      FII: [],
      BDR: [],
    };

    positions.forEach((position) => {
      if (groups[position.assetType]) {
        groups[position.assetType].push(position);
      }
    });

    return groups;
  }, [positions]);

  const categoriesWithPositions = Object.entries(groupedPositions).filter(
    ([_, positionsList]) => positionsList.length > 0
  );

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[60px_minmax(150px,1fr)_120px_100px_120px_140px_140px_50px] gap-4 px-4 py-3 text-sm text-muted-foreground font-medium border-b">
        <div></div>
        <div>Ativo</div>
        <div>Preço Médio</div>
        <div className="text-right">Quantidade</div>
        <div className="text-right">Preço Unitário</div>
        <div className="text-right">Total Investido</div>
        <div className="text-right">Valor Atual</div>
        <div></div>
      </div>

      {/* Body */}
      <Accordion
        type="multiple"
        defaultValue={["STOCK", "FII", "BDR"]}
        className="w-full"
      >
        {categoriesWithPositions.map(([assetType, positionsList]) => {
          const categoryTotals = positionsList.reduce(
            (acc, position) => {
              const positionData = position.positionData?.results?.[0];
              const currentPrice = positionData?.regularMarketPrice || 0;
              const totalInvested = position.averagePrice * position.quantity;
              const currentValue = currentPrice * position.quantity;

              return {
                totalInvested: acc.totalInvested + totalInvested,
                currentValue: acc.currentValue + currentValue,
              };
            },
            { totalInvested: 0, currentValue: 0 }
          );

          return (
            <AccordionItem
              key={assetType}
              value={assetType}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]_svg]:rotate-90">
                <div className="grid grid-cols-[60px_minmax(200px,1fr)_120px_100px_120px_140px_140px_50px] gap-4 w-full px-4 py-3 text-sm">
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <span className="font-semibold">
                      {
                        ASSET_TYPE_LABELS[
                          assetType as keyof typeof ASSET_TYPE_LABELS
                        ]
                      }
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({positionsList.length}{" "}
                      {positionsList.length === 1 ? "ativo" : "ativos"})
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    -
                  </div>
                  <div className="flex items-center justify-end text-muted-foreground">
                    -
                  </div>
                  <div className="flex items-center justify-end text-muted-foreground">
                    -
                  </div>
                  <div className="flex items-center justify-end font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(categoryTotals.totalInvested)}
                  </div>
                  <div
                    className={`flex items-center justify-end font-medium ${
                      categoryTotals.currentValue >=
                      categoryTotals.totalInvested
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(categoryTotals.currentValue)}
                  </div>
                  <div className="flex items-center"></div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {positionsList.map((position, index) => {
                  const positionData = position.positionData?.results?.[0];
                  const currentPrice = positionData?.regularMarketPrice || 0;
                  const totalInvested =
                    position.averagePrice * position.quantity;
                  const currentValue = currentPrice * position.quantity;
                  const logoUrl =
                    positionData?.logourl ||
                    "https://icons.brapi.dev/icons/BRAPI.svg";
                  const longName = positionData?.longName || position.ticker;

                  return (
                    <div
                      key={position.id}
                      className={`grid grid-cols-[60px_minmax(200px,1fr)_120px_100px_120px_140px_140px_50px] gap-4 px-4 py-3 text-sm hover:bg-muted/50 ${
                        index !== positionsList.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <Image
                            src={logoUrl}
                            alt={position.ticker}
                            width={30}
                            height={30}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="font-bold">{position.ticker}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {longName}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(position.averagePrice)}
                      </div>
                      <div className="flex items-center justify-end">
                        {position.quantity}
                      </div>
                      <div className="flex items-center justify-end">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(currentPrice)}
                      </div>
                      <div className="flex items-center justify-end font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(totalInvested)}
                      </div>
                      <div
                        className={`flex items-center justify-end font-medium ${
                          currentValue >= totalInvested
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(currentValue)}
                      </div>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default PositionsTable;
