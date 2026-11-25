"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export type AppCardProps = {
  name: string;
  description: string;
  category: string;
  icon: ReactNode;
  installed: boolean;
  /** Incluse dans l'abonnement de l'entreprise (EF-APP-01) */
  included?: boolean;
  dependencies?: string[];
  onInstall?: () => void;
  onOpen?: () => void;
};

/** Carte d'une application dans l'écran « Applications » (EF-APP-01). */
export function AppCard({ name, description, category, icon, installed, included = true, dependencies = [], onInstall, onOpen }: AppCardProps) {
  const t = useTranslations("ui.appCard");
  return (
    <Card className="h-full shadow-card" data-installed={installed}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-gold-strong [&_svg]:size-5">{icon}</span>
          <div className="min-w-0">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </div>
        </div>
        <CardAction>
          {installed ? (
            <Badge variant="secondary" className="bg-green-l text-green">
              <CheckCircle2Icon /> {t("installed")}
            </Badge>
          ) : !included ? (
            <Badge variant="outline">{t("notIncluded")}</Badge>
          ) : null}
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-ink-2">
        <p>{description}</p>
        {dependencies.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("requires")} {dependencies.join(", ")}
          </p>
        )}
      </CardContent>
      <CardFooter>
        {installed ? (
          <Button variant="outline" className="w-full" onClick={onOpen}>
            {t("open")}
          </Button>
        ) : (
          <Button className="w-full" onClick={onInstall}>
            {included ? t("install") : t("addToPlan")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
