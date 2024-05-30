#version 300 es
// we need to specify a default precision
// cause fragment shader doesnt have one
// highp is a good default, means "high precision"
precision highp float;

vec4 mainColor = vec4(0.0f, 0.7f, 1.0f, 1.0f);
vec4 shadeColorF = vec4(0.0f, 0.59f, 0.84f, 1.0f);
vec4 shadeColorS = vec4(0.0f, 0.5f, 0.7f, 1.0f);

uniform vec2 u_resolution;
uniform float u_time;

// we need to declare an output for the fragment shader
out vec4 FragColor;

void main() {
  // st - spatial texture coords
  // normalized coords of current pixel texture
  vec2 st = vec2(gl_FragCoord.x - u_time * 0.25f, gl_FragCoord.y) / u_resolution.xy;

  // border with current frame rate
  // - 0.5f ratio added cause border moves too fast
  float border = 0.499f - u_time * 0.25f * 0.5f;

  // percentage of shade gradient
  float pct = abs(sin(u_time * 0.25f));

  // check if the pixel in a border range
  if(st.x < border) {
    // mix the two shade colors for border
    FragColor = mix(shadeColorF, shadeColorS, pct);
  } else {
    // draw main shader color
    FragColor = mainColor;
  }
}
