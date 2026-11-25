import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DemoClient } from "./DemoClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("demo");
  return { title: `${t("title")} · Smart Collab` };
}

export default function DemoPage() {
  return <DemoClient />;
}
