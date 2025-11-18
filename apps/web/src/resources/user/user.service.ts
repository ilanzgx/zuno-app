import { type User } from "./user.entity";
import { type SignInDTO, type SignUpDTO } from "./user.schemas";
import { type AuthResponse } from "./user.types";

class UserService {
  API_BASE_URL = "http://localhost:8080/v1";

  async signIn(credentials: SignInDTO): Promise<AuthResponse> {
    const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    const data = await response.json();

    return {
      token: data.token,
    };
  }

  async signUp(credentials: SignUpDTO): Promise<AuthResponse> {
    const { confirmPassword, ...payload } = credentials;

    const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    const data = await response.json();

    return {
      token: data.token,
    };
  }
}

export const userService = new UserService();
