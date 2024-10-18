import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3100,
  },
  plugins: [react()],

  // root: "/src",
  css: {
    devSourcemap: true,

    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        quietDeps: true,
        silenceDeprecations: ["legacy-js-api", "mixed-decls", "color-functions"],
      },

      sass: {
        silenceDeprecations: ["legacy-js-api", "mixed-decls", "color-functions"],
      },
    },
  },

  build: {
    cssMinify: false,
    emptyOutDir: true, // also necessary

    rollupOptions: {
      output: {
        dir: "./deploy",
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },

        chunkFileNames: "assets/js/[name]-[hash].js",

        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
});
