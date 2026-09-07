'use strict';
const crypto=require('node:crypto');
const core=require('../freshness-contract');
const {visibleText}=require('./text');
const {fetchPublication}=require('./fetch');
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalize=value=>String(value).normalize('NFKC').replace(/\s+/g,' ').trim();
function key(value){try{const u=new URL(value);u.hostname=u.hostname.replace(/^www\./,'');u.hash='';return u.href.replace(/\/$/,'');}catch{return null;}}
function latestQualifiedSnapshot(state,sourceId,checkpointSourceId){
 const checkpoints=Object.values(state.runs).flatMap(run=>Object.values(run.results)).filter(result=>result&&result.kind==='matter-monitor-source'&&result.sourceId===checkpointSourceId&&result.qualified===true&&typeof result.normalizedContentHash==='string'&&typeof result.observedAt==='string').sort((a,b)=>b.observedAt.localeCompare(a.observedAt));
 if(checkpoints.length){const latestAt=checkpoints[0].observedAt,latest=checkpoints.filter(result=>result.observedAt===latestAt);return new Set(latest.map(result=>result.normalizedContentHash)).size===1?latest[0]:null;}
 const latestAt=state.sources[sourceId]?.lastSuccessfulObservationAt;
 const observations=Object.values(state.observations).filter(o=>o.sourceId===sourceId&&o.coverageQualified&&o.assessmentKind==='primary_retrieval'&&o.retrievalStatus==='succeeded'&&o.retrievedAt===latestAt);
 if(!observations.length||new Set(observations.map(o=>o.normalizedContentHash)).size!==1)return null;
 return observations[0];
}
function corpusIndex(data){return Object.entries(data.datasets || {}).flatMap(([bucket,v])=>(v.records || []).map(r=>({id:r.error_id || r.candidate_id,bucket,title:r.public_matter_name || r.candidate_matter || r.error_title || r.candidate_title,urls:[r.public_record_link,r.case_sameAs,...String(r.secondary_source_links || '').split(';'),...String(r.best_available_sources || '').split(';')].filter(Boolean).map(s=>key(s.trim())).filter(Boolean)})));}
function classify(item,index){
 const matched=index.filter(r=>r.urls.includes(key(item.url)));
 if(matched.length)return{type:'existing_matter_review',recordIds:matched.map(r=>r.id),reason:'Exact source identity already exists in the corpus; inspect as an update, without creating another matter.'};
 if(!/\bartificial intelligence\b|\bAI\b|algorithmic|facial recognition|automated decision/i.test(item.title || ''))return{type:'insufficient_ai_attribution',recordIds:[],reason:'No explicit AI signal in this publication title. No AI mechanism or defect may be inferred.'};
 return{type:'candidate_needs_primary_document',recordIds:[],reason:'Official publication title is a discovery lead. Obtain the underlying complaint/order, establish the source’s own AI discussion and defect, and apply INTENT admission rules. Allegations are not findings.'};
}
function render(report){const out=['# AI Incident Law review pilot',`Status: ${report.status}`,`Fetch attempts: ${report.requests}/${report.maxRequests}; paid calls: 0.`,`Owner: ${report.reviewOwner}`,'Source observation does not change legal status, attribution, corpus dates or admission.','','| Scope | Result | Next review |','|---|---|---|'];for(const s of report.sources)out.push(`| ${s.id} | ${s.status}: ${s.reason || s.scope || ''} | ${s.nextReviewAt} |`);out.push('','## Review candidates');for(const x of report.items)out.push(`- ${x.type}: [${x.title}](${x.url}). ${x.reason}`);return out.join('\n')+'\n';}
async function collect({matters,streams,index=[],state=core.emptyState({reviewPolicy:{owner:'Sam Rogers',capacityMinutesPerWeek:null,scope:'six-repo-portfolio'}}),now=new Date().toISOString(),fetcher=fetchPublication,parseIndex,retainRaw=async()=>{},persist=async()=>{},maxRequests=7}={}){
 if(!Array.isArray(matters)||matters.length!==5||new Set(matters.map(s=>s.id)).size!==5||!Array.isArray(streams)||streams.length!==2||new Set(streams.map(s=>s.id)).size!==2)throw Error('T09 requires five distinct active matters and two discovery streams');
 if(!Number.isSafeInteger(maxRequests)||maxRequests<1||maxRequests>7)throw Error('T09 fetch budget must be 1..7');
 if(typeof parseIndex!=='function')throw Error('A discovery parser is required');
 if(matters.some(s=>s.kind!=='matter'||!['party_publication','secondary_mirror','court_document','docket_metadata'].includes(s.role)||!Array.isArray(s.identity)||!s.identity.length)||streams.some(s=>s.kind!=='discovery'))throw Error('Invalid source kind, role or matter identity');
 const sources=[...matters,...streams];
 if(new Set(sources.map(s=>s.id)).size!==7)throw Error('Source IDs must be unique');
 for(const s of sources){const u=new URL(s.url);if(u.protocol!=='https:'||u.hostname!==s.expectedHost||u.port||u.username||u.password)throw Error('Unexpected source URL');}
 const sourceFingerprint=hash(sources.map(({id,kind,url,expectedHost,role,identity})=>({id,kind,url,expectedHost,role,identity})));
 const history=core.beginRun(state,{id:`matter-monitor-history-${crypto.randomUUID()}`,selectionKeys:sources.map(s=>s.id).sort(),inputFingerprint:sourceFingerprint},{now}).run;
 if(history.status==='completed')throw Error('Matter-monitor history checkpoint already completed for this observation time');
 const checkpoint=(source,qualified,normalizedContentHash=null)=>core.checkpointResult(state,history.id,source.id,{kind:'matter-monitor-source',sourceId:source.id,qualified,normalizedContentHash,observedAt:now},{now});
 const report={id:`matter-monitor-${crypto.randomUUID()}`,startedAt:now,status:'running',requests:0,maxRequests,paidProviderCalls:0,reviewOwner:state.reviewPolicy.owner,sources:[],items:[],configuration:sources};
 for(const source of sources){
  const sourceId=`matter-monitor:${source.id}`,due=new Date(Date.parse(now)+(source.kind==='matter'?30:7)*86400000).toISOString();
  core.registerSource(state,{id:sourceId,owner:'ai-incident-law',authoritativeUrl:source.url,sourceType:source.role==='secondary_mirror'?'official_secondary':'official_primary',subjectIds:[source.id],cadenceDays:source.kind==='matter'?30:7,criticality:'standard',parserVersion:'matter-monitor-v1',contentValidation:'required',collectionMode:source.unsupportedReason?'manual':'automated'},{now});
  const summary={id:source.id,url:source.url,kind:source.kind,status:'running',nextReviewAt:due,scope:source.qualification || 'First publication index page, title-filtered only'};report.sources.push(summary);
  let response,errorReason=source.unsupportedReason;
  if(!errorReason&&report.requests>=maxRequests)errorReason='Run request budget exhausted';
  if(!errorReason){report.requests++;await persist(state,report);try{response=await fetcher(source.url);}catch(error){errorReason=error.message;await retainRaw(source,{...(error.receipt || {retrievedUrl:source.url}),status:'failed',failureReason:errorReason});}}
  if(errorReason){
   const {observation}=core.recordObservation(state,sourceId,{retrievedAt:now,retrievalStatus:'error',assessmentKind:'primary_retrieval',coverageQualified:false,contentValidation:'invalid',failureReason:errorReason,locator:source.url,evidenceLinks:[source.url]},{now});
   Object.assign(summary,{status:source.unsupportedReason?'unsupported':'unavailable',reason:errorReason,observationId:observation.id,nextReviewAt:new Date(Date.parse(now)+7*86400000).toISOString()});
   if(source.kind==='matter'){const {finding}=core.upsertFinding(state,{subjectIds:[source.id],claim:'Repair active matter source coverage',newValue:{reason:errorReason,qualification:source.qualification},evidence:{sourceId,normalizedContentHash:hash({reason:errorReason}),locator:source.url},affectedRecords:['data/data.json'],reviewDueAt:summary.nextReviewAt},{now});summary.findingId=finding.id;}
   checkpoint(source,false);
   await persist(state,report);continue;
  }
  await retainRaw(source,response);
  const text=response.format==='pdf'?normalize(response.body):normalize(visibleText(response.body));
  const inspected={...core.inspectContent({...response,contentType:response.format==='pdf'?'text/plain':response.contentType}),...(response.rawContentHash?{rawContentHash:response.rawContentHash}:{})};
  let parsed={supported:false,reason:response.extractionError || inspected.failureReason || 'Source identity could not be established'};
  if(inspected.coverageQualified&&!response.extractionError)try{
   const terminal=new URL(response.retrievedUrl || source.url);terminal.hostname=terminal.hostname.replace(/^www\./,'');
   if(terminal.protocol!=='https:'||terminal.hostname!==source.expectedHost||terminal.port||terminal.username||terminal.password)throw Error('Unexpected terminal source URL');
   if(source.kind==='discovery')parsed=parseIndex(response.body,{source,url:terminal.href});
   else if(new URL(source.url).pathname.toLowerCase().endsWith('.pdf')&&response.format!=='pdf')parsed={supported:false,reason:'Expected original PDF bytes; HTML or text shell cannot qualify'};
   else if(source.identity.every(token=>text.toLowerCase().includes(token)))parsed={supported:true,scope:{documentOnly:true},items:[]};
  }catch(error){parsed={supported:false,reason:error.message};}
  const qualified=inspected.coverageQualified&&parsed.supported===true&&(source.kind==='matter'||Array.isArray(parsed.items)&&(parsed.items.length>0||parsed.emptyEvidence))&&parsed.scope?.complete!==false;
  const contentHash=hash(source.kind==='matter'?text:(parsed.items || []).map(i=>({url:key(i.url),title:normalize(i.title)})));
  const prior=latestQualifiedSnapshot(state,sourceId,source.id),hasPrior=Boolean(state.sources[sourceId].lastSuccessfulObservationAt);
  const {observation}=core.recordObservation(state,sourceId,{...inspected,retrievedAt:now,assessmentKind:'primary_retrieval',coverageQualified:Boolean(qualified),contentValidation:qualified?'valid':'invalid',normalizedContentHash:contentHash,locator:source.url,evidenceLinks:[source.url],...(qualified?{}:{failureReason:parsed.reason || 'Incomplete or unsupported source scope'})},{now});
  Object.assign(summary,{status:qualified?'covered':'unavailable',observationId:observation.id,rawContentHash:observation.rawContentHash,scopeEvidence:parsed.scope || null,emptyEvidence:parsed.emptyEvidence || null,...(qualified?{}:{reason:parsed.reason || 'Incomplete or unsupported source scope',nextReviewAt:new Date(Date.parse(now)+7*86400000).toISOString()})});
  if(source.kind==='matter'&&qualified){
   const unchanged=prior?.normalizedContentHash===contentHash,kind=unchanged?'unchanged_source':hasPrior?'existing_development_review':'baseline_source_review';summary.assessment=kind;
   if(!unchanged){const {finding}=core.upsertFinding(state,{subjectIds:[source.id],claim:'Review active matter source snapshot',oldValue:{filingStatus:source.baselineStatus,attribution:source.attribution},newValue:{sourceRole:source.role,sourceHash:contentHash,qualification:source.qualification,assessment:kind},evidence:{sourceId,normalizedContentHash:contentHash,locator:source.url},affectedRecords:['data/data.json'],reviewDueAt:new Date(Date.parse(now)+7*86400000).toISOString()},{now});summary.findingId=finding.id;}
  }else if(source.kind==='matter'){
   const {finding}=core.upsertFinding(state,{subjectIds:[source.id],claim:'Repair active matter source coverage',newValue:{reason:summary.reason,qualification:source.qualification},evidence:{sourceId,normalizedContentHash:hash({reason:summary.reason}),locator:source.url},affectedRecords:['data/data.json'],reviewDueAt:summary.nextReviewAt},{now});summary.findingId=finding.id;
  }else if(parsed.supported){
   for(const item of parsed.items || []){
    if(!item.title||!item.url||new URL(item.url).hostname!==source.expectedHost||new URL(item.url).protocol!=='https:'||new URL(item.url).port||new URL(item.url).username||new URL(item.url).password)throw Error('Invalid discovery identity');
    const assessment=classify(item,index),result={...item,...assessment,sourceId};report.items.push(result);
    const {finding}=core.upsertFinding(state,{subjectIds:assessment.recordIds.length?assessment.recordIds:[item.id || item.url],claim:'Review official discovery lead',newValue:{title:item.title,url:item.url,...assessment,admission:'human_review_required',aiAttribution:'not_established_by_index'},evidence:{sourceId,normalizedContentHash:hash({url:key(item.url),title:normalize(item.title)}),locator:item.url},affectedRecords:['data/data.json'],reviewDueAt:new Date(Date.parse(now)+7*86400000).toISOString()},{now});result.findingId=finding.id;
   }
  }
  checkpoint(source,Boolean(qualified),qualified?contentHash:null);
  await persist(state,report);
 }
 core.finishRun(state,history.id,{now});report.reviewQueue=core.reviewQueueState(state,{now});report.status=report.sources.every(s=>s.status!=='covered')?'failed':report.sources.some(s=>s.status!=='covered')?'degraded':report.reviewQueue.pending?'review_required':'healthy';await persist(state,report);return{state,report};
}
module.exports={collect,corpusIndex,classify,render,key};
