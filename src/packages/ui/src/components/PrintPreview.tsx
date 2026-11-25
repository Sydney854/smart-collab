"use client";

import { PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

/**
 * Fenêtre d'aperçu avant impression (EF-BI-01). Le contenu s'affiche sur une page A4 ;
 * à l'impression, seule cette page est imprimée (règle CSS `.sc-print-area`).
 * Les exports PDF / Excel / Word arrivent avec le centre d'états.
 */
export function PrintPreview({
  open,
  onOpenChange,
  title,
  companyName,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  companyName: string;
  children: ReactNode;
}) {
  const t = useTranslations("ui.print");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-auto rounded-lg bg-muted p-4">
          {/* Page A4 : toujours claire, comme sur le papier */}
          <div className="sc-print-area mx-auto aspect-[210/297] w-full max-w-[600px] bg-card p-8 text-sm text-foreground shadow-card">
            <header className="mb-6 flex items-end justify-between border-b-2 border-print pb-3">
              <div>
                <p className="text-lg font-bold text-print">{companyName}</p>
                <p className="text-xs text-muted-foreground">{t("generatedBy")}</p>
              </div>
              <h2 className="text-base font-semibold text-print">{title}</h2>
            </header>
            {children}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
          <Button onClick={() => window.print()}>
            <PrinterIcon /> {t("print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
