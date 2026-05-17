import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@game": resolve(__dirname, "game/index"),
      "@systems": resolve(__dirname, "engine/systems"),
      "@components": resolve(__dirname, "engine/components"),
    },
  },
});
