export type Kind = "observation" | "sketch" | "question" | "concept" | "discovery" | "plan";
export type Section = "dashboard" | "plan" | "observations" | "sketchbook" | "questions" | "concepts" | "discoveries";
export type Step = { title: string; hint: string; minutes: number; done: boolean };
export type Entry = {
  id: string; kind: Kind; rev: number; title: string; date: string; week: string;
  deleted?: boolean; media?: boolean; target?: string; time?: string; sky?: string;
  tool?: string; method?: string; note?: string; relatedId?: string; answer?: string;
  learned?: boolean; example?: string; summary?: string; matters?: string;
  source?: string; url?: string; prompt?: string; discussed?: boolean;
  category?: string; steps?: Step[]; cloudy?: string;
};
export const sections: Record<Section, string> = {
  dashboard: "Dashboard", plan: "Weekly plan", observations: "Observation log", sketchbook: "Sketchbook",
  questions: "Question log", concepts: "Concept tracker", discoveries: "Discoveries",
};
const dayMs = 86400000;
export const homeZone = "America/New_York";
export function todayISO(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {timeZone:homeZone,year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
}
export function timeNow(): string {
  return new Intl.DateTimeFormat("en-GB", {timeZone:homeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date());
}
export function shiftDate(iso: string, n: number) { return new Date(Date.parse(iso+"T12:00:00Z")+n*dayMs).toISOString().slice(0,10); }
export function monday(iso: string) {
  const weekday=new Date(iso+"T12:00:00Z").getUTCDay();
  return shiftDate(iso,-((weekday+6)%7));
}
export function displayDate(iso: string, options: Intl.DateTimeFormatOptions = {month:"short",day:"numeric"}): string {
  return new Intl.DateTimeFormat("en-US",{...options,timeZone:"UTC"}).format(new Date(iso+"T12:00:00Z"));
}
export function weekRange(week: string): string {
  const end=shiftDate(week,6);
  return displayDate(week)+" – "+displayDate(end,week.slice(0,7)===end.slice(0,7)?{day:"numeric"}:{month:"short",day:"numeric"});
}
export function displayTime(value?: string) {
  if(!value) return "";
  const [hour,minutes]=value.split(":").map(Number);
  return (hour%12||12)+":"+String(minutes).padStart(2,"0")+" "+(hour<12?"AM":"PM");
}
export function streak(entries: Entry[], today: string) {
  const weeks=new Set(entries.filter(e=>e.kind==="observation" && e.method==="Sky sighting" && !e.deleted).map(e=>monday(e.date)));
  let w=monday(today), count=0;
  if(!weeks.has(w)) w=shiftDate(w,-7);
  while(weeks.has(w)){ count++; w=shiftDate(w,-7); }
  return count;
}
export function newEntry(kind:Kind,week:string,date:string):Entry {
  return {id:crypto.randomUUID(),kind,rev:0,title:"",date,week};
}
export function displayMedia(e:Entry) { return "/api/media/"+encodeURIComponent(e.id)+"?v="+e.rev; }
export function mergeEntries(initial:Entry[],saved:Entry[]) {
  const items=new Map(initial.map(e=>[e.id,e]));
  for(const e of saved)items.set(e.id,e);
  return [...items.values()].filter(e=>!e.deleted);
}

