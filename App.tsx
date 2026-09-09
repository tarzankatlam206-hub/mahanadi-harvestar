import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASTER_RAW } from './master_data';
import { HOME_MENU, SETTING_MENU, ALL_MENU, HINDI, FULL, THEME_COLORS, ENG_MENU } from './constants';
import { getUpasthitiDates, getAdvanceList, getFasalList, getKaryaList, getAdvanceTotal, calcTotalRashi, calcKisanTotal, calcMechanicTotal, BOTTOM_KEYS, KISAN_BOTTOM, KISAN_FASAL_KEYS, MECHANIC_BOTTOM } from './helpers';

export default function App(){
  const [view,setView]=useState('home');
  const [bottomTab,setBottomTab]=useState('home');
  const [members,setMembers]=useState<any[]>([]); const [kisans,setKisans]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [helpers,setHelpers]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]); const [mechanics,setMechanics]=useState<any[]>([]); const [notices,setNotices]=useState<any[]>([]);
  const [expenses,setExpenses]=useState<any[]>([]);
  const [form,setForm]=useState<any>({}); const [show,setShow]=useState(false); const [type,setType]=useState('members'); const [editId,setEditId]=useState<string|null>(null);
  const [search,setSearch]=useState(''); const [splash,setSplash]=useState(true); const [progress,setProgress]=useState(0);
  const [isLogin,setIsLogin]=useState(false); const [pass,setPass]=useState(''); const [loaded,setLoaded]=useState(false);
  const [detailItem,setDetailItem]=useState<any|null>(null); const [deleteItem,setDeleteItem]=useState<any|null>(null);
  const [expForm,setExpForm]=useState({vivaran:'',tarikh:'',rashi:''}); const [expShow,setExpShow]=useState(false); const [expEditId,setExpEditId]=useState<string|null>(null);
  const [lang,setLang]=useState('hindi'); const [themeColor,setThemeColor]=useState('#2E7D32'); const [showTheme,setShowTheme]=useState(false);

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
    const l2=await AsyncStorage.getItem('appLang'); if(l2) setLang(l2);
    const th=await AsyncStorage.getItem('themeColor'); if(th) setThemeColor(th);
  }catch(e){} setLoaded(true); })(); },[]);
  useEffect(()=>{ let v=0; const it=setInterval(()=>{ v+=2; if(v>=100){v=100;clearInterval(it); setTimeout(()=>setSplash(false),400);} setProgress(v); },80); return ()=>clearInterval(it); },[]);
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

  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); setBottomTab('home'); };
  const openForm=(t:string,item:any)=>{ setType(t); setEditId(item?item.id:null); const base=(FULL as any)[t]||{}; setForm(item?Object.assign({},JSON.parse(JSON.stringify(base)),item):JSON.parse(JSON.stringify(base))); setShow(true); };
  const save=()=>{ const id=editId||Date.now().toString(); const data=Object.assign({},form,{id}); if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='mechanic') setMechanics(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); setShow(false); };
  const getFullList=()=>{ if(type==='members') return members; else if(type==='kisan') return kisans; else if(type==='agent') return agents; else if(type==='operator') return operators; else if(type==='helper') return helpers; else if(type==='dealer') return dealers; else if(type==='parts') return parts; else if(type==='mechanic') return mechanics; else return notices; };
  const getList=()=>{ const l=getFullList(); if(!search.trim()) return l; const q=search.trim().toLowerCase(); return l.filter(it=>Object.values(it).join(' ').toLowerCase().includes(q)); };
  const confirmDelete=()=>{ if(!deleteItem) return; const it=deleteItem; if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id)); if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id)); if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id)); if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id)); if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id)); if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id)); if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id)); if(type==='mechanic') setMechanics(p=>p.filter(x=>x.id!==it.id)); if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id)); setDeleteItem(null); };
  const getFormKeys=()=>Object.keys(form).filter(k=>k!=='id');
  const getDetailKeys=()=>Object.keys((FULL as any)[type]||{}).filter(k=>k!=='id');
  const t=(hindi:string,eng:string)=> lang==='hindi'? hindi : eng;

  if(splash){ return(<View style={s.splash}><Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" /><View style={s.loadBox}><Text style={s.loadText}>लोड हो रहा है... {progress}%</Text><View style={s.barBg}><View style={[s.barFill,{width:progress+'%'}]} /></View></View></View>); }
  if(!isLogin){ return(<SafeAreaView style={s.loginSafe}><ScrollView contentContainerStyle={s.loginScroll}><View style={s.loginBox}><Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" /><Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text><TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" /><TouchableOpacity style={s.loginBtn} onPress={()=>{ if(pass==='2022'){ setIsLogin(true); AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); }}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity></View></ScrollView></SafeAreaView>); }

  const filteredList=getList(); const menuTitle=t(ALL_MENU.find(m=>m.key===type)?.title||'', (ENG_MENU as any)[type]||type);

  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}><View style={{alignItems:'center'}}><Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text><View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View></View></View>

      {bottomTab==='home' && view==='home' && <ScrollView style={{flex:1}}><View style={{padding:12,paddingBottom:90}}>{HOME_MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:themeColor}]} onPress={()=>{ setType(i.key); setView(i.key); setSearch(''); }}><Text style={s.btnTxt}>{t(i.title,(ENG_MENU as any)[i.key]||i.title)}</Text></TouchableOpacity>)}</View></ScrollView>}

      {bottomTab==='settings' && view==='home' && (
        <ScrollView style={{flex:1}}><View style={{padding:12,paddingBottom:90}}>
          <Text style={{fontWeight:'900',fontSize:16,textAlign:'center',marginBottom:10}}>⚙️ {t('सेटिंग','Settings')}</Text>
          {SETTING_MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={async()=>{
            if(i.key==='logout'){ doLogout(); }
            else if(i.key==='language'){ const nl=lang==='hindi'?'english':'hindi'; setLang(nl); await AsyncStorage.setItem('appLang',nl); }
            else if(i.key==='theme'){ setShowTheme(true); }
            else { setType(i.key); setView(i.key); setSearch(''); setBottomTab('home'); }
          }}><Text style={s.btnTxt}>{t(i.title,(ENG_MENU as any)[i.key]||i.title)}</Text></TouchableOpacity>)}
          <View style={{backgroundColor:'#fff',padding:12,borderRadius:10,marginTop:10}}>
            <Text style={{fontWeight:'bold'}}>{t('ऐप जानकारी','App Info')}</Text>
            <Text style={{color:'#666',marginTop:6}}>{t('भाषा: हिंदी','Language: English')}</Text>
          </View>
        </View></ScrollView>
      )}

      {view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>{ setView('home'); if(type==='notice') setBottomTab('settings'); }}><Text>← {t('वापस','Back')}</Text></TouchableOpacity><Text>{menuTitle} ({filteredList.length})</Text><Text></Text></View>
      <View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder={t('सर्च करें','Search')} /></View>
      <ScrollView style={{marginBottom:70}}>{filteredList.map(it=>(<View key={it.id} style={s.card}><Text style={{fontWeight:'bold',fontSize:16}}>{it.name||it.vishay}</Text><Text>{it.mobile||''}</Text><View style={{flexDirection:'row',marginTop:8}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>✏️ {t('एडिट','Edit')}</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>setDeleteItem(it)}><Text style={s.smT}>🗑️ {t('हटाएं','Delete')}</Text></TouchableOpacity></View></View>))}</ScrollView>
      <TouchableOpacity style={[s.fab,{bottom:80,backgroundColor:themeColor}]} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}

      <View style={s.bottomNav}>
        <TouchableOpacity style={s.navBtn} onPress={()=>{setBottomTab('home');setView('home');}}><Text style={s.navIcon}>🏠</Text><Text style={s.navTxt}>{t('होम','Home')}</Text></TouchableOpacity>
        <TouchableOpacity style={s.navBtn} onPress={()=>{setBottomTab('settings');setView('home');}}><Text style={s.navIcon}>⚙️</Text><Text style={s.navTxt}>{t('सेटिंग','Settings')}</Text></TouchableOpacity>
      </View>

      <Modal visible={showTheme} transparent={true} animationType="fade"><View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}}><View style={{backgroundColor:'#fff',borderRadius:14,padding:20,width:'90%'}}><Text style={{fontWeight:'900',textAlign:'center',marginBottom:12}}>🎨 {t('कलर चुनें','Choose Color')}</Text><View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>{THEME_COLORS.map(c=><TouchableOpacity key={c} onPress={async()=>{ setThemeColor(c); await AsyncStorage.setItem('themeColor',c); setShowTheme(false); }} style={{width:50,height:50,borderRadius:25,backgroundColor:c,margin:8,borderWidth:themeColor===c?3:0,borderColor:'#000'}} />)}</View><TouchableOpacity style={{backgroundColor:'#888',padding:12,borderRadius:8,marginTop:12,alignItems:'center'}} onPress={()=>setShowTheme(false)}><Text style={{color:'#fff',fontWeight:'bold'}}>{t('बंद करें','Close')}</Text></TouchableOpacity></View></View></Modal>

      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}}><Text style={{fontWeight:'bold',textAlign:'center'}}>{menuTitle} {t('फॉर्म','Form')}</Text>{getFormKeys().map(k=>(<View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{(HINDI as any)[type]?.[k]||k}</Text><TextInput style={s.inp} value={String(form[k]??'')} onChangeText={tt=>setForm({...form,[k]:tt})} /></View>))}</ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>{t('वापस','Back')}</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>{t('सुरक्षित करें','Save')}</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={!!deleteItem} transparent={true} animationType="fade"><View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}}><View style={{backgroundColor:'#fff',borderRadius:14,padding:20,width:'90%',alignItems:'center'}}><Text style={{fontWeight:'900'}}>{t('हटाना चाहते हैं?','Delete?')}</Text><View style={{flexDirection:'row',marginTop:20}}><TouchableOpacity style={{flex:1,backgroundColor:'#D32F2F',padding:14,borderRadius:10,marginRight:8,alignItems:'center'}} onPress={confirmDelete}><Text style={{color:'#fff',fontWeight:'900'}}>{t('हाँ','Yes')}</Text></TouchableOpacity><TouchableOpacity style={{flex:1,backgroundColor:'#2E7D32',padding:14,borderRadius:10,alignItems:'center'}} onPress={()=>setDeleteItem(null)}><Text style={{color:'#fff',fontWeight:'900'}}>{t('नहीं','No')}</Text></TouchableOpacity></View></View></View></Modal>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  headColorful:{backgroundColor:'#FFF8E1',margin:10,padding:14,borderRadius:16,borderWidth:2,borderColor:'#FFB300'},
  headTitle1:{fontWeight:'900',fontSize:17,color:'#B71C1C',textAlign:'center'},
  headTitle2:{fontWeight:'800',fontSize:14,color:'#0D47A1',marginTop:5,textAlign:'center'},
  regBox:{backgroundColor:'#1B5E20',paddingHorizontal:12,paddingVertical:3,borderRadius:20,marginTop:6,alignSelf:'center'},
  headTitle3:{fontWeight:'900',fontSize:11,color:'#FFEB3B'},
  btn:{padding:16,borderRadius:12,marginBottom:10,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'bold'},
  sub:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:'#fff'},
  search:{flexDirection:'row',backgroundColor:'#fff',margin:8,paddingHorizontal:10,borderRadius:8,alignItems:'center',borderWidth:1,borderColor:'#FF9800'},
  card:{backgroundColor:'#fff',margin:8,padding:12,borderRadius:8},
  sm:{paddingHorizontal:14,paddingVertical:8,borderRadius:8,marginRight:8},
  smT:{color:'#fff',fontSize:13,fontWeight:'bold'},
  fab:{position:'absolute',right:16,bottom:16,width:56,height:56,borderRadius:28,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'},
  fabT:{color:'#fff',fontSize:28},
  inp:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginTop:4},
  mBtn:{flex:1,padding:12,borderRadius:8,alignItems:'center',marginRight:6},
  mBtnT:{color:'#fff',fontWeight:'bold'},
  modal:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  modalBottom:{flexDirection:'row',padding:12,backgroundColor:'#fff'},
  splash:{flex:1,backgroundColor:'#000',justifyContent:'flex-end'},
  splashImage:{position:'absolute',width:'100%',height:'100%'},
  loadBox:{width:'100%',padding:30,alignItems:'center',backgroundColor:'rgba(0,0,0,0.55)'},
  loadText:{color:'#fff',fontSize:18,fontWeight:'bold',marginBottom:10},
  barBg:{width:'100%',height:12,backgroundColor:'rgba(255,255,255,0.3)',borderRadius:6,overflow:'hidden'},
  barFill:{height:'100%',backgroundColor:'#4CAF50'},
  loginSafe:{flex:1,backgroundColor:'#FFF3E0',justifyContent:'center'},
  loginScroll:{flexGrow:1,justifyContent:'center',alignItems:'center',padding:20},
  loginBox:{width:'90%',backgroundColor:'#fff',padding:25,borderRadius:15,alignItems:'center'},
  loginLogo:{width:120,height:120,marginBottom:10},
  sloganText:{fontWeight:'900',fontSize:14,color:'#1B5E20',marginBottom:4},
  loginInput:{width:'100%',borderWidth:1,borderColor:'#FF9800',borderRadius:8,padding:12,marginTop:20,textAlign:'center',fontSize:18},
  loginBtn:{width:'100%',backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:15,alignItems:'center'},
  loginBtnT:{color:'#fff',fontWeight:'bold',fontSize:16},
  bottomNav:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:2,borderTopColor:'#FFB300',padding:6},
  navBtn:{flex:1,alignItems:'center',paddingVertical:6},
  navIcon:{fontSize:22},
  navTxt:{fontSize:12,fontWeight:'bold',color:'#666'},
});
