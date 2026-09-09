export function ghantaToMinute(val){
  if(val===null||val===undefined||val==='') return 0;
  const s=String(val).trim();
  if(s.indexOf('.')===-1){ const h=parseInt(s,10)||0; return h*60; }
  const parts=s.split('.'); const h=parseInt(parts[0]||'0',10)||0;
  const mStr=(parts[1]||'').slice(0,2); const m=parseInt(mStr||'0',10)||0; return h*60+m;
}
export function minuteToGhantaText(totalMin){
  const h=Math.floor(totalMin/60); const m=totalMin%60; return h+' घंटा '+m+' मिनट';
}
export function getUpasthitiDates(item){
  if(!item) return [];
  if(Array.isArray(item.upasthitiDates)) return item.upasthitiDates;
  if(item.upasthiti && typeof item.upasthiti==='string' && item.upasthiti.trim()!==''){
    return item.upasthiti.split(',').map((s)=>s.trim()).filter((s)=>s!=='');
  }
  return [];
}
export function getAdvanceList(item){
  if(!item) return [];
  if(Array.isArray(item.advanceList)) return item.advanceList;
  return [];
}
export function getFasalList(item){
  if(!item) return [];
  if(Array.isArray(item.fasalList) && item.fasalList.length>0) return item.fasalList;
  if(item.kataiTarikh || item.samay || item.ekad || item.totalGhanta){
    const t=(item.kataiTarikh||'').trim(); const s=(item.samay||'').trim(); const e=(item.ekad||'').trim(); const g=(item.totalGhanta||'').trim();
    if(t||s||e||g) return [{date:t,samay:s,ekad:e,ghanta:g}];
  }
  return [];
}
export function getKaryaList(item){
  if(!item) return [];
  if(Array.isArray(item.karyaList)) return item.karyaList;
  return [];
}
export function getKaryaTotal(item){
  const list=getKaryaList(item);
  return list.reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
}
export function getFasalGhantaTotal(item){
  const list=getFasalList(item); let totalMin=0;
  list.forEach((e)=>{ totalMin+=ghantaToMinute(e.ghanta); });
  return minuteToGhantaText(totalMin);
}
export function getAdvanceTotal(f,t){
  const list=getAdvanceList(f);
  let sum=list.reduce((s,e)=>s+(parseFloat(e.amount)||0),0);
  if(sum===0){ const advKey=t==='operator'?'advance':'advanceRashi'; sum=parseFloat(f[advKey]||'0')||0; }
  return sum;
}
export function calcTotalRashi(f,t){
  const a=getAdvanceTotal(f,t); const b=parseFloat(f['bachatRashi']||'0')||0; return String(a+b);
}
export function calcKisanTotal(f){ return calcTotalRashi(f,'kisan'); }
export function calcMechanicTotal(f){ return calcTotalRashi(f,'mechanic'); }

export const BOTTOM_KEYS = ['totalKaryadivas','upasthiti','upasthitiDates','advance','advanceRashi','bachatRashi','totalRashi','pooraRashi','advanceList','ekad','kataiTarikh','samay','totalGhanta','fasalList','karyaList'];
export const KISAN_BOTTOM = ['advanceRashi','bachatRashi','pooraRashi','advanceList'];
export const KISAN_FASAL_KEYS = ['ekad','kataiTarikh','samay','totalGhanta','fasalList'];
export const MECHANIC_BOTTOM = ['advanceRashi','bachatRashi','pooraRashi','advanceList','karyaList'];
