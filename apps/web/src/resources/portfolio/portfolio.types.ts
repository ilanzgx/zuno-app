export interface PortfolioSummary {
  grossBalance: number;
  appliedBalance: number;
  profitOrLoss: number;
  percentageProfit: number;
  allocation: { type: string; value: number; percentage: number }[];
}

export interface PortfolioHistory {
  label: string;
  value: number;
}
