import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

const SKELETON_CATEGORIES = [
  { key: "STOCK", label: "Ações", count: 3 },
  { key: "FII", label: "Fundos Imobiliários", count: 2 },
  { key: "BDR", label: "BDRs", count: 1 },
];

export function PositionsTableSkeleton() {
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
        {SKELETON_CATEGORIES.map((category) => (
          <AccordionItem
            key={category.key}
            value={category.key}
            className="border-b last:border-b-0"
          >
            <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]_svg]:rotate-90">
              <div className="grid grid-cols-[60px_minmax(150px,1fr)_120px_100px_120px_140px_140px_50px] gap-4 w-full px-4 py-3 text-sm">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
                <div className="flex items-center gap-2 text-left">
                  <span className="font-semibold">{category.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ({category.count}{" "}
                    {category.count === 1 ? "ativo" : "ativos"})
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">-</div>
                <div className="flex items-center justify-end text-muted-foreground">
                  -
                </div>
                <div className="flex items-center justify-end text-muted-foreground">
                  -
                </div>
                <div className="flex items-center justify-end">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-end">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center"></div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {Array.from({ length: category.count }).map((_, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[60px_minmax(150px,1fr)_120px_100px_120px_140px_140px_50px] gap-4 px-4 py-3 text-sm ${
                    index !== category.count - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                  <div className="flex items-center justify-center"></div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
