import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // fail clearly instead of silently shifting to 5174
  },
  resolve: {
    alias: {
      "@liftivity/shared-types": resolve(__dirname, "../../packages/shared-types/src/index.ts"),
    },
  },
});
