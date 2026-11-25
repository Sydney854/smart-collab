"use client";

import { CloudOff, RefreshCw, Wifi } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** Indique si l'appareil est en ligne et combien d'opérations attendent d'être envoyées (EF-OFF-01). */
export function OfflineBanner({ pendingCount = 0, forceOffline }: { pendingCount?: number; forceOffline?: boolean }) {
  const t = useTranslations("ui.offline");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const isOnline = forceOffline ? false : online;
  if (isOnline && pendingCount === 0) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-lg bg-green-l px-3 py-2 text-sm text-green">
        <Wifi className="size-4" aria-hidden /> {t("online")}
      </div>
    );
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isOnline ? "bg-blue-l text-blue" : "bg-amber-l text-amber"}`}
    >
      {isOnline ? <RefreshCw className="size-4 animate-spin" aria-hidden /> : <CloudOff className="size-4" aria-hidden />}
      <span className="font-medium">{isOnline ? t("syncing") : t("offline")}</span>
      {pendingCount > 0 && <span>· {t("pending", { count: pendingCount })}</span>}
    </div>
  );
}
