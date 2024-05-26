#version 300 es
// we need to specify a default precision
// cause fragment shader doesnt have one
// highp is a good default, means "high precision"
precision highp float;

#define PI 3.14159265359
vec4 mainColor = vec4(0.0f, 0.7f, 1.0f, 1.0f);
vec4 shadeColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);

uniform vec2 u_resolution;
uniform float u_time;
// we need to declare an output for the fragment shader
out vec4 color;

void main() {
  // vec2 st = gl_FragCoord.xy / u_resolution.xy;

  float pct = abs(sin(u_time));

  // Mix uses pct (a value from 0-1) to
  // mix the two colors
  color = mix(mainColor, shadeColor, pct);
}
