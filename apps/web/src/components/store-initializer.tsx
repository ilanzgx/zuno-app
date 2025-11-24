"use client";

import { useRef } from "react";
import { useUserStore } from "@/stores/user.store";
import { type User } from "@/resources/user/user.entity";

export default function StoreInitializer({ user }: { user: User }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useUserStore.setState({ user });
    initialized.current = true;
  }
  return null;
}
