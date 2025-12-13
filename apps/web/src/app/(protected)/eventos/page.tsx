"use client";

import { useEffect, useMemo, useState } from "react";
import { getDividends } from "@/resources/dividend/dividend.service";
import { UserDividendsResponse } from "@/resources/dividend/dividend.types";
import { EventsTable, DividendEvent } from "./components/events-table";
import { EventsTableSkeleton } from "./components/events-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventosPage() {
  const [events, setEvents] = useState<DividendEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DividendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const totalDividends = useMemo(() => {
    return events.reduce((acc, event) => acc + event.totalAmount, 0);
  }, [events]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
      if (!position.dividendsData || !position.dividendsData.dividends) {
        console.warn(`No dividend data for ${position.ticker}`);
        return;
      }

      const dividends = position.dividendsData.dividends;
      const transactions = position.transactions || [];

      const assetType =
        (transactions[0]?.assetType as "STOCK" | "FII" | "BDR") || "STOCK";

      const getQuantityAtDate = (targetDate: Date): number => {
        let quantity = 0;

        for (const transaction of transactions) {
          const transactionDate = new Date(transaction.date);

          if (transactionDate <= targetDate) {
            if (transaction.type === "BUY") {
              quantity += transaction.quantity;
            } else if (transaction.type === "SELL") {
              quantity -= transaction.quantity;
            }
          } else {
            break;
          }
        }

        return quantity;
      };

      Object.entries(dividends).forEach(([date, value]) => {
        const dividendDate = new Date(date);
        const quantityAtDate = getQuantityAtDate(dividendDate);

        if (quantityAtDate > 0) {
          const eventType: "JSCP" | "Dividendo" = "Dividendo";

          allEvents.push({
            paymentDate: date,
            eventType,
            ticker: position.ticker,
            unitValue: value,
            quantity: quantityAtDate,
            totalAmount: value * quantityAtDate,
            assetType,
          });
        }
      });
    });

    return allEvents.sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  }

  return (
    <div className="space-y-6">
      <div className="my-4">
        <h1 className="text-lg font-medium tracking-tight text-gray-900">
          Proventos a receber
        </h1>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border bg-card">
          <div className="p-4 border-b">
            <h2 className="text-sm text-muted-foreground">
              Resultado histórico de proventos
            </h2>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalDividends)}
              </p>
            )}
          </div>

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
