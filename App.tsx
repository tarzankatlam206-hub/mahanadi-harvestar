import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const HINDI = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',bhugtanTarikh:'भुगतान की तारीख',bhugtanMadhyam:'भुगतान माध्यम',rashiPraptakarta:'राशि प्राप्तकर्ता',gadiSankhya:'गाड़ी संख्या',company:'कंपनी',model:'मॉडल',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',ekad:'एकड़',kataiTarikh:'फसल कटाई की तारीख',samay:'समय',totalGhanta:'टोटल घंटा/समय',totalKaryadivas:'टोटल कार्यदिवस',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',agreement:'एग्रीमेंट',check:'चेक',karyadivas:'कार्यदिवस',totalGhanta:'टोटल घंटा/समय',advanceRashi:'एडवांस राशि प्राप्त',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि प्राप्त',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',totalKaryadivas:'टोटल कार्यदिवस',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',advance:'एडवांस राशि',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि',dailyMajduri:'प्रतिदिन मजदूरी राशि',upasthiti:'उपस्थिति तिथियां',anyaJankari:'अन्य जानकारी'},
 helper: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',totalKaryadivas:'टोटल कार्यदिवस',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि',dailyMajduri:'प्रतिदिन मजदूरी राशि',upasthiti:'उपस्थिति तिथियां',anyaJankari:'अन्य जानकारी'},
 dealer: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',company:'कंपनी',showroomPata:'शोरूम पता',serviceCenter:'सर्विस सेंटर',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',dukaanNaam:'दुकान का नाम',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',partsPrakar:'पार्ट्स प्रकार',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',anyaJankari:'अन्य जानकारी'}
};
const FULL = {
 members: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',pad:'सदस्य',harvesterNumber:'',sadasyataShulk:'500',bhugtanTarikh:'',bhugtanMadhyam:'नकद',rashiPraptakarta:'',gadiSankhya:'',company:'',model:'',anyaJankari:''},
 kisan: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',fasal:'धान',ekad:'',kataiTarikh:'',samay:'',totalGhanta:'',totalKaryadivas:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:''},
 agent: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',agreement:'',check:'',karyadivas:'',totalGhanta:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:''},
 operator: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',totalKaryadivas:'',karyPrarambhTithi:'',karySamaptiTithi:'',advance:'',bachatRashi:'',totalRashi:'',dailyMajduri:'',upasthiti:'',anyaJankari:''},
 helper: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',totalKaryadivas:'',karyPrarambhTithi:'',karySamaptiTithi:'',advanceRashi:'',bachatRashi:'',totalRashi:'',dailyMajduri:'',upasthiti:'',anyaJankari:''},
 dealer: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',company:'',showroomPata:'',serviceCenter:'',anyaJankari:''},
 parts: {name:'',dukaanNaam:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',partsPrakar:'',anyaJankari:''},
 notice: {vishay:'',tarikh:'',vivaran:'',anyaJankari:''}
};

export default function App(){
  const [view,setView]=useState('home');
  const [members,setMembers]=useState([]); const [kisans,setKisans]=useState([]); const [agents,setAgents]=useState([]); const [operators,setOperators]=useState([]); const [helpers,setHelpers]=useState([]); const [dealers,setDealers]=useState([]); const [parts,setParts]=useState([]); const [notices,setNotices]=useState([]);
  const [form,setForm]=useState({}); const [show,setShow]=useState(false); const [type,setType]=useState('members'); const [editId,setEditId]=useState(null);
  const [search,setSearch]=useState(''); const [splash,setSplash]=useState(true);
  const [isLogin,setIsLogin]=useState(false); const [pass,setPass]=useState('');

  useEffect(()=>{
    (async()=>{
      try{
        const m=await AsyncStorage.getItem('members'); if(m) setMembers(JSON.parse(m));
        const k=await AsyncStorage.getItem('kisans'); if(k) setKisans(JSON.parse(k));
        const a=await AsyncStorage.getItem('agents'); if(a) setAgents(JSON.parse(a));
        const o=await AsyncStorage.getItem('operators'); if(o) setOperators(JSON.parse(o));
        const h=await AsyncStorage.getItem('helpers'); if(h) setHelpers(JSON.parse(h));
        const d=await AsyncStorage.getItem('dealers'); if(d) setDealers(JSON.parse(d));
        const p=await AsyncStorage.getItem('parts'); if(p) setParts(JSON.parse(p));
        const n=await AsyncStorage.getItem('notices'); if(n) setNotices(JSON.parse(n));
        const lg=await AsyncStorage.getItem('isLogin'); if(lg==='yes') setIsLogin(true);
      }catch(e){}
    })();
    const t=setTimeout(()=>setSplash(false),2500); return ()=>clearTimeout(t);
  },[]);

  useEffect(()=>{ AsyncStorage.setItem('members',JSON.stringify(members)); },[members]);
  useEffect(()=>{ AsyncStorage.setItem('kisans',JSON.stringify(kisans)); },[kisans]);
  useEffect(()=>{ AsyncStorage.setItem('agents',JSON.stringify(agents)); },[agents]);
  useEffect(()=>{ AsyncStorage.setItem('operators',JSON.stringify(operators)); },[operators]);
  useEffect(()=>{ AsyncStorage.setItem('helpers',JSON.stringify(helpers)); },[helpers]);
  useEffect(()=>{ AsyncStorage.setItem('dealers',JSON.stringify(dealers)); },[dealers]);
  useEffect(()=>{ AsyncStorage.setItem('parts',JSON.stringify(parts)); },[parts]);
  useEffect(()=>{ AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices]);

  const doLogin=async()=>{ if(pass==='2022'){ setIsLogin(true); await AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); };
  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); };
  const openForm=(t,item)=>{ setType(t); setEditId(item?item.id:null); const base=FULL[t]||{}; setForm(item?Object.assign({},base,item):base); setShow(true); };
  const save=()=>{ const id=editId||Date.now().toString(); const data=Object.assign({},form,{id}); if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); setShow(false); };
  const getList=()=>{ let l=[]; if(type==='members') l=members; else if(type==='kisan') l=kisans; else if(type==='agent') l=agents; else if(type==='operator') l=operators; else if(type==='helper') l=helpers; else if(type==='dealer') l=dealers; else if(type==='parts') l=parts; else l=notices; if(search){ const q=search.toLowerCase(); return l.filter(it=>Object.values(it).join(' ').toLowerCase().includes(q)); } return l; };

  if(splash){ return(<View style={s.splash}><Text style={{fontSize:60}}>🚜</Text><Text style={s.splashT}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={{color:'#fff',marginTop:10}}>लोड हो रहा है...</Text></View>); }
  if(!isLogin){
    return(
      <SafeAreaView style={s.loginSafe}>
        <View style={s.loginBox}>
          <Text style={{fontSize:50}}>🚜</Text>
          <Text style={s.loginTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
          <TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" />
          <TouchableOpacity style={s.loginBtn} onPress={doLogin}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
          <Text style={{fontSize:32}}>🌾</Text>
          <View style={{flex:1,alignItems:'center',paddingHorizontal:6}}>
            <Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
            <Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text>
            <View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View>
          </View>
          <Text style={{fontSize:32}}>🚜</Text>
        </View>
      </View>
      {view==='home' && <ScrollView><View style={{padding:12}}>{MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ if(i.key==='logout') setView('logout'); else { setType(i.key); setView(i.key); }}}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>}
      {view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{MENU.find(m=>m.key===type)?.title} ({getList().length})</Text><Text></Text></View><View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder='सर्च करें' /></View><ScrollView>{getList().map(it=><View key={it.id} style={s.card}><Text style={{fontWeight:'bold'}}>{it.name||it.vishay}</Text><Text>{it.mobile||''} {it.pata||''}</Text><View style={{flexDirection:'row',marginTop:6}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>{ if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id)); if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id)); if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id)); if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id)); if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id)); if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id)); if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id)); if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id)); }}><Text style={s.smT}>हटाएं</Text></TouchableOpacity></View></View>)}</ScrollView><TouchableOpacity style={s.fab} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}
      {view==='logout' && <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><View style={[s.card,{width:'90%',alignItems:'center',padding:25}]}><Text style={{fontSize:20,fontWeight:'bold'}}>लॉग आउट करें?</Text><Text style={{color:'#666',marginTop:6,textAlign:'center'}}>डाटा डिलीट नहीं होगा</Text><TouchableOpacity style={[s.mBtn,{backgroundColor:'#212121',width:'100%',marginTop:15}]} onPress={doLogout}><Text style={s.mBtnT}>हाँ, लॉग आउट</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'#4CAF50',width:'100%',marginTop:10}]} onPress={()=>setView('home')}><Text style={s.mBtnT}>नहीं</Text></TouchableOpacity></View></View>}
      {/* यहाँ ठीक किया - अब हिंदी में दिखेगा */}
      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}}><Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{MENU.find(m=>m.key===type)?.title} फॉर्म</Text>{Object.keys(form).filter(k=>k!=='id').map(k=><View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{HINDI[type]?.[k]||k}</Text><TextInput style={s.inp} value={form[k]} onChangeText={t=>setForm({...form,[k]:t})} /></View>)}<View style={{flexDirection:'row',marginTop:15}}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity></View></ScrollView></View></Modal>
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
  btn:{padding:16,borderRadius:12,marginBottom:10,alignItems:'center'}, btnTxt:{color:'#fff',fontWeight:'bold'},
  sub:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:'#fff'},
  search:{flexDirection:'row',backgroundColor:'#fff',margin:8,paddingHorizontal:10,borderRadius:8,alignItems:'center',borderWidth:1,borderColor:'#FF9800'},
  card:{backgroundColor:'#fff',margin:8,padding:12,borderRadius:8},
  sm:{paddingHorizontal:10,paddingVertical:5,borderRadius:6,marginRight:8}, smT:{color:'#fff',fontSize:12},
  fab:{position:'absolute',right:16,bottom:16,width:56,height:56,borderRadius:28,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'}, fabT:{color:'#fff',fontSize:28},
  inp:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginTop:4},
  mBtn:{flex:1,padding:12,borderRadius:8,alignItems:'center',marginRight:6}, mBtnT:{color:'#fff',fontWeight:'bold'},
  modal:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  splash:{flex:1,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'}, splashT:{color:'#fff',fontWeight:'900',fontSize:18,marginTop:10,textAlign:'center'},
  loginSafe:{flex:1,backgroundColor:'#FFF3E0',justifyContent:'center',alignItems:'center'},
  loginBox:{width:'85%',backgroundColor:'#fff',padding:25,borderRadius:15,alignItems:'center',borderWidth:2,borderColor:'#FF9800'},
  loginTitle:{fontWeight:'900',fontSize:16,color:'#B71C1C',textAlign:'center',marginTop:10},
  loginInput:{width:'100%',borderWidth:1,borderColor:'#FF9800',borderRadius:8,padding:12,marginTop:20,textAlign:'center',fontSize:18},
  loginBtn:{width:'100%',backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:15,alignItems:'center'},
  loginBtnT:{color:'#fff',fontWeight:'bold',fontSize:16},
});
