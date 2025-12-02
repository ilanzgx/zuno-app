export interface MarketStockData {
  ticker: string;
  dividendYield: number;
  trailingPE: number;
  forwardPE: number;
  bookValue: number;
  priceToBook: number;
  recommendationKey: string;
}

export interface MarketStockDataByDate {
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
