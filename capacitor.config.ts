import type { CapacitorConfig } from "@capacitor/cli";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const version = readFileSync(join(process.cwd(), "VERSION"), "utf8").trim();

const config: CapacitorConfig = {
  appId: "com.abcadventure.letterworld",
  appName: "ABC Adventure",
  webDir: `public/portable/abc-adventure-v${version}-portable`,
  android: {
    allowMixedContent: true,
    backgroundColor: "#fff8f0",
  },
  server: {
    androidScheme: "https",
    cleartext: true,
  },
};

export default config;
