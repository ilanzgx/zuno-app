"use server";

import { cookies } from "next/headers";
import { type SignInDTO, type SignUpDTO } from "./user.schemas";
import { type AuthResponse } from "./user.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function signIn(credentials: SignInDTO): Promise<AuthResponse> {
  console.log(`${API_BASE_URL}/auth/login`);
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Sign in failed: ${response.status} - ${errorText}`);
    throw new Error(`Failed to sign in: ${response.status}`);
  }

  const data = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { token: data.token };
}

export async function signUp(credentials: SignUpDTO): Promise<AuthResponse> {
  const { confirmPassword, ...payload } = credentials;

  console.log(`${API_BASE_URL}/auth/register`);
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Sign up failed: ${response.status} - ${errorText}`);
    throw new Error(`Failed to sign up: ${response.status}`);
  }

  const data = await response.json();

  const cookieStore = await cookies();
  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: false,
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

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getUserId(): Promise<string | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const user = await response.json();
    return user.id;
  } catch {
    return null;
  }
}

export async function validateToken(): Promise<boolean> {
  const profile = await getProfile();
  return !!profile;
}
