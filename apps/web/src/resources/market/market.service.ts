"use server";

import { cookies } from "next/headers";
import {
  MarketNewsData,
  MarketStockData,
  MarketStockDataByDate,
} from "./market.types";
import { getUserId } from "../user/user.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getStockData(
  ticker: string
): Promise<MarketStockData | null> {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/market/quote/${ticker}`, {
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
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}

export async function getStockDataByDate(
  ticker: string,
  date: string
): Promise<MarketStockDataByDate | null> {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/market/quote/${ticker}/history?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}

export async function getStockNews(
  ticker: string
): Promise<MarketNewsData[] | null> {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/market/news/${ticker}`, {
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
    console.error("Failed to fetch stock data:", error);
    return null;
  }
}
