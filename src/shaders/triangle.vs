#version 300 es

// attribute is an input(in) to a vertex shader
// it will receive data from a buffer
in vec4 a_position;

void main() {
  // gl_Position is a special vertex shader var
  // is responsible for setting
  gl_Position = a_position;
}