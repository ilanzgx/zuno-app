export interface Transaction {
  id: string;
  ticker: string;
  quantity: number;
  price: number;
  type: "BUY" | "SELL";
  date: Date;
  user_id: string;
}
