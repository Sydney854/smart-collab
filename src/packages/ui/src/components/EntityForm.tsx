"use client";

/**
 * Fiche à onglets (produit, employé, client…) : react-hook-form + zod + composants shadcn/ui.
 * Les règles de saisie (zod) sont construites à partir de la description des champs,
 * avec des messages traduits. Les champs personnalisés de l'entreprise sont signalés.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDaysIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { useDateLocale, useFormatDate } from "../lib/dates";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

export type FieldType = "text" | "textarea" | "number" | "money" | "select" | "date" | "switch";
export type EntityField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Champ personnalisé ajouté par l'entreprise (moteur de configuration) */
  custom?: boolean;
  /** Occupe toute la largeur */
  wide?: boolean;
};
export type EntityTab = { key: string; label: string; fields: EntityField[] };

type T = ReturnType<typeof useTranslations>;

/** Règle de saisie zod d'un champ (montants en chaîne de chiffres : jamais de nombre à virgule flottante). */
function fieldSchema(f: EntityField, t: T): z.ZodType {
  const req = t("required");
  switch (f.type) {
    case "switch":
      return z.boolean().optional();
    case "date":
      return f.required ? z.date({ error: req }) : z.date().optional();
    case "number": {
      const n = z.string().regex(/^-?\d+([.,]\d+)?$/, t("invalidNumber"));
      return f.required ? n : n.or(z.literal("")).optional();
    }
    case "money": {
      const m = z.string().regex(/^\d+$/, t("invalidAmount"));
      return f.required ? m : m.or(z.literal("")).optional();
    }
    default:
      return f.required ? z.string({ error: req }).trim().min(1, req) : z.string().optional();
  }
}

function DateInput({ value, onChange, id, invalid }: { value?: Date; onChange: (d?: Date) => void; id: string; invalid: boolean }) {
  const t = useTranslations("ui.form");
  const locale = useDateLocale();
  const formatDate = useFormatDate();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button id={id} variant="outline" aria-invalid={invalid} className="w-full justify-start font-normal">
          <CalendarDaysIcon />
          {value ? formatDate(value, "dd/MM/yyyy") : <span className="text-muted-foreground">{t("pickDate")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" locale={locale} selected={value} onSelect={onChange} defaultMonth={value} />
      </PopoverContent>
    </Popover>
  );
}

export function EntityForm<V extends FieldValues>({
  tabs,
  defaultValues,
  onSubmit,
  onCancel,
}: {
  tabs: EntityTab[];
  defaultValues?: Partial<V>;
  onSubmit: (values: V) => void;
  onCancel?: () => void;
}) {
  const t = useTranslations("ui.form");
  const fields = tabs.flatMap((tab) => tab.fields);
  const schema = useMemo(() => z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f, t)]))), [fields, t]);
  const form = useForm<FieldValues>({ resolver: zodResolver(schema), defaultValues: defaultValues as FieldValues, mode: "onTouched" });

  // Onglets contenant une erreur : signalés pour ne pas la cacher
  const errors = form.formState.errors;
  const tabHasError = (tab: EntityTab) => tab.fields.some((f) => errors[f.name]);

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((v) => onSubmit(v as V))}
      className="@container rounded-xl border bg-card p-4 shadow-card"
    >
      <Tabs defaultValue={tabs[0]?.key}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} data-error={tabHasError(tab)} className="data-[error=true]:text-destructive">
              {tab.label}
              {tabHasError(tab) && <span className="size-1.5 rounded-full bg-destructive" aria-label={t("tabHasError")} />}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} forceMount className="mt-4 grid gap-4 data-[state=inactive]:hidden @xl:grid-cols-2">
            {tab.fields.map((f) => (
              <Controller
                key={f.name}
                name={f.name}
                control={form.control}
                render={({ field, fieldState }) => {
                  const id = `field-${f.name}`;
                  const invalid = Boolean(fieldState.error);
                  const label = (
                    <FieldLabel htmlFor={id}>
                      {f.label}
                      {f.required && <span className="text-destructive" aria-hidden>*</span>}
                      {f.custom && (
                        <Badge variant="secondary" className="bg-purple-l text-purple">
                          {t("customField")}
                        </Badge>
                      )}
                    </FieldLabel>
                  );
                  if (f.type === "switch") {
                    return (
                      <Field orientation="horizontal" className={f.wide ? "@xl:col-span-2" : undefined}>
                        <Switch id={id} checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                        {label}
                      </Field>
                    );
                  }
                  return (
                    <Field data-invalid={invalid} className={f.wide || f.type === "textarea" ? "@xl:col-span-2" : undefined}>
                      {label}
                      {f.type === "textarea" ? (
                        <Textarea id={id} aria-invalid={invalid} {...field} value={field.value ?? ""} />
                      ) : f.type === "select" ? (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger id={id} aria-invalid={invalid} className="w-full" onBlur={field.onBlur}>
                            <SelectValue placeholder={t("choose")} />
                          </SelectTrigger>
                          <SelectContent>
                            {f.options?.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : f.type === "date" ? (
                        <DateInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} />
                      ) : f.type === "money" ? (
                        <div className="relative">
                          <Input id={id} inputMode="numeric" aria-invalid={invalid} className="pr-8 text-right tabular-nums" {...field} value={field.value ?? ""} />
                          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">F</span>
                        </div>
                      ) : (
                        <Input id={id} inputMode={f.type === "number" ? "decimal" : undefined} aria-invalid={invalid} {...field} value={field.value ?? ""} />
                      )}
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
      <div className="mt-4 flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
        )}
        <Button type="submit">{t("save")}</Button>
      </div>
    </form>
  );
}
