"use client";

import { useEffect, useState } from "react";
import { getPositionsByUser } from "@/resources/position/position.service";
import { Position } from "@/resources/position/position.entity";
import { PositionsTable } from "./components/positions-table";
import { PositionsTableSkeleton } from "./components/positions-table-skeleton";

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
    <div className="space-y-4">
      <div className="my-4">
        <h1 className="text-lg font-medium tracking-tight text-gray-900">
          Posições
        </h1>
      </div>

      <div className="space-y-2">
        <div className="rounded-md border bg-card">
          {loading ? (
            <PositionsTableSkeleton />
          ) : (
            <PositionsTable positions={positions} />
          )}
        </div>
      </div>
    </div>
  );
}
