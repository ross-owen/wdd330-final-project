import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/search/index.html"),
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
});
