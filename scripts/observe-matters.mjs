#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const core=require('./lib/freshness-contract.js');
const {mattersFrom}=require('./lib/matter-monitor/config.js');
const {streams,parseIndex}=require('./lib/matter-monitor/discovery.js');
const {collect,corpusIndex,render}=require('./lib/matter-monitor/collector.js');
const ROOT=fileURLToPath(new URL('../',import.meta.url));
export function parseArgs(args){
 const o={live:false,reports:null,state:path.join(ROOT,'data/maintenance/matter-monitor-state.json')};
 for(let i=0;i<args.length;i++){if(args[i]==='--live')o.live=true;else if(['--reports','--state'].includes(args[i])){const k=args[i].slice(2),v=args[++i];if(!v||v.startsWith('--'))throw Error(`Missing ${k} path`);o[k]=path.resolve(v);}else throw Error(`Unknown argument ${args[i]}`);}
 if(!o.live)throw Error('Pass --live for the bounded public-source pilot; no paid calls or corpus edits');
 o.reports ||=path.join(ROOT,'.verification-reports',`matter-monitor-${new Date().toISOString().replace(/[:.]/g,'-')}`);
 if(o.state===o.reports||o.state.startsWith(o.reports+path.sep))throw Error('Keep durable state outside the report directory');return o;
}
export async function run(o){
 if(o.live!==true)throw Error('Live authorization required');await fs.mkdir(o.reports,{recursive:true});if((await fs.readdir(o.reports)).length)throw Error('Use an empty evidence directory');let latest;
 async function atomic(name,value){const p=path.join(o.reports,name);await fs.writeFile(p+'.tmp',value);await fs.rename(p+'.tmp',p);}
 try{
 const data=JSON.parse(await fs.readFile(path.join(ROOT,'data/data.json'),'utf8'));const state=await core.loadState(o.state);state.reviewPolicy.owner ||='Sam Rogers';
 const result=await collect({matters:mattersFrom(data),streams,index:corpusIndex(data),state,parseIndex,
  retainRaw:async(s,r)=>{if(r.rawBody)await atomic(s.id+(r.format==='pdf'?'.pdf':'.html'),r.rawBody);if(r.format==='pdf'&&r.body)await atomic(s.id+'.txt',r.body);const{body,rawBody,...receipt}=r;await atomic(s.id+'-receipt.json',JSON.stringify(receipt,null,2)+'\n');},
  persist:async(current,report)=>{latest=report;await atomic('report.json',JSON.stringify(report,null,2)+'\n');await atomic('review-state.json',JSON.stringify(current,null,2)+'\n');await atomic('review-proposals.md',render(report));await core.saveState(o.state,current);}
 });
 console.log(JSON.stringify({status:result.report.status,requests:result.report.requests,sources:result.report.sources,discoveryLeads:result.report.items.length,reviewQueue:result.report.reviewQueue,report:path.join(o.reports,'report.json')},null,2));return result.report.status==='healthy'?0:result.report.status==='review_required'?1:2;
 }catch(error){if(latest){latest.status='failed';latest.failure=error.message;await atomic('report.json',JSON.stringify(latest,null,2)+'\n');await atomic('review-proposals.md',render(latest));}await atomic('failure.json',JSON.stringify({status:'failed',message:error.message,failedAt:new Date().toISOString()},null,2)+'\n');throw error;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))Promise.resolve().then(()=>run(parseArgs(process.argv.slice(2)))).then(code=>{process.exitCode=code;}).catch(error=>{console.error(error.message);process.exitCode=2;});
