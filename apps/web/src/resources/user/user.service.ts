"use server";

import { cookies } from "next/headers";
import { type SignInDTO, type SignUpDTO } from "./user.schemas";
import { type AuthResponse } from "./user.types";

const API_BASE_URL = "http://localhost:8080/v1";

export async function signIn(credentials: SignInDTO): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to sign in");
  }

  const data = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { token: data.token };
}

export async function signUp(credentials: SignUpDTO): Promise<AuthResponse> {
  const { confirmPassword, ...payload } = credentials;

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  const data = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { token: data.token };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function getProfile(): Promise<AuthResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();
  return { token, user };
}

export async function validateToken(): Promise<boolean> {
  const profile = await getProfile();
  return !!profile;
}
