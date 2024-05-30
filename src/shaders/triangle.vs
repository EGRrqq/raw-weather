#version 300 es

uniform float u_time;
// attribute is an input(in) to a vertex shader
// it will receive data from a buffer
in vec4 a_position;

// pass vars to fragment shader
// - current frame rate
out float time;

void main() {
  // set time vars
  time = u_time * 0.25f;
  // vertical movement + shake on sides
  // vec4 a_position = vec4(a_position.x - time, a_position.y - time, a_position.z, a_position.w);

  // vertical movement only
  vec4 a_position = vec4(a_position.x, a_position.y - time, a_position.z, a_position.w);

  // gl_Position is a special vertex shader var
  // is responsible for setting
  gl_Position = a_position;
}
