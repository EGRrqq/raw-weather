import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    assetsDir: "",
  },
  server: {
    proxy: {
      "/api": "http://localhost:1234/"
    }
  }
});
