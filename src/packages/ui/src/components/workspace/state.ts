/**
 * État du cadre à 2 modes (décision du 25/11/2026) :
 *  - « list » : modules à gauche, écran à droite, onglets des écrans ouverts ;
 *  - « mosaic » : tuiles ; chaque écran s'ouvre dans une fenêtre déplaçable.
 * Les onglets (mode Liste) et les fenêtres (mode Mosaïque) sont la MÊME liste,
 * limitée à MAX_OPEN éléments.
 */

export const LAYOUT_MODES = ["list", "mosaic"] as const;
export type LayoutMode = (typeof LAYOUT_MODES)[number];
export const MAX_OPEN = 6;

export function isLayoutMode(value: unknown): value is LayoutMode {
  return typeof value === "string" && (LAYOUT_MODES as readonly string[]).includes(value);
}

export type Rect = { x: number; y: number; w: number; h: number };
export type OpenScreen = Rect & { key: string; minimized: boolean; maximized: boolean; z: number };
export type WorkspaceState = { mode: LayoutMode; open: OpenScreen[]; current: string | null; zTop: number };

export type WorkspaceAction =
  | { type: "open"; key: string; desk: { w: number; h: number } }
  | { type: "close"; key: string; fallback: string }
  | { type: "focus"; key: string }
  | { type: "minimize"; key: string }
  | { type: "toggleMaximize"; key: string }
  | { type: "place"; key: string; rect: Partial<Rect> }
  | { type: "setMode"; mode: LayoutMode; desk: { w: number; h: number }; fallback: string };

export const MIN_WINDOW = { w: 360, h: 240 };

/** Position d'une nouvelle fenêtre : en cascade, dans les limites du bureau. */
export function cascadeRect(index: number, desk: { w: number; h: number }): Rect {
  const w = Math.max(MIN_WINDOW.w, Math.min(960, desk.w - 48));
  const h = Math.max(MIN_WINDOW.h, Math.min(640, desk.h - 48));
  const step = 32 * (index % MAX_OPEN);
  return { x: Math.max(0, Math.min(24 + step, desk.w - w)), y: Math.max(0, Math.min(16 + step, desk.h - h)), w, h };
}

/** L'écran peut-il être ouvert ? (déjà ouvert, ou moins de MAX_OPEN éléments) */
export function canOpen(state: WorkspaceState, key: string): boolean {
  return state.open.some((o) => o.key === key) || state.open.length < MAX_OPEN;
}

/** Fenêtre au premier plan (non réduite) ; sert d'écran « courant » en mode Mosaïque. */
function topWindow(open: OpenScreen[]): string | null {
  const visible = open.filter((o) => !o.minimized);
  if (visible.length === 0) return null;
  return visible.reduce((a, b) => (b.z > a.z ? b : a)).key;
}

export function initialWorkspace(mode: LayoutMode, screen: string | null, desk = { w: 1200, h: 800 }): WorkspaceState {
  if (!screen) return { mode, open: [], current: null, zTop: 1 };
  return { mode, open: [{ key: screen, minimized: false, maximized: false, z: 1, ...cascadeRect(0, desk) }], current: screen, zTop: 1 };
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "open": {
      const existing = state.open.find((o) => o.key === action.key);
      const z = state.zTop + 1;
      if (existing) {
        return {
          ...state,
          zTop: z,
          current: action.key,
          open: state.open.map((o) => (o.key === action.key ? { ...o, minimized: false, z } : o)),
        };
      }
      if (state.open.length >= MAX_OPEN) return state;
      const win: OpenScreen = { key: action.key, minimized: false, maximized: false, z, ...cascadeRect(state.open.length, action.desk) };
      return { ...state, zTop: z, current: action.key, open: [...state.open, win] };
    }
    case "close": {
      const open = state.open.filter((o) => o.key !== action.key);
      if (state.mode === "list") {
        // En mode Liste, il reste toujours au moins un écran affiché
        if (open.length === 0) return initialWorkspace("list", action.fallback);
        const current = state.current === action.key ? open[open.length - 1].key : state.current;
        return { ...state, open, current };
      }
      return { ...state, open, current: topWindow(open) };
    }
    case "focus": {
      const z = state.zTop + 1;
      return { ...state, zTop: z, current: action.key, open: state.open.map((o) => (o.key === action.key ? { ...o, minimized: false, z } : o)) };
    }
    case "minimize": {
      const open = state.open.map((o) => (o.key === action.key ? { ...o, minimized: true } : o));
      return { ...state, open, current: topWindow(open) };
    }
    case "toggleMaximize":
      return { ...state, open: state.open.map((o) => (o.key === action.key ? { ...o, maximized: !o.maximized } : o)) };
    case "place":
      return { ...state, open: state.open.map((o) => (o.key === action.key ? { ...o, ...action.rect } : o)) };
    case "setMode": {
      if (action.mode === state.mode) return state;
      if (action.mode === "mosaic") {
        // L'écran affiché devient la fenêtre au premier plan ; les autres onglets sont réduits
        const z = state.zTop + 1;
        const open = state.open.map((o, i) => ({
          ...o,
          ...cascadeRect(i, action.desk),
          maximized: false,
          minimized: o.key !== state.current,
          z: o.key === state.current ? z : o.z,
        }));
        return { mode: "mosaic", open, current: state.current, zTop: z };
      }
      // Retour en Liste : les fenêtres redeviennent des onglets
      const open = state.open.map((o) => ({ ...o, minimized: false }));
      if (open.length === 0) return initialWorkspace("list", action.fallback, action.desk);
      return { ...state, mode: "list", open, current: state.current ?? open[open.length - 1].key };
    }
  }
}
