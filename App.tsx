import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASTER_RAW } from './master_data';

const HOME_MENU = [
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

const MENU = [
...HOME_MENU,
  {title:'सूचना / नोटिस',color:'#B07BE6',key:'notice'},
  {title:'लॉग आउट',color:'#212121',key:'logout'},
];

const EXPENSE_CATS = ['डीजल','पार्ट्स','मैकेनिक','ऑपरेटर','हेल्पर','एजेंट','अन्य'];

const HINDI: any = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',bhugtanTarikh:'भुगतान की तारीख',bhugtanMadhyam:'भुगतान माध्यम',rashiPraptakarta:'राशि प्राप्तकर्ता',gadiSankhya:'गाड़ी संख्या',company:'कंपनी',model:'मॉडल',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',agreement:'एग्रीमेंट',check:'चेक',karyadivas:'कार्यदिवस',totalGhanta:'टोटल घंटा/समय',advanceRashi:'एडवांस राशि प्राप्त',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि प्राप्त',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि'},
 helper: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि'},
 dealer: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',company:'कंपनी',showroomPata:'शोरूम पता',serviceCenter:'सर्विस सेंटर',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',dukaanNaam:'दुकान का नाम',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',partsPrakar:'पार्ट्स प्रकार',anyaJankari:'अन्य जानकारी'},
 mechanic: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 anya: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',mobile:'मोबाइल नंबर',anyaJankari:'अन्य जानकारी'}
};

const FULL: any = {
 members: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',pad:'सदस्य',harvesterNumber:'',sadasyataShulk:'500',bhugtanTarikh:'',bhugtanMadhyam:'नकद',rashiPraptakarta:'',gadiSankhya:'',company:'',model:'',anyaJankari:''},
 kisan: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',fasal:'धान',ekad:'',kataiTarikh:'',samay:'',totalGhanta:'',totalKaryadivas:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],fasalList:[]},
 agent: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',agreement:'',check:'',karyadivas:'',totalGhanta:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[]},
 operator: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advance:'',bachatRashi:'',totalRashi:'',advanceList:[]},
 helper: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advanceRashi:'',bachatRashi:'',totalRashi:'',advanceList:[]},
 dealer: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',company:'',showroomPata:'',serviceCenter:'',anyaJankari:''},
 parts: {name:'',dukaanNaam:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',partsPrakar:'',anyaJankari:''},
 mechanic: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],karyaList:[]},
 anya: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],karyaList:[]},
 notice: {vishay:'',tarikh:'',vivaran:'',mobile:'',anyaJankari:''}
};

function ghantaToMinute(val:any): number {
  if(val===null||val===undefined||val==='') return 0;
  const s=String(val).trim();
  if(s.indexOf('.')===-1){ const h=parseInt(s,10)||0; return h*60; }
  const parts=s.split('.'); const h=parseInt(parts[0]||'0',10)||0;
  const mStr=(parts[1]||'').slice(0,2); const m=parseInt(mStr||'0',10)||0; return h*60+m;
}
function minuteToGhantaText(totalMin:number): string {
  const h=Math.floor(totalMin/60); const m=totalMin%60; return h+' घंटा '+m+' मिनट';
}
function getUpasthitiDates(item:any): string[] {
  if(!item) return [];
  if(Array.isArray(item.upasthitiDates)) return item.upasthitiDates;
  if(item.upasthiti && typeof item.upasthiti==='string' && item.upasthiti.trim()!==''){
    return item.upasthiti.split(',').map((s:string)=>s.trim()).filter((s:string)=>s!=='');
  }
  return [];
}
function getAdvanceList(item:any): any[] {
  if(!item) return [];
  if(Array.isArray(item.advanceList)) return item.advanceList;
  return [];
}
function getFasalList(item:any): any[] {
  if(!item) return [];
  if(Array.isArray(item.fasalList) && item.fasalList.length>0) return item.fasalList;
  if(item.kataiTarikh || item.samay || item.ekad || item.totalGhanta){
    const t=(item.kataiTarikh||'').trim(); const s=(item.samay||'').trim(); const e=(item.ekad||'').trim(); const g=(item.totalGhanta||'').trim();
    if(t||s||e||g) return [{date:t,samay:s,ekad:e,ghanta:g}];
  }
  return [];
}
function getKaryaList(item:any): any[] {
  if(!item) return [];
  if(Array.isArray(item.karyaList)) return item.karyaList;
  return [];
}
function getKaryaTotal(item:any): number {
  const list=getKaryaList(item);
  return list.reduce((s:any,e:any)=>s+(parseFloat(e.amount)||0),0);
}
function getFasalGhantaTotal(item:any): string {
  const list=getFasalList(item); let totalMin=0;
  list.forEach((e:any)=>{ totalMin+=ghantaToMinute(e.ghanta); });
  return minuteToGhantaText(totalMin);
}
function getAdvanceTotal(f:any, t:string): number {
  const list=getAdvanceList(f);
  let sum=list.reduce((s:any,e:any)=>s+(parseFloat(e.amount)||0),0);
  if(sum===0){ const advKey=t==='operator'?'advance':'advanceRashi'; sum=parseFloat(f[advKey]||'0')||0; }
  return sum;
}
function calcKisanBachat(f:any): string {
  const total=parseFloat(f['kulRashi']||'0')||0;
  const adv=getAdvanceTotal(f,'kisan');
  return String(total-adv);
}
function calcTotalRashi(f:any, t:string): string {
  const a=getAdvanceTotal(f,t); const b=parseFloat(f['bachatRashi']||'0')||0; return String(a+b);
}
function calcKisanTotal(f:any): string { return f['kulRashi']||'0'; }
function calcMechanicTotal(f:any): string { return calcTotalRashi(f,'mechanic'); }
function calcAnyaTotal(f:any): string { return calcTotalRashi(f,'anya'); }

const BOTTOM_KEYS = ['totalKaryadivas','upasthiti','upasthitiDates','advance','advanceRashi','bachatRashi','totalRashi','pooraRashi','advanceList','ekad','kataiTarikh','samay','totalGhanta','fasalList','karyaList','kulRashi'];
const KISAN_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList'];
const KISAN_FASAL_KEYS = ['ekad','kataiTarikh','samay','totalGhanta','fasalList'];
const MECHANIC_BOTTOM = ['advanceRashi','bachatRashi','pooraRashi','advanceList','karyaList'];

export default function App(){
  const [view,setView]=useState('home');
  const [tab,setTab]=useState('home');
  const [members,setMembers]=useState<any[]>([]);
  const [kisans,setKisans]=useState<any[]>([]);
  const [agents,setAgents]=useState<any[]>([]);
  const [operators,setOperators]=useState<any[]>([]);
  const [helpers,setHelpers]=useState<any[]>([]);
  const [dealers,setDealers]=useState<any[]>([]);
  const [parts,setParts]=useState<any[]>([]);
  const [mechanics,setMechanics]=useState<any[]>([]);
  const [anyas,setAnyas]=useState<any[]>([]);
  const [notices,setNotices]=useState<any[]>([]);
  const [expenses,setExpenses]=useState<any[]>([]);
  const [expCat,setExpCat]=useState('डीजल');
  const [expVivaran,setExpVivaran]=useState('');
  const [expRashi,setExpRashi]=useState('');
  const [expTarikh,setExpTarikh]=useState('');
  const [expLiter,setExpLiter]=useState('');
  const [newPass,setNewPass]=useState('');
  const [storedPass,setStoredPass]=useState('2022');
  const [form,setForm]=useState<any>({});
  const [show,setShow]=useState(false);
  const [type,setType]=useState('members');
  const [editId,setEditId]=useState<string|null>(null);
  const [search,setSearch]=useState('');
  const [splash,setSplash]=useState(true);
  const [progress,setProgress]=useState(0);
  const [isLogin,setIsLogin]=useState(false);
  const [pass,setPass]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [detailItem,setDetailItem]=useState<any|null>(null);
  const [deleteItem,setDeleteItem]=useState<any|null>(null);
  const [newDate,setNewDate]=useState('');
  const [advDate,setAdvDate]=useState('');
  const [advAmt,setAdvAmt]=useState('');
  const [fasalDate,setFasalDate]=useState('');
  const [fasalSamay,setFasalSamay]=useState('');
  const [fasalEkad,setFasalEkad]=useState('');
  const [fasalGhanta,setFasalGhanta]=useState('');
  const [karyaDate,setKaryaDate]=useState('');
  const [karyaWork,setKaryaWork]=useState('');
  const [karyaAmt,setKaryaAmt]=useState('');

  const MASTER_DATA = MASTER_RAW.map((r: string[], i: number) => ({
    id: 'master_' + i + '_' + r[3],
    name: r[0], pata: r[1], block: r[2], jila: 'कांकेर', rajya: 'छत्तीसगढ़',
    mobile: r[3], pad: r[5] || 'सदस्य', harvesterNumber: r[4],
    sadasyataShulk: r[11] || '500', bhugtanTarikh: r[10],
    bhugtanMadhyam: r[9] || 'नकद', rashiPraptakarta: r[12],
    gadiSankhya: r[6], company: r[7], model: r[8], anyaJankari: ''
  }));

  const importMasterData = () => {
    setMembers((prev: any[]) => {
      const ex = new Set(prev.map(x => x.name + '_' + x.mobile));
      const fr = MASTER_DATA.filter(m =>!ex.has(m.name + '_' + m.mobile));
      setTimeout(() => alert(fr.length > 0? fr.length + ' सदस्य जुड़ गए!' : 'पहले से जुड़े हैं'), 300);
      return [...fr,...prev];
    });
  };

  useEffect(()=>{ (async()=>{ try{
    const m=await AsyncStorage.getItem('members'); if(m) setMembers(JSON.parse(m));
    const k=await AsyncStorage.getItem('kisans'); if(k) setKisans(JSON.parse(k));
    const a=await AsyncStorage.getItem('agents'); if(a) setAgents(JSON.parse(a));
    const o=await AsyncStorage.getItem('operators'); if(o) setOperators(JSON.parse(o));
    const h=await AsyncStorage.getItem('helpers'); if(h) setHelpers(JSON.parse(h));
    const d=await AsyncStorage.getItem('dealers'); if(d) setDealers(JSON.parse(d));
    const p=await AsyncStorage.getItem('parts'); if(p) setParts(JSON.parse(p));
    const mc=await AsyncStorage.getItem('mechanics'); if(mc) setMechanics(JSON.parse(mc));
    const an=await AsyncStorage.getItem('anyas'); if(an) setAnyas(JSON.parse(an));
    const n=await AsyncStorage.getItem('notices'); if(n) setNotices(JSON.parse(n));
    const ex=await AsyncStorage.getItem('expenses'); if(ex) setExpenses(JSON.parse(ex));
    const pw=await AsyncStorage.getItem('appPass'); if(pw) setStoredPass(pw);
    const lg=await AsyncStorage.getItem('isLogin'); if(lg==='yes') setIsLogin(true);
  }catch(e){} setLoaded(true); })(); },[]);

  useEffect(()=>{ let val=0; const interval=setInterval(()=>{ val+=1; if(val>=100){ val=100; clearInterval(interval); setTimeout(()=>setSplash(false),500); } setProgress(val); },100); return ()=>clearInterval(interval); },[]);

  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('members',JSON.stringify(members)); },[members,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('kisans',JSON.stringify(kisans)); },[kisans,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('agents',JSON.stringify(agents)); },[agents,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('operators',JSON.stringify(operators)); },[operators,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('helpers',JSON.stringify(helpers)); },[helpers,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('dealers',JSON.stringify(dealers)); },[dealers,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('parts',JSON.stringify(parts)); },[parts,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('mechanics',JSON.stringify(mechanics)); },[mechanics,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('anyas',JSON.stringify(anyas)); },[anyas,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('expenses',JSON.stringify(expenses)); },[expenses,loaded]);

  useEffect(()=>{ const onBackPress=()=>{ if(deleteItem){setDeleteItem(null);return true;} if(detailItem){setDetailItem(null);return true;} if(show){setShow(false);return true;} if(view!=='home'){setView('home');return true;} if(isLogin&&view==='home'){AsyncStorage.setItem('isLogin','no');setIsLogin(false);return true;} return false; }; const sub=BackHandler.addEventListener('hardwareBackPress',onBackPress); return ()=>sub.remove(); },[view,show,isLogin,detailItem,deleteItem]);

  const doLogin=async()=>{ if(pass===storedPass){ setIsLogin(true); await AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); };
  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); setTab('home'); };
  const isMechanicLike=(t:string)=> t==='mechanic'||t==='anya';
  const getSearchPlaceholder=()=> type==='members'? 'सर्च करें (नाम / मोनो नं. / हार्वेस्टर नं.)' : 'सर्च करें (नाम / मोबाइल नं. / पता)';

  const openForm=(t:string,item:any)=>{
    setType(t); setEditId(item?item.id:null);
    const base=FULL[t]||{};
    const merged=item?Object.assign({},JSON.parse(JSON.stringify(base)),item):JSON.parse(JSON.stringify(base));
    if((t==='operator'||t==='helper')){
      merged.upasthitiDates=getUpasthitiDates(merged);
      merged.advanceList=getAdvanceList(merged);
      merged.totalRashi=calcTotalRashi(merged,t);
      merged.totalKaryadivas=String(getUpasthitiDates(merged).length);
    }
    if(t==='kisan'){
      merged.advanceList=getAdvanceList(merged);
      merged.fasalList=getFasalList(merged);
      merged.bachatRashi=calcKisanBachat(merged);
      merged.pooraRashi=merged.kulRashi||'0';
    }
    if(t==='agent'){
      merged.advanceList=getAdvanceList(merged);
      merged.bachatRashi=calcKisanBachat(merged);
      merged.pooraRashi=merged.kulRashi||'0';
    }
    if(isMechanicLike(t)){
      merged.advanceList=getAdvanceList(merged);
      merged.karyaList=getKaryaList(merged);
      merged.pooraRashi=t==='anya'?calcAnyaTotal(merged):calcMechanicTotal(merged);
    }
    setForm(merged);
    setNewDate(''); setAdvDate(''); setAdvAmt('');
    setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta('');
    setKaryaDate(''); setKaryaWork(''); setKaryaAmt('');
    setShow(true);
  };

  const updateFormField=(k:string,t:string)=>{
    const nf={...form,[k]:t};
    if((type==='operator'||type==='helper')&&k==='bachatRashi'){ nf.totalRashi=calcTotalRashi(nf,type); }
    if((type==='kisan'||type==='agent')&&k==='kulRashi'){ nf.bachatRashi=calcKisanBachat(nf); nf.pooraRashi=t; }
    if(type==='mechanic'&&k==='bachatRashi'){ nf.pooraRashi=calcMechanicTotal(nf); }
    if(type==='anya'&&k==='bachatRashi'){ nf.pooraRashi=calcAnyaTotal(nf); }
    setForm(nf);
  };

  const addUpasthitiDate=()=>{
    const d=newDate.trim(); if(!d){alert('पहले तारीख लिखें');return;}
    const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    if(cur.includes(d)){alert('यह तारीख पहले से जुड़ी है');return;}
    const updated=[...cur,d];
    setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)});
    setNewDate('');
  };
  const removeUpasthitiDate=(d:string)=>{
    const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    const updated=cur.filter(x=>x!==d);
    setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)});
  };

  const addAdvanceEntry=()=>{
    const d=advDate.trim(); const a=advAmt.trim();
    if(!d){alert('एडवांस की तारीख लिखें');return;}
    if(!a){alert('एडवांस राशि लिखें');return;}
    const cur=getAdvanceList(form);
    const updated=[...cur,{date:d,amount:a}];
    const nf={...form,advanceList:updated};
    if(type==='kisan'||type==='agent'){ nf.bachatRashi=calcKisanBachat(nf); nf.pooraRashi=nf.kulRashi||'0'; }
    else if(type==='mechanic'){ nf.pooraRashi=calcMechanicTotal(nf); }
    else if(type==='anya'){ nf.pooraRashi=calcAnyaTotal(nf); }
    else { nf.totalRashi=calcTotalRashi(nf,type); }
    setForm(nf); setAdvDate(''); setAdvAmt('');
  };
  const removeAdvanceEntry=(idx:number)=>{
    const cur=getAdvanceList(form);
    const updated=cur.filter((_:any,i:number)=>i!==idx);
    const nf={...form,advanceList:updated};
    if(type==='kisan'||type==='agent'){ nf.bachatRashi=calcKisanBachat(nf); nf.pooraRashi=nf.kulRashi||'0'; }
    else if(type==='mechanic'){ nf.pooraRashi=calcMechanicTotal(nf); }
    else if(type==='anya'){ nf.pooraRashi=calcAnyaTotal(nf); }
    else { nf.totalRashi=calcTotalRashi(nf,type); }
    setForm(nf);
  };

  const addFasalEntry=()=>{
    const d=fasalDate.trim(); const sm=fasalSamay.trim(); const ek=fasalEkad.trim(); const gh=fasalGhanta.trim();
    if(!d){alert('फसल कटाई की तारीख लिखें');return;}
    if(!sm){alert('समय लिखें');return;}
    if(!ek){alert('एकड़ लिखें');return;}
    if(!gh){alert('घंटा लिखें');return;}
    const cur=getFasalList(form);
    const updated=[...cur,{date:d,samay:sm,ekad:ek,ghanta:gh}];
    setForm({...form,fasalList:updated});
    setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta('');
  };
  const removeFasalEntry=(idx:number)=>{
    const cur=getFasalList(form);
    const updated=cur.filter((_:any,i:number)=>i!==idx);
    setForm({...form,fasalList:updated});
  };

  const addKaryaEntry=()=>{
    const d=karyaDate.trim(); const w=karyaWork.trim(); const a=karyaAmt.trim();
    if(!d){alert('कार्य की तिथि लिखें');return;}
    if(!w){alert('कार्य लिखें');return;}
    if(!a){alert('राशि लिखें');return;}
    const cur=getKaryaList(form);
    const updated=[...cur,{date:d,work:w,amount:a}];
    setForm({...form,karyaList:updated});
    setKaryaDate(''); setKaryaWork(''); setKaryaAmt('');
  };
  const removeKaryaEntry=(idx:number)=>{
    const cur=getKaryaList(form);
    const updated=cur.filter((_:any,i:number)=>i!==idx);
    setForm({...form,karyaList:updated});
  };

  const save=()=>{
    const id=editId||Date.now().toString();
    const data=Object.assign({},form,{id});
    if((type==='operator'||type==='helper')){
      const dates=getUpasthitiDates(data);
      data.upasthitiDates=dates; data.upasthiti=dates.join(', ');
      data.totalKaryadivas=String(dates.length);
      data.advanceList=getAdvanceList(data);
      data.totalRashi=calcTotalRashi(data,type);
    }
    if(type==='kisan'){
      data.advanceList=getAdvanceList(data);
      data.fasalList=getFasalList(data);
      if(data.fasalList.length>0){
        const last=data.fasalList[data.fasalList.length-1];
        data.kataiTarikh=last.date||''; data.samay=last.samay||''; data.ekad=last.ekad||'';
      }
      data.totalGhanta=getFasalGhantaTotal(data);
      data.bachatRashi=calcKisanBachat(data);
      data.pooraRashi=data.kulRashi||'0';
    }
    if(type==='agent'){
        data.advanceList=getAdvanceList(data);
        data.bachatRashi=calcKisanBachat(data);
        data.pooraRashi=data.kulRashi||'0';
    }
    if(isMechanicLike(type)){
      data.advanceList=getAdvanceList(data);
      data.karyaList=getKaryaList(data);
      data.pooraRashi=type==='anya'?calcAnyaTotal(data):calcMechanicTotal(data);
    }
    if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='mechanic') setMechanics(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='anya') setAnyas(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]);
    setShow(false);
  };

  const getFullList=()=>{
    if(type==='members') return members;
    else if(type==='kisan') return kisans;
    else if(type==='agent') return agents;
    else if(type==='operator') return operators;
    else if(type==='helper') return helpers;
    else if(type==='dealer') return dealers;
    else if(type==='parts') return parts;
    else if(type==='mechanic') return mechanics;
    else if(type==='anya') return anyas;
    else return notices;
  };

  const getList=()=>{
    const l=getFullList();
    if(!search || search.trim()==='') return l;
    const qRaw=search.trim();
    const q=qRaw.toLowerCase();
    const isNumeric=/^[0-9]+$/.test(qRaw);
    return l.filter(it=>{
      const monoFields=[it.harvesterNumber||'', it.gadiSankhya||''].join(' ').toLowerCase();
      const mobileField=String(it.mobile||'').toLowerCase();
      const nameField=String(it.name||it.vishay||'').toLowerCase();
      const otherFields=[it.pata||'',it.block||'',it.jila||'',it.pad||'',it.company||'',it.model||''].join(' ').toLowerCase();
      if(isNumeric && qRaw.length<=3){
        if(monoFields.includes(q)) return true;
        if(nameField.includes(q)) return true;
        if(otherFields.includes(q)) return true;
        return false;
      } else if(isNumeric && qRaw.length>3){
        if(monoFields.includes(q)) return true;
        if(mobileField.includes(q)) return true;
        if(nameField.includes(q)) return true;
        if(otherFields.includes(q)) return true;
        return false;
      } else {
        const all=Object.values(it).join(' ').toLowerCase();
        return all.includes(q);
      }
    });
  };

  const confirmDelete=()=>{
    if(!deleteItem) return;
    const it=deleteItem;
    if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id));
    if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id));
    if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id));
    if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id));
    if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id));
    if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id));
    if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id));
    if(type==='mechanic') setMechanics(p=>p.filter(x=>x.id!==it.id));
    if(type==='anya') setAnyas(p=>p.filter(x=>x.id!==it.id));
    if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id));
    setDeleteItem(null);
  };

  const addExpense=()=>{
    if(expCat==='डीजल'){
      if(!expTarikh.trim()){alert('तिथि लिखें');return;}
      if(!expLiter.trim()){alert('लीटर लिखें');return;}
      if(!expRashi.trim()){alert('राशि लिखें');return;}
      const e={id:Date.now().toString(),cat:expCat,tarikh:expTarikh,liter:expLiter,rashi:expRashi,vivaran:'डीजल '+expLiter+' लीटर'};
      setExpenses(p=>[e,...p]); setExpTarikh(''); setExpLiter(''); setExpRashi(''); setExpVivaran('');
    }else{
      if(!expRashi.trim()){alert('राशि लिखें');return;}
      const e={id:Date.now().toString(),cat:expCat,vivaran:expVivaran||expCat,tarikh:expTarikh||new Date().toLocaleDateString('hi-IN'),rashi:expRashi,liter:''};
      setExpenses(p=>[e,...p]); setExpVivaran(''); setExpRashi(''); setExpTarikh('');
    }
  };
  const totalExpense=expenses.reduce((s,e)=>s+(parseFloat(e.rashi)||0),0);
  const getExpCatList=()=>expenses.filter(e=>(e.cat||'अन्य')===expCat);
  const getExpCatTotal=()=>getExpCatList().reduce((s,e)=>s+(parseFloat(e.rashi)||0),0);
  const getExpCatLiterTotal=()=>getExpCatList().reduce((s,e)=>s+(parseFloat(e.liter)||0),0);

  const getDueList=()=>{
    const arr:any[]=[];
    kisans.forEach(x=>{ const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'किसान',name:x.name,mobile:x.mobile,amt:b}); });
    operators.forEach(x=>{ const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'ऑपरेटर',name:x.name,mobile:x.mobile,amt:b}); });
    helpers.forEach(x=>{ const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'हेल्पर',name:x.name,mobile:x.mobile,amt:b}); });
    mechanics.forEach(x=>{ const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'मैकेनिक',name:x.name,mobile:x.mobile,amt:b}); });
    anyas.forEach(x=>{ const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'अन्य',name:x.name,mobile:x.mobile,amt:b}); });
    return arr;
  };
  const totalDue=getDueList().reduce((s,e)=>s+e.amt,0);
  const changePassword=async()=>{ if(newPass.trim().length<4){alert('कम से कम 4 अंक का पासवर्ड रखें');return;} await AsyncStorage.setItem('appPass',newPass.trim()); setStoredPass(newPass.trim()); setNewPass(''); alert('पासवर्ड बदल गया'); };

  const renderKisanFasalSection=()=>{
    if(type!=='kisan') return null;
    const list=getFasalList(form);
    const ghText=getFasalGhantaTotal(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#E8F5E9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#1B5E20',textAlign:'center'}}>🌾 फसल कटाई - तिथि / समय / एकड़ / घंटा</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>कटाई विवरण - टोटल: {list.length} प्रविष्टि | टोटल घंटा: {ghText}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={fasalDate} onChangeText={setFasalDate} placeholder="तिथि जैसे 07/09/2026" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={fasalSamay} onChangeText={setFasalSamay} placeholder="समय" />
        </View>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={fasalEkad} onChangeText={setFasalEkad} placeholder="एकड़" keyboardType="numeric" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={fasalGhanta} onChangeText={setFasalGhanta} placeholder="घंटा" keyboardType="numeric" />
        </View>
        <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addFasalEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {list.map((e:any,idx:number)=>(
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. तिथि: {e.date} | समय: {e.samay} | एकड़: {e.ekad} | घंटा: {e.ghanta}</Text>
            <TouchableOpacity onPress={()=>removeFasalEntry(idx)}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
          </View>
        ))}
        </ScrollView>
      </View>
    );
  };

  const renderKisanSection=()=>{
    if(type!=='kisan' && type!=='agent') return null;
    const advList=getAdvanceList(form);
    const advTotal=getAdvanceTotal(form,type);
    return (
      <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 टोटल राशि / एडवांस / बचत</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>टोटल राशि (आप डालेंगे)</Text>
        <TextInput style={[s.inp,{borderWidth:2,borderColor:'#E65100'}]} value={form.kulRashi} onChangeText={t=>updateFormField('kulRashi',t)} keyboardType="numeric" placeholder="टोटल राशि ₹ लिखें" />
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{advTotal}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख जैसे 07/09/2026" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="राशि ₹" keyboardType="numeric" />
        </View>
        <TouchableOpacity style={{backgroundColor:'#FF9800',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addAdvanceEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:140,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {advList.map((e:any,idx:number)=>(
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold'}}>{idx+1}. {e.date} - ₹{e.amount}</Text>
            <TouchableOpacity onPress={()=>removeAdvanceEntry(idx)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
          </View>
        ))}
        </ScrollView>
        <View style={[s.inp,{backgroundColor:'#E8F5E9',marginTop:10,borderWidth:2,borderColor:'#2E7D32'}]}>
          <Text style={{fontWeight:'900',color:'#1B5E20',fontSize:17,textAlign:'center'}}>बचत राशि (बाकी): ₹ {form.bachatRashi||'0'}</Text>
          <Text style={{fontSize:11,color:'#666',textAlign:'center',marginTop:2}}>टोटल ({form.kulRashi||'0'}) - एडवांस ({advTotal})</Text>
        </View>
      </View>
    );
  };

  // बाकी render functions वही रहेंगे...
  const renderMechanicKaryaSection=()=>{
    if(!isMechanicLike(type)) return null;
    const list=getKaryaList(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#EFEBE9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#795548'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#3E2723',textAlign:'center'}}>🔧 कार्य - तिथि / कार्य / राशि</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>कार्य विवरण - टोटल: {list.length} प्रविष्टि | टोटल राशि: ₹{getKaryaTotal(form)}</Text>
        <TextInput style={[s.inp,{marginTop:6}]} value={karyaDate} onChangeText={setKaryaDate} placeholder="तिथि जैसे 09/09/2026" />
        <TextInput style={[s.inp,{marginTop:6}]} value={karyaWork} onChangeText={setKaryaWork} placeholder="कार्य लिखें" />
        <TextInput style={[s.inp,{marginTop:6}]} value={karyaAmt} onChangeText={setKaryaAmt} placeholder="राशि ₹" keyboardType="numeric" />
        <TouchableOpacity style={{backgroundColor:'#795548',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addKaryaEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ कार्य जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {list.map((e:any,idx:number)=>(
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. तिथि: {e.date} | कार्य: {e.work} | राशि: ₹{e.amount}</Text>
            <TouchableOpacity onPress={()=>removeKaryaEntry(idx)}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
          </View>
        ))}
        </ScrollView>
      </View>
    );
  };

  const renderMechanicAdvanceSection=()=>{
    if(!isMechanicLike(type)) return null;
    const advList=getAdvanceList(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{getAdvanceTotal(form,type)}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="राशि ₹" keyboardType="numeric" />
        </View>
        <TouchableOpacity style={{backgroundColor:'#FF9800',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addAdvanceEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {advList.map((e:any,idx:number)=>(
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold'}}>{idx+1}. {e.date} - ₹{e.amount}</Text>
            <TouchableOpacity onPress={()=>removeAdvanceEntry(idx)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
          </View>
        ))}
        </ScrollView>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>बचत राशि</Text>
        <TextInput style={s.inp} value={form.bachatRashi} onChangeText={t=>updateFormField('bachatRashi',t)} keyboardType="numeric" placeholder="राशि लिखें" />
        <View style={[s.inp,{backgroundColor:'#FFE0B2',marginTop:10}]}><Text style={{fontWeight:'900',color:'#E65100',fontSize:17,textAlign:'center'}}>पूरा राशि जमा: ₹ {form.pooraRashi||'0'}</Text></View>
      </View>
    );
  };

  const renderBottomSection=()=>{
    if(!(type==='operator'||type==='helper')) return null;
    const dates=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    const advList=getAdvanceList(form);
    return (
      <View>
        <View style={{marginTop:16,backgroundColor:'#E8F5E9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}>
          <Text style={{fontSize:15,fontWeight:'900',color:'#1B5E20',textAlign:'center'}}>📅 उपस्थिति व टोटल कार्यदिवस</Text>
          <View style={[s.inp,{backgroundColor:'#fff',marginTop:8}]}><Text style={{fontWeight:'900',color:'#1B5E20',fontSize:16,textAlign:'center'}}>{form.totalKaryadivas||'0'} दिन</Text></View>
          <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>उपस्थिति तिथियां - टोटल: {dates.length} दिन</Text>
          <View style={{flexDirection:'row',marginTop:6}}>
            <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={newDate} onChangeText={setNewDate} placeholder="तारीख जैसे 07/09/2026" />
            <TouchableOpacity style={{backgroundColor:'#2E7D32',paddingHorizontal:14,justifyContent:'center',borderRadius:8,marginLeft:6}} onPress={addUpasthitiDate}><Text style={{color:'#fff',fontWeight:'bold'}}>जोड़ें</Text></TouchableOpacity>
          </View>
          <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
          {dates.map((d:string,idx:number)=>(
            <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
              <Text style={{fontWeight:'bold'}}>{idx+1}. {d}</Text>
              <TouchableOpacity onPress={()=>removeUpasthitiDate(d)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
            </View>
          ))}
          </ScrollView>
        </View>
        <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
          <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
          <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{getAdvanceTotal(form,type)}</Text>
          <View style={{flexDirection:'row',marginTop:6}}>
            <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख" />
            <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="राशि ₹" keyboardType="numeric" />
          </View>
          <TouchableOpacity style={{backgroundColor:'#FF9800',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addAdvanceEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
          <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
          {advList.map((e:any,idx:number)=>(
            <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
              <Text style={{fontWeight:'bold'}}>{idx+1}. {e.date} - ₹{e.amount}</Text>
              <TouchableOpacity onPress={()=>removeAdvanceEntry(idx)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
            </View>
          ))}
          </ScrollView>
          <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>बचत राशि</Text>
          <TextInput style={s.inp} value={form.bachatRashi} onChangeText={t=>updateFormField('bachatRashi',t)} keyboardType="numeric" placeholder="राशि लिखें" />
          <View style={[s.inp,{backgroundColor:'#FFE0B2',marginTop:10}]}><Text style={{fontWeight:'900',color:'#E65100',fontSize:17,textAlign:'center'}}>टोटल राशि: ₹ {form.totalRashi||'0'}</Text></View>
        </View>
      </View>
    );
  };

  const getFormKeys=()=>{
    return Object.keys(form).filter(k=>{
      if(k==='id') return false;
      if(BOTTOM_KEYS.includes(k)) return false;
      if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false;
      if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false;
      if(isMechanicLike(type) && MECHANIC_BOTTOM.includes(k)) return false;
      return true;
    });
  };
  const getDetailKeys=()=>{
    return Object.keys(FULL[type]||{}).filter(k=>{
      if(k==='id') return false;
      if(BOTTOM_KEYS.includes(k)) return false;
      if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false;
      if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false;
      if(isMechanicLike(type) && MECHANIC_BOTTOM.includes(k)) return false;
      return true;
    });
  };

  const renderBottomNav=()=>(
    <View style={s.navBar}>
      <TouchableOpacity style={s.navBtn} onPress={()=>{setTab('home');setView('home');}}><Text style={[s.navTxt,{color:tab==='home'?'#2E7D32':'#666'}]}>🏠{'\n'}होम</Text></TouchableOpacity>
      <TouchableOpacity style={s.navBtn} onPress={()=>{setTab('expense');setView('home');}}><Text style={[s.navTxt,{color:tab==='expense'?'#2E7D32':'#666'}]}>💸{'\n'}खर्च</Text></TouchableOpacity>
      <TouchableOpacity style={s.navBtn} onPress={()=>{setTab('due');setView('home');}}><Text style={[s.navTxt,{color:tab==='due'?'#2E7D32':'#666'}]}>📒{'\n'}देय राशि</Text></TouchableOpacity>
      <TouchableOpacity style={s.navBtn} onPress={()=>{setTab('setting');setView('home');}}><Text style={[s.navTxt,{color:tab==='setting'?'#2E7D32':'#666'}]}>⚙️{'\n'}सेटिंग</Text></TouchableOpacity>
    </View>
  );

  const renderExpenseTab=()=>{
    const catList=getExpCatList();
    return (
    <View style={{flex:1}}>
      <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
        <Text style={{fontWeight:'900',fontSize:18,textAlign:'center',color:'#B71C1C'}}>💸 खर्च का हिसाब</Text>
        <View style={[s.inp,{backgroundColor:'#FFEBEE',marginTop:10}]}><Text style={{fontWeight:'900',fontSize:16,textAlign:'center',color:'#B71C1C'}}>कुल खर्च: ₹ {totalExpense}</Text></View>
        <Text style={{fontWeight:'900',marginTop:14,marginBottom:6}}>खर्च की श्रेणी चुनें:</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
          {EXPENSE_CATS.map(c=>(
            <TouchableOpacity key={c} onPress={()=>setExpCat(c)} style={{backgroundColor:expCat===c?'#B71C1C':'#fff',borderWidth:1,borderColor:'#B71C1C',paddingHorizontal:14,paddingVertical:10,borderRadius:20,marginRight:8,marginBottom:8}}>
              <Text style={{color:expCat===c?'#fff':'#B71C1C',fontWeight:'900'}}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {expCat==='डीजल'? (
          <View style={{marginTop:12,backgroundColor:'#E3F2FD',padding:12,borderRadius:10,borderWidth:2,borderColor:'#1565C0'}}>
            <Text style={{fontSize:15,fontWeight:'900',color:'#0D47A1',textAlign:'center'}}>⛽ डीजल - तिथि / लीटर / राशि</Text>
            <Text style={{fontWeight:'bold',marginTop:10}}>तिथि</Text>
            <TextInput style={s.inp} value={expTarikh} onChangeText={setExpTarikh} placeholder="तिथि जैसे 10/09/2026" />
            <Text style={{fontWeight:'bold',marginTop:8}}>लीटर</Text>
            <TextInput style={s.inp} value={expLiter} onChangeText={setExpLiter} placeholder="लीटर लिखें" keyboardType="numeric" />
            <Text style={{fontWeight:'bold',marginTop:8}}>राशि ₹</Text>
            <TextInput style={s.inp} value={expRashi} onChangeText={setExpRashi} placeholder="राशि ₹" keyboardType="numeric" />
            <TouchableOpacity style={{backgroundColor:'#1565C0',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={addExpense}><Text style={{color:'#fff',fontWeight:'900'}}>➕ डीजल खर्च जोड़ें</Text></TouchableOpacity>
            <View style={{marginTop:12,backgroundColor:'#fff',borderRadius:10,padding:10,borderWidth:1,borderColor:'#1565C0'}}>
              <Text style={{fontWeight:'900',color:'#0D47A1',textAlign:'center'}}>डीजल खर्च बॉक्स - टोटल: {catList.length} प्रविष्टि | {getExpCatLiterTotal()} लीटर | ₹{getExpCatTotal()}</Text>
              <ScrollView style={{maxHeight:200,marginTop:8}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {catList.map((e:any,idx:number)=>(
                <View key={e.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#E3F2FD',padding:8,borderRadius:6,marginTop:6}}>
                  <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. {e.tarikh} | {e.liter} लीटर | ₹{e.rashi}</Text>
                  <TouchableOpacity onPress={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
                </View>
              ))}
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={{marginTop:8}}>
            <Text style={{fontWeight:'bold',marginTop:8}}>चुनी हुई श्रेणी: <Text style={{color:'#B71C1C'}}>{expCat}</Text></Text>
            <Text style={{fontWeight:'bold',marginTop:12}}>विवरण</Text><TextInput style={s.inp} value={expVivaran} onChangeText={setExpVivaran} placeholder={expCat+" का विवरण लिखें"} />
            <Text style={{fontWeight:'bold',marginTop:8}}>राशि</Text><TextInput style={s.inp} value={expRashi} onChangeText={setExpRashi} placeholder="राशि ₹" keyboardType="numeric" />
            <Text style={{fontWeight:'bold',marginTop:8}}>तारीख</Text><TextInput style={s.inp} value={expTarikh} onChangeText={setExpTarikh} placeholder="तारीख जैसे 10/09/2026" />
            <TouchableOpacity style={{backgroundColor:'#D32F2F',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={addExpense}><Text style={{color:'#fff',fontWeight:'900'}}>➕ खर्च जोड़ें ({expCat})</Text></TouchableOpacity>
            <View style={{marginTop:12,backgroundColor:'#fff',borderRadius:10,padding:10,borderWidth:1,borderColor:'#D32F2F'}}>
              <Text style={{fontWeight:'900',color:'#B71C1C',textAlign:'center'}}>{expCat} खर्च बॉक्स - टोटल: {catList.length} प्रविष्टि | ₹{getExpCatTotal()}</Text>
              <ScrollView style={{maxHeight:200,marginTop:8}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {catList.map((e:any)=>(
                <View key={e.id} style={s.card}><Text style={{fontWeight:'900',color:'#B71C1C'}}>[{e.cat}] {e.vivaran}</Text><Text>₹{e.rashi} | {e.tarikh}</Text>
                <TouchableOpacity onPress={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))}><Text style={{color:'red',fontWeight:'bold',marginTop:6}}>हटाएं</Text></TouchableOpacity></View>
              ))}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
      {renderBottomNav()}
    </View>
    );
  };

  if(splash){ return(<View style={s.splash}><Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" /><View style={s.loadBox}><Text style={s.loadText}>लोड हो रहा है... {progress}%</Text><View style={s.barBg}><View style={[s.barFill,{width:progress+'%'}]} /></View><Text style={s.loadSub}>{progress} / 100</Text></View></View>); }
  if(!isLogin){ return(<SafeAreaView style={s.loginSafe}><ScrollView contentContainerStyle={s.loginScroll} showsVerticalScrollIndicator={false}><View style={s.welcomeHeader}><Text style={s.welcomeTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ{'\n'}जिला कांकेर (छत्तीसगढ़) में आपका स्वागत है</Text><Text style={s.welcomeSub}>हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच,{'\n'}शासकीय मान्यता प्राप्त सहकारी संस्था</Text></View><View style={s.loginBox}><Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" /><Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text><TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" /><TouchableOpacity style={s.loginBtn} onPress={doLogin}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity></View><View style={s.addressBox}><Text style={s.addressTitle}>जिला कार्यालय</Text><Text style={s.addressText}>पता- लखनपुरी, मेन रोड़, N.H.30,{'\n'}जिला सहकारी बैंक के सामने,{'\n'}ब्लॉक-चारामा, जिला-कांकेर (छत्तीसगढ़)</Text><Text style={s.phoneText}>फोन नम्बर- 9479025929</Text><Text style={s.emailText} numberOfLines={1} ellipsizeMode="tail">ईमेल- mahanadiharvestar2026@gmail.com</Text></View></ScrollView></SafeAreaView>); }

  const totalCount=getFullList().length;
  const filteredList=getList();
  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}><Text style={{fontSize:32}}>🌾</Text><View style={{flex:1,alignItems:'center',paddingHorizontal:6}}><Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text><View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View></View><Text style={{fontSize:32}}>🚜</Text></View></View>
      {tab==='expense' && renderExpenseTab()}
      {tab==='due' && (
        <View style={{flex:1}}>
          <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',fontSize:18,textAlign:'center',color:'#E65100'}}>📒 देय राशि (बचत बाकी)</Text>
            <View style={[s.inp,{backgroundColor:'#FFF3E0',marginTop:10}]}><Text style={{fontWeight:'900',fontSize:16,textAlign:'center',color:'#E65100'}}>कुल देय: ₹ {totalDue}</Text></View>
            {getDueList().map((d,i)=>(
              <View key={i} style={s.card}><Text style={{fontWeight:'bold'}}>{d.cat} - {d.name}</Text><Text>मोबाइल: {d.mobile||'-'}</Text><Text style={{fontWeight:'900',color:'#D32F2F'}}>बाकी: ₹{d.amt}</Text></View>
            ))}
            {getDueList().length===0 && <Text style={{textAlign:'center',marginTop:20,color:'#888'}}>कोई देय राशि नहीं है</Text>}
          </ScrollView>
          {renderBottomNav()}
        </View>
      )}
      {tab==='setting' && (
        <View style={{flex:1}}>
          <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',fontSize:18,textAlign:'center'}}>⚙️ सेटिंग</Text>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15,marginBottom:10}}>📢 सूचना / नोटिस</Text>
              <TouchableOpacity style={{backgroundColor:'#B07BE6',padding:14,borderRadius:10,alignItems:'center'}} onPress={()=>{ setType('notice'); setView('notice'); setTab('home'); setSearch(''); }}>
                <Text style={{color:'#fff',fontWeight:'900'}}>📋 सूचना / नोटिस देखें</Text>
              </TouchableOpacity>
              <Text style={{fontSize:12,color:'#888',marginTop:6,textAlign:'center'}}>कुल नोटिस: {notices.length}</Text>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>🔑 पासवर्ड बदलें</Text>
              <TextInput style={s.inp} value={newPass} onChangeText={setNewPass} placeholder="नया पासवर्ड लिखें" secureTextEntry={true} keyboardType="number-pad" />
              <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:12,borderRadius:8,marginTop:10,alignItems:'center'}} onPress={changePassword}><Text style={{color:'#fff',fontWeight:'900'}}>पासवर्ड सुरक्षित करें</Text></TouchableOpacity>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>📊 कुल डाटा</Text>
              <Text style={{marginTop:6}}>सदस्य: {members.length} | किसान: {kisans.length} | एजेंट: {agents.length}</Text>
              <Text>ऑपरेटर: {operators.length} | हेल्पर: {helpers.length} | डीलर: {dealers.length}</Text>
              <Text>पार्ट्स: {parts.length} | मैकेनिक: {mechanics.length} | अन्य: {anyas.length} | नोटिस: {notices.length}</Text>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>🏢 संस्था जानकारी</Text>
              <Text style={{marginTop:6}}>महानदी हार्वेस्टर मालिक कल्याण संघ, जिला कांकेर</Text>
              <Text>पंजीयन क्रमांक 122202678489</Text>
              <Text>फोन: 9479025929</Text>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15,marginBottom:10,color:'#D32F2F'}}>🚪 लॉग आउट</Text>
              <TouchableOpacity style={{backgroundColor:'#212121',padding:16,borderRadius:10,alignItems:'center'}} onPress={()=>{ setTab('home'); setView('logout'); }}>
                <Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>लॉग आउट करें</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {renderBottomNav()}
        </View>
      )}
      {tab==='home' && view==='home' && <ScrollView><View style={{padding:12,paddingBottom:90}}>{HOME_MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ setType(i.key); setView(i.key); setSearch(''); }}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>}
      {tab==='home' && view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{MENU.find(m=>m.key===type)?.title} ({filteredList.length})</Text><Text></Text></View>
      <View style={{backgroundColor:'#E8F5E9',marginHorizontal:8,marginTop:8,padding:10,borderRadius:8,borderWidth:1,borderColor:'#2E7D32'}}>
        <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>कुल {MENU.find(m=>m.key===type)?.title}: {totalCount}{search.trim()!==''? ` | सर्च में मिले: ${filteredList.length}` : ''}</Text>
      </View>
      <View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder={getSearchPlaceholder()} /></View>
      {type==='members' && (<TouchableOpacity style={{backgroundColor:'#1B5E20',margin:8,padding:14,borderRadius:10,alignItems:'center'}} onPress={importMasterData}><Text style={{color:'#fff',fontWeight:'900'}}>📥 मास्टर डेटा से सदस्य जोड़ें</Text></TouchableOpacity>)}
      <ScrollView contentContainerStyle={{paddingBottom:90}}>{filteredList.map(it=>{
        const dts=getUpasthitiDates(it); const advT=getAdvanceTotal(it,type); const fList=getFasalList(it); const kList=getKaryaList(it);
        const bachatKisan=calcKisanBachat(it);
        return (
      <TouchableOpacity key={it.id} activeOpacity={0.8} onPress={()=>setDetailItem(it)}>
      <View style={s.card}><Text style={{fontWeight:'bold',fontSize:16,color:'#0D47A1'}}>{it.name||it.vishay} 👁️</Text><Text>{it.mobile||''} {it.pata||''}</Text>
      {type==='members' && it.harvesterNumber? <Text style={{fontSize:13,fontWeight:'bold',color:'#4E342E',marginTop:2}}>मोनो/हार्वेस्टर नं.: {it.harvesterNumber}</Text> : null}
      {(type==='operator'||type==='helper')? <Text style={{fontSize:13,fontWeight:'bold',color:'#1B5E20',marginTop:4}}>✅ कार्यदिवस: {dts.length} दिन | एडवांस: ₹{advT} | टोटल: ₹{it.totalRashi||'0'}</Text> : null}
      {type==='kisan'? <Text style={{fontSize:13,fontWeight:'bold',color:'#2E7D32',marginTop:4}}>🌾 टोटल: ₹{it.kulRashi||'0'} | एडवांस: ₹{advT} | बचत: ₹{bachatKisan} | घंटा: {getFasalGhantaTotal(it)}</Text> : null}
      {isMechanicLike(type)? <Text style={{fontSize:13,fontWeight:'bold',color:'#3E2723',marginTop:4}}>🔧 कार्य: {kList.length} | राशि: ₹{getKaryaTotal(it)} | एडवांस: ₹{advT}</Text> : null}
      <Text style={{fontSize:11,color:'#888',marginTop:4}}>पूरी जानकारी देखने के लिए क्लिक करें</Text>
      {it.mobile? (<View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${it.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${it.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${it.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>) : null}
      <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>setDeleteItem(it)}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity></View></View>
      </TouchableOpacity>);})}</ScrollView><TouchableOpacity style={[s.fab,{bottom:90}]} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}
      {tab==='home' && view==='logout' && <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center',padding:15,paddingBottom:80}}><View style={[s.card,{width:'95%',alignItems:'center',padding:20,paddingBottom:30}]}><TouchableOpacity style={{backgroundColor:'#212121',width:'100%',marginTop:10,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={doLogout}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>हाँ, लॉग आउट करें</Text></TouchableOpacity><TouchableOpacity style={{backgroundColor:'#2E7D32',width:'100%',marginTop:20,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={()=>setView('home')}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>नहीं, वापस जाएं</Text></TouchableOpacity></View></ScrollView>}
      {tab==='home' && renderBottomNav()}
      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}><Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{MENU.find(m=>m.key===type)?.title} फॉर्म</Text>
      {getFormKeys().map(k=>(
        <View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{HINDI[type]?.[k]||k}</Text><TextInput style={s.inp} value={form[k]} onChangeText={t=>setForm({...form,[k]:t})} /></View>
      ))}
      {renderMechanicKaryaSection()}
      {renderMechanicAdvanceSection()}
      {renderKisanFasalSection()}
      {renderKisanSection()}
      {renderBottomSection()}
      </ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={!!deleteItem} transparent={true} animationType="fade" onRequestClose={()=>setDeleteItem(null)}>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}}>
          <View style={{backgroundColor:'#fff',borderRadius:14,padding:20,width:'90%',alignItems:'center',borderWidth:2,borderColor:'#D32F2F'}}>
            <Text style={{fontSize:18,fontWeight:'900',color:'#B71C1C',textAlign:'center'}}>क्या आप सच में हटाना चाहते हैं?</Text>
            <Text style={{fontSize:14,color:'#333',textAlign:'center',marginTop:10}}>{deleteItem?.name || deleteItem?.vishay || ''}</Text>
            <Text style={{fontSize:12,color:'#888',textAlign:'center',marginTop:4}}>यह कार्रवाई वापस नहीं होगी</Text>
            <View style={{flexDirection:'row',marginTop:20,width:'100%'}}>
              <TouchableOpacity style={{flex:1,backgroundColor:'#D32F2F',padding:14,borderRadius:10,alignItems:'center',marginRight:8}} onPress={confirmDelete}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>हाँ, हटाएं</Text></TouchableOpacity>
              <TouchableOpacity style={{flex:1,backgroundColor:'#2E7D32',padding:14,borderRadius:10,alignItems:'center'}} onPress={()=>setDeleteItem(null)}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>नहीं</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={!!detailItem} animationType="slide" onRequestClose={()=>setDetailItem(null)}>
        <SafeAreaView style={s.modal}><ScrollView style={{padding:14}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',textAlign:'center',fontSize:18,color:'#B71C1C',marginBottom:4}}>{MENU.find(m=>m.key===type)?.title} - पूरी जानकारी</Text>
            <Text style={{textAlign:'center',fontSize:12,color:'#888',marginBottom:12}}>बायोडाटा डिटेल</Text>
            {detailItem && getDetailKeys().map(k=>(
              <View key={k} style={s.detailRow}><Text style={s.detailLabel}>{HINDI[type]?.[k]||k}</Text><Text style={s.detailValue}>{detailItem[k]||'-'}</Text></View>
            ))}
            {type==='kisan' && detailItem? (
              <View style={{backgroundColor:'#FFF8E1',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#FF9800'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#E65100',textAlign:'center'}}>💰 टोटल / एडवांस / बचत</Text>
                <Text style={{fontSize:14,marginTop:6}}>टोटल राशि: ₹{detailItem.kulRashi||'0'}</Text>
                <Text style={{fontSize:14,marginTop:2}}>एडवांस टोटल: ₹{getAdvanceTotal(detailItem,type)}</Text>
                <Text style={{fontWeight:'900',fontSize:16,color:'#1B5E20',marginTop:6}}>बचत राशि (बाकी): ₹{calcKisanBachat(detailItem)}</Text>
                <Text style={{fontSize:14,marginTop:6}}>फसल कटाई प्रविष्टि: {getFasalList(detailItem).length} | टोटल घंटा: {getFasalGhantaTotal(detailItem)}</Text>
              </View>
            ):null}
            {detailItem?.mobile? (<View style={{flexDirection:'row',marginTop:14,flexWrap:'wrap',justifyContent:'center'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${detailItem.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${detailItem.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${detailItem.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>):null}
          </ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#FF9800'}]} onPress={()=>{ const it=detailItem; setDetailItem(null); if(it) openForm(type,it); }}><Text style={s.mBtnT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setDetailItem(null)}><Text style={s.mBtnT}>वापस जाएं</Text></TouchableOpacity></View></SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  headColorful:{backgroundColor:'#FFF8E1',margin:10,padding:14,borderRadius:16,borderWidth:2,borderColor:'#FFB300',elevation:4},
  headTitle1:{fontWeight:'900',fontSize:17,color:'#B71C1C',textAlign:'center'},
  headTitle2:{fontWeight:'800',fontSize:14,color:'#0D47A1',marginTop:5,textAlign:'center',backgroundColor:'#E3F2FD',paddingHorizontal:10,paddingVertical:2,borderRadius:10},
  regBox:{backgroundColor:'#1B5E20',paddingHorizontal:12,paddingVertical:3,borderRadius:20,marginTop:6},
  headTitle3:{fontWeight:'900',fontSize:11,color:'#FFEB3B',textAlign:'center'},
  btn:{padding:16,borderRadius:12,marginBottom:10,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'bold'},
  sub:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:'#fff'},
  search:{flexDirection:'row',backgroundColor:'#fff',margin:8,paddingHorizontal:10,borderRadius:8,alignItems:'center',borderWidth:1,borderColor:'#FF9800'},
  card:{backgroundColor:'#fff',margin:8,padding:12,borderRadius:8},
  sm:{paddingHorizontal:14,paddingVertical:8,borderRadius:8,marginRight:8,marginBottom:6},
  smT:{color:'#fff',fontSize:13,fontWeight:'bold'},
  fab:{position:'absolute',right:16,bottom:16,width:56,height:56,borderRadius:28,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'},
  fabT:{color:'#fff',fontSize:28},
  inp:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginTop:4},
  mBtn:{flex:1,padding:12,borderRadius:8,alignItems:'center',marginRight:6},
  mBtnT:{color:'#fff',fontWeight:'bold'},
  modal:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  modalBottom:{flexDirection:'row',padding:12,paddingBottom:30,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',elevation:10},
  splash:{flex:1,backgroundColor:'#000',justifyContent:'flex-end'},
  splashImage:{position:'absolute',width:'100%',height:'100%'},
  loadBox:{width:'100%',paddingHorizontal:30,paddingBottom:60,alignItems:'center',backgroundColor:'rgba(0,0,0,0.55)',paddingTop:18},
  loadText:{color:'#fff',fontSize:18,fontWeight:'bold',marginBottom:10},
  loadSub:{color:'#FFEB3B',fontSize:14,fontWeight:'bold',marginTop:8},
  barBg:{width:'100%',height:12,backgroundColor:'rgba(255,255,255,0.3)',borderRadius:6,overflow:'hidden'},
  barFill:{height:'100%',backgroundColor:'#4CAF50',borderRadius:6},
  detailRow:{backgroundColor:'#fff',borderRadius:8,padding:10,marginBottom:8,borderLeftWidth:4,borderLeftColor:'#FF9800'},
  detailLabel:{fontSize:12,fontWeight:'bold',color:'#888'},
  detailValue:{fontSize:15,fontWeight:'600',color:'#212121',marginTop:3},
  loginSafe:{flex:1,backgroundColor:'#FFF3E0'},
  loginScroll:{flexGrow:1,justifyContent:'flex-start',alignItems:'center',paddingVertical:20,paddingHorizontal:10,paddingBottom:50},
  welcomeHeader:{width:'92%',backgroundColor:'#E8F5E9',borderRadius:14,padding:14,alignItems:'center',borderWidth:2,borderColor:'#2E7D32',marginBottom:15},
  welcomeTitle:{fontWeight:'900',fontSize:15,color:'#B71C1C',textAlign:'center',lineHeight:22},
  welcomeSub:{fontWeight:'700',fontSize:12,color:'#0D47A1',textAlign:'center',marginTop:8,lineHeight:18,backgroundColor:'#FFF9C4',paddingHorizontal:10,paddingVertical:6,borderRadius:8},
  loginBox:{width:'90%',backgroundColor:'#fff',padding:25,borderRadius:15,alignItems:'center',borderWidth:2,borderColor:'#FF9800'},
  loginLogo:{width:120,height:120,marginBottom:10},
  sloganText:{fontWeight:'900',fontSize:14,color:'#1B5E20',textAlign:'center',marginTop:6,marginBottom:4},
  loginInput:{width:'100%',borderWidth:1,borderColor:'#FF9800',borderRadius:8,padding:12,marginTop:20,textAlign:'center',fontSize:18},
  loginBtn:{width:'100%',backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:15,alignItems:'center'},
  loginBtnT:{color:'#fff',fontWeight:'bold',fontSize:16},
  addressBox:{width:'92%',marginTop:15,marginBottom:30,backgroundColor:'#fff',borderRadius:12,padding:12,alignItems:'center',borderWidth:1,borderColor:'#FFB300'},
  addressTitle:{fontWeight:'900',fontSize:14,color:'#B71C1C',marginBottom:6},
  addressText:{fontSize:12,color:'#333',textAlign:'center',lineHeight:18,marginTop:2},
  phoneText:{fontSize:13,color:'#000',textAlign:'center',fontWeight:'900',marginTop:6,lineHeight:20},
  emailText:{fontSize:11,color:'#333',textAlign:'center',marginTop:4},
  navBar:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',paddingVertical:8,paddingBottom:18,position:'absolute',bottom:0,left:0,right:0,elevation:10},
  navBtn:{flex:1,alignItems:'center',justifyContent:'center'},
  navTxt:{fontSize:12,fontWeight:'bold',textAlign:'center',lineHeight:18},
});
