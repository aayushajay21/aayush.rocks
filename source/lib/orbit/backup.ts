import type {Entry} from "./model";
import {entrySchema} from "./validate";
import {localEntries,localImage,restoreLocal} from "./local";
const asData=(blob:Blob)=>new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(r.error);r.readAsDataURL(blob);});
export async function downloadBackup(){
 const entries=await localEntries(),images:Record<string,string>={};
 for(const e of entries){if(e.media){const image=await localImage(e.id);if(!image)throw new Error("An image could not be read. Try downloading the backup again.");images[e.id]=await asData(image);}}
 const blob=new Blob([JSON.stringify({format:"orbit-journal-backup",version:1,entries,images})],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="orbit-journal-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function readBackup(file:File){
 const b=JSON.parse(await file.text());const entries:Entry[]=[],images=new Map<string,Blob>();
 if(b.format!=="orbit-journal-backup"||b.version!==1||!Array.isArray(b.entries)||typeof b.images!=="object"||b.images===null)throw new Error("Choose a backup downloaded from this journal.");
 const ids=new Set<string>();
 for(const raw of b.entries){
  const p=entrySchema.safeParse(raw);if(!p.success||raw.rev<1||ids.has(raw.id))throw new Error("This backup contains an unreadable entry.");
  const e={...p.data as Entry,deleted:!!raw.deleted,media:!!raw.media};ids.add(e.id);
  if(e.media){const s=b.images[e.id];if(typeof s!=="string"||!/^data:image\/(png|jpeg|webp);base64,/.test(s)||s.length>11200000)throw new Error("This backup contains an unreadable image.");
   const [prefix,data]=s.split(",");const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));images.set(e.id,new Blob([bytes],{type:prefix.slice(5,-7)}));}
  entries.push(e);
 }
 return {entries,images};
}
export {restoreLocal};

