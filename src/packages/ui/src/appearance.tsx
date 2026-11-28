"use client";

import { createContext, useContext } from "react";
import {
  type Appearance,
  DEFAULT_BAR_POSITION,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_STYLE,
  DEFAULT_WIZARD_LAYOUT,
} from "./icon-settings";

export type AppearanceValue = Appearance & { set: <K extends keyof Appearance>(key: K, value: Appearance[K]) => void };

export const AppearanceContext = createContext<AppearanceValue>({
  iconStyle: DEFAULT_ICON_STYLE,
  iconSize: DEFAULT_ICON_SIZE,
  wizardLayout: DEFAULT_WIZARD_LAYOUT,
  barPosition: DEFAULT_BAR_POSITION,
  set: () => {},
});

export function useAppearance() {
  return useContext(AppearanceContext);
}
