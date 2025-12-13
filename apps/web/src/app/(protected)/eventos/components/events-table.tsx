import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface DividendEvent {
  paymentDate: string;
  eventType: "JSCP" | "Dividendo";
  ticker: string;
  totalAmount: number;
  unitValue: number;
  quantity: number;
  assetType: "STOCK" | "FII" | "BDR";
}

const ASSET_TYPE_LABELS: Record<string, string> = {
  STOCK: "Ação",
  FII: "FII",
  BDR: "BDR",
};

const ASSET_TYPE_COLORS: Record<string, string> = {
  STOCK: "border-green-500",
  FII: "border-blue-500",
  BDR: "border-blue-500",
};

interface EventsTableProps {
  events: DividendEvent[];
}

export function EventsTable({ events }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum provento encontrado.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
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
          <TableHead>Categoria</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead className="text-right">Valor unitário</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Data Com</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => {
          const isJSCP = event.eventType === "JSCP";

          return (
            <TableRow key={`${event.ticker}-${event.paymentDate}-${index}`}>
              <TableCell>
                <span
                  className={`font-semibold pl-4 border-l-4 ${
                    ASSET_TYPE_COLORS[event.assetType]
                  }`}
                >
                  {ASSET_TYPE_LABELS[event.assetType] || event.assetType}
                </span>
              </TableCell>
              <TableCell>
                <div className="font-semibold">{event.ticker}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={isJSCP ? "secondary" : "default"}
                  className={
                    isJSCP
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                  }
                >
                  {event.eventType}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{event.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(event.unitValue)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(event.totalAmount)}
              </TableCell>

              <TableCell className="text-right">
                {formatDate(event.paymentDate)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
