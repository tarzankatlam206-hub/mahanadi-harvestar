// shared.ts - साझे constants और helper functions
export const EXPENSE_CATS = ['डीजल','पार्ट्स','मैकेनिक','ऑपरेटर','हेल्पर','एजेंट','अन्य'];
export const HOME_MENU = [
  {title:'सदस्य',color:'#6ABF69',key:'members'},
  {title:'किसान',color:'#F5A623',key:'kisan'},
  {title:'एजेंट',color:'#5AC8FA',key:'agent'},
  {title:'ऑपरेटर',color:'#9B7ED8',key:'operator'},
  {title:'हेल्पर',color:'#E94E6B',key:'helper'},
  {title:'डीलर',color:'#A07C6D',key:'dealer'},
  {title:'पार्ट्स विक्रेता',color:'#4DB6AC',key:'parts'},
  {title:'मैकेनिक',color:'#795548',key:'mechanic'},
  {title:'अन्य',color:'#607D8B',key:'anya'},
];
export const MENU = [...HOME_MENU,{title:'सूचना / नोटिस',color:'#B07BE6',key:'notice'},{title:'लॉग आउट',color:'#212121',key:'logout'}];
export function getAdvanceList(it:any):any[]{ if(!it) return []; if(Array.isArray(it.advanceList)) return it.advanceList; return []; }
export function getAdvanceTotal(f:any,t:string):number{ let s=getAdvanceList(f).reduce((a:any,e:any)=>a+(parseFloat(e.amount)||0),0); if(s===0){ s=parseFloat(f[t==='operator'?'advance':'advanceRashi']||'0')||0; } return s; }
export function calcCommonBachat(f:any,t:string):string{ return String((parseFloat(f['kulRashi']||'0')||0)-getAdvanceTotal(f,t)); }
export function calcKisanBachat(f:any):string{ return String((parseFloat(f['kulRashi']||'0')||0)-getAdvanceTotal(f,'kisan')); }
