"use client";

import React, { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

export function ClientOnly({ children }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Hoặc một loading spinner đơn giản
  }

  return <>{children}</>;
}
