export interface Transaction {
  id: string;
  ticker: string;
  quantity: number;
  price: number;
  type: "BUY" | "SELL";
  assetType: "STOCK" | "FII" | "BDR";
  date: Date;
  userId: string;
  createdAt: Date;
}
