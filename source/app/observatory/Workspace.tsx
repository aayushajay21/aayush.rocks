"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {ArrowRight,ArrowUpRight,BookOpen,BookOpenCheck,CalendarDays,Check,CheckCircle2,ChevronRight,Compass,Download,ExternalLink,HardDrive,Images,LayoutDashboard,MapPin,Menu,MessageCircle,NotebookPen,Orbit,PanelLeft,Radio,RefreshCw,Sparkles,Telescope,Trash2,X} from "lucide-react";
import {Entry,Kind,mergeEntries,monday,newEntry,Section,sections,timeNow,todayISO,displayDate} from "../../lib/orbit/model";
import {localEntries,localSave} from "../../lib/orbit/local";
import {nextSlot,seedEntries} from "../../lib/orbit/starter";
import {OrbitContext,ModalState} from "./context";
import {Brand,Modal} from "./ui";
import Dashboard from "./Dashboard";
import {ConceptPage,DiscoveryPage,ObservationPage,PlanPage,QuestionPage,SketchPage} from "./Collections";
import EntryEditor from "./EntryEditor";
import Detail from "./Detail";
import Backup from "./Backup";
const icons={dashboard:LayoutDashboard,plan:CalendarDays,observations:Telescope,sketchbook:Images,questions:MessageCircle,concepts:BookOpen,discoveries:Orbit};
const pages={dashboard:Dashboard,plan:PlanPage,observations:ObservationPage,sketchbook:SketchPage,questions:QuestionPage,concepts:ConceptPage,discoveries:DiscoveryPage};
function fragment():Section{const s=window.location.hash.slice(1);return Object.hasOwn(sections,s)?s as Section:"dashboard";}
export default function Workspace({initialDate,local=false}:{initialDate:string;local?:boolean}){
 const [today,setToday]=useState(initialDate),currentWeek=monday(today);
 const [week,setWeek]=useState(currentWeek),[section,setSection]=useState<Section>("dashboard"),[filter,setFilter]=useState("All");
 const [saved,setSaved]=useState<Entry[]>([]),[modal,setModal]=useState<ModalState|null>(null),[backup,setBackup]=useState(false);
 const [busy,setBusy]=useState(false),saving=useRef(false),readSerial=useRef(0),[error,setError]=useState(""),[loadErr,setLoadErr]=useState(""),[ready,setReady]=useState(false);
 const [toast,setToast]=useState(""),timeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [mobile,setMobile]=useState(false),[compact,setCompact]=useState(false);const entries=mergeEntries(seedEntries,saved);
 const notify=(s:string)=>{if(timeout.current)clearTimeout(timeout.current);setToast(s);timeout.current=setTimeout(()=>setToast(""),3000);};
 const load=useCallback(async()=>{
  const n=++readSerial.current;try{
   let rows:Entry[];
   if(local) rows=await localEntries();else{const r=await fetch("/api/journal",{cache:"no-store"});if(!r.ok)throw new Error(r.status===401?"Sign in to load your private journal.":"Your journal could not be loaded.");rows=((await r.json()) as {entries:Entry[]}).entries;}
   if(n===readSerial.current){setSaved(rows);setReady(true);setLoadErr("");}
  }catch(e){if(n===readSerial.current)setLoadErr(e instanceof Error?e.message:"Your journal could not be loaded.");}
 },[local]);
 useEffect(()=>{void load();const sync=()=>{setSection(fragment());setFilter("All");setMobile(false);setModal(null);window.scrollTo(0,0);};sync();window.addEventListener("popstate",sync);window.addEventListener("hashchange",sync);window.addEventListener("focus",load);return()=>{window.removeEventListener("popstate",sync);window.removeEventListener("hashchange",sync);window.removeEventListener("focus",load);if(timeout.current)clearTimeout(timeout.current);};},[load]);
 useEffect(()=>{const tick=()=>{const date=todayISO();setToday(date);if(week===currentWeek)setWeek(monday(date));};const timer=setInterval(tick,60000);return()=>clearInterval(timer);},[currentWeek,week]);
 useEffect(()=>{if(!mobile)return;const handler=(e:KeyboardEvent)=>{if(e.key==="Escape")setMobile(false);};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[mobile]);
 function go(s:Section,f="All",w=currentWeek){setSection(s);setFilter(f);setWeek(w);setMobile(false);setModal(null);setError("");if(location.hash!=="#"+s)history.pushState(null,"","#"+s);window.scrollTo(0,0);}
 function close(){if(saving.current)return;setModal(null);setError("");}
 function show(entry:Entry){setError("");setModal({mode:"detail",entry});}
 function edit(entry:Entry){setError("");setModal({mode:"edit",entry});}
 const draftDiscovery=(w:string)=>({...newEntry("discovery",w,today),discussed:false,summary:"",matters:"",prompt:"",source:"",url:"",category:"",note:""});
 function create(kind:Kind,target?:string){
  setError("");const w=section==="discoveries"||section==="plan"?week:currentWeek;
  let e=newEntry(kind,w,today);
  if(kind==="observation")e={...e,target:target||"Jupiter",time:timeNow(),method:"Sky sighting",sky:"Clear",tool:"Eyes only",note:""};
  if(kind==="question")e.answer="";
  if(kind==="concept")e={...e,learned:false,summary:"",example:"",note:""};
  if(kind==="discovery"){const slot=nextSlot(saved,entries,w);if(!slot){setModal({mode:"choose",entry:{...e,week:w}});return;}e={...draftDiscovery(w),...slot};}
  setModal({mode:"create",entry:e});
 }
 function replace(e:Entry){setError("");setModal({mode:"replace",entry:{...draftDiscovery(e.week),id:e.id,rev:e.rev}});}
 async function save(e:Entry,message:string,file?:File,remove=false){
  if(saving.current)return false;if(!ready){setError("Your journal is still connecting. Please try again.");void load();return false;}
  saving.current=true;setBusy(true);setError("");
  try{
   let entry:Entry;
   if(local)entry=await localSave(e,file,remove);
   else{const form=new FormData();form.set("entry",JSON.stringify(e));if(file)form.set("file",file);if(remove)form.set("remove","1");const r=await fetch("/api/journal",{method:"POST",body:form,headers:{"x-orbit-journal":"1"}});const res=await r.json().catch(()=>({})) as {entry?:Entry;error?:string};if(!r.ok||!res.entry)throw new Error(res.error||"The journal could not save. Please try again.");entry=res.entry;}
   ++readSerial.current;setSaved(a=>[...a.filter(other=>other.id!==entry.id),entry]);notify(message);return true;
  }catch(e){setError(e instanceof Error?e.message:"Your entry could not be saved. Try again.");void load();return false;}finally{setBusy(false);saving.current=false;}
 }
 const ctx={section,go,week,setWeek,today,currentWeek,entries,filter,setFilter,create,show,edit,askDelete:(entry:Entry)=>{setError("");setModal({mode:"delete",entry});},save,close,replace,busy,error,local};
 const nav=(list:Section[])=>list.map(s=>{const Icon=icons[s];return <a key={s} href={"#"+s} aria-current={section===s?"page":undefined} title={sections[s]} className={"nav-link "+(section===s?"active":"")} onClick={ev=>{ev.preventDefault();go(s);}}><Icon size={18} strokeWidth={1.75}/><span>{sections[s]}</span>{section===s&&<i/>}</a>;});
 const Content=pages[section],me=modal?.entry;
 return <OrbitContext.Provider value={ctx}><div className={"shell "+(mobile?"mobile-open ":"")+(compact?"side-compact":"")}>
 <a className="skip" href="#main-content">Skip to workspace</a>{mobile&&<button className="nav-scrim" aria-label="Close navigation" onClick={()=>setMobile(false)}/>}
 <aside className="sidebar" aria-label="Workspace navigation"><a href="#dashboard" className="brand" onClick={e=>{e.preventDefault();go("dashboard");}}><Brand/><span>Orbit Journal</span></a><div className="nav-groups"><div className="nav-label">WORKSPACE</div><nav aria-label="Field workspace">{nav(["dashboard","plan","observations","sketchbook"])}</nav><div className="nav-label second">LEARNING LAB</div><nav aria-label="Learning lab">{nav(["questions","concepts","discoveries"])}</nav></div><div className="side-bottom">{local&&<button className="sky-external utility" onClick={()=>{setMobile(false);setBackup(true);}} title="Journal backup"><HardDrive size={16}/><span>Journal backup</span></button>}<a className="sky-external" title="Open sky map" href="https://stellarium-web.org/" target="_blank" rel="noreferrer"><Compass size={17}/><span>Sky map</span><ArrowUpRight size={14}/></a><div className="profile"><span className="avatar">A</span><span className="profile-text"><strong>Aayush</strong><small>{local?"Saved on this device":"Personal observatory"}</small></span></div></div></aside>
 <div className="workspace"><header className="topbar"><div className="breadcrumb"><button className="icon-button toggle-nav" aria-label="Toggle navigation" onClick={()=>{if(window.matchMedia("(max-width: 800px)").matches)setMobile(!mobile);else setCompact(!compact);}}><PanelLeft size={17}/></button><span className="crumb-separator"/><button className="workspace-crumb" onClick={()=>go("dashboard")}>Workspace</button><ChevronRight className="crumb-chevron" size={13}/><span className="current-crumb">{sections[section]}</span></div><div className="top-right"><span className="locality"><MapPin size={14}/>Princeton, NJ</span><span className="top-div"/><span><CalendarDays size={14}/>{displayDate(today,{month:"short",day:"numeric",year:"numeric"})}</span></div></header>
 <main id="main-content" className="main" tabIndex={-1}>{loadErr&&<div className="notice error" role="alert">{loadErr}<button onClick={()=>void load()}><RefreshCw size={14}/>Retry</button></div>}{error&&!modal&&<div className="notice error" role="alert">{error}<button onClick={()=>setError("")}>Dismiss</button></div>}<Content/></main></div>
 {toast&&<div className="toast" role="status"><CheckCircle2 size={17}/>{toast}<button aria-label="Dismiss notification" onClick={()=>setToast("")}><X size={13}/></button></div>}
 {me&&modal&&(modal.mode==="edit"||modal.mode==="create"||modal.mode==="replace")&&<EntryEditor key={modal.mode+me.id} entry={me} mode={modal.mode}/>}
 {me&&modal?.mode==="detail"&&<Detail key={me.id} entry={entries.find(e=>e.id===me.id)||me}/>}
 {me&&modal?.mode==="choose"&&<Modal title="Choose a discovery to replace" close={close}><div className="modal-body form-stack"><p className="body-note">All three spots for this week are filled. Choose a discovery to replace, or use the week arrows to start another collection.</p>{entries.filter(e=>e.kind==="discovery"&&e.week===me.week).map(e=><button className="pick-replace" key={e.id} onClick={()=>replace(e)}><span><small>{e.source}</small><strong>{e.title}</strong></span><ArrowRight size={16}/></button>)}</div></Modal>}
 {me&&modal?.mode==="delete"&&<Modal title="Delete this entry?" close={close}><div className="modal-body"><p className="body-note">Remove “{me.title}”{me.media?" and its attached picture":""} from this journal?</p>{error&&<p className="form-error" role="alert">{error}</p>}</div><div className="modal-footer"><button className="button secondary" onClick={()=>show(me)}>Keep entry</button><button className="button danger-button" disabled={busy} onClick={async()=>{if(await save(me,"Entry deleted.",undefined,true))close();}}><Trash2 size={15}/>Delete entry</button></div></Modal>}
 {backup&&<Backup close={()=>setBackup(false)} done={()=>{setBackup(false);void load();notify("Backup restored.");}}/>}
 </div></OrbitContext.Provider>;
}

