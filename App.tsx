import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MD from './master_data';
const MASTER_RAW: string[][] = (MD as any).MASTER_RAW || (MD as any).default || [];

const MENU = [
  {title:'सदस्य',color:'#6ABF69',key:'members'},
  {title:'किसान',color:'#F5A623',key:'kisan'},
  {title:'एजेंट',color:'#5AC8FA',key:'agent'},
  {title:'ऑपरेटर',color:'#9B7ED8',key:'operator'},
  {title:'हेल्पर',color:'#E94E6B',key:'helper'},
  {title:'डीलर',color:'#A07C6D',key:'dealer'},
  {title:'पार्ट्स विक्रेता',color:'#4DB6AC',key:'parts'},
  {title:'सूचना / नोटिस',color:'#B07BE6',key:'notice'},
  {title:'लॉग आउट',color:'#212121',key:'logout'},
];
const HINDI: any = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',bhugtanTarikh:'भुगतान की तारीख',bhugtanMadhyam:'भुगतान माध्यम',rashiPraptakarta:'राशि प्राप्तकर्ता',gadiSankhya:'गाड़ी संख्या',company:'कंपनी',model:'मॉडल',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',ekad:'एकड़',kataiTarikh:'फसल कटाई की तारीख',samay:'समय',totalGhanta:'टोटल घंटा/समय',totalKaryadivas:'टोटल कार्यदिवस',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',agreement:'एग्रीमेंट',check:'चेक',karyadivas:'कार्यदिवस',totalGhanta:'टोटल घंटा/समय',advanceRashi:'एडवांस राशि प्राप्त',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि प्राप्त',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि'},
 helper: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि'},
 dealer: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',company:'कंपनी',showroomPata:'शोरूम पता',serviceCenter:'सर्विस सेंटर',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',dukaanNaam:'दुकान का नाम',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',partsPrakar:'पार्ट्स प्रकार',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',mobile:'मोबाइल नंबर',anyaJankari:'अन्य जानकारी'}
};
const FULL: any = {
 members: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',pad:'सदस्य',harvesterNumber:'',sadasyataShulk:'500',bhugtanTarikh:'',bhugtanMadhyam:'नकद',rashiPraptakarta:'',gadiSankhya:'',company:'',model:'',anyaJankari:''},
 kisan: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',fasal:'धान',ekad:'',kataiTarikh:'',samay:'',totalGhanta:'',totalKaryadivas:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],fasalList:[]},
 agent: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',agreement:'',check:'',karyadivas:'',totalGhanta:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:''},
 operator: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advance:'',bachatRashi:'',totalRashi:'',advanceList:[]},
 helper: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advanceRashi:'',bachatRashi:'',totalRashi:'',advanceList:[]},
 dealer: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',company:'',showroomPata:'',serviceCenter:'',anyaJankari:''},
 parts: {name:'',dukaanNaam:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',partsPrakar:'',anyaJankari:''},
 notice: {vishay:'',tarikh:'',vivaran:'',mobile:'',anyaJankari:''}
};

function ghantaToMinute(val:any): number {
  if(val===null||val===undefined||val==='') return 0;
  const s=String(val).trim();
  if(s.indexOf('.')===-1){
    const h=parseInt(s,10)||0;
    return h*60;
  }
  const parts=s.split('.');
  const h=parseInt(parts[0]||'0',10)||0;
  const mStr=(parts[1]||'').slice(0,2);
  const m=parseInt(mStr||'0',10)||0;
  return h*60+m;
}
function minuteToGhantaText(totalMin:number): string {
  const h=Math.floor(totalMin/60);
  const m=totalMin%60;
  return h+' घंटा '+m+' मिनट';
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
function getFasalGhantaTotal(item:any): string {
  const list=getFasalList(item);
  let totalMin=0;
  list.forEach((e:any)=>{ totalMin+=ghantaToMinute(e.ghanta); });
  return minuteToGhantaText(totalMin);
}
function getAdvanceTotal(f:any, t:string): number {
  const list=getAdvanceList(f);
  let sum=list.reduce((s:any,e:any)=>s+(parseFloat(e.amount)||0),0);
  if(sum===0){
    const advKey=t==='operator'?'advance':'advanceRashi';
    sum=parseFloat(f[advKey]||'0')||0;
  }
  return sum;
}
function calcTotalRashi(f:any, t:string): string {
  const a=getAdvanceTotal(f,t);
  const b=parseFloat(f['bachatRashi']||'0')||0;
  return String(a+b);
}
function calcKisanTotal(f:any): string { return calcTotalRashi(f,'kisan'); }
const BOTTOM_KEYS = ['totalKaryadivas','upasthiti','upasthitiDates','advance','advanceRashi','bachatRashi','totalRashi','pooraRashi','advanceList','ekad','kataiTarikh','samay','totalGhanta','fasalList'];
const KISAN_BOTTOM = ['advanceRashi','bachatRashi','pooraRashi','advanceList'];
const KISAN_FASAL_KEYS = ['ekad','kataiTarikh','samay','totalGhanta','fasalList'];

export default function App(){
  const [view,setView]=useState('home');
  const [members,setMembers]=useState<any[]>([]); const [kisans,setKisans]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [helpers,setHelpers]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]); const [notices,setNotices]=useState<any[]>([]);
  const [form,setForm]=useState<any>({}); const [show,setShow]=useState(false); const [type,setType]=useState('members'); const [editId,setEditId]=useState<string|null>(null);
  const [search,setSearch]=useState(''); const [splash,setSplash]=useState(true);
  const [progress,setProgress]=useState(0);
  const [isLogin,setIsLogin]=useState(false); const [pass,setPass]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [detailItem,setDetailItem]=useState<any|null>(null);
  const [newDate,setNewDate]=useState('');
  const [advDate,setAdvDate]=useState(''); const [advAmt,setAdvAmt]=useState('');
  const [fasalDate,setFasalDate]=useState(''); const [fasalSamay,setFasalSamay]=useState(''); const [fasalEkad,setFasalEkad]=useState(''); const [fasalGhanta,setFasalGhanta]=useState('');

  const MASTER_DATA = (MASTER_RAW || []).map((r: string[], i: number) => ({
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
    const n=await AsyncStorage.getItem('notices'); if(n) setNotices(JSON.parse(n));
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
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices,loaded]);
  useEffect(()=>{ const onBackPress=()=>{ if(detailItem){setDetailItem(null);return true;} if(show){setShow(false);return true;} if(view!=='home'){setView('home');return true;} if(isLogin&&view==='home'){AsyncStorage.setItem('isLogin','no');setIsLogin(false);return true;} return false; }; const sub=BackHandler.addEventListener('hardwareBackPress',onBackPress); return ()=>sub.remove(); },[view,show,isLogin,detailItem]);

  const doLogin=async()=>{ if(pass==='2022'){ setIsLogin(true); await AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); };
  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); };
  const openForm=(t:string,item:any)=>{ setType(t); setEditId(item?item.id:null); const base=FULL[t]||{}; const merged=item?Object.assign({},JSON.parse(JSON.stringify(base)),item):JSON.parse(JSON.stringify(base)); if((t==='operator'||t==='helper')){ merged.upasthitiDates=getUpasthitiDates(merged); merged.advanceList=getAdvanceList(merged); merged.totalRashi=calcTotalRashi(merged,t); merged.totalKaryadivas=String(getUpasthitiDates(merged).length); } if(t==='kisan'){ merged.advanceList=getAdvanceList(merged); merged.fasalList=getFasalList(merged); merged.pooraRashi=calcKisanTotal(merged); } setForm(merged); setNewDate(''); setAdvDate(''); setAdvAmt(''); setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta(''); setShow(true); };
  const updateFormField=(k:string,t:string)=>{ const nf={...form,[k]:t}; if((type==='operator'||type==='helper')&&k==='bachatRashi'){ nf.totalRashi=calcTotalRashi(nf,type); } if(type==='kisan'&&k==='bachatRashi'){ nf.pooraRashi=calcKisanTotal(nf); } setForm(nf); };
  const addUpasthitiDate=()=>{ const d=newDate.trim(); if(!d){alert('पहले तारीख लिखें');return;} const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[]; if(cur.includes(d)){alert('यह तारीख पहले से जुड़ी है');return;} const updated=[...cur,d]; setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}); setNewDate(''); };
  const removeUpasthitiDate=(d:string)=>{ const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[]; const updated=cur.filter(x=>x!==d); setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}); };
  const addAdvanceEntry=()=>{ const d=advDate.trim(); const a=advAmt.trim(); if(!d){alert('एडवांस की तारीख लिखें');return;} if(!a){alert('एडवांस राशि लिखें');return;} const cur=getAdvanceList(form); const updated=[...cur,{date:d,amount:a}]; const nf={...form,advanceList:updated}; if(type==='kisan'){ nf.pooraRashi=calcKisanTotal(nf); } else { nf.totalRashi=calcTotalRashi(nf,type); } setForm(nf); setAdvDate(''); setAdvAmt(''); };
  const removeAdvanceEntry=(idx:number)=>{ const cur=getAdvanceList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); const nf={...form,advanceList:updated}; if(type==='kisan'){ nf.pooraRashi=calcKisanTotal(nf); } else { nf.totalRashi=calcTotalRashi(nf,type); } setForm(nf); };
  const addFasalEntry=()=>{ const d=fasalDate.trim(); const sm=fasalSamay.trim(); const ek=fasalEkad.trim(); const gh=fasalGhanta.trim(); if(!d){alert('फसल कटाई की तारीख लिखें');return;} if(!sm){alert('समय लिखें');return;} if(!ek){alert('एकड़ लिखें');return;} if(!gh){alert('घंटा लिखें');return;} const cur=getFasalList(form); const updated=[...cur,{date:d,samay:sm,ekad:ek,ghanta:gh}]; setForm({...form,fasalList:updated}); setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta(''); };
  const removeFasalEntry=(idx:number)=>{ const cur=getFasalList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); setForm({...form,fasalList:updated}); };
  const save=()=>{ const id=editId||Date.now().toString(); const data=Object.assign({},form,{id}); if((type==='operator'||type==='helper')){ const dates=getUpasthitiDates(data); data.upasthitiDates=dates; data.upasthiti=dates.join(', '); data.totalKaryadivas=String(dates.length); data.advanceList=getAdvanceList(data); data.totalRashi=calcTotalRashi(data,type); } if(type==='kisan'){ data.advanceList=getAdvanceList(data); data.fasalList=getFasalList(data); if(data.fasalList.length>0){ const last=data.fasalList[data.fasalList.length-1]; data.kataiTarikh=last.date||''; data.samay=last.samay||''; data.ekad=last.ekad||''; } data.totalGhanta=getFasalGhantaTotal(data); data.pooraRashi=calcKisanTotal(data); } if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); setShow(false); };

  const getFullList=()=>{ if(type==='members') return members; else if(type==='kisan') return kisans; else if(type==='agent') return agents; else if(type==='operator') return operators; else if(type==='helper') return helpers; else if(type==='dealer') return dealers; else if(type==='parts') return parts; else return notices; };
  const getList=()=>{ const l=getFullList(); if(search){ const q=search.toLowerCase(); return l.filter(it=>Object.values(it).join(' ').toLowerCase().includes(q)); } return l; };

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
    if(type!=='kisan') return null;
    const advList=getAdvanceList(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{getAdvanceTotal(form,type)}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख जैसे 07/09/2026" />
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
            <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख जैसे 07/09/2026" />
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
      return true;
    });
  };
  const getDetailKeys=()=>{
    return Object.keys(FULL[type]||{}).filter(k=>{
      if(k==='id') return false;
      if(BOTTOM_KEYS.includes(k)) return false;
      if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false;
      if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false;
      return true;
    });
  };

  if(splash){ return(<View style={s.splash}><Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" /><View style={s.loadBox}><Text style={s.loadText}>लोड हो रहा है... {progress}%</Text><View style={s.barBg}><View style={[s.barFill,{width:progress+'%'}]} /></View><Text style={s.loadSub}>{progress} / 100</Text></View></View>); }
  if(!isLogin){ return(<SafeAreaView style={s.loginSafe}><ScrollView contentContainerStyle={s.loginScroll} showsVerticalScrollIndicator={false}><View style={s.welcomeHeader}><Text style={s.welcomeTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ{'\n'}जिला कांकेर (छत्तीसगढ़) में आपका स्वागत है</Text><Text style={s.welcomeSub}>हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच,{'\n'}शासकीय मान्यता प्राप्त सहकारी संस्था</Text></View><View style={s.loginBox}><Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" /><Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text><TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" /><TouchableOpacity style={s.loginBtn} onPress={doLogin}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity></View><View style={s.addressBox}><Text style={s.addressTitle}>जिला कार्यालय</Text><Text style={s.addressText}>पता- लखनपुरी, मेन रोड़, N.H.30,{'\n'}जिला सहकारी बैंक के सामने,{'\n'}ब्लॉक-चारामा, जिला-कांकेर (छत्तीसगढ़)</Text><Text style={s.phoneText}>फोन नम्बर- 9479025929</Text><Text style={s.emailText} numberOfLines={1} ellipsizeMode="tail">ईमेल- mahanadiharvestar2026@gmail.com</Text></View></ScrollView></SafeAreaView>); }

  const totalCount=getFullList().length;
  const filteredList=getList();

  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}><Text style={{fontSize:32}}>🌾</Text><View style={{flex:1,alignItems:'center',paddingHorizontal:6}}><Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text><View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View></View><Text style={{fontSize:32}}>🚜</Text></View></View>
      {view==='home' && <ScrollView><View style={{padding:12}}>{MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ if(i.key==='logout') setView('logout'); else { setType(i.key); setView(i.key); setSearch(''); }}}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>}
      {view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{MENU.find(m=>m.key===type)?.title} ({filteredList.length})</Text><Text></Text></View>

      <View style={{backgroundColor:'#E8F5E9',marginHorizontal:8,marginTop:8,padding:10,borderRadius:8,borderWidth:1,borderColor:'#2E7D32'}}>
        <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>कुल {MENU.find(m=>m.key===type)?.title}: {totalCount}{search.trim()!==''? ` | सर्च में मिले: ${filteredList.length}` : ''}</Text>
      </View>

      <View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder='सर्च करें' /></View>
      {type==='members' && (<TouchableOpacity style={{backgroundColor:'#1B5E20',margin:8,padding:14,borderRadius:10,alignItems:'center'}} onPress={importMasterData}><Text style={{color:'#fff',fontWeight:'900'}}>📥 मास्टर डेटा से सदस्य जोड़ें</Text></TouchableOpacity>)}
      <ScrollView>{filteredList.map(it=>{ const dts=getUpasthitiDates(it); const advT=getAdvanceTotal(it,type); const fList=getFasalList(it); return (
      <TouchableOpacity key={it.id} activeOpacity={0.8} onPress={()=>setDetailItem(it)}>
      <View style={s.card}><Text style={{fontWeight:'bold',fontSize:16,color:'#0D47A1'}}>{it.name||it.vishay} 👁️</Text><Text>{it.mobile||''} {it.pata||''}</Text>
      {(type==='operator'||type==='helper')? <Text style={{fontSize:13,fontWeight:'bold',color:'#1B5E20',marginTop:4}}>✅ कार्यदिवस: {dts.length} दिन | एडवांस: ₹{advT} | टोटल: ₹{it.totalRashi||calcTotalRashi(it,type)}</Text> : null}
      {type==='kisan'? <Text style={{fontSize:13,fontWeight:'bold',color:'#2E7D32',marginTop:4}}>🌾 कटाई: {fList.length} प्रविष्टि | टोटल घंटा: {getFasalGhantaTotal(it)} | 💰 एडवांस: ₹{advT} | पूरा: ₹{it.pooraRashi||calcKisanTotal(it)}</Text> : null}
      <Text style={{fontSize:11,color:'#888',marginTop:4}}>पूरी जानकारी देखने के लिए क्लिक करें</Text>
      {it.mobile? (<View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${it.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${it.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${it.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>) : null}
      <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>{ if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id)); if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id)); if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id)); if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id)); if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id)); if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id)); if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id)); if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id)); }}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity></View></View>
      </TouchableOpacity>);})}</ScrollView><TouchableOpacity style={s.fab} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}
      {view==='logout' && <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center',padding:15,paddingBottom:80}}><View style={[s.card,{width:'95%',alignItems:'center',padding:20,paddingBottom:30}]}><TouchableOpacity style={{backgroundColor:'#212121',width:'100%',marginTop:10,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={doLogout}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>हाँ, लॉग आउट करें</Text></TouchableOpacity><TouchableOpacity style={{backgroundColor:'#2E7D32',width:'100%',marginTop:20,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={()=>setView('home')}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>नहीं, वापस जाएं</Text></TouchableOpacity></View></ScrollView>}
      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}><Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{MENU.find(m=>m.key===type)?.title} फॉर्म</Text>
      {getFormKeys().map(k=>(
        <View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{HINDI[type]?.[k]||k}</Text><TextInput style={s.inp} value={form[k]} onChangeText={t=>setForm({...form,[k]:t})} /></View>
      ))}
      {renderKisanFasalSection()}
      {renderKisanSection()}
      {renderBottomSection()}
      </ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity></View></View></Modal>

      <Modal visible={!!detailItem} animationType="slide" onRequestClose={()=>setDetailItem(null)}>
        <SafeAreaView style={s.modal}><ScrollView style={{padding:14}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',textAlign:'center',fontSize:18,color:'#B71C1C',marginBottom:4}}>{MENU.find(m=>m.key===type)?.title} - पूरी जानकारी</Text>
            <Text style={{textAlign:'center',fontSize:12,color:'#888',marginBottom:12}}>बायोडाटा डिटेल</Text>
            {detailItem && getDetailKeys().map(k=>(
              <View key={k} style={s.detailRow}><Text style={s.detailLabel}>{HINDI[type]?.[k]||k}</Text><Text style={s.detailValue}>{detailItem[k]||'-'}</Text></View>
            ))}
            {type==='kisan' && detailItem? (
              <View style={{backgroundColor:'#E8F5E9',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#2E7D32'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>🌾 फसल कटाई - तिथि / समय / एकड़ / घंटा : {getFasalList(detailItem).length} प्रविष्टि</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getFasalList(detailItem).map((e:any,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. तिथि: {e.date} | समय: {e.samay} | एकड़: {e.ekad} | घंटा: {e.ghanta}</Text>))}
                </ScrollView>
                <Text style={{fontWeight:'900',fontSize:14,color:'#1B5E20',marginTop:6}}>टोटल घंटा: {getFasalGhantaTotal(detailItem)}</Text>
              </View>
            ):null}
            {(type==='operator'||type==='helper') && detailItem? (
              <View style={{backgroundColor:'#E8F5E9',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#2E7D32'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>📅 उपस्थिति व टोटल कार्यदिवस: {getUpasthitiDates(detailItem).length} दिन</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getUpasthitiDates(detailItem).map((d:string,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. {d}</Text>))}
                </ScrollView>
              </View>
            ):null}
            {(type==='operator'||type==='helper') && detailItem? (
              <View style={{backgroundColor:'#FFF8E1',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#FF9800'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getAdvanceList(detailItem).map((e:any,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. {e.date} - ₹{e.amount}</Text>))}
                </ScrollView>
                <Text style={{fontSize:14,marginTop:6}}>एडवांस टोटल: ₹{getAdvanceTotal(detailItem,type)}</Text>
                <Text style={{fontSize:14,marginTop:2}}>बचत राशि: ₹{detailItem.bachatRashi||'0'}</Text>
                <Text style={{fontWeight:'900',fontSize:16,color:'#E65100',marginTop:6}}>टोटल राशि: ₹{calcTotalRashi(detailItem,type)}</Text>
              </View>
            ):null}
            {type==='kisan' && detailItem? (
              <View style={{backgroundColor:'#FFF8E1',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#FF9800'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getAdvanceList(detailItem).map((e:any,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. {e.date} - ₹{e.amount}</Text>))}
                </ScrollView>
                <Text style={{fontSize:14,marginTop:6}}>एडवांस टोटल: ₹{getAdvanceTotal(detailItem,type)}</Text>
                <Text style={{fontSize:14,marginTop:2}}>बचत राशि: ₹{detailItem.bachatRashi||'0'}</Text>
                <Text style={{fontWeight:'900',fontSize:16,color:'#E65100',marginTop:6}}>पूरा राशि जमा: ₹{calcKisanTotal(detailItem)}</Text>
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
  loginTitle:{fontWeight:'900',fontSize:16,color:'#B71C1C',textAlign:'center',marginTop:10},
  loginInput:{width:'100%',borderWidth:1,borderColor:'#FF9800',borderRadius:8,padding:12,marginTop:20,textAlign:'center',fontSize:18},
  loginBtn:{width:'100%',backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:15,alignItems:'center'},
  loginBtnT:{color:'#fff',fontWeight:'bold',fontSize:16},
  addressBox:{width:'92%',marginTop:15,marginBottom:30,backgroundColor:'#fff',borderRadius:12,padding:12,alignItems:'center',borderWidth:1,borderColor:'#FFB300'},
  addressTitle:{fontWeight:'900',fontSize:14,color:'#B71C1C',marginBottom:6},
  addressText:{fontSize:12,color:'#333',textAlign:'center',lineHeight:18,marginTop:2},
  phoneText:{fontSize:13,color:'#000',textAlign:'center',fontWeight:'900',marginTop:6,lineHeight:20},
  emailText:{fontSize:11,color:'#333',textAlign:'center',marginTop:4},
});
