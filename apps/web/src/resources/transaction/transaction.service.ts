"use server";

import { cookies } from "next/headers";
import { Transaction } from "./transaction.entity";
import { getUserId } from "../user/user.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getTransactionsByUser(): Promise<Transaction[] | null> {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions/user/${userId}`,
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
    console.error("Failed to fetch transactions:", error);
    return null;
  }
}

export async function createTransaction(transaction: Transaction) {
  const token = await getToken();
  const userId = await getUserId();

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return null;
  }
}
