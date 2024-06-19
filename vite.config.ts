import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../build",
    assetsDir: "",
  },
  base: "/raw-weather/",
});

