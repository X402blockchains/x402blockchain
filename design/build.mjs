import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('.',import.meta.url)));
await build({absWorkingDir:fileURLToPath(new URL('.',import.meta.url)),entryPoints:['src/live.jsx'],bundle:true,minify:true,sourcemap:true,outfile:'../public/design/app.js',define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
console.log('React design built locally.');
