import "@/extensions";
import "@/style.css";
import AsideSettings from "@/elements/aside";
import RainParticle from "@/webgl/elements/particles/Rain";

AsideSettings;
window.addEventListener("DOMContentLoaded", RainParticle.init, { once: true });
