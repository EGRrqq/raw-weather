#version 300 es
// we need to specify a default precision
// cause fragment shader doesnt have one
// highp is a good default, means "high precision"
precision highp float;

vec4 mainColor = vec4(0.0f, 0.7f, 1.0f, 1.0f);

// uniform vec2 u_resolution;
// uniform float u_time;

// we need to declare an output for the fragment shader
out vec4 FragColor;

void main() {
  // st - spatial texture coords
  // normalized coords of current pixel texture
  // vec2 st = vec2(gl_FragCoord.x, gl_FragCoord.y - u_time) / u_resolution.xy;

  // draw main shader color
  FragColor = mainColor;
}
