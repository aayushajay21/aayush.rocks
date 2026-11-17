"use client";
import {ArrowRight,BookOpen,CalendarDays,CalendarRange,Compass,Flame,MessagesSquare,Plus,Radio,Satellite,Sparkles,Telescope} from "lucide-react";
import {useOrbit} from "./context";
import {displayDate,Section,streak,weekRange} from "../../lib/orbit/model";
import {planFor} from "../../lib/orbit/starter";
import {DiscoveryCard,Duration,Empty,IconTile,PanelHeading,PlanSteps,SkyTargets,TextLink} from "./ui";
export default function Dashboard(){
 const {entries,go,create,currentWeek,today,show}=useOrbit();
 const plan=planFor(entries,currentWeek),discoveries=entries.filter(e=>e.kind==="discovery"&&e.week===currentWeek);
 const stats=[
  {label:"Observation streak",value:streak(entries,today),unit:"week",icon:Flame,color:"amber",page:"observations",filter:"All"},
  {label:"Concepts covered",value:entries.filter(e=>e.kind==="concept"&&e.learned).length,icon:BookOpen,color:"cyan",page:"concepts",filter:"Learned"},
  {label:"Unanswered questions",value:entries.filter(e=>e.kind==="question"&&!e.answer?.trim()).length,icon:MessagesSquare,color:"purple",page:"questions",filter:"Unanswered"},
  {label:"Discoveries to discuss",value:discoveries.filter(e=>!e.discussed).length,icon:Sparkles,color:"blue",page:"discoveries",filter:"To discuss"}
 ];
 const recent=entries.filter(e=>e.kind==="observation").sort((a,b)=>(b.date+(b.time||"")).localeCompare(a.date+(a.time||""))).slice(0,3);
 return <div className="dashboard"><section className="hero"><div className="hero-art" aria-hidden="true"/><div className="hero-content"><div className="mission-label"><span className="little-star">✦</span> WEEKLY SKY JOURNAL</div><h1>Aayush’s Observatory</h1><p>{plan.note}</p><div className="hero-actions"><button className="button primary" onClick={()=>create("observation")}><Plus size={17}/>Log observation</button><button className="button hero-secondary" onClick={()=>go("plan")}>View weekly plan<ArrowRight size={15}/></button></div></div></section>
 <section className="stats" aria-label="Journal dashboard counts">{stats.map(s=><button key={s.label} onClick={()=>go(s.page as Section,s.filter)} className={"stat-card tone-"+s.color}><IconTile icon={s.icon} color={s.color}/><div><span className="stat-value">{s.value}{s.unit&&<small>{s.unit}{s.value===1?"":"s"}</small>}</span><span className="stat-label">{s.label}</span></div></button>)}</section>
 <div className="dashboard-middle"><article className="panel plan-panel"><PanelHeading icon={CalendarRange} title="This week’s plan" subtitle={weekRange(currentWeek)+" · "+plan.title} action={<Duration plan={plan}/>}/><PlanSteps plan={plan} compact/></article><SkyTargets/></div>
 <section className="discover-section"><PanelHeading icon={Radio} title="Discovery desk" subtitle="This week’s space science to explore together." color="purple" action={<TextLink onClick={()=>go("discoveries")}>View all</TextLink>}/>{discoveries.length?<div className="discovery-grid">{discoveries.map(e=><DiscoveryCard key={e.id} entry={e}/>)}</div>:<div className="panel"><Empty title="Room for this week’s discoveries" icon={Satellite} action={<TextLink onClick={()=>create("discovery")}>Add a discovery</TextLink>}>Choose up to three discoveries to talk about together.</Empty></div>}</section>
 {recent.length>0&&<section className="panel recent"><PanelHeading icon={Telescope} title="Recent observations" action={<TextLink onClick={()=>go("observations")}>Open log</TextLink>}/>{recent.map(e=><button className="simple-row" key={e.id} onClick={()=>show(e)}><strong>{e.title}</strong><span>{displayDate(e.date)}</span><ArrowRight size={14}/></button>)}</section>}
 </div>;
}

