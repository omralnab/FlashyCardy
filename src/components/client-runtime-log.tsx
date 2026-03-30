"use client";

import { useEffect } from "react";

export function ClientRuntimeLog() {
  useEffect(() => {
    console.log("CLIENT RENDER");
  }, []);

  return null;
}
