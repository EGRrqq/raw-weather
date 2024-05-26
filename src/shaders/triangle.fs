#version 300 es
// we need to specify a default precision
// cause fragment shader doesnt have one
// highp is a good default, means "high precision"
precision highp float;

vec4 mainColor = vec4(0.0f, 0.7f, 1.0f, 1.0f);
vec4 shadeColor = vec4(0.0f, 0.0f, 0.0f, 1.0f);

uniform vec2 u_resolution;
// we need to declare an output for the fragment shader
out vec4 color;

void main() {
  // color = vec4(0.0f, 0.0f, 0.0f, 1.0f);
  vec2 coord = gl_FragCoord.xy / u_resolution.xy;
  // float pct = 0.25f;
  float pct = coord.x;

  // Mix uses pct (a value from 0-1) to
  // mix the two colors
  color = mix(mainColor, shadeColor, pct * 0.25f);
}
