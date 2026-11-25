"use client";

import { Button, Modal } from "antd";
import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/**
 * Fenêtre d'aperçu avant impression (EF-BI-01). Le contenu s'affiche sur une page A4 ;
 * à l'impression, seule cette page est imprimée (règle CSS `.sc-print-area`).
 * Les exports PDF / Excel / Word arrivent avec le centre d'états.
 */
export function PrintPreview({
  open,
  title,
  companyName,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  companyName: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const t = useTranslations("ui.print");
  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      title={t("title")}
      footer={[
        <Button key="close" onClick={onClose}>
          {t("close")}
        </Button>,
        <Button key="print" type="primary" icon={<Printer className="size-4" />} onClick={() => window.print()}>
          {t("print")}
        </Button>,
      ]}
    >
      <div className="max-h-[70vh] overflow-auto bg-bg p-4">
        <div className="sc-print-area mx-auto aspect-[210/297] w-full max-w-[640px] bg-card p-8 text-sm text-ink shadow-card">
          <header className="mb-6 flex items-end justify-between border-b-2 border-print pb-3">
            <div>
              <p className="text-lg font-bold text-print">{companyName}</p>
              <p className="text-xs text-muted">{t("generatedBy")}</p>
            </div>
            <h2 className="text-base font-semibold text-print">{title}</h2>
          </header>
          {children}
        </div>
      </div>
    </Modal>
  );
}
