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
  | { type: "minimizeAll" }
  | { type: "toggleMaximize"; key: string }
  | { type: "place"; key: string; rect: Partial<Rect> }
  | { type: "setMode"; mode: LayoutMode; desk: { w: number; h: number }; fallback: string };

/** Taille minimale d'une fenêtre : en dessous, le contenu des écrans ne s'affiche plus correctement (décision du 26/11/2026). */
export const MIN_WINDOW = { w: 640, h: 440 };
/** Taille d'une nouvelle fenêtre, en part du bureau (comportement de la vidéo de référence du 26/11/2026). */
export const WINDOW_SHARE = { w: 0.7, h: 0.8 };
/** Décalage en cascade entre deux fenêtres ouvertes l'une après l'autre. */
export const CASCADE_STEP = { x: 36, y: 30 };
/** Une fenêtre peut dépasser les bords du bureau, mais sa barre de titre reste attrapable. */
export const MIN_VISIBLE = { x: 120, y: 40 };

/** Garde une fenêtre attrapable : elle peut dépasser à droite, à gauche et en bas, jamais en haut. */
export function clampRect(rect: Rect, desk: { w: number; h: number }): Rect {
  return {
    ...rect,
    x: Math.round(Math.min(Math.max(rect.x, MIN_VISIBLE.x - rect.w), desk.w - MIN_VISIBLE.x)),
    y: Math.round(Math.min(Math.max(rect.y, 0), Math.max(0, desk.h - MIN_VISIBLE.y))),
  };
}

/**
 * Position d'une nouvelle fenêtre : grande (70 % × 80 % du bureau), posée en haut à gauche,
 * chaque nouvelle fenêtre décalée en cascade vers le bas et la droite.
 */
export function cascadeRect(index: number, desk: { w: number; h: number }): Rect {
  const w = Math.max(MIN_WINDOW.w, Math.round(desk.w * WINDOW_SHARE.w));
  const h = Math.max(MIN_WINDOW.h, Math.round(desk.h * WINDOW_SHARE.h));
  const i = index % MAX_OPEN;
  return clampRect({ x: 16 + CASCADE_STEP.x * i, y: 12 + CASCADE_STEP.y * i, w, h }, desk);
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
    case "minimizeAll":
      // Retour à l'écran d'accueil (bureau et tuiles) : toutes les fenêtres se replient, chacune garde son format
      return { ...state, open: state.open.map((o) => ({ ...o, minimized: true })), current: null };
    case "toggleMaximize":
      return { ...state, open: state.open.map((o) => (o.key === action.key ? { ...o, maximized: !o.maximized } : o)) };
    case "place":
      return { ...state, open: state.open.map((o) => (o.key === action.key ? { ...o, ...action.rect } : o)) };
    case "setMode": {
      if (action.mode === state.mode) return state;
      if (action.mode === "mosaic") {
        // Tous les écrans ouverts se replient dans la barre du bas ; le bureau (tuiles) apparaît (décision du 28/11/2026)
        const open = state.open.map((o, i) => ({ ...o, ...cascadeRect(i, action.desk), maximized: false, minimized: true }));
        return { mode: "mosaic", open, current: null, zTop: state.zTop };
      }
      // Retour en Liste : les fenêtres redeviennent des écrans ouverts ; le Tableau de bord s'affiche (décision du 28/11/2026)
      const open = state.open.map((o) => ({ ...o, minimized: false, maximized: false }));
      if (open.length === 0) return initialWorkspace("list", action.fallback, action.desk);
      if (!open.some((o) => o.key === action.fallback) && open.length < MAX_OPEN) {
        open.unshift({ ...open[0], key: action.fallback, minimized: false, maximized: false });
      }
      const current = open.some((o) => o.key === action.fallback) ? action.fallback : (state.current ?? open[open.length - 1].key);
      return { ...state, mode: "list", open, current };
    }
  }
}
