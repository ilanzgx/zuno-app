import { type User } from "./user.entity";

export interface AuthResponse {
  token: string;
  user?: User;
}
