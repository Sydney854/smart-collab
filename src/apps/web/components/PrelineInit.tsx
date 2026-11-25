"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    HSStaticMethods?: { autoInit: (collection?: string | string[]) => void };
  }
}

/** Active les composants Preline (menus déroulants…) après chaque affichage de page. */
export function PrelineInit() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    import("preline").then(() => {
      if (!cancelled) window.HSStaticMethods?.autoInit();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  return null;
}
