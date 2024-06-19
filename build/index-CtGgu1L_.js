var v=Object.defineProperty;var R=(t,e,o)=>e in t?v(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var h=(t,e,o)=>(R(t,typeof e!="symbol"?e+"":e,o),o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();function E(t,e){return Math.random()*(e-t)+t}function L(t){x(t.canvas),t.viewport(0,0,t.canvas.width,t.canvas.height)}function x(t){const e=t.clientWidth,o=t.clientHeight,r=t.width!==e||t.height!==o;return r&&(t.width=e,t.height=o),r}function b(t){t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}const _=document.getElementById("canvas"),g=()=>{const t=_.getContext("webgl2");if(!t)throw new Error("Error while getting webgl2 context");return t},y=g();function A(t,e,o){const r=F(t,e,o);if(!r)throw new Error(`Failed to create ${e} shader`);return T(t,r)}function F(t,e,o){const r=t.createShader(e);return r&&(t.shaderSource(r,o),t.compileShader(r)),r}function T(t,e){if(!t.getShaderParameter(e,t.SHADER_TYPE)){const r=t.getShaderInfoLog(e);throw t.deleteShader(e),new Error(`Could not compile shader: ${r}`)}return e}function B(t,e,o){const r=D(t,e,o);if(!r)throw new Error("Failed to create program");return O(t,r)}function D(t,e,o){const r=t.createProgram();if(r)return t.attachShader(r,e),t.attachShader(r,o),t.linkProgram(r),r}function O(t,e){if(!t.getProgramParameter(e,t.LINK_STATUS)){const r=t.getProgramInfoLog(e);throw t.deleteProgram(e),new Error(`program failed to link: ${r}`)}return e}async function U(t){const[e,o]=await Promise.all([fetch(t.vsPath).then(r=>r.text()),fetch(t.fsPath).then(r=>r.text())]);return{vertSource:e,fragSource:o}}class I{constructor(){h(this,"draw",({gl:e,particles:o,program:r})=>{e.useProgram(r),e.lineWidth(7);const n=e.getUniformLocation(r,"u_resolution"),i=e.getUniformLocation(r,"u_time"),a=e.getUniformLocation(r,"u_xPos"),u=e.LINES,c=0,s=()=>{L(e),b(e),e.uniform2f(n,e.canvas.width,e.canvas.height);for(let f=0;f<o.length;f++){const{vao:d,positionBuffer:m,positions:l,coords:p,startTime:P}=o[f],w=()=>performance.now()/1e3-P,S=p.y_offset*2;-w()-S<-1?(o.splice(f,1),e.deleteVertexArray(d),e.deleteBuffer(m)):(e.uniform1f(a,p.x),e.uniform1f(i,w()),e.bindVertexArray(d),e.drawArrays(u,c,l.length))}requestAnimationFrame(s)};s()});h(this,"setupProgram",async({gl:e,paths:o})=>{const{vertSource:r,fragSource:n}=await U(o),i=A(e,e.VERTEX_SHADER,r),a=A(e,e.FRAGMENT_SHADER,n);return B(e,i,a)});h(this,"supplyDataToProgram",({gl:e,coords:o,program:r})=>{const n=e.getAttribLocation(r,"a_position"),i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i);const{x:a,x_offset:u,y:c,y_offset:s}=o,f=[[a,c+s],[a,c-s],[a-u,c+s],[a,c-s],[a+u,c+s],[a,c-s]];e.bufferData(e.ARRAY_BUFFER,new Float32Array(f.flat()),e.STATIC_DRAW);const d=e.createVertexArray();e.bindVertexArray(d),e.enableVertexAttribArray(n);const m=f[0].length,l=e.FLOAT;if(e.vertexAttribPointer(n,m,l,!1,0,0),!d)throw new Error("Failed to create vao");if(!i)throw new Error("Failed to create position buffer");return{positions:f,positionBuffer:i,vao:d}})}}class V{constructor(){h(this,"RainParticle");h(this,"init",async()=>{const e={vsPath:"./webgl/shaders/triangle.vs",fsPath:"./webgl/shaders/triangle.fs"},o=await this.RainParticle.setupProgram({gl:y,paths:e}),r=[];setInterval(()=>{for(let n=0;n<10;n++){const i={x:E(-1,1),x_offset:.005,y:0,y_offset:.07},{positionBuffer:a,positions:u,vao:c}=this.RainParticle.supplyDataToProgram({gl:y,program:o,coords:i}),s=performance.now()/1e3;r.push({vao:c,positionBuffer:a,positions:u,coords:i,startTime:s})}},250),this.RainParticle.draw({gl:y,program:o,particles:r})});this.RainParticle=new I}}const z=new V;window.addEventListener("DOMContentLoaded",z.init,{once:!0});
