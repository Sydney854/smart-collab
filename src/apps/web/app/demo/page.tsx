import { redirect } from "next/navigation";

// Ancienne adresse de la page de démonstration : c'est désormais un écran du cadre.
export default function DemoPage() {
  redirect("/?ecran=components");
}
