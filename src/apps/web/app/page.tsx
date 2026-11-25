import { redirect } from "next/navigation";

// Lot 0 : l'accueil mène à la page de démonstration des composants.
export default function Home() {
  redirect("/demo");
}
