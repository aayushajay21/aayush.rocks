"use client";
import {createContext,useContext} from "react";
import type {Entry,Kind,Section} from "../../lib/orbit/model";
export type ModalState={mode:"create"|"edit"|"detail"|"replace"|"choose"|"delete";entry?:Entry};
type OrbitState={
 section:Section;go:(s:Section,filter?:string,week?:string)=>void;
 week:string;setWeek:(s:string)=>void;today:string;currentWeek:string;
 entries:Entry[];filter:string;setFilter:(s:string)=>void;
 create:(k:Kind,target?:string)=>void;show:(e:Entry)=>void;edit:(e:Entry)=>void;askDelete:(e:Entry)=>void;
 save:(e:Entry,message:string,file?:File,remove?:boolean)=>Promise<boolean>;close:()=>void;
 replace:(e:Entry)=>void;busy:boolean;error:string;local:boolean;
};
export const OrbitContext=createContext<OrbitState|null>(null);
export function useOrbit(){const ctx=useContext(OrbitContext);if(!ctx)throw new Error("Missing workspace");return ctx;}

