#version 300 es
// we need to specify a default precision
// cause fragment shader doesnt have one
// highp is a good default, means "high precision"
precision highp float;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // setup a dark blue color
  outColor = vec4(0.0f, 0.7f, 1.0f, 1.0f);
}
