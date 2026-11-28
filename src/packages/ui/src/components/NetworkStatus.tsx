"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** État du réseau de l'appareil (EF-OFF-01), suivi en direct */
export function useOnline() {
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
  return online;
}

/**
 * Icône seule de l'état du réseau (décision du 28/11/2026) : wifi vert en ligne, wifi barré hors ligne.
 * Le texte (et le nombre d'opérations en attente) reste lisible au survol et par les lecteurs d'écran.
 */
export function NetworkStatus({ pendingCount = 0, className = "" }: { pendingCount?: number; className?: string }) {
  const t = useTranslations("ui.offline");
  const online = useOnline();
  const label = `${online ? t("online") : t("offline")}${pendingCount > 0 ? ` · ${t("pending", { count: pendingCount })}` : ""}`;
  return (
    <span role="status" aria-live="polite" aria-label={label} title={label} data-network={online ? "online" : "offline"} className={`inline-grid shrink-0 place-items-center ${className}`}>
      {online ? <Wifi className="size-4 text-green" aria-hidden /> : <WifiOff className="size-4 text-amber" aria-hidden />}
    </span>
  );
}
