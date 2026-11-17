import {z} from "zod";
import {monday,todayISO} from "./model";
const iso=z.string().regex(/^\d{4}-\d\d-\d\d$/).refine(d=>{const dt=new Date(d+"T12:00:00Z");return Number.isFinite(+dt)&&dt.toISOString().slice(0,10)===d;},"Choose a valid date.");
const small=z.string().trim().max(180), required=small.min(1), notes=z.string().trim().max(4000), must=notes.min(1);
const base={id:z.string().regex(/^[a-zA-Z0-9-]{1,90}$/),rev:z.number().int().nonnegative(),week:iso,date:iso,title:required};
const kind=(s:string)=>z.literal(s);
const obs=z.object({...base,kind:kind("observation"),target:required,time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),sky:z.enum(["Clear","Partly cloudy","Hazy","Cloudy"]),method:z.enum(["Sky sighting","Clouded out","Sky map practice"]),tool:z.enum(["Eyes only","Binoculars","Telescope","Sky map"]),note:must});
const sketch=z.object({...base,kind:kind("sketch"),note:notes.optional(),relatedId:small.optional()});
const question=z.object({...base,kind:kind("question"),answer:notes.optional(),category:small.optional()});
const concept=z.object({...base,kind:kind("concept"),summary:must,example:notes.optional(),category:small.optional(),learned:z.boolean(),note:notes.optional()});
const discovery=z.object({...base,kind:kind("discovery"),summary:must,matters:must,source:required,url:z.string().url().max(1500).refine(s=>/^https?:\/\//i.test(s),"Use an https or http source link."),prompt:must,category:small.optional(),discussed:z.boolean(),note:notes.optional()});
const plan=z.object({...base,kind:kind("plan"),note:must,cloudy:must,steps:z.array(z.object({title:required,hint:notes,done:z.boolean(),minutes:z.number().int().min(1).max(30)})).min(1).max(6)});
export const entrySchema=z.union([obs,sketch,question,concept,discovery,plan]).superRefine((e,ctx)=>{
  const fail=(message:string)=>ctx.addIssue({code:"custom",message});
  if(monday(e.week)!==e.week)fail("The week must begin on a Monday.");
  if(e.kind==="discovery" && ![1,2,3].some(n=>e.id==="pick-"+e.week+"-"+n))fail("Choose one of this week’s three discovery slots.");
  if(e.kind==="plan" && e.id!=="plan-"+e.week)fail("This plan belongs to a different week.");
  if(e.kind==="observation" && (e.date>todayISO() || monday(e.date)!==e.week))fail("Choose today or an earlier observation date.");
});

