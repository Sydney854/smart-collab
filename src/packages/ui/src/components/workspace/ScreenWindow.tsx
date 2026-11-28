"use client";

import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { Button } from "../ui/button";
import { ScreenContainerContext } from "./context";
import { MIN_WINDOW, type OpenScreen, type Rect, clampRect } from "./state";

type WindowProps = {
  win: OpenScreen;
  title: string;
  icon: ReactNode;
  active: boolean;
  /** Téléphone : toujours en plein écran, sans déplacement */
  fullScreen: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
  onPlace: (rect: Partial<Rect>) => void;
  children: ReactNode;
};

function TitleBar({
  title,
  icon,
  active,
  fullScreen,
  maximized,
  onMinimize,
  onToggleMaximize,
  onClose,
  onDragStart,
}: Omit<WindowProps, "win" | "onFocus" | "onPlace" | "children"> & { maximized: boolean; onDragStart?: (e: ReactPointerEvent<HTMLDivElement>) => void }) {
  const t = useTranslations("ui.window");
  return (
    <div
      className="sc-window-handle flex h-10 shrink-0 cursor-default items-center gap-2 border-b bg-muted px-3 select-none data-[active=true]:bg-card"
      data-active={active}
      onDoubleClick={fullScreen ? undefined : onToggleMaximize}
      onPointerDown={onDragStart}
    >
      <span className="text-gold-strong [&_svg]:size-4" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
      <Button variant="ghost" size="icon-sm" aria-label={t("minimize", { name: title })} onClick={onMinimize}>
        <MinusIcon />
      </Button>
      {!fullScreen && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={maximized ? t("restore", { name: title }) : t("maximize", { name: title })}
          onClick={onToggleMaximize}
        >
          {maximized ? <Minimize2Icon /> : <Maximize2Icon />}
        </Button>
      )}
      <Button variant="ghost" size="icon-sm" aria-label={t("close", { name: title })} onClick={onClose}>
        <XIcon />
      </Button>
    </div>
  );
}

/** Seuil (px) avant qu'un appui sur la barre de titre devienne un déplacement (évite les faux déplacements au clic). */
const DRAG_THRESHOLD = 3;

/**
 * Fenêtre du mode Mosaïque : déplaçable, redimensionnable, agrandissable, réductible.
 * Déplacement « par contour » (comme la vidéo de référence du 26/11/2026) : pendant le geste,
 * la fenêtre reste en place et seul un contour suit la souris ; au relâchement, la fenêtre
 * saute à la place du contour. Échap annule. Les fenêtres peuvent dépasser les bords du bureau,
 * mais leur barre de titre reste attrapable (clampRect).
 */
export function ScreenWindow({ win, title, icon, active, fullScreen, onFocus, onMinimize, onToggleMaximize, onClose, onPlace, children }: WindowProps) {
  const [outline, setOutline] = useState<Rect | null>(null);
  const drag = useRef<{ startX: number; startY: number; moved: boolean; desk: { w: number; h: number } } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  // Retire les écouteurs du geste en cours (relâchement, Échap ou disparition de la fenêtre)
  const stopListening = useRef<(() => void) | null>(null);
  useEffect(() => () => stopListening.current?.(), []);

  // Échap pendant un déplacement : on annule, la fenêtre ne bouge pas
  useEffect(() => {
    if (!outline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopListening.current?.();
        drag.current = null;
        setOutline(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [outline]);

  if (win.minimized) return null;

  function startDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (fullScreen || win.maximized || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const desktop = anchorRef.current?.parentElement;
    const desk = { w: desktop?.clientWidth ?? window.innerWidth, h: desktop?.clientHeight ?? window.innerHeight };
    drag.current = { startX: e.clientX, startY: e.clientY, moved: false, desk };
    e.currentTarget.setPointerCapture(e.pointerId);
    const handle = e.currentTarget;
    const move = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = ev.clientX - d.startX;
      const dy = ev.clientY - d.startY;
      if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      d.moved = true;
      setOutline(clampRect({ x: win.x + dx, y: win.y + dy, w: win.w, h: win.h }, d.desk));
    };
    const up = (ev: PointerEvent) => {
      stopListening.current?.();
      const d = drag.current;
      drag.current = null;
      setOutline(null);
      if (!d?.moved || ev.type === "pointercancel") return;
      const r = clampRect({ x: win.x + ev.clientX - d.startX, y: win.y + ev.clientY - d.startY, w: win.w, h: win.h }, d.desk);
      onPlace({ x: r.x, y: r.y });
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
    stopListening.current = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      stopListening.current = null;
    };
  }

  // Agrandie (sur ordinateur) : plus de barre de titre, affichage comme en mode Liste ; on la remet en fenêtre
  // par son bouton dans la barre du bas (décision du 28/11/2026)
  const bare = win.maximized && !fullScreen;
  const frame = (
    <section
      role="dialog"
      aria-modal={fullScreen}
      aria-label={title}
      data-window={win.key}
      data-active={active}
      data-maximized={win.maximized}
      className="flex size-full flex-col overflow-hidden rounded-xl border bg-background shadow-lg data-[active=true]:ring-2 data-[active=true]:ring-primary/40 data-[maximized=true]:rounded-none data-[maximized=true]:border-0 data-[maximized=true]:shadow-none data-[maximized=true]:ring-0"
      onPointerDownCapture={onFocus}
    >
      {!bare && <TitleBar
        title={title}
        icon={icon}
        active={active}
        fullScreen={fullScreen}
        maximized={win.maximized}
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
        onDragStart={startDrag}
      />}
      <div className={`@container min-h-0 flex-1 overflow-auto ${bare ? "p-4 md:p-6 md:pr-16" : "p-4"}`}>
        <ScreenContainerContext.Provider value="window">{children}</ScreenContainerContext.Provider>
      </div>
    </section>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-40 bg-background" style={{ zIndex: 40 + win.z }}>
        {frame}
      </div>
    );
  }

  return (
    <>
      {/* Repère invisible : permet de mesurer le bureau (parent commun) */}
      <span ref={anchorRef} hidden />
      <Rnd
        disableDragging
        minWidth={MIN_WINDOW.w}
        minHeight={MIN_WINDOW.h}
        position={win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
        size={win.maximized ? { width: "100%", height: "100%" } : { width: win.w, height: win.h }}
        enableResizing={!win.maximized}
        style={{ zIndex: win.z }}
        onResizeStart={() => {
          onFocus();
        }}
        onResizeStop={(_e, _dir, ref, _delta, pos) => {
          // Bord haut tiré au-dessus du bureau : on coupe ce qui dépasse pour garder la barre de titre visible
          const top = Math.min(0, pos.y);
          const desktop = anchorRef.current?.parentElement;
          const desk = { w: desktop?.clientWidth ?? window.innerWidth, h: desktop?.clientHeight ?? window.innerHeight };
          const r = clampRect({ x: pos.x, y: pos.y - top, w: ref.offsetWidth, h: Math.max(MIN_WINDOW.h, ref.offsetHeight + top) }, desk);
          onPlace(r);
        }}
      >
        {frame}
      </Rnd>
      {outline && (
        <div
          data-testid="window-outline"
          aria-hidden
          className="pointer-events-none absolute rounded-xl border-2 border-foreground/70 bg-foreground/5"
          style={{ left: outline.x, top: outline.y, width: outline.w, height: outline.h, zIndex: 10_000 }}
        />
      )}
    </>
  );
}
