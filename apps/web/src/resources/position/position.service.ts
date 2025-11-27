"use server";

import { cookies } from "next/headers";
import { UserPositionResponse } from "./position.entity";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

async function getUserId(): Promise<string | null> {
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

export async function getPositionsByUser(): Promise<UserPositionResponse | null> {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/positions/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch positions:", error);
    return null;
  }
}
