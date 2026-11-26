"use client";

/**
 * Icônes illustrées des modules Smart Collab (05_UI_UX/ICONES_MODULES.md, validé le 26/11/2026).
 *
 * Un seul dessin par module, sur une grille de 48 × 48 : chaque forme porte un RÔLE
 * (p principal, s second, t troisième, n sombre, w blanc). Le style choisi dans
 * Paramètres → Apparence transforme les rôles en couleurs : on ne dessine jamais six fois.
 * Couleurs : tokens.ts (MODULE_PALETTE, ICON_INKS) ; aucune couleur écrite ici.
 * Ces icônes servent UNIQUEMENT aux tuiles des modules ; l'interface reste en Lucide.
 */

import { type SVGProps, useId } from "react";
import { useScTheme } from "../context";
import type { IconStyle } from "../icon-settings";
import { ICON_INKS, MODULE_PALETTE, type ModuleColor, type ThemeMode, shadeHex, tintHex } from "../tokens";


type Role = "p" | "s" | "t" | "n" | "w";
type Shape =
  | ["rect", { x: number; y: number; width: number; height: number; rx?: number; transform?: string; opacity?: number }, Role]
  | ["circle", { cx: number; cy: number; r: number }, Role]
  | ["path", { d: string; stroke?: "line"; strokeWidth?: number }, Role];

export type ModuleIconDef = { color: ModuleColor; trio: [ModuleColor, ModuleColor, ModuleColor]; shapes: Shape[] };

/** Dessins des modules (géométrie reprise de 05_UI_UX/references/icones-modules.html). */
export const MODULE_ICONS = {
  dashboard: {
    color: "gold",
    trio: ["gold", "coral", "teal"],
    shapes: [
      ["rect", { x: 6, y: 22, width: 9, height: 20, rx: 2.5 }, "s"],
      ["rect", { x: 19.5, y: 10, width: 9, height: 32, rx: 2.5 }, "p"],
      ["rect", { x: 33, y: 28, width: 9, height: 14, rx: 2.5 }, "t"],
      ["circle", { cx: 37.5, cy: 15, r: 5 }, "n"],
    ],
  },
  sales: {
    color: "coral",
    trio: ["coral", "gold", "violet"],
    shapes: [
      ["path", { d: "M7 9.5Q7 7 9.5 7H24L42 25 25 42 7 24Z" }, "p"],
      ["circle", { cx: 15, cy: 15, r: 3.2 }, "w"],
      ["circle", { cx: 34, cy: 35, r: 9.5 }, "s"],
      ["circle", { cx: 34, cy: 35, r: 4.5 }, "t"],
    ],
  },
  pos: {
    color: "orange",
    trio: ["orange", "violet", "teal"],
    shapes: [
      ["rect", { x: 30, y: 15, width: 4, height: 6 }, "n"],
      ["rect", { x: 23, y: 5, width: 18, height: 11, rx: 2.5 }, "s"],
      ["path", { d: "M9 20H39L43 34H5Z" }, "p"],
      ["rect", { x: 3, y: 34, width: 42, height: 9, rx: 2.5 }, "t"],
      ["rect", { x: 12, y: 24, width: 5, height: 3.5, rx: 1 }, "w"],
      ["rect", { x: 21.5, y: 24, width: 5, height: 3.5, rx: 1 }, "w"],
      ["rect", { x: 31, y: 24, width: 5, height: 3.5, rx: 1 }, "w"],
    ],
  },
  stock: {
    color: "teal",
    trio: ["teal", "blue", "gold"],
    shapes: [
      ["path", { d: "M6 15 24 24V43L6 34Z" }, "p"],
      ["path", { d: "M24 24 42 15V34L24 43Z" }, "s"],
      ["path", { d: "M24 6 42 15 24 24 6 15Z" }, "t"],
      ["path", { d: "M15 10.5 33 19.5V25L29 27V21.5L11 12.5Z" }, "w"],
    ],
  },
  purchases: {
    color: "blue",
    trio: ["blue", "teal", "gold"],
    shapes: [
      ["rect", { x: 3, y: 11, width: 26, height: 21, rx: 2.5 }, "p"],
      ["path", { d: "M29 18H37L44 25V32H29Z" }, "s"],
      ["rect", { x: 32, y: 21, width: 5, height: 5, rx: 1 }, "w"],
      ["circle", { cx: 13, cy: 35, r: 5.5 }, "n"],
      ["circle", { cx: 13, cy: 35, r: 2 }, "t"],
      ["circle", { cx: 36, cy: 35, r: 5.5 }, "n"],
      ["circle", { cx: 36, cy: 35, r: 2 }, "t"],
    ],
  },
  finance: {
    color: "green",
    trio: ["green", "gold", "coral"],
    shapes: [
      ["rect", { x: 11, y: 6, width: 26, height: 15, rx: 2.5, transform: "rotate(-8 24 13)" }, "t"],
      ["rect", { x: 5, y: 14, width: 38, height: 28, rx: 4.5 }, "p"],
      ["rect", { x: 28, y: 22, width: 15, height: 12, rx: 3.5 }, "s"],
      ["circle", { cx: 34.5, cy: 28, r: 2.5 }, "w"],
    ],
  },
  apps: {
    color: "violet",
    trio: ["violet", "teal", "gold"],
    shapes: [
      ["rect", { x: 5, y: 5, width: 17, height: 17, rx: 4.5 }, "p"],
      ["rect", { x: 26, y: 5, width: 17, height: 17, rx: 4.5 }, "s"],
      ["rect", { x: 5, y: 26, width: 17, height: 17, rx: 4.5 }, "t"],
      ["circle", { cx: 34.5, cy: 34.5, r: 8.5 }, "n"],
    ],
  },
  // Paramètres : trois curseurs (nouveau dessin, même grammaire que les autres)
  settings: {
    color: "indigo",
    trio: ["indigo", "gold", "teal"],
    shapes: [
      ["rect", { x: 5, y: 9, width: 38, height: 6, rx: 3 }, "s"],
      ["rect", { x: 5, y: 21, width: 38, height: 6, rx: 3 }, "s"],
      ["rect", { x: 5, y: 33, width: 38, height: 6, rx: 3 }, "s"],
      ["circle", { cx: 15, cy: 12, r: 6 }, "p"],
      ["circle", { cx: 32, cy: 24, r: 6 }, "t"],
      ["circle", { cx: 21, cy: 36, r: 6 }, "n"],
      ["circle", { cx: 15, cy: 12, r: 2.2 }, "w"],
      ["circle", { cx: 32, cy: 24, r: 2.2 }, "w"],
      ["circle", { cx: 21, cy: 36, r: 2.2 }, "w"],
    ],
  },
  components: {
    color: "pink",
    trio: ["coral", "blue", "gold"],
    shapes: [
      ["circle", { cx: 17, cy: 18, r: 12 }, "p"],
      ["rect", { x: 20, y: 21, width: 23, height: 22, rx: 4.5, opacity: 0.92 }, "s"],
      ["path", { d: "M35 4 44 18H26Z" }, "t"],
    ],
  },
  "hr-employees": {
    color: "plum",
    trio: ["violet", "gold", "teal"],
    shapes: [
      ["circle", { cx: 32, cy: 14, r: 6 }, "s"],
      ["rect", { x: 21, y: 23, width: 22, height: 17, rx: 8.5 }, "s"],
      ["circle", { cx: 17, cy: 17, r: 7 }, "p"],
      ["rect", { x: 4, y: 27, width: 26, height: 17, rx: 8.5 }, "p"],
      ["rect", { x: 15, y: 31, width: 4, height: 9, rx: 2 }, "t"],
    ],
  },
  "hr-attendance": {
    color: "sky",
    trio: ["blue", "coral", "gold"],
    shapes: [
      ["circle", { cx: 11, cy: 10, r: 5 }, "t"],
      ["circle", { cx: 37, cy: 10, r: 5 }, "t"],
      ["circle", { cx: 24, cy: 26, r: 18 }, "p"],
      ["circle", { cx: 24, cy: 26, r: 13.5 }, "w"],
      ["path", { d: "M24 26V16.5", stroke: "line", strokeWidth: 3.2 }, "n"],
      ["path", { d: "M24 26 31 30.5", stroke: "line", strokeWidth: 3.2 }, "s"],
      ["circle", { cx: 24, cy: 26, r: 2.4 }, "n"],
    ],
  },
  "hr-payroll": {
    color: "indigo",
    trio: ["gold", "teal", "violet"],
    shapes: [
      ["rect", { x: 6, y: 4, width: 27, height: 35, rx: 3.5 }, "s"],
      ["rect", { x: 11, y: 11, width: 17, height: 3, rx: 1.5 }, "w"],
      ["rect", { x: 11, y: 17, width: 12, height: 3, rx: 1.5 }, "w"],
      ["rect", { x: 11, y: 23, width: 14, height: 3, rx: 1.5 }, "w"],
      ["circle", { cx: 33, cy: 34, r: 10.5 }, "p"],
      ["circle", { cx: 33, cy: 34, r: 5 }, "t"],
    ],
  },
} as const satisfies Record<string, ModuleIconDef>;
export type ModuleIconKey = keyof typeof MODULE_ICONS;


type Paint = { fill?: string; fillOpacity?: number; stroke?: string; strokeWidth?: number; style?: React.CSSProperties };
type Gradient = { id: string; from: string; to: string };

/** Couleurs d'une forme selon le style (fonction pure, testée). */
export function paintFor(def: ModuleIconDef, role: Role, style: IconStyle, mode: ThemeMode, line: boolean, gid: string, grads: Gradient[]): Paint | null {
  const c = MODULE_PALETTE[def.color];
  const [m0, m1, m2] = def.trio.map((k) => MODULE_PALETTE[k]);
  const ink = ICON_INKS[mode];
  const as = (color: string): Paint => (line ? { fill: "none", stroke: color } : { fill: color });

  switch (style) {
    case "trait":
      // Contour or de l'interface (suit la couleur principale choisie) ; pas de trous
      if (role === "w") return null;
      return { fill: "none", style: { stroke: "var(--sc-accent-strong)" }, strokeWidth: 2.4 };
    case "bi":
      return as({ p: c, s: ink.navy, t: tintHex(c, 0.5), n: ink.navy, w: ink.white }[role]);
    case "multi":
      return as({ p: m0, s: m1, t: m2, n: ink.navyMulti, w: ink.white }[role]);
    case "grad": {
      if (role === "w") return { fill: ink.white, fillOpacity: 0.92 };
      const base = { p: c, s: m1 === c ? m0 : m1, t: tintHex(c, 0.35), n: shadeHex(c, 0.35) }[role];
      const id = `${gid}-${role}`;
      if (!grads.some((g) => g.id === id)) grads.push({ id, from: tintHex(base, 0.38), to: shadeHex(base, 0.1) });
      return as(`url(#${id})`);
    }
    case "duo": {
      const stroke = mode === "dark" ? tintHex(c, 0.2) : shadeHex(c, 0.12);
      if (line) return { fill: "none", stroke };
      if (role === "w") return { fill: ink.hole, stroke, strokeWidth: 2 };
      return { fill: c, fillOpacity: { p: 0.32, s: 0.5, t: 0.18, n: 0.6 }[role], stroke, strokeWidth: 2 };
    }
    case "pill":
      if (line) return { fill: "none", stroke: c };
      if (role === "w") return { fill: c };
      return { fill: ink.white, fillOpacity: { p: 1, s: 0.7, t: 0.5, n: 0.88 }[role] };
  }
}

/** Icône illustrée d'un module, dans le style et le thème demandés (par défaut : thème courant). */
export function ModuleIcon({
  module,
  iconStyle,
  mode,
  ...props
}: { module: ModuleIconKey; iconStyle: IconStyle; mode?: ThemeMode } & Omit<SVGProps<SVGSVGElement>, "style" | "mode">) {
  const theme = useScTheme();
  const m = mode ?? theme.mode;
  const gid = `sc-ico-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const def: ModuleIconDef = MODULE_ICONS[module];
  const grads: Gradient[] = [];

  const shapes = def.shapes.map(([tag, attrs, role], i) => {
    const { stroke: lineFlag, strokeWidth: lineWidth, ...geometry } = attrs as Record<string, unknown> & { stroke?: string; strokeWidth?: number };
    const line = lineFlag === "line";
    const paint = paintFor(def, role, iconStyle, m, line, gid, grads);
    if (!paint) return null;
    const common = {
      key: i,
      ...geometry,
      ...paint,
      strokeWidth: line ? lineWidth : paint.strokeWidth,
      strokeLinecap: line || iconStyle === "trait" ? ("round" as const) : undefined,
      strokeLinejoin: paint.stroke || paint.style ? ("round" as const) : undefined,
    };
    if (tag === "rect") return <rect {...(common as SVGProps<SVGRectElement>)} />;
    if (tag === "circle") return <circle {...(common as SVGProps<SVGCircleElement>)} />;
    return <path {...(common as SVGProps<SVGPathElement>)} />;
  });

  const defs = (extra?: Gradient) => (
    <defs>
      {[...grads, ...(extra ? [extra] : [])].map((g) => (
        <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={g.from} />
          <stop offset="1" stopColor={g.to} />
        </linearGradient>
      ))}
    </defs>
  );

  if (iconStyle === "pill") {
    const c = MODULE_PALETTE[def.color];
    const bg = { id: `${gid}-bg`, from: tintHex(c, 0.18), to: shadeHex(c, 0.14) };
    return (
      <svg viewBox="0 0 48 48" aria-hidden data-icon-style={iconStyle} data-module={module} {...props}>
        {defs(bg)}
        <rect width="48" height="48" rx="12" fill={`url(#${bg.id})`} />
        <g transform="translate(10.5 10.5) scale(.5625)">{shapes}</g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden data-icon-style={iconStyle} data-module={module} style={iconStyle === "multi" ? { isolation: "isolate" } : undefined} {...props}>
      {grads.length > 0 && defs()}
      {shapes}
    </svg>
  );
}
