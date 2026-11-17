import React from "react";
import {createRoot} from "react-dom/client";
import Workspace from "../app/observatory/Workspace";
import {todayISO} from "../lib/orbit/model";
const root=document.getElementById("journal");
if(root)createRoot(root).render(<Workspace initialDate={todayISO()} local/>);

