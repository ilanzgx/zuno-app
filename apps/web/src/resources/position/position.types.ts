import { Position } from "./position.entity";

export interface PositionData {
  results: Array<{
    currency: string;
    marketCap: number | null;
    shortName: string;
    longName: string;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketTime: string;
    regularMarketPrice: number;
    regularMarketDayHigh: number;
    regularMarketDayRange: string;
    regularMarketDayLow: number;
    regularMarketVolume: number;
    regularMarketPreviousClose: number;
    regularMarketOpen: number;
    fiftyTwoWeekRange: string;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    symbol: string;
    logourl: string;
    priceEarnings: number | null;
    earningsPerShare: number | null;
  }>;
  requestedAt: string;
  took: string;
}

export interface UserPositionResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  positions: Position[];
}
