var A=Object.defineProperty;var g=(t,e,o)=>e in t?A(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var h=(t,e,o)=>(g(t,typeof e!="symbol"?e+"":e,o),o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();function x(t,e){return Math.random()*(e-t)+t}function S(t){F(t.canvas),t.viewport(0,0,t.canvas.width,t.canvas.height)}function F(t){const e=t.clientWidth,o=t.clientHeight,r=t.width!==e||t.height!==o;return r&&(t.width=e,t.height=o),r}function R(t){t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}const E=document.getElementById("canvas"),b=()=>{const t=E.getContext("webgl2");if(!t)throw new Error("Error while getting webgl2 context");return t},_=b();function y(t,e,o){const r=L(t,e,o);if(!r)throw new Error(`Failed to create ${e} shader`);return C(t,r)}function L(t,e,o){const r=t.createShader(e);return r&&(t.shaderSource(r,o),t.compileShader(r)),r}function C(t,e){if(!t.getShaderParameter(e,t.SHADER_TYPE)){const r=t.getShaderInfoLog(e);throw t.deleteShader(e),new Error(`Could not compile shader: ${r}`)}return e}function T(t,e,o){const r=B(t,e,o);if(!r)throw new Error("Failed to create program");return D(t,r)}function B(t,e,o){const r=t.createProgram();if(r)return t.attachShader(r,e),t.attachShader(r,o),t.linkProgram(r),r}function D(t,e){if(!t.getProgramParameter(e,t.LINK_STATUS)){const r=t.getProgramInfoLog(e);throw t.deleteProgram(e),new Error(`program failed to link: ${r}`)}return e}var O=`#version 300 es

uniform float u_time;

in vec4 a_position;

void main() {

  
  vec4 a_position = vec4(a_position.x, a_position.y - u_time, a_position.z, a_position.w);

  
  
  gl_Position = a_position;
}`,U=`#version 300 es

precision highp float;

vec4 mainColor = vec4(0.0f, 0.7f, 1.0f, 1.0f);
vec4 shadeColorF = vec4(0.0f, 0.59f, 0.84f, 1.0f);
vec4 shadeColorS = vec4(0.0f, 0.5f, 0.7f, 1.0f);

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_xPos;

out vec4 FragColor;

void main() {
  
  
  vec2 st = vec2(gl_FragCoord.x, gl_FragCoord.y - u_time) / u_resolution.xy;

  
  float border = 0.499f + u_xPos * 0.5f;

  
  float pct = abs(sin(u_time * 0.25f));

  
  if(st.x < border) {
    
    FragColor = mix(shadeColorF, shadeColorS, pct);
  } else {
    
    FragColor = mainColor;
  }
}`;class I{constructor(){h(this,"draw",({gl:e,particles:o,program:r})=>{e.useProgram(r),e.lineWidth(7);const n=e.getUniformLocation(r,"u_resolution"),i=e.getUniformLocation(r,"u_time"),a=e.getUniformLocation(r,"u_xPos"),u=e.LINES,c=0,s=()=>{S(e),R(e),e.uniform2f(n,e.canvas.width,e.canvas.height);for(let f=0;f<o.length;f++){const{vao:d,positionBuffer:m,positions:l,coords:p,startTime:w}=o[f],v=()=>performance.now()/1e3-w,P=p.y_offset*2;-v()-P<-1?(o.splice(f,1),e.deleteVertexArray(d),e.deleteBuffer(m)):(e.uniform1f(a,p.x),e.uniform1f(i,v()),e.bindVertexArray(d),e.drawArrays(u,c,l.length))}requestAnimationFrame(s)};s()});h(this,"setupProgram",async({gl:e})=>{const o=y(e,e.VERTEX_SHADER,O),r=y(e,e.FRAGMENT_SHADER,U);return T(e,o,r)});h(this,"supplyDataToProgram",({gl:e,coords:o,program:r})=>{const n=e.getAttribLocation(r,"a_position"),i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i);const{x:a,x_offset:u,y:c,y_offset:s}=o,f=[[a,c+s],[a,c-s],[a-u,c+s],[a,c-s],[a+u,c+s],[a,c-s]];e.bufferData(e.ARRAY_BUFFER,new Float32Array(f.flat()),e.STATIC_DRAW);const d=e.createVertexArray();e.bindVertexArray(d),e.enableVertexAttribArray(n);const m=f[0].length,l=e.FLOAT;if(e.vertexAttribPointer(n,m,l,!1,0,0),!d)throw new Error("Failed to create vao");if(!i)throw new Error("Failed to create position buffer");return{positions:f,positionBuffer:i,vao:d}})}}class z{constructor(){h(this,"RainParticle");h(this,"init",async()=>{const e={vsPath:"./webgl/shaders/triangle.vs",fsPath:"./webgl/shaders/triangle.fs"},o=await this.RainParticle.setupProgram({gl:_,paths:e}),r=[];setInterval(()=>{for(let n=0;n<10;n++){const i={x:x(-1,1),x_offset:.005,y:0,y_offset:.07},{positionBuffer:a,positions:u,vao:c}=this.RainParticle.supplyDataToProgram({gl:_,program:o,coords:i}),s=performance.now()/1e3;r.push({vao:c,positionBuffer:a,positions:u,coords:i,startTime:s})}},250),this.RainParticle.draw({gl:_,program:o,particles:r})});this.RainParticle=new I}}const V=new z;window.addEventListener("DOMContentLoaded",V.init,{once:!0});
