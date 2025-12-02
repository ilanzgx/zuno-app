export interface Transaction {
  id: string;
  ticker: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  date: string;
  assetType: string;
  createdAt: string;
}

export interface PositionDividendData {
  ticker: string;
  quantity: number;
  dividendsData: {
    ticker: string;
    dividends: Record<string, number>;
  };
  transactions: Transaction[];
}

export interface UserDividendsResponse {
  userId: string;
  dividends: PositionDividendData[];
}
