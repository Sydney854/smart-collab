import { cookies } from "next/headers";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  // Menu latéral ouvert ou réduit : mémorisé par shadcn/ui dans le cookie « sidebar_state »
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";
  return <DashboardClient sidebarOpen={sidebarOpen} />;
}
