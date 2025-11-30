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
import { getDividends } from "@/resources/dividend/dividend.service";
import { UserDividendsResponse } from "@/resources/dividend/dividend.types";

interface DividendEvent {
  paymentDate: string;
  eventType: "JSCP" | "Dividendo";
  ticker: string;
  totalAmount: number;
  unitValue: number;
  quantity: number;
}

export default function EventosPage() {
  const [events, setEvents] = useState<DividendEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DividendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDividends() {
      try {
        const data = await getDividends();
        if (data) {
          const allEvents = processDividendsToEvents(data);
          setEvents(allEvents);
          setFilteredEvents(allEvents);
        }
      } catch (error) {
        console.error("Failed to fetch dividends:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDividends();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.ticker.toLowerCase().includes(query) ||
        event.eventType.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  function processDividendsToEvents(
    data: UserDividendsResponse
  ): DividendEvent[] {
    const allEvents: DividendEvent[] = [];

    data.dividends.forEach((position) => {
      const dividends = position.dividendsData.dividends;

      Object.entries(dividends).forEach(([date, value]) => {
        const eventType: "JSCP" | "Dividendo" = "Dividendo";

        allEvents.push({
          paymentDate: date,
          eventType,
          ticker: position.ticker,
          unitValue: value,
          quantity: position.quantity,
          totalAmount: value * position.quantity,
        });
      });
    });

    return allEvents.sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Proventos a receber
        </h1>
        <p className="text-muted-foreground">
          Visualize todos os dividendos e JCP das suas posições.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border bg-card">
          <div className="p-4 flex gap-4 border-b">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
              placeholder="Pesquise por ativo ou tipo de evento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {loading ? (
            <EventsTableSkeleton />
          ) : (
            <EventsTable events={filteredEvents} />
          )}
        </div>
      </div>
    </div>
  );
}

interface EventsTableProps {
  events: DividendEvent[];
}

function EventsTable({ events }: EventsTableProps) {
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
          <TableHead>Data de Pgto.</TableHead>
          <TableHead>Evento</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead className="text-right">A receber</TableHead>
          <TableHead className="text-right">Valor unitário</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => {
          const isJSCP = event.eventType === "JSCP";

          return (
            <TableRow key={`${event.ticker}-${event.paymentDate}-${index}`}>
              <TableCell>{formatDate(event.paymentDate)}</TableCell>
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
              <TableCell>
                <div className="font-bold">{event.ticker}</div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(event.totalAmount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(event.unitValue)}
              </TableCell>
              <TableCell className="text-right">{event.quantity}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function EventsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data de Pgto.</TableHead>
          <TableHead>Evento</TableHead>
          <TableHead>Ativo</TableHead>
          <TableHead className="text-right">A receber</TableHead>
          <TableHead className="text-right">Valor unitário</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 8 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
