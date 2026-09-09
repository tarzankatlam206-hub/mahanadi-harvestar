import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASTER_RAW } from './master_data';
import { HOME_MENU, SETTING_MENU, ALL_MENU, HINDI, FULL } from './constants';
import { ghantaToMinute, minuteToGhantaText, getUpasthitiDates, getAdvanceList, getFasalList, getKaryaList, getKaryaTotal, getFasalGhantaTotal, getAdvanceTotal, calcTotalRashi, calcKisanTotal, calcMechanicTotal, BOTTOM_KEYS, KISAN_BOTTOM, KISAN_FASAL_KEYS, MECHANIC_BOTTOM } from './helpers';

export default function App(){
  const [view,setView]=useState('home');
  const [bottomTab,setBottomTab]=useState('home');
  const [members,setMembers]=useState<any[]>([]); const [kisans,setKisans]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [helpers,setHelpers]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]); const [mechanics,setMechanics]=useState<any[]>([]); const [notices,setNotices]=useState<any[]>([]);
  const [expenses,setExpenses]=useState<any[]>([]);
  const [form,setForm]=useState<any>({}); const [show,setShow]=useState(false); const [type,setType]=useState('members'); const [editId,setEditId]=useState<string|null>(null);
  const [search,setSearch]=useState(''); const [splash,setSplash]=useState(true);
  const [progress,setProgress]=useState(0);
  const [isLogin,setIsLogin]=useState(false); const [pass,setPass]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [detailItem,setDetailItem]=useState<any|null>(null);
  const [deleteItem,setDeleteItem]=useState<any|null>(null);
  const [newDate,setNewDate]=useState('');
  const [advDate,setAdvDate]=useState(''); const [advAmt,setAdvAmt]=useState('');
  const [fasalDate,setFasalDate]=useState(''); const [fasalSamay,setFasalSamay]=useState(''); const [fasalEkad,setFasalEkad]=useState(''); const [fasalGhanta,setFasalGhanta]=useState('');
  const [karyaDate,setKaryaDate]=useState(''); const [karyaWork,setKaryaWork]=useState(''); const [karyaAmt,setKaryaAmt]=useState('');
  const [expForm,setExpForm]=useState({vivaran:'',tarikh:'',rashi:''}); const [expShow,setExpShow]=useState(false); const [expEditId,setExpEditId]=useState<string|null>(null);

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
    const n=await AsyncStorage.getItem('notices'); if(n) setNotices(JSON.parse(n));
    const ex=await AsyncStorage.getItem('expenses'); if(ex) setExpenses(JSON.parse(ex));
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
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('expenses',JSON.stringify(expenses)); },[expenses,loaded]);
  useEffect(()=>{ const onBackPress=()=>{ if(deleteItem){setDeleteItem(null);return true;} if(detailItem){setDetailItem(null);return true;} if(show){setShow(false);return true;} if(expShow){setExpShow(false);return true;} if(view!=='home'){setView('home');return true;} if(isLogin&&view==='home'&&bottomTab==='home'){AsyncStorage.setItem('isLogin','no');setIsLogin(false);return true;} return false; }; const sub=BackHandler.addEventListener('hardwareBackPress',onBackPress); return ()=>sub.remove(); },[view,show,isLogin,detailItem,deleteItem,bottomTab,expShow]);

  const doLogin=async()=>{ if(pass==='2022'){ setIsLogin(true); await AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); };
  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); setBottomTab('home'); };
  const openForm=(t:string,item:any)=>{ setType(t); setEditId(item?item.id:null); const base=(FULL as any)[t]||{}; const merged=item?Object.assign({},JSON.parse(JSON.stringify(base)),item):JSON.parse(JSON.stringify(base)); if((t==='operator'||t==='helper')){ merged.upasthitiDates=getUpasthitiDates(merged); merged.advanceList=getAdvanceList(merged); merged.totalRashi=calcTotalRashi(merged,t); merged.totalKaryadivas=String(getUpasthitiDates(merged).length); } if(t==='kisan'){ merged.advanceList=getAdvanceList(merged); merged.fasalList=getFasalList(merged); merged.pooraRashi=calcKisanTotal(merged); } if(t==='mechanic'){ merged.advanceList=getAdvanceList(merged); merged.karyaList=getKaryaList(merged); merged.pooraRashi=calcMechanicTotal(merged); } setForm(merged); setNewDate(''); setAdvDate(''); setAdvAmt(''); setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta(''); setKaryaDate(''); setKaryaWork(''); setKaryaAmt(''); setShow(true); };
  const updateFormField=(k:string,t:string)=>{ const nf={...form,[k]:t}; if((type==='operator'||type==='helper')&&k==='bachatRashi'){ nf.totalRashi=calcTotalRashi(nf,type); } if(type==='kisan'&&k==='bachatRashi'){ nf.pooraRashi=calcKisanTotal(nf); } if(type==='mechanic'&&k==='bachatRashi'){ nf.pooraRashi=calcMechanicTotal(nf); } setForm(nf); };
  const addUpasthitiDate=()=>{ const d=newDate.trim(); if(!d){alert('पहले तारीख लिखें');return;} const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[]; if(cur.includes(d)){alert('यह तारीख पहले से जुड़ी है');return;} const updated=[...cur,d]; setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}); setNewDate(''); };
  const removeUpasthitiDate=(d:string)=>{ const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[]; const updated=cur.filter(x=>x!==d); setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}); };
  const addAdvanceEntry=()=>{ const d=advDate.trim(); const a=advAmt.trim(); if(!d){alert('एडवांस की तारीख लिखें');return;} if(!a){alert('एडवांस राशि लिखें');return;} const cur=getAdvanceList(form); const updated=[...cur,{date:d,amount:a}]; const nf={...form,advanceList:updated}; if(type==='kisan'){ nf.pooraRashi=calcKisanTotal(nf); } else if(type==='mechanic'){ nf.pooraRashi=calcMechanicTotal(nf); } else { nf.totalRashi=calcTotalRashi(nf,type); } setForm(nf); setAdvDate(''); setAdvAmt(''); };
  const removeAdvanceEntry=(idx:number)=>{ const cur=getAdvanceList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); const nf={...form,advanceList:updated}; if(type==='kisan'){ nf.pooraRashi=calcKisanTotal(nf); } else if(type==='mechanic'){ nf.pooraRashi=calcMechanicTotal(nf); } else { nf.totalRashi=calcTotalRashi(nf,type); } setForm(nf); };
  const addFasalEntry=()=>{ const d=fasalDate.trim(); const sm=fasalSamay.trim(); const ek=fasalEkad.trim(); const gh=fasalGhanta.trim(); if(!d){alert('फसल कटाई की तारीख लिखें');return;} if(!sm){alert('समय लिखें');return;} if(!ek){alert('एकड़ लिखें');return;} if(!gh){alert('घंटा लिखें');return;} const cur=getFasalList(form); const updated=[...cur,{date:d,samay:sm,ekad:ek,ghanta:gh}]; setForm({...form,fasalList:updated}); setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta(''); };
  const removeFasalEntry=(idx:number)=>{ const cur=getFasalList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); setForm({...form,fasalList:updated}); };
  const addKaryaEntry=()=>{ const d=karyaDate.trim(); const w=karyaWork.trim(); const a=karyaAmt.trim(); if(!d){alert('कार्य की तिथि लिखें');return;} if(!w){alert('कार्य लिखें');return;} if(!a){alert('राशि लिखें');return;} const cur=getKaryaList(form); const updated=[...cur,{date:d,work:w,amount:a}]; setForm({...form,karyaList:updated}); setKaryaDate(''); setKaryaWork(''); setKaryaAmt(''); };
  const removeKaryaEntry=(idx:number)=>{ const cur=getKaryaList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); setForm({...form,karyaList:updated}); };
  const save=()=>{ const id=editId||Date.now().toString(); const data=Object.assign({},form,{id}); if((type==='operator'||type==='helper')){ const dates=getUpasthitiDates(data); data.upasthitiDates=dates; data.upasthiti=dates.join(', '); data.totalKaryadivas=String(dates.length); data.advanceList=getAdvanceList(data); data.totalRashi=calcTotalRashi(data,type); } if(type==='kisan'){ data.advanceList=getAdvanceList(data); data.fasalList=getFasalList(data); if(data.fasalList.length>0){ const last=data.fasalList[data.fasalList.length-1]; data.kataiTarikh=last.date||''; data.samay=last.samay||''; data.ekad=last.ekad||''; } data.totalGhanta=getFasalGhantaTotal(data); data.pooraRashi=calcKisanTotal(data); } if(type==='mechanic'){ data.advanceList=getAdvanceList(data); data.karyaList=getKaryaList(data); data.pooraRashi=calcMechanicTotal(data); } if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='mechanic') setMechanics(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); setShow(false); };
  const getFullList=()=>{ if(type==='members') return members; else if(type==='kisan') return kisans; else if(type==='agent') return agents; else if(type==='operator') return operators; else if(type==='helper') return helpers; else if(type==='dealer') return dealers; else if(type==='parts') return parts; else if(type==='mechanic') return mechanics; else return notices; };
  const getList=()=>{
    const l=getFullList();
    if(!search || search.trim()==='') return l;
    const qRaw=search.trim(); const q=qRaw.toLowerCase(); const isNumeric=/^[0-9]+$/.test(qRaw);
    return l.filter(it=>{
      const monoFields=[it.harvesterNumber||'', it.gadiSankhya||''].join(' ').toLowerCase();
      const mobileField=String(it.mobile||'').toLowerCase();
      const nameField=String(it.name||it.vishay||'').toLowerCase();
      const otherFields=[it.pata||'',it.block||'',it.jila||'',it.pad||'',it.company||'',it.model||''].join(' ').toLowerCase();
      if(isNumeric){ if(monoFields.includes(q)) return true; if(mobileField.includes(q)) return true; if(nameField.includes(q)) return true; if(otherFields.includes(q)) return true; return false; }
      const all=Object.values(it).join(' ').toLowerCase(); return all.includes(q);
    });
  };
  const confirmDelete=()=>{
    if(!deleteItem) return; const it=deleteItem;
    if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id));
    if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id));
    if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id));
    if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id));
    if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id));
    if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id));
    if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id));
    if(type==='mechanic') setMechanics(p=>p.filter(x=>x.id!==it.id));
    if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id));
    setDeleteItem(null);
  };
  const openExpForm=(item:any)=>{ setExpEditId(item?item.id:null); setExpForm(item?{vivaran:item.vivaran,tarikh:item.tarikh,rashi:String(item.rashi)}:{vivaran:'',tarikh:'',rashi:''}); setExpShow(true); };
  const saveExpense=()=>{ if(!expForm.vivaran.trim()){alert('विवरण लिखें');return;} if(!expForm.rashi.trim()){alert('राशि लिखें');return;} const id=expEditId||Date.now().toString(); const data={id,vivaran:expForm.vivaran,tarikh:expForm.tarikh,rashi:expForm.rashi}; setExpenses(p=>expEditId?p.map(x=>x.id===expEditId?data:x):[data,...p]); setExpShow(false); };
  const getDueList=()=>{
    const arr:any[]=[];
    kisans.forEach(it=>{ const b=parseFloat(it.bachatRashi||'0')||0; if(b>0) arr.push({cat:'किसान',name:it.name,mobile:it.mobile,total:it.pooraRashi||calcKisanTotal(it),advance:getAdvanceTotal(it,'kisan'),due:b,id:it.id}); });
    mechanics.forEach(it=>{ const b=parseFloat(it.bachatRashi||'0')||0; if(b>0) arr.push({cat:'मैकेनिक',name:it.name,mobile:it.mobile,total:it.pooraRashi||calcMechanicTotal(it),advance:getAdvanceTotal(it,'mechanic'),due:b,id:it.id}); });
    operators.forEach(it=>{ const b=parseFloat(it.bachatRashi||'0')||0; if(b>0) arr.push({cat:'ऑपरेटर',name:it.name,mobile:it.mobile,total:it.totalRashi||calcTotalRashi(it,'operator'),advance:getAdvanceTotal(it,'operator'),due:b,id:it.id}); });
    helpers.forEach(it=>{ const b=parseFloat(it.bachatRashi||'0')||0; if(b>0) arr.push({cat:'हेल्पर',name:it.name,mobile:it.mobile,total:it.totalRashi||calcTotalRashi(it,'helper'),advance:getAdvanceTotal(it,'helper'),due:b,id:it.id}); });
    agents.forEach(it=>{ const b=parseFloat(it.bachatRashi||'0')||0; if(b>0) arr.push({cat:'एजेंट',name:it.name,mobile:it.mobile,total:it.pooraRashi||'0',advance:getAdvanceTotal(it,'agent'),due:b,id:it.id}); });
    return arr;
  };
  const getFormKeys=()=>{ return Object.keys(form).filter(k=>{ if(k==='id') return false; if(BOTTOM_KEYS.includes(k)) return false; if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false; if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false; if(type==='mechanic' && MECHANIC_BOTTOM.includes(k)) return false; return true; }); };
  const getDetailKeys=()=>{ return Object.keys((FULL as any)[type]||{}).filter(k=>{ if(k==='id') return false; if(BOTTOM_KEYS.includes(k)) return false; if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false; if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false; if(type==='mechanic' && MECHANIC_BOTTOM.includes(k)) return false; return true; }); };

  if(splash){ return(<View style={s.splash}><Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" /><View style={s.loadBox}><Text style={s.loadText}>लोड हो रहा है... {progress}%</Text><View style={s.barBg}><View style={[s.barFill,{width:progress+'%'}]} /></View><Text style={s.loadSub}>{progress} / 100</Text></View></View>); }
  if(!isLogin){ return(<SafeAreaView style={s.loginSafe}><ScrollView contentContainerStyle={s.loginScroll} showsVerticalScrollIndicator={false}><View style={s.welcomeHeader}><Text style={s.welcomeTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ{'\n'}जिला कांकेर (छत्तीसगढ़) में आपका स्वागत है</Text><Text style={s.welcomeSub}>हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच,{'\n'}शासकीय मान्यता प्राप्त सहकारी संस्था</Text></View><View style={s.loginBox}><Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" /><Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text><TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" /><TouchableOpacity style={s.loginBtn} onPress={()=>{ if(pass==='2022'){ setIsLogin(true); AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); }}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity></View></ScrollView></SafeAreaView>); }

  const totalCount=getFullList().length; const filteredList=getList(); const menuTitle=ALL_MENU.find(m=>m.key===type)?.title;
  const expTotal=expenses.reduce((s,e)=>s+(parseFloat(e.rashi)||0),0); const dueList=getDueList(); const dueTotal=dueList.reduce((s,e)=>s+e.due,0);
  const renderBottomNav=()=>(
    <View style={s.bottomNav}>
      <TouchableOpacity style={[s.navBtn,bottomTab==='home'&&s.navActive]} onPress={()=>{setBottomTab('home');setView('home');}}><Text style={s.navIcon}>🏠</Text><Text style={[s.navTxt,bottomTab==='home'&&s.navTxtActive]}>होम</Text></TouchableOpacity>
      <TouchableOpacity style={[s.navBtn,bottomTab==='expense'&&s.navActive]} onPress={()=>{setBottomTab('expense');setView('home');}}><Text style={s.navIcon}>💸</Text><Text style={[s.navTxt,bottomTab==='expense'&&s.navTxtActive]}>खर्च</Text></TouchableOpacity>
      <TouchableOpacity style={[s.navBtn,bottomTab==='due'&&s.navActive]} onPress={()=>{setBottomTab('due');setView('home');}}><Text style={s.navIcon}>📋</Text><Text style={[s.navTxt,bottomTab==='due'&&s.navTxtActive]}>देय राशि</Text></TouchableOpacity>
      <TouchableOpacity style={[s.navBtn,bottomTab==='settings'&&s.navActive]} onPress={()=>{setBottomTab('settings');setView('home');}}><Text style={s.navIcon}>⚙️</Text><Text style={[s.navTxt,bottomTab==='settings'&&s.navTxtActive]}>सेटिंग</Text></TouchableOpacity>
    </View>
  );

  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}><Text style={{fontSize:32}}>🌾</Text><View style={{flex:1,alignItems:'center',paddingHorizontal:6}}><Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text><View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View></View><Text style={{fontSize:32}}>🚜</Text></View></View>
      {bottomTab==='home' && view==='home' && <ScrollView style={{flex:1}}><View style={{padding:12,paddingBottom:90}}>{HOME_MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ setType(i.key); setView(i.key); setSearch(''); }}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>}
      {bottomTab==='expense' && (
        <View style={{flex:1}}>
          <View style={{backgroundColor:'#FFEBEE',margin:10,padding:12,borderRadius:10,borderWidth:2,borderColor:'#D32F2F'}}><Text style={{fontWeight:'900',fontSize:16,color:'#B71C1C',textAlign:'center'}}>💸 कुल खर्च: ₹{expTotal}</Text></View>
          <ScrollView style={{flex:1}}><View style={{padding:10,paddingBottom:90}}>{expenses.map(it=>(<View key={it.id} style={s.card}><Text style={{fontWeight:'bold',fontSize:15}}>{it.vivaran}</Text><Text style={{color:'#666',marginTop:4}}>तारीख: {it.tarikh||'-'} | राशि: ₹{it.rashi}</Text><View style={{flexDirection:'row',marginTop:8}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openExpForm(it)}><Text style={s.smT}>✏️ एडिट</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>setExpenses(p=>p.filter(x=>x.id!==it.id))}><Text style={s.smT}>🗑️ हटाएं</Text></TouchableOpacity></View></View>))}</View></ScrollView>
          <TouchableOpacity style={s.fab} onPress={()=>openExpForm(null)}><Text style={s.fabT}>+</Text></TouchableOpacity>
        </View>
      )}
      {bottomTab==='due' && (
        <View style={{flex:1}}>
          <View style={{backgroundColor:'#E8F5E9',margin:10,padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}><Text style={{fontWeight:'900',fontSize:16,color:'#1B5E20',textAlign:'center'}}>📋 कुल देय राशि: ₹{dueTotal}</Text><Text style={{textAlign:'center',color:'#666',marginTop:4}}>कुल व्यक्ति: {dueList.length}</Text></View>
          <ScrollView style={{flex:1}}><View style={{padding:10,paddingBottom:90}}>{dueList.map(it=>(<View key={it.cat+it.id} style={s.card}><Text style={{fontWeight:'bold',fontSize:15,color:'#0D47A1'}}>{it.name} <Text style={{fontSize:12,color:'#fff',backgroundColor:'#795548'}}> {it.cat} </Text></Text><Text style={{marginTop:4}}>{it.mobile||''}</Text><Text style={{marginTop:4,fontWeight:'bold'}}>टोटल: ₹{it.total} | एडवांस: ₹{it.advance}</Text><Text style={{marginTop:4,fontWeight:'900',color:'#D32F2F',fontSize:16}}>देय: ₹{it.due}</Text></View>))}{dueList.length===0?<Text style={{textAlign:'center',color:'#888',marginTop:20}}>कोई देय राशि नहीं है</Text>:null}</View></ScrollView>
        </View>
      )}
      {bottomTab==='settings' && view==='home' && (
        <ScrollView style={{flex:1}}><View style={{padding:12,paddingBottom:90}}><Text style={{fontWeight:'900',fontSize:16,textAlign:'center',marginBottom:10,color:'#333'}}>⚙️ सेटिंग</Text>{SETTING_MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ if(i.key==='logout'){ setView('logout'); } else { setType(i.key); setView(i.key); setSearch(''); } }}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>
      )}
      {bottomTab==='home' && view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{menuTitle} ({filteredList.length})</Text><Text></Text></View>
      <View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder='सर्च करें' /></View>
      {type==='members' && (<TouchableOpacity style={{backgroundColor:'#1B5E20',margin:8,padding:14,borderRadius:10,alignItems:'center'}} onPress={importMasterData}><Text style={{color:'#fff',fontWeight:'900'}}>📥 मास्टर डेटा से सदस्य जोड़ें</Text></TouchableOpacity>)}
      <ScrollView style={{marginBottom:70}}>{filteredList.map(it=>(<TouchableOpacity key={it.id} activeOpacity={0.8} onPress={()=>setDetailItem(it)}><View style={s.card}><Text style={{fontWeight:'bold',fontSize:16,color:'#0D47A1'}}>{it.name||it.vishay} 👁️</Text><Text>{it.mobile||''} {it.pata||''}</Text><View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}>{it.mobile?<><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${it.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${it.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity></>:null}<TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>setDeleteItem(it)}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity></View></View></TouchableOpacity>))}</ScrollView><TouchableOpacity style={[s.fab,{bottom:80}]} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}
      {renderBottomNav()}
      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}><Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{menuTitle} फॉर्म</Text>{getFormKeys().map(k=>(<View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{(HINDI as any)[type]?.[k]||k}</Text><TextInput style={s.inp} value={form[k]} onChangeText={t=>setForm({...form,[k]:t})} /></View>))}</ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={!!deleteItem} transparent={true} animationType="fade"><View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}}><View style={{backgroundColor:'#fff',borderRadius:14,padding:20,width:'90%',alignItems:'center'}}><Text style={{fontSize:18,fontWeight:'900',color:'#B71C1C'}}>क्या आप सच में हटाना चाहते हैं?</Text><View style={{flexDirection:'row',marginTop:20,width:'100%'}}><TouchableOpacity style={{flex:1,backgroundColor:'#D32F2F',padding:14,borderRadius:10,alignItems:'center',marginRight:8}} onPress={confirmDelete}><Text style={{color:'#fff',fontWeight:'900'}}>हाँ, हटाएं</Text></TouchableOpacity><TouchableOpacity style={{flex:1,backgroundColor:'#2E7D32',padding:14,borderRadius:10,alignItems:'center'}} onPress={()=>setDeleteItem(null)}><Text style={{color:'#fff',fontWeight:'900'}}>नहीं</Text></TouchableOpacity></View></View></View></Modal>
      <Modal visible={!!detailItem} animationType="slide"><SafeAreaView style={s.modal}><ScrollView style={{padding:14}} contentContainerStyle={{paddingBottom:120}}><Text style={{fontWeight:'900',textAlign:'center',fontSize:18,color:'#B71C1C'}}>{menuTitle} - पूरी जानकारी</Text>{detailItem && getDetailKeys().map(k=>(<View key={k} style={s.detailRow}><Text style={s.detailLabel}>{(HINDI as any)[type]?.[k]||k}</Text><Text style={s.detailValue}>{detailItem[k]||'-'}</Text></View>))}</ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setDetailItem(null)}><Text style={s.mBtnT}>वापस जाएं</Text></TouchableOpacity></View></SafeAreaView></Modal>
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
  bottomNav:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:2,borderTopColor:'#FFB300',paddingBottom:8,paddingTop:6,elevation:10},
  navBtn:{flex:1,alignItems:'center',paddingVertical:6,borderRadius:10,marginHorizontal:4},
  navActive:{backgroundColor:'#FFF8E1'},
  navIcon:{fontSize:22},
  navTxt:{fontSize:12,fontWeight:'bold',color:'#666',marginTop:2},
  navTxtActive:{color:'#B71C1C'},
});
