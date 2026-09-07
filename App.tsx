import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image } from 'react-native';
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
const HINDI: any = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',bhugtanTarikh:'भुगतान की तारीख',bhugtanMadhyam:'भुगतान माध्यम',rashiPraptakarta:'राशि प्राप्तकर्ता',gadiSankhya:'गाड़ी संख्या',company:'कंपनी',model:'मॉडल',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',ekad:'एकड़',kataiTarikh:'फसल कटाई की तारीख',samay:'समय',totalGhanta:'टोटल घंटा/समय',totalKaryadivas:'टोटल कार्यदिवस',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',agreement:'एग्रीमेंट',check:'चेक',karyadivas:'कार्यदिवस',totalGhanta:'टोटल घंटा/समय',advanceRashi:'एडवांस राशि प्राप्त',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि प्राप्त',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',totalKaryadivas:'टोटल कार्यदिवस',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',advance:'एडवांस राशि',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि',dailyMajduri:'प्रतिदिन मजदूरी राशि',upasthiti:'उपस्थिति तिथियां',anyaJankari:'अन्य जानकारी'},
 helper: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',totalKaryadivas:'टोटल कार्यदिवस',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि',dailyMajduri:'प्रतिदिन मजदूरी राशि',upasthiti:'उपस्थिति तिथियां',anyaJankari:'अन्य जानकारी'},
 dealer: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',company:'कंपनी',showroomPata:'शोरूम पता',serviceCenter:'सर्विस सेंटर',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',dukaanNaam:'दुकान का नाम',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',partsPrakar:'पार्ट्स प्रकार',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',mobile:'मोबाइल नंबर',anyaJankari:'अन्य जानकारी'}
};
const FULL: any = {
 members: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',pad:'सदस्य',harvesterNumber:'',sadasyataShulk:'500',bhugtanTarikh:'',bhugtanMadhyam:'नकद',rashiPraptakarta:'',gadiSankhya:'',company:'',model:'',anyaJankari:''},
 kisan: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',fasal:'धान',ekad:'',kataiTarikh:'',samay:'',totalGhanta:'',totalKaryadivas:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:''},
 agent: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',agreement:'',check:'',karyadivas:'',totalGhanta:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:''},
 operator: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',totalKaryadivas:'',karyPrarambhTithi:'',karySamaptiTithi:'',advance:'',bachatRashi:'',totalRashi:'',dailyMajduri:'',upasthiti:'',anyaJankari:''},
 helper: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',totalKaryadivas:'',karyPrarambhTithi:'',karySamaptiTithi:'',advanceRashi:'',bachatRashi:'',totalRashi:'',dailyMajduri:'',upasthiti:'',anyaJankari:''},
 dealer: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',company:'',showroomPata:'',serviceCenter:'',anyaJankari:''},
 parts: {name:'',dukaanNaam:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',partsPrakar:'',anyaJankari:''},
 notice: {vishay:'',tarikh:'',vivaran:'',mobile:'',anyaJankari:''}
};

export default function App(){
  const [view,setView]=useState('home');
  const [members,setMembers]=useState<any[]>([]); const [kisans,setKisans]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [helpers,setHelpers]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]); const [notices,setNotices]=useState<any[]>([]);
  const [form,setForm]=useState<any>({}); const [show,setShow]=useState(false); const [type,setType]=useState('members'); const [editId,setEditId]=useState<string|null>(null);
  const [search,setSearch]=useState(''); const [splash,setSplash]=useState(true);
  const [progress,setProgress]=useState(0);
  const [isLogin,setIsLogin]=useState(false); const [pass,setPass]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [detailItem,setDetailItem]=useState<any|null>(null);

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
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{
    let val=0;
    const interval=setInterval(()=>{
      val+=1;
      if(val>=100){ val=100; clearInterval(interval); setTimeout(()=>setSplash(false),500); }
      setProgress(val);
    },100);
    return ()=>clearInterval(interval);
  },[]);

  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('members',JSON.stringify(members)); },[members,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('kisans',JSON.stringify(kisans)); },[kisans,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('agents',JSON.stringify(agents)); },[agents,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('operators',JSON.stringify(operators)); },[operators,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('helpers',JSON.stringify(helpers)); },[helpers,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('dealers',JSON.stringify(dealers)); },[dealers,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('parts',JSON.stringify(parts)); },[parts,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices,loaded]);

  useEffect(()=>{
    const onBackPress = () => {
      if (detailItem) { setDetailItem(null); return true; }
      if (show) { setShow(false); return true; }
      if (view!== 'home') { setView('home'); return true; }
      if (isLogin && view === 'home') { AsyncStorage.setItem('isLogin','no'); setIsLogin(false); return true; }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  },[view, show, isLogin, detailItem]);

  const doLogin=async()=>{ if(pass==='2022'){ setIsLogin(true); await AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); };
  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); };
  const openForm=(t:string,item:any)=>{ setType(t); setEditId(item?item.id:null); const base=FULL[t]||{}; setForm(item?Object.assign({},base,item):base); setShow(true); };
  const save=()=>{ const id=editId||Date.now().toString(); const data=Object.assign({},form,{id}); if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); setShow(false); };
  const getList=()=>{ let l:any[]=[]; if(type==='members') l=members; else if(type==='kisan') l=kisans; else if(type==='agent') l=agents; else if(type==='operator') l=operators; else if(type==='helper') l=helpers; else if(type==='dealer') l=dealers; else if(type==='parts') l=parts; else l=notices; if(search){ const q=search.toLowerCase(); return l.filter(it=>Object.values(it).join(' ').toLowerCase().includes(q)); } return l; };

  if(splash){
    return(
      <View style={s.splash}>
        <Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" />
        <View style={s.loadBox}>
          <Text style={s.loadText}>लोड हो रहा है... {progress}%</Text>
          <View style={s.barBg}>
            <View style={[s.barFill,{width: progress + '%'}]} />
          </View>
          <Text style={s.loadSub}>{progress} / 100</Text>
        </View>
      </View>
    );
  }
  if(!isLogin){
    return(
      <SafeAreaView style={s.loginSafe}>
        <ScrollView contentContainerStyle={s.loginScroll} showsVerticalScrollIndicator={false}>
          <View style={s.welcomeHeader}>
            <Text style={s.welcomeTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ{'\n'}जिला कांकेर (छत्तीसगढ़) में आपका स्वागत है</Text>
            <Text style={s.welcomeSub}>हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच,{'\n'}शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
          </View>
          <View style={s.loginBox}>
            <Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" />
            <Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text>
            <TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" />
            <TouchableOpacity style={s.loginBtn} onPress={doLogin}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity>
          </View>
          <View style={s.addressBox}>
            <Text style={s.addressTitle}>जिला कार्यालय</Text>
            <Text style={s.addressText}>पता- लखनपुरी, मेन रोड़, N.H.30,{'\n'}जिला सहकारी बैंक के सामने,{'\n'}ब्लॉक-चारामा, जिला-कांकेर (छत्तीसगढ़)</Text>
            <Text style={s.phoneText}>फोन नम्बर- 9479025929</Text>
            <Text style={s.emailText} numberOfLines={1} ellipsizeMode="tail">ईमेल- mahanadiharvestar2026@gmail.com</Text>
          </View>
        </ScrollView>
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
      {view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{MENU.find(m=>m.key===type)?.title} ({getList().length})</Text><Text></Text></View><View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder='सर्च करें' /></View><ScrollView>{getList().map(it=>
      <TouchableOpacity key={it.id} activeOpacity={0.8} onPress={()=>setDetailItem(it)}>
      <View style={s.card}><Text style={{fontWeight:'bold',fontSize:16,color:'#0D47A1'}}>{it.name||it.vishay} 👁️</Text><Text>{it.mobile||''} {it.pata||''}</Text>
      <Text style={{fontSize:11,color:'#888',marginTop:4}}>पूरी जानकारी देखने के लिए क्लिक करें</Text>
      {it.mobile? (<View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${it.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${it.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${it.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>) : null}
      <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>{ if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id)); if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id)); if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id)); if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id)); if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id)); if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id)); if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id)); if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id)); }}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity></View></View>
      </TouchableOpacity>)}</ScrollView><TouchableOpacity style={s.fab} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}
      {view==='logout' && <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center',padding:15,paddingBottom:80}}><View style={[s.card,{width:'95%',alignItems:'center',padding:20,paddingBottom:30}]}><TouchableOpacity style={{backgroundColor:'#212121',width:'100%',marginTop:10,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={doLogout}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>हाँ, लॉग आउट करें</Text></TouchableOpacity><TouchableOpacity style={{backgroundColor:'#2E7D32',width:'100%',marginTop:20,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={()=>setView('home')}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>नहीं, वापस जाएं</Text></TouchableOpacity></View></ScrollView>}
      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}><Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{MENU.find(m=>m.key===type)?.title} फॉर्म</Text>{Object.keys(form).filter(k=>k!=='id').map(k=><View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{HINDI[type]?.[k]||k}</Text><TextInput style={s.inp} value={form[k]} onChangeText={t=>setForm({...form,[k]:t})} /></View>)}</ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity></View></View></Modal>

      <Modal visible={!!detailItem} animationType="slide" onRequestClose={()=>setDetailItem(null)}>
        <SafeAreaView style={s.modal}>
          <ScrollView style={{padding:14}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',textAlign:'center',fontSize:18,color:'#B71C1C',marginBottom:4}}>{MENU.find(m=>m.key===type)?.title} - पूरी जानकारी</Text>
            <Text style={{textAlign:'center',fontSize:12,color:'#888',marginBottom:12}}>बायोडाटा डिटेल</Text>
            {detailItem && Object.keys(FULL[type]||{}).filter(k=>k!=='id').map(k=>(
              <View key={k} style={s.detailRow}>
                <Text style={s.detailLabel}>{HINDI[type]?.[k]||k}</Text>
                <Text style={s.detailValue}>{detailItem[k]||'-'}</Text>
              </View>
            ))}
            {detailItem?.mobile? (
              <View style={{flexDirection:'row',marginTop:14,flexWrap:'wrap',justifyContent:'center'}}>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${detailItem.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${detailItem.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${detailItem.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
          <View style={s.modalBottom}>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#FF9800'}]} onPress={()=>{ const it=detailItem; setDetailItem(null); if(it) openForm(type,it); }}><Text style={s.mBtnT}>✏️ एडिट करें</Text></TouchableOpacity>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setDetailItem(null)}><Text style={s.mBtnT}>वापस जाएं</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
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
