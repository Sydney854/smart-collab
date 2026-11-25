"use client";

import { Input, Modal } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Fenêtre de confirmation. Avec `requireReason`, un motif est obligatoire
 * (annulation d'un document validé, EF-GEN-02).
 */
export function ConfirmDialog({
  open,
  title,
  description,
  danger,
  requireReason,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  danger?: boolean;
  requireReason?: boolean;
  confirmLabel?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("ui.confirm");
  const [reason, setReason] = useState("");
  const missingReason = requireReason && reason.trim().length < 3;
  return (
    <Modal
      open={open}
      title={title}
      okText={confirmLabel ?? t("confirm")}
      cancelText={t("cancel")}
      okButtonProps={{ danger, disabled: missingReason }}
      onOk={() => {
        onConfirm(requireReason ? reason.trim() : undefined);
        setReason("");
      }}
      onCancel={() => {
        setReason("");
        onCancel();
      }}
      destroyOnHidden
    >
      {description && <p className="text-ink-2">{description}</p>}
      {requireReason && (
        <label className="mt-4 block text-sm text-ink-2">
          {t("reasonLabel")}
          <Input.TextArea
            className="mt-1"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reasonPlaceholder")}
            autoSize={{ minRows: 2 }}
            aria-required
          />
        </label>
      )}
    </Modal>
  );
}
