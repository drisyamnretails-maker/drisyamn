"use client";
import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type BeautyId = "Smooth" | "Face" | "Eyes" | "Nose" | "Lips";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_smooth;
uniform float u_face;
uniform float u_eyes;
uniform float u_nose;
uniform float u_lips;
uniform vec2 u_nosePos;
uniform vec2 u_eyeL;
uniform vec2 u_eyeR;
uniform vec2 u_mouth;
uniform vec2 u_faceCenter;
float isSkin(vec3 c){ float r=c.r, g=c.g, b=c.b; return step(0.15, r) * step(g, r*0.9) * step(0.2, r-g) * step(0.0, b); }
void main(){
  vec2 uv = v_uv;
  float distFace = distance(uv, u_faceCenter);
  float faceFactor = u_face * 0.35 * (1.0 - smoothstep(0.0, 0.5, distFace));
  uv.x = u_faceCenter.x + (uv.x - u_faceCenter.x) * (1.0 - faceFactor * 0.6);
  float dNose = distance(uv, u_nosePos);
  if(dNose < 0.12){ float s = u_nose * 0.5 * (1.0 - dNose/0.12); uv.x = u_nosePos.x + (uv.x - u_nosePos.x) * (1.0 - s); }
  float dEyeL = distance(uv, u_eyeL);
  if(dEyeL < 0.08){ float s = u_eyes * 0.6 * (1.0 - dEyeL/0.08); uv = u_eyeL + (uv - u_eyeL) * (1.0 + s); }
  float dEyeR = distance(uv, u_eyeR);
  if(dEyeR < 0.08){ float s = u_eyes * 0.6 * (1.0 - dEyeR/0.08); uv = u_eyeR + (uv - u_eyeR) * (1.0 + s); }
  float dMouth = distance(uv, u_mouth);
  if(dMouth < 0.1){ float s = u_lips * 0.4 * (1.0 - dMouth/0.1); uv = u_mouth + (uv - u_mouth) * (1.0 + s); }
  vec3 col = texture2D(u_tex, uv).rgb;
  if(u_smooth > 0.01){
    float skin = isSkin(col);
    vec3 blur = vec3(0.0);
    blur += texture2D(u_tex, uv + vec2(0.002, 0.0)).rgb;
    blur += texture2D(u_tex, uv - vec2(0.002, 0.0)).rgb;
    blur += texture2D(u_tex, uv + vec2(0.0, 0.002)).rgb;
    blur += texture2D(u_tex, uv - vec2(0.0, 0.002)).rgb;
    blur /= 4.0;
    float edge = length(col - blur);
    float mixF = u_smooth * skin * (1.0 - edge*3.0) * 0.7;
    col = mix(col, blur, clamp(mixF, 0.0, 0.45));
    col = mix(col, col * 1.06, mixF * 0.5);
  }
  if(u_lips > 0.01 && dMouth < 0.08){
    float lipMask = (1.0 - dMouth/0.08) * u_lips;
    col = mix(col, vec3(col.r*1.2, col.g*0.85, col.b*0.85), lipMask*0.25);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function BeautyTab() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const rafRef = useRef<number>(0);
  const [active, setActive] = useState<BeautyId>("Face");
  const [values, setValues] = useState<Record<BeautyId, number>>({ Smooth: 30, Face: 18, Eyes: 22, Nose: 15, Lips: 18 });
  const valsRef = useRef(values);
  useEffect(() => { valsRef.current = values; }, [values]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    (async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`, delegate: "GPU" },
        runningMode: "VIDEO", numFaces: 1,
      });
      landmarkerRef.current = landmarker;

      const glCanvas = glCanvasRef.current!; 
      const gl = glCanvas.getContext("webgl") as WebGLRenderingContext;
      const vs = gl.createShader(gl.VERTEX_SHADER)!; gl.shaderSource(vs, VERT); gl.compileShader(vs);
      const fs = gl.createShader(gl.FRAGMENT_SHADER)!; gl.shaderSource(fs, FRAG); gl.compileShader(fs);
      const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);
      const buf = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      const posLoc = gl.getAttribLocation(prog, "a_pos"); gl.enableVertexAttribArray(posLoc); gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      const texture = gl.createTexture()!;
      const uniformLoc: any = {
        tex: gl.getUniformLocation(prog, "u_tex"),
        smooth: gl.getUniformLocation(prog, "u_smooth"),
        face: gl.getUniformLocation(prog, "u_face"),
        eyes: gl.getUniformLocation(prog, "u_eyes"),
        nose: gl.getUniformLocation(prog, "u_nose"),
        lips: gl.getUniformLocation(prog, "u_lips"),
        nosePos: gl.getUniformLocation(prog, "u_nosePos"),
        eyeL: gl.getUniformLocation(prog, "u_eyeL"),
        eyeR: gl.getUniformLocation(prog, "u_eyeR"),
        mouth: gl.getUniformLocation(prog, "u_mouth"),
        faceCenter: gl.getUniformLocation(prog, "u_faceCenter"),
      };

      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 720, height: 1280 } });
      const video = videoRef.current!; 
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      
      await new Promise<void>(res => video.onloadedmetadata = () => res());
      if (cancelled) return;
      
      try { await video.play(); } catch(e:any){ if(e.name !== 'AbortError') console.log(e); }

      const lmCache = { nose:[0.5,0.5], eyeL:[0.35,0.4], eyeR:[0.65,0.4], mouth:[0.5,0.65], center:[0.5,0.5] };
      const draw = () => {
        if (cancelled || video.videoWidth===0){ rafRef.current=requestAnimationFrame(draw); return; }
        glCanvas.width = video.videoWidth; glCanvas.height = video.videoHeight;
        gl.viewport(0,0, glCanvas.width, glCanvas.height);
        const res = landmarker.detectForVideo(video, performance.now());
        if (res.faceLandmarks?.[0]) {
          const lm = res.faceLandmarks[0];
          const gp = (i:number) => [1 - lm[i].x, lm[i].y];
          lmCache.nose = gp(1); lmCache.eyeL = gp(33); lmCache.eyeR = gp(263); lmCache.mouth = gp(13); lmCache.center = gp(1);
        }
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        gl.uniform1i(uniformLoc.tex, 0);
        const v = valsRef.current;
        gl.uniform1f(uniformLoc.smooth, v.Smooth/100);
        gl.uniform1f(uniformLoc.face, v.Face/100);
        gl.uniform1f(uniformLoc.eyes, v.Eyes/100);
        gl.uniform1f(uniformLoc.nose, v.Nose/100);
        gl.uniform1f(uniformLoc.lips, v.Lips/100);
        gl.uniform2f(uniformLoc.nosePos, lmCache.nose[0], 1-lmCache.nose[1]);
        gl.uniform2f(uniformLoc.eyeL, lmCache.eyeL[0], 1-lmCache.eyeL[1]);
        gl.uniform2f(uniformLoc.eyeR, lmCache.eyeR[0], 1-lmCache.eyeR[1]);
        gl.uniform2f(uniformLoc.mouth, lmCache.mouth[0], 1-lmCache.mouth[1]);
        gl.uniform2f(uniformLoc.faceCenter, lmCache.center[0], 1-lmCache.center[1]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        rafRef.current = requestAnimationFrame(draw);
      };
      draw();
    })();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const pills: BeautyId[] = ["Smooth", "Face", "Eyes", "Nose", "Lips"];
  return (
    <div className="w-full h-[100dvh] bg-black relative overflow-hidden flex justify-center">
      <div className="w-full max-w-[400px] h-full relative">
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
        <canvas ref={glCanvasRef} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-[100px] left-[6px] right-[6px] bg-white/15 backdrop-blur-[20px] rounded-[22px] px-5 py-5 border border-white/20 z-10 flex flex-col gap-6">
          <div className="text-white text-center font-bold text-[14px]">WEBGL BEAUTY FIXED</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-1">
            {pills.map((p) => (
              <button key={p} onClick={() => setActive(p)} className={`min-w-[62px] h-[38px] px-3 rounded-[14px] text-[12px] font-bold shrink-0 ${active===p ? "bg-[#FF2D20] text-white" : "bg-black/30 text-white/80 border border-white/10"}`}>{p}</button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center"><span className="text-white font-black text-[13px]">{active.toUpperCase()}</span><span className="bg-[#FF2D20] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">{values[active]}</span></div>
            <div className="relative h-[4px] bg-white/20 rounded-full"><div className="absolute left-0 top-0 h-[4px] bg-[#FF2D20] rounded-full" style={{ width: `${values[active]}%` }} /><input type="range" min={0} max={100} value={values[active]} onChange={(e) => setValues({ ...values, [active]: Number(e.target.value) })} className="absolute inset-0 w-full h-8 -top-3 opacity-0 cursor-pointer z-20" /><div className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-white border-2 border-[#FF2D20] rounded-full shadow-lg" style={{ left: `calc(${values[active]}% - 9px)` }} /></div>
          </div>
          <div className="flex gap-3"><button onClick={() => setValues({ ...values, [active]: 0 })} className="flex-1 h-[42px] rounded-full bg-white/10 text-white text-[13px] font-bold">Reset</button><button onClick={() => setValues({ Smooth:0, Face:0, Eyes:0, Nose:0, Lips:0 })} className="flex-1 h-[42px] rounded-full bg-[#FF2D20] text-white text-[13px] font-bold">Clear</button></div>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}