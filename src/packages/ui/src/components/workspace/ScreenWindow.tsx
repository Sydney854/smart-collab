"use client";

import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Rnd } from "react-rnd";
import { Button } from "../ui/button";
import { ScreenContainerContext } from "./context";
import { MIN_WINDOW, type OpenScreen, type Rect } from "./state";

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

function TitleBar({ title, icon, active, fullScreen, maximized, onMinimize, onToggleMaximize, onClose }: Omit<WindowProps, "win" | "onFocus" | "onPlace" | "children"> & { maximized: boolean }) {
  const t = useTranslations("ui.window");
  return (
    <div
      className="sc-window-handle flex h-10 shrink-0 cursor-default items-center gap-2 border-b bg-muted px-3 select-none data-[active=true]:bg-card"
      data-active={active}
      onDoubleClick={fullScreen ? undefined : onToggleMaximize}
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

/** Fenêtre du mode Mosaïque : déplaçable, redimensionnable, agrandissable, réductible. */
export function ScreenWindow({ win, title, icon, active, fullScreen, onFocus, onMinimize, onToggleMaximize, onClose, onPlace, children }: WindowProps) {
  if (win.minimized) return null;

  const frame = (
    <section
      role="dialog"
      aria-modal={fullScreen}
      aria-label={title}
      data-window={win.key}
      data-active={active}
      data-maximized={win.maximized}
      className="flex size-full flex-col overflow-hidden rounded-xl border bg-background shadow-lg data-[active=true]:ring-2 data-[active=true]:ring-primary/40 data-[maximized=true]:rounded-none"
      onPointerDownCapture={onFocus}
    >
      <TitleBar
        title={title}
        icon={icon}
        active={active}
        fullScreen={fullScreen}
        maximized={win.maximized}
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
      />
      <div className="@container min-h-0 flex-1 overflow-auto p-4">
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
    <Rnd
      bounds="parent"
      dragHandleClassName="sc-window-handle"
      cancel="button"
      minWidth={MIN_WINDOW.w}
      minHeight={MIN_WINDOW.h}
      position={win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
      size={win.maximized ? { width: "100%", height: "100%" } : { width: win.w, height: win.h }}
      disableDragging={win.maximized}
      enableResizing={!win.maximized}
      style={{ zIndex: win.z }}
      onDragStart={() => {
        onFocus();
      }}
      onResizeStart={() => {
        onFocus();
      }}
      onDragStop={(_e, d) => onPlace({ x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, pos) => onPlace({ w: ref.offsetWidth, h: ref.offsetHeight, x: pos.x, y: pos.y })}
    >
      {frame}
    </Rnd>
  );
}
