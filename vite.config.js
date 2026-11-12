import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "preserve-original-script",
      apply: "build",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "script.js",
          source: readFileSync(new URL("./script.js", import.meta.url), "utf8")
        });
      }
    }
  ]
});
