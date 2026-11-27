import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, authConfigured, demoWithoutAuth, isPublicPath } from "@/lib/supabase/config";

/**
 * Garde de l'application (exécutée avant chaque page) :
 * - renouvelle la session Supabase (cookies) ;
 * - sans session : seules les pages publiques (/connexion, /invitation) s'ouvrent, les autres renvoient à la connexion ;
 * - session sans second facteur validé (quand il est activé) : renvoi vers la double authentification ;
 * - session sans entreprise dans le jeton : renvoi vers le choix de l'entreprise.
 * La base refuse de toute façon toute donnée dans ces cas (règles de sécurité par ligne) : ce contrôle évite seulement
 * d'afficher des écrans vides.
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!authConfigured) {
    if (demoWithoutAuth) return NextResponse.next();
    // Sécurité par défaut : sans Supabase configuré, l'application ne s'ouvre pas
    return new NextResponse("Configuration incomplète : connexion indisponible.", { status: 503 });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  const redirect = (to: string) => {
    const url = request.nextUrl.clone();
    const [pathname, query] = to.split("?");
    url.pathname = pathname;
    url.search = query ? `?${query}` : "";
    const r = NextResponse.redirect(url);
    for (const c of response.cookies.getAll()) r.cookies.set(c);
    return r;
  };

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { tenant_id?: string; aal?: string } | undefined;
  const wanted = `${path}${request.nextUrl.search}`;

  if (!claims) {
    return isPublicPath(path) ? response : redirect(`/connexion?suite=${encodeURIComponent(wanted)}`);
  }
  if (isPublicPath(path)) return response;

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
    return redirect(`/connexion/double-authentification?suite=${encodeURIComponent(wanted)}`);
  }
  if (!claims.tenant_id) return redirect(`/connexion/entreprise?suite=${encodeURIComponent(wanted)}`);
  // Administrateur sans second facteur alors que la plateforme l'exige (production, décision L5) : activation d'abord
  if (claims.aal !== "aal2") {
    const { data: mustEnroll, error } = await supabase.rpc("must_enroll_mfa");
    if (error || mustEnroll) return redirect(`/connexion/double-authentification/activer?suite=${encodeURIComponent(wanted)}`);
  }
  return response;
}

export const config = {
  // Toutes les pages, sauf les fichiers statiques
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico|woff2?)$).*)"],
};
