// compute vertex positions
// #version 300 es stand for GLSL ES 3.00 shader language
export const vertexShaderSource = `#version 300 es

// attribute is an input(in) to a vertex shader
// it will receive data from a buffer
in vec4 a_position;

void main() {
  // gl_Position is a special vertex shader var
  // is responsible for setting
  gl_Position = a_position;
}
`;

// compute a color for each pixel
export const fragmentShaderSource = `#version 300 es
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
`;

