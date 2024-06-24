import "./style.css";
import RainParticle from "@/webgl/elements/particles/Rain";
import AsideSettings from "@/elements/aside";

AsideSettings;
window.addEventListener("DOMContentLoaded", RainParticle.init, { once: true });

