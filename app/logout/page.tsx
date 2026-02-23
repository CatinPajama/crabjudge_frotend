"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("crabjudge_username");
    }

    // If you later add a backend /api/logout, call it here before redirecting.
    router.replace("/login");
  }, [router]);

  return null;
}

