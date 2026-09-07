'use strict';
const ACTIVE_IDS = ['AIEL-2024-015','AIEL-2024-017','AIEL-2025-018','AIEL-2026-019','AIEL-2026-020'];
const definitions = {
 'AIEL-2024-015':{role:'party_publication',identity:['parks','mccormac'],qualification:'Party allegations; this case page is not a current court docket or judgment.'},
 'AIEL-2024-017':{role:'secondary_mirror',identity:['murphy'],unsupportedReason:'The configured PDF is on a news-media mirror. Original court or party publication must be identified before qualified observation.',qualification:'Allegations only; remand and current proceeding status remain unverified.'},
 'AIEL-2025-018':{role:'court_document',identity:['mobley','workday'],qualification:'One original court document; discrimination remains alleged and the document is not a current docket.'},
 'AIEL-2026-019':{role:'docket_metadata',identity:['swanson','international business machines'],qualification:'Docket metadata only; unnamed tool and ML-versus-rules distinction remain unverified.'},
 'AIEL-2026-020':{role:'docket_metadata',identity:['cable news network','perplexity'],qualification:'Docket metadata only; copyright and false-attribution assertions are unresolved allegations.'}
};
function mattersFrom(data) {
 const active=(data.datasets?.included?.records || []).filter(r=>['pending','filed'].includes(r.filing_status));
 if(JSON.stringify(active.map(r=>r.error_id).sort())!==JSON.stringify([...ACTIVE_IDS].sort()))throw Error('Active matter set changed; reconcile the bounded five-matter pilot');
 return ACTIVE_IDS.map(id=>{const r=active.find(r=>r.error_id===id),url=new URL(r.public_record_link);url.hostname=url.hostname.replace(/^www\./,'');
  return {id,kind:'matter',url:url.href,expectedHost:url.hostname,title:r.public_matter_name,baselineStatus:r.filing_status,attribution:r.ai_system_name,confidence:r.confidence_score,needsReview:r.needs_review,reviewCadenceDays:30,...definitions[id]};});
}
module.exports={mattersFrom,ACTIVE_IDS};
