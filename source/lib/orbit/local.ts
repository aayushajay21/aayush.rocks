import type {Entry} from "./model";
import {entrySchema} from "./validate";
const name=()=> "orbit-journal-v1:"+location.pathname.replace(/index\.html$/,"").replace(/\/$/,"");
let cached:Promise<IDBDatabase>|undefined;
function db(){
 if(!cached)cached=new Promise<IDBDatabase>((resolve,reject)=>{
  const request=indexedDB.open(name(),1);
  request.onupgradeneeded=()=>{request.result.createObjectStore("entries",{keyPath:"id"});request.result.createObjectStore("images");};
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>{cached=undefined;reject(request.error);};
 });
 return cached;
}
async function read<T>(store:string,action:(s:IDBObjectStore)=>IDBRequest<T>):Promise<T>{
 const base=await db();
 return new Promise((done,fail)=>{const rq=action(base.transaction(store).objectStore(store));rq.onsuccess=()=>done(rq.result);rq.onerror=()=>fail(rq.error);});
}
export function localEntries():Promise<Entry[]>{return read("entries",s=>s.getAll());}
export function localImage(id:string):Promise<Blob|undefined>{return read("images",s=>s.get(id));}
export async function localSave(input:Entry,file:File|undefined,remove:boolean):Promise<Entry>{
 const parsed=entrySchema.safeParse(input);
 if(!parsed.success)throw new Error("Check the required fields and try again.");
 if(file&&(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>8388608))throw new Error("Choose a JPG, PNG or WebP image under 8 MB.");
 const base=await db();
 return new Promise((resolve,reject)=>{
  const tx=base.transaction(["entries","images"],"readwrite"),entries=tx.objectStore("entries"),images=tx.objectStore("images");
  const get=entries.get(input.id);let result:Entry,problem:string|undefined;
  get.onsuccess=()=>{
   const old=get.result as Entry|undefined;
   if((old?.rev||0)!==input.rev){problem="This entry changed in another tab. Close it and open the latest version.";tx.abort();return;}
   if(input.kind==="sketch"&&!remove&&!file&&!old?.media){problem="Add a picture or make a sketch first.";tx.abort();return;}
   result={...parsed.data as Entry,rev:input.rev+1,deleted:remove,media:!remove&&(!!file||!!old?.media)};
   entries.put(result);if(remove)images.delete(input.id);else if(file)images.put(file,input.id);
  };
  tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(new Error(problem||"The browser could not save this entry. Check its available storage."));tx.onerror=()=>{};
 });
}

export async function restoreLocal(entries:Entry[],images:Map<string,Blob>):Promise<void>{
 const base=await db();
 return new Promise((resolve,reject)=>{
  const tx=base.transaction(["entries","images"],"readwrite"),records=tx.objectStore("entries"),pictures=tx.objectStore("images");
  records.clear();pictures.clear();for(const e of entries)records.put(e);for(const [id,blob] of images)pictures.put(blob,id);
  tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error);tx.onerror=()=>{};
 });
}
