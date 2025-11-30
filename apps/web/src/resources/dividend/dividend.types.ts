export interface PositionDividendData {
  ticker: string;
  quantity: number;
  dividendsData: {
    ticker: string;
    dividends: Record<string, number>;
  };
}

export interface UserDividendsResponse {
  userId: string;
  dividends: PositionDividendData[];
}
