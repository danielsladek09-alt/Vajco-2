"use client";

import dynamic from "next/dynamic";

const FarmMap = dynamic(() => import("./FarmMap").then((m) => m.FarmMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-cream-dark" />,
});

export function FarmMapLoader() {
  return <FarmMap />;
}
