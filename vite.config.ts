import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // run dev 시 jsx 변환
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@/utils/core",
  },
});
