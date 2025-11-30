"use server";

import { cookies } from "next/headers";
import { getUserId } from "../user/user.service";
import { UserDividendsResponse } from "./dividend.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getDividends(): Promise<UserDividendsResponse | null> {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/dividends/${userId}`, {
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
    console.error("Failed to fetch dividends:", error);
    return null;
  }
}
