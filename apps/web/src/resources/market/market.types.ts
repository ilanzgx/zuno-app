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

export interface MarketNewsData {
  ticker: string;
  news: MarketNews[];
}

export interface MarketNews {
  id: string;
  content: MarketNewsContent;
}

export interface MarketNewsContent {
  id: string;
  contentType: string;
  title: string;
  description: string;
  summary: string;
  pubDate: string;
  displayTime: string;
  isHosted: boolean;
  bypassModal: boolean;
  previewUrl: string | null;
  thumbnail: MarketNewsThumbnail;
  provider: MarketNewsProvider;
  canonicalUrl: MarketNewsUrl;
  clickThroughUrl: MarketNewsUrl;
  metadata: MarketNewsMetadata;
  finance: MarketNewsFinance;
  storyline: any;
}

export interface MarketNewsThumbnail {
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  caption: string;
  resolutions: MarketNewsThumbnailResolution[];
}

export interface MarketNewsThumbnailResolution {
  url: string;
  width: number;
  height: number;
  tag: string;
}

export interface MarketNewsProvider {
  displayName: string;
  url: string;
}

export interface MarketNewsUrl {
  url: string;
  site: string;
  region: string;
  lang: string;
}

export interface MarketNewsMetadata {
  editorsPick: boolean;
}

export interface MarketNewsFinance {
  premiumFinance: {
    isPremiumNews: boolean;
    isPremiumFreeNews: boolean;
  };
}
