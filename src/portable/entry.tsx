import { createRoot } from "react-dom/client";
import { PortableApp } from "./PortableApp";
import { initThemeMode } from "@/lib/theme-pref";
import { initGfxMode } from "@/lib/gfx-pref";
import { initLayoutMode } from "@/lib/layout-mode";
import { ensureDefaultProfileReady } from "@/lib/profiles";
import "../styles.css";

// Offline-first bootstrap — no network, no auth gate.
initLayoutMode();
initThemeMode();
initGfxMode();
void ensureDefaultProfileReady("Explorer");

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<PortableApp />);
}
