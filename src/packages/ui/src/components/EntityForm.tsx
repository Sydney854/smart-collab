"use client";

import { Button, DatePicker, Form, Input, InputNumber, Select, Switch, Tabs } from "antd";
import { useTranslations } from "next-intl";

export type FieldType = "text" | "textarea" | "number" | "money" | "select" | "date" | "switch";
export type EntityField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Champ personnalisé ajouté par l'entreprise (moteur de configuration) */
  custom?: boolean;
  span?: 1 | 2;
};
export type EntityTab = { key: string; label: string; fields: EntityField[] };

/**
 * Champ de saisie selon le type. `Form.Item` injecte `value`, `onChange`, `checked`, `id`…
 * dans ce composant : il faut les transmettre au vrai champ.
 */
function FieldInput({ field, ...props }: { field: EntityField } & Record<string, unknown>) {
  switch (field.type) {
    case "textarea":
      return <Input.TextArea autoSize={{ minRows: 3 }} {...props} />;
    case "number":
      return <InputNumber className="w-full" {...props} />;
    case "money":
      return <InputNumber<string> className="w-full" stringMode min="0" step="1" suffix="F" {...props} />;
    case "select":
      return <Select options={field.options} {...props} />;
    case "date":
      return <DatePicker className="w-full" format="DD/MM/YYYY" {...props} />;
    case "switch":
      return <Switch {...props} />;
    default:
      return <Input {...props} />;
  }
}

/** Fiche à onglets (produit, employé, client…), avec champs personnalisés. */
export function EntityForm<T extends Record<string, unknown>>({
  tabs,
  initialValues,
  onSubmit,
  onCancel,
}: {
  tabs: EntityTab[];
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void;
  onCancel?: () => void;
}) {
  const t = useTranslations("ui.form");
  const [form] = Form.useForm<T>();
  return (
    <Form<T> form={form} layout="vertical" initialValues={initialValues} onFinish={onSubmit} requiredMark="optional" className="rounded-card border border-line bg-card p-4 shadow-card">
      <Tabs
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          forceRender: true,
          children: (
            <div className="grid gap-x-4 sm:grid-cols-2">
              {tab.fields.map((f) => (
                <Form.Item
                  key={f.name}
                  name={f.name}
                  className={f.span === 2 || f.type === "textarea" ? "sm:col-span-2" : undefined}
                  valuePropName={f.type === "switch" ? "checked" : "value"}
                  label={
                    <span className="flex items-center gap-2">
                      {f.label}
                      {f.custom && <span className="rounded bg-purple-l px-1.5 text-[11px] text-purple">{t("customField")}</span>}
                    </span>
                  }
                  rules={f.required ? [{ required: true, message: t("required") }] : undefined}
                >
                  <FieldInput field={f} />
                </Form.Item>
              ))}
            </div>
          ),
        }))}
      />
      <div className="flex justify-end gap-2 border-t border-line pt-3">
        {onCancel && <Button onClick={onCancel}>{t("cancel")}</Button>}
        <Button type="primary" htmlType="submit">
          {t("save")}
        </Button>
      </div>
    </Form>
  );
}
