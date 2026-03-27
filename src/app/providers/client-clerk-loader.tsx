"use client";

import dynamic from "next/dynamic";

const ClientClerk = dynamic(
  () => import("./client-clerk").then((m) => m.ClientClerk),
  { ssr: false }
);

export function ClientClerkLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientClerk>{children}</ClientClerk>;
}
