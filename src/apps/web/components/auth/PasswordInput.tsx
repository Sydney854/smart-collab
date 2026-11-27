"use client";

import { Button } from "@smart-collab/ui/components/ui/button";
import { Input } from "@smart-collab/ui/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentProps, forwardRef, useState } from "react";

/** Mot de passe avec bouton œil et signal « majuscules activées » (fiche core.login) */
export const PasswordInput = forwardRef<HTMLInputElement, ComponentProps<typeof Input>>(function PasswordInput(props, ref) {
  const t = useTranslations("auth");
  const [shown, setShown] = useState(false);
  const [caps, setCaps] = useState(false);
  return (
    <div>
      <div className="relative">
        <Input
          ref={ref}
          {...props}
          type={shown ? "text" : "password"}
          className="pr-10 max-sm:h-11"
          onKeyUp={(e) => setCaps(e.getModifierState?.("CapsLock") ?? false)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
          aria-label={shown ? t("hidePassword") : t("showPassword")}
          onClick={() => setShown((s) => !s)}
        >
          {shown ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      {caps && <p className="mt-1 text-xs text-muted-foreground">{t("capsLock")}</p>}
    </div>
  );
});
