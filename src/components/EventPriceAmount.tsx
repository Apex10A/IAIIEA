"use client";

import {
  EventCurrency,
  formatEventPrice,
  hasPaidEventPrice,
} from "@/utils/eventCurrency";

interface EventPriceAmountProps {
  usd: string | number | null | undefined;
  naira: string | number | null | undefined;
  currency: EventCurrency;
  size?: "sm" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-xl font-bold",
  lg: "text-3xl font-bold",
};

export function EventPriceAmount({
  usd,
  naira,
  currency,
  size = "lg",
  className = "",
}: EventPriceAmountProps) {
  const paid = hasPaidEventPrice(usd, naira);
  const textClass = `${sizeClasses[size]} text-[#0E1A3D] ${className}`.trim();

  if (!paid) {
    return <p className={`${sizeClasses[size]} text-[#0E1A3D] ${className}`.trim()}>Free</p>;
  }

  return <p className={textClass}>{formatEventPrice(currency, usd, naira)}</p>;
}
