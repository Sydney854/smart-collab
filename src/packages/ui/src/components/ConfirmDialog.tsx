"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";

const MIN_REASON = 3;

/**
 * Fenêtre de confirmation. Avec `requireReason`, un motif est obligatoire
 * (annulation d'un document validé, EF-GEN-02).
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  danger,
  requireReason,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  danger?: boolean;
  requireReason?: boolean;
  confirmLabel?: string;
  onConfirm: (reason?: string) => void;
}) {
  const t = useTranslations("ui.confirm");
  const id = useId();
  const [reason, setReason] = useState("");
  const missingReason = Boolean(requireReason) && reason.trim().length < MIN_REASON;
  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setReason("");
        onOpenChange(v);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        {requireReason && (
          <Field>
            <FieldLabel htmlFor={id}>{t("reasonLabel")}</FieldLabel>
            <Textarea id={id} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("reasonPlaceholder")} aria-required />
            <FieldDescription>{t("reasonHint", { count: MIN_REASON })}</FieldDescription>
          </Field>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant={danger ? "destructive" : "default"}
            disabled={missingReason}
            onClick={() => {
              onConfirm(requireReason ? reason.trim() : undefined);
              setReason("");
            }}
          >
            {confirmLabel ?? t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
