import "./style.css";
import Rain from "./webgl/particles/Rain/Rain";

const RainParticle = new Rain();
window.addEventListener("DOMContentLoaded", RainParticle.init, { once: true });

