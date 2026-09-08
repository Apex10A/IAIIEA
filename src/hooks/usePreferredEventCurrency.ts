"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  EventCurrency,
  guessCurrencyFromTimezone,
  isNigeriaCountry,
  resolveEventCurrency,
} from "@/utils/eventCurrency";

/**
 * Prefer profile country when signed in; otherwise timezone guess (Africa/Lagos → NGN).
 */
export function usePreferredEventCurrency(): EventCurrency {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [currency, setCurrency] = useState<EventCurrency>(() => guessCurrencyFromTimezone());

  useEffect(() => {
    if (!bearerToken) {
      setCurrency(guessCurrencyFromTimezone());
      return;
    }

    let cancelled = false;

    const loadCountry = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/view_profile_details`,
          {
            headers: { Authorization: `Bearer ${bearerToken}` },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        const country = data?.data?.country as string | undefined;
        if (!cancelled) {
          setCurrency(resolveEventCurrency(country));
        }
      } catch {
        if (!cancelled) {
          setCurrency(guessCurrencyFromTimezone());
        }
      }
    };

    loadCountry();

    return () => {
      cancelled = true;
    };
  }, [bearerToken]);

  return currency;
}

export function getCurrencyLabel(currency: EventCurrency): string {
  return currency === "NGN" ? "Nigerian Naira" : "US Dollars";
}

export { isNigeriaCountry };
