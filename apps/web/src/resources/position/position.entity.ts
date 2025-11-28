import { PositionData } from "./position.types";

export interface Position {
  id: string;
  ticker: string;
  quantity: number;
  averagePrice: number;
  positionData?: PositionData;
}
