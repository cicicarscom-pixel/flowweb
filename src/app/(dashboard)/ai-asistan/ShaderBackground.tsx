"use client";

import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
 const canvasRef = useRef<HTMLCanvasElement>(null);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;

 function syncSize() {
 if (!canvas) return;
 const w = canvas.clientWidth || 1280;
 const h = canvas.clientHeight || 720;
 if (canvas.width !== w || canvas.height !== h) {
 canvas.width = w;
 canvas.height = h;
 }
 }

 let resizeObserver: ResizeObserver | null = null;
 if (typeof ResizeObserver !== 'undefined') {
 resizeObserver = new ResizeObserver(syncSize);
 resizeObserver.observe(canvas);
 }
 syncSize();

 const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext);
 if (!gl) return;

 const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
 v_texCoord = a_position * 0.5 + 0.5;
 gl_Position = vec4(a_position, 0.0, 1.0);
}`;

 const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float sdRoundRect(vec2 p, vec2 b, float r) {
 vec2 d = abs(p) - b + r;
 return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}

void main() {
 vec2 uv = v_texCoord;
 vec2 p = uv - 0.5;
 float time = u_time * 0.8;
 
 vec2 size = vec2(0.48, 0.48);
 float radius = 0.05;
 
 float d = sdRoundRect(p, size, radius);
 
 float thickness = 0.005;
 float border = smoothstep(thickness, 0.0, abs(d));
 
 float glow = exp(-pow(d, 2.0) / 0.002) * 0.6;
 vec3 glowColor = vec3(0.0, 0.5, 1.0);
 
 float angle = atan(p.y, p.x);
 float chaserPos = mod(angle - time * 2.0, 6.28318);
 float chaserMask = smoothstep(0.8, 0.0, chaserPos);
 
 vec3 rainbow = 0.5 + 0.5 * cos(time + angle + vec3(0.0, 2.0, 4.0));
 
 vec3 finalColor = glowColor * glow;
 finalColor += rainbow * border * chaserMask * 2.0;
 
 float alpha = clamp(glow + border * chaserMask, 0.0, 1.0);
 
 gl_FragColor = vec4(finalColor, alpha);
}`;

 function createShader(type: number, src: string) {
 if (!gl) return null;
 const s = gl.createShader(type);
 if (!s) return null;
 gl.shaderSource(s, src);
 gl.compileShader(s);
 return s;
 }

 const prog = gl.createProgram();
 if (!prog) return;
 
 const vertexShader = createShader(gl.VERTEX_SHADER, vs);
 const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
 if (!vertexShader || !fragmentShader) return;

 gl.attachShader(prog, vertexShader);
 gl.attachShader(prog, fragmentShader);
 gl.linkProgram(prog);
 gl.useProgram(prog);

 const buf = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, buf);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
 const pos = gl.getAttribLocation(prog, 'a_position');
 gl.enableVertexAttribArray(pos);
 gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

 const uTime = gl.getUniformLocation(prog, 'u_time');
 const uRes = gl.getUniformLocation(prog, 'u_resolution');

 let animationFrameId: number;
 const startTime = Date.now();

 function render() {
 if (!canvas || !gl) return;
 if (typeof ResizeObserver === 'undefined') syncSize();
 gl.viewport(0, 0, canvas.width, canvas.height);
 
 const t = Date.now() - startTime;
 if (uTime) gl.uniform1f(uTime, t * 0.001);
 if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
 
 gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
 animationFrameId = requestAnimationFrame(render);
 }
 
 render();

 return () => {
 if (animationFrameId) cancelAnimationFrame(animationFrameId);
 if (resizeObserver) resizeObserver.disconnect();
 };
 }, []);

 return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
}
