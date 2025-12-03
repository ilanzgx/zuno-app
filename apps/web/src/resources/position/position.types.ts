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

export interface UserPositionNews {
  news: Array<{
    id: string;
    relatedTicker: string;
    providerPublishTime?: number;
    link?: string;
    title?: string;
    content: {
      id: string;
      contentType: string;
      title: string;
      description?: string;
      summary?: string;
      pubDate: string;
      displayTime: string;
      isHosted: boolean;
      bypassModal: boolean;
      previewUrl?: string | null;
      thumbnail?: {
        originalUrl: string;
        originalWidth: number;
        originalHeight: number;
        caption?: string;
        resolutions: Array<{
          url: string;
          width: number;
          height: number;
          tag: string;
        }>;
      };
      provider: {
        displayName: string;
        url: string;
      };
      canonicalUrl?: {
        url: string;
        site: string;
        region: string;
        lang: string;
      };
      clickThroughUrl?: {
        url: string;
        site: string;
        region: string;
        lang: string;
      };
      metadata?: {
        editorsPick: boolean;
      };
      finance?: {
        premiumFinance: {
          isPremiumNews: boolean;
          isPremiumFreeNews: boolean;
        };
      };
      storyline?: any;
    };
  }>;
}
