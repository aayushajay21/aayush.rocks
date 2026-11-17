import { Entry, monday, Step } from "./model";
export const firstWeek = "2026-11-16";
const base={rev:0,week:firstWeek,date:firstWeek};
export const seedEntries:Entry[]=[
  {...base,kind:"question",id:"starter-twinkle",title:"Why does a star twinkle more than Jupiter?",answer:"",category:"Starter question"},
  ...[
    ["twinkling","Why stars twinkle","Moving air bends a star’s light a little differently from one moment to the next. The star can seem to flicker, even when its own light stays steady.","Watch a bright star for 30 seconds. Does its brightness seem to change?","Starlight"],
    ["planet-light","Starlight and planet light","Stars make their own light. Jupiter looks bright because sunlight bounces off its clouds and reaches your eyes.","Imagine a lamp shining on a ball. Which object is making light, and which is reflecting it?","Solar system"],
    ["sky-direction","Finding a direction","The horizon is where the ground appears to meet the sky. A compass direction and a nearby landmark can help you find a target again.","Write “above the tree to the west” beside a star in your sketch.","Sky skills"],
    ["earth-rotation","Earth’s turning sky","Earth spins toward the east. As you turn with it, stars appear to move across the sky toward the west.","Compare a star’s position above a roof at two different times on one night.","Earth & sky"],
    ["orbits","Following an orbit","Gravity keeps a moon moving around a planet and a planet moving around a star. The curved path is called an orbit.","Jupiter orbits the Sun. Jupiter’s moon Io orbits Jupiter.","Solar system"],
    ["light-year","A light-year","A light-year is the distance light travels in a year. Looking at a distant star means seeing light that left it long ago.","Vega is about 25 light-years away. Its light traveled for about 25 years before you saw it.","Deep space"],
  ].map(([id,title,summary,example,category])=>({...base,kind:"concept" as const,id:"concept-"+id,title,summary,example,category,learned:false,note:""})),
  {...base,kind:"discovery",id:"pick-2026-11-16-1",date:"2026-11-12",title:"Two giants around a small star",category:"Exoplanets",source:"NASA Exoplanet Archive",url:"https://exoplanetarchive.ipac.caltech.edu/overview/KMT-2026-BLG-0083L",summary:"Light from a distant star briefly brightened in a special pattern. It revealed two giant planets circling a smaller star in front of it.",matters:"A change in starlight can give away cold planets that are too faint for a telescope to see directly.",prompt:"If a planet is too faint to see, what could you measure to tell that it is there?",discussed:false},
  {...base,kind:"discovery",id:"pick-2026-11-16-2",date:"2026-11-09",title:"A star that flashes every 113 days",category:"Stellar science",source:"Chandra X-ray Center",url:"https://chandra.harvard.edu/press/26_releases/press_110926.html",summary:"A hidden companion swings close to a giant star about every 113 days. Scientists think gas passing between them helps explain the repeating flashes.",matters:"X-rays let scientists investigate the companion. It could be a black hole or a neutron star, the tiny, dense core left by a massive star.",prompt:"If you had one night to point a telescope at this star, how would you choose the date?",discussed:false},
  {...base,kind:"discovery",id:"pick-2026-11-16-3",date:"2026-11-12",title:"Galaxies that bend light",category:"Deep space",source:"ESA · Euclid",url:"https://euclid.caltech.edu/news/euclid-lays-the-foundation-for-its-best-ever-3d-map-of-the-universe",summary:"Euclid found about 15,000 places where a galaxy’s gravity may bend light from a galaxy behind it. The bent light can appear as arcs or rings.",matters:"The shapes help scientists weigh a galaxy, including matter they cannot see shining.",prompt:"What shapes would you look for in a photo if you were hunting for bent light?",discussed:false}
];
export const sourceArt: Record<string,{file:string;alt:string;credit:string}> = {
  "pick-2026-11-16-1":{file:"gas-giant",alt:"Artist’s illustration of a planet crossing a star",credit:"Illustration of a different planetary system. ESA, NASA, STScI and M. Kornmesser."},
  "pick-2026-11-16-2":{file:"star-flashes",alt:"X-ray and visible-light view of galaxy NGC 4559",credit:"X-ray: NASA/CXC/University of Virginia/M. Aghakhanloo et al. Optical: SDSS. Processing: NASA/CXC/SAO/P. Edmonds."},
  "pick-2026-11-16-3":{file:"lensing",alt:"Several galaxy lenses imaged by Euclid",credit:"ESA/Euclid/Euclid Consortium/NASA. Image processing by N. Lines and T. Li."}
};
export function artFor(e:Entry) {
  const seed=seedEntries.find(s=>s.id===e.id && s.kind==="discovery");
  return seed && seed.url===e.url ? sourceArt[e.id] : undefined;
}
const missions=[
  {title:"Jupiter & the stars",intro:"Look for Jupiter’s steady glow and a bright star’s twinkle.",steps:[
    ["Spot Jupiter or a bright star","Watch its light for one full minute."],["Sketch your patch of sky","Add a nearby tree or roof as a landmark."],["Explore why stars twinkle","Write down one idea or question."]]},
  {title:"Find your sky landmark",intro:"Use a familiar roof or tree to map one bright object in the sky.",steps:[
    ["Find a star above a landmark","Pick one clear patch of sky."],["Make a tiny sky map","Draw the landmark, the star and the horizon."],["Describe how to find it again","Give someone two clues from your map."]]},
  {title:"Look for a change",intro:"Return to a familiar spot and compare it with an earlier field note.",steps:[
    ["Repeat a view from your journal","Use the same spot and check the time."],["Compare two sky sketches","Circle one change or one thing that stayed alike."],["Explain one difference","Could the time, clouds or viewpoint matter?"]]},
  {title:"A closer look at starlight",intro:"Compare two points of light and describe a difference you can see.",steps:[
    ["Choose two bright targets","Use a sky map to identify at least one."],["Describe their color and brightness","Use words first, then make a sketch."],["Make a prediction","Which detail would you expect to see next time?"]]}
];
export function defaultPlan(week:string):Entry {
  const index=Math.round((Date.parse(week)-Date.parse(firstWeek))/604800000);
  const tpl=missions[((index%missions.length)+missions.length)%missions.length];
  return {id:"plan-"+week,kind:"plan",rev:0,title:tpl.title,date:week,week,note:tpl.intro,cloudy:"Open a sky map for Princeton, NJ. Sketch one target and label your entry as sky map practice.",steps:tpl.steps.map(([title,hint])=>({title,hint,minutes:5,done:false}))};
}
export function planFor(entries:Entry[],week:string) {return entries.find(e=>e.kind==="plan" && e.week===week)||defaultPlan(week);}
export function nextSlot(saved:Entry[],all:Entry[],week:string) {
  for(let slot=1;slot<=3;slot++){
    const id="pick-"+week+"-"+slot;
    if(!all.some(e=>e.id===id))return {id,rev:saved.find(e=>e.id===id)?.rev||0};
  }
  return null;
}
export function totalMinutes(steps:Step[]|undefined) {return (steps||[]).reduce((n,s)=>n+s.minutes,0);}
export function thisWeek(date:string) {return monday(date);}

