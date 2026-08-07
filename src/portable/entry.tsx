import { createRoot } from "react-dom/client";
import { PortableApp } from "./PortableApp";
import { initThemeMode } from "@/lib/theme-pref";
import { initGfxMode } from "@/lib/gfx-pref";
import "../styles.css";

initThemeMode();
initGfxMode();

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<PortableApp />);
}
