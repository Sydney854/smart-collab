import { theme as antdTheme, type ThemeConfig } from "antd";
import { type AccentPreset, DEFAULT_ACCENT, type ThemeMode, resolveColors, shape } from "./tokens";

/** Thème Ant Design construit à partir des jetons Smart Collab. */
export function buildAntdTheme(mode: ThemeMode, accent: AccentPreset = DEFAULT_ACCENT): ThemeConfig {
  const c = resolveColors(mode, accent);
  return {
    algorithm: mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    cssVar: { key: "sc" },
    token: {
      colorPrimary: c.accent,
      colorInfo: c.blue,
      colorSuccess: c.green,
      colorWarning: c.amber,
      colorError: c.red,
      colorLink: c.blue,
      colorTextBase: c.ink,
      colorText: c.ink,
      colorTextSecondary: c["ink-2"],
      colorTextTertiary: c.muted,
      colorTextQuaternary: c.faint,
      colorBgBase: c.card,
      colorBgLayout: c.bg,
      colorBgContainer: c.card,
      colorBgElevated: c.card,
      colorBgMask: c.overlay,
      colorBorder: c.line,
      colorBorderSecondary: c.line,
      fontFamily: shape.fontFamily,
      borderRadius: shape.radiusControl,
      borderRadiusLG: shape.radiusCard,
      boxShadowTertiary: shape.shadowCard,
    },
    components: {
      Button: { primaryColor: c["on-accent"], primaryShadow: "none" },
      Layout: { siderBg: c["nav-1"], headerBg: c.card, bodyBg: c.bg, headerPadding: "0 16px" },
      Menu: {
        darkItemBg: "transparent",
        darkSubMenuItemBg: "transparent",
        darkItemColor: c["nav-text"],
        darkItemHoverColor: c["nav-text-active"],
        darkItemSelectedBg: c.accent,
        darkItemSelectedColor: c["on-accent"],
      },
      Card: { headerFontSize: 15 },
      // Texte de l'onglet actif en couleur de texte (l'or sur blanc est trop peu contrasté), barre en or
      Tabs: { itemSelectedColor: c.ink, itemActiveColor: c.ink, itemHoverColor: c.ink, inkBarColor: c.accent },
    },
  };
}
