import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        checkoutSuccess: resolve(__dirname, "src/checkout/success.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        productListing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
});
