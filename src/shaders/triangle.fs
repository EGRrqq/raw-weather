#version 300 es
// we need to specify a default precision
// cause fragment shader doesnt have one
// highp is a good default, means "high precision"
precision highp float;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // setup a light green color
  // basically rgba(0, 255, 255* 0,7, 1)
  // 1 is a max value in glsl
outColor = vec4(0, 1, 0.7, 1);
}
