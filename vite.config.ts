import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    assetsDir: "",
  },
  base: "/raw-weather/",
});

