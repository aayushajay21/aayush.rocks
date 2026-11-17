import {build} from "esbuild";
import {readFile,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
const root=path.dirname(fileURLToPath(import.meta.url));
const dest=path.resolve(root,"..");
await build({entryPoints:[path.join(root,"pages-export/entry.tsx")],bundle:true,outfile:path.join(dest,"app.js"),format:"esm",target:"es2020",jsx:"automatic",minify:true,legalComments:"eof",define:{"process.env.NODE_ENV":'"production"'}});
const css=await readFile(path.join(root,"app/globals.css"),"utf8");
await writeFile(path.join(dest,"styles.css"),css.replaceAll("url('/","url('./"));

