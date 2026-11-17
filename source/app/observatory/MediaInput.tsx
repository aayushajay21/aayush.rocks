"use client";
import {useEffect,useRef,useState} from "react";
import {Camera,Check,ImagePlus,Pencil,RotateCcw,Upload,X} from "lucide-react";
import type {Entry} from "../../lib/orbit/model";
import {EntryImage} from "./ui";
type Point={x:number;y:number};type Line={color:string;points:Point[]};
function draw(ctx:CanvasRenderingContext2D,lines:Line[],width:number,height:number){
 ctx.fillStyle="#0d1224";ctx.fillRect(0,0,width,height);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";
 for(const l of lines){ctx.strokeStyle=l.color;ctx.fillStyle=l.color;ctx.beginPath();const first=l.points[0];if(!first)continue;
 if(l.points.length===1){ctx.arc(first.x,first.y,2,0,Math.PI*2);ctx.fill();continue;}
 ctx.moveTo(first.x,first.y);for(const p of l.points.slice(1))ctx.lineTo(p.x,p.y);ctx.stroke();}
}
function DrawPad({accept,cancel}:{accept:(f:File)=>void;cancel:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),lines=useRef<Line[]>([]),active=useRef<number|null>(null);
 const [count,setCount]=useState(0),[color,setColor]=useState("#f0efff"),[exporting,setExporting]=useState(false);
 const redraw=()=>{const c=canvas.current,ctx=c?.getContext("2d");if(c&&ctx)draw(ctx,lines.current,c.width,c.height);};
 useEffect(redraw,[]);
 const point=(e:React.PointerEvent<HTMLCanvasElement>)=>{const box=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-box.left)*800/box.width,y:(e.clientY-box.top)*400/box.height};};
 return <div className="draw-pad"><div className="draw-toolbar"><div className="swatches">{[["Starlight","#f0efff"],["Lavender","#ad98ff"],["Gold","#ffc076"],["Mint","#82e2ce"]].map(([label,c])=><button aria-label={label+" pen"} aria-pressed={color===c} type="button" className={color===c?"active":""} key={c} onClick={()=>setColor(c)} style={{background:c}}/>)}</div><button type="button" className="text-link" disabled={!count} onClick={()=>{lines.current.pop();setCount(lines.current.length);redraw();}}><RotateCcw size={13}/>Undo</button></div><canvas ref={canvas} aria-label="Sky sketch drawing area. Drag to draw stars and landmarks." width={800} height={400} onPointerDown={e=>{if(active.current!==null)return;e.currentTarget.setPointerCapture(e.pointerId);active.current=e.pointerId;lines.current.push({color,points:[point(e)]});setCount(lines.current.length);redraw();}} onPointerMove={e=>{if(active.current!==e.pointerId)return;lines.current[lines.current.length-1].points.push(point(e));redraw();}} onPointerUp={()=>{active.current=null;}} onPointerCancel={()=>{active.current=null;}}/><div className="draw-footer"><button type="button" className="text-link muted" onClick={cancel}>Cancel drawing</button><button type="button" className="button secondary mini" disabled={!count||exporting} onClick={()=>{setExporting(true);canvas.current?.toBlob(b=>{setExporting(false);if(b)accept(new File([b],"sky-sketch.png",{type:"image/png"}));},"image/png");}}><Check size={13}/>Use sketch</button></div></div>;
}
export default function MediaInput({entry,file,onFile,onDrawing}:{entry:Entry;file?:File;onFile:(file?:File)=>void;onDrawing:(v:boolean)=>void}){
 const input=useRef<HTMLInputElement>(null),[drawing,setDrawing]=useState(false),[problem,setProblem]=useState(""),[preview,setPreview]=useState("");
 useEffect(()=>{if(!file){setPreview("");return;}const u=URL.createObjectURL(file);setPreview(u);return()=>URL.revokeObjectURL(u);},[file]);
 const setMode=(v:boolean)=>{setDrawing(v);onDrawing(v);};
 const choose=(f?:File)=>{setProblem("");if(!f)return;if(!["image/png","image/jpeg","image/webp"].includes(f.type)||f.size>8388608){setProblem("Choose a JPG, PNG or WebP image up to 8 MB.");return;}onFile(f);setMode(false);};
 return <div className="media-input"><span className="field-label">{entry.kind==="observation"?"Sketch or photo (optional)":"Sketch or photo"}</span>{drawing?<DrawPad accept={choose} cancel={()=>setMode(false)}/>:<>{(preview||entry.media)&&<div className="attachment-preview">{preview?<img src={preview} alt="Selected attachment"/>:<EntryImage entry={entry}/>}<span>{file?.name||"Current attachment"}</span>{file&&<button type="button" className="icon-button" aria-label="Remove selected image" onClick={()=>onFile(undefined)}><X size={15}/></button>}</div>}<div className="media-actions"><button type="button" onClick={()=>input.current?.click()}><Upload size={15}/>{preview||entry.media?"Choose another image":"Upload image"}</button><button type="button" onClick={()=>setMode(true)}><Pencil size={15}/>Draw a sketch</button></div><small className="field-help">JPG, PNG or WebP · up to 8 MB</small></>}<input type="file" accept="image/jpeg,image/png,image/webp" ref={input} hidden onChange={e=>{choose(e.target.files?.[0]);e.target.value="";}}/>{problem&&<span role="alert" className="form-error">{problem}</span>}</div>;
}

