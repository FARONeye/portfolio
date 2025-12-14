"use client";

import dynamic from "next/dynamic";

const PreflightGate = dynamic(() => import("./PreflightGate"), { ssr: false });

export default function PreflightGateClient() {
  return <PreflightGate />;
}
