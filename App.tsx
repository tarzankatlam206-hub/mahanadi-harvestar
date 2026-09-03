import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, Linking, Image } from 'react-native';

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
  const [sel,setSel]=useState(null); const [selType,setSelType]=useState('operator'); const [attShow,setAttShow]=useState(false); const [newDate,setNewDate]=useState('');

  const call=(n)=>{ if(n) Linking.openURL('tel:'+n); };
  const wa=(n)=>{ if(n) Linking.openURL('https://wa.me/91'+n); };
  const sms=(n)=>{ if(n) Linking.openURL('sms:'+n); };
  const today=()=>{ const d=new Date(); return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear(); };

  const openForm=(t,item)=>{
    setType(t); setEditId(item? item.id : null);
    const base = FULL[t] || {};
    setForm(item? Object.assign({}, base, item) : base);
    setShow(true);
  };

  const save=()=>{
    const id = editId? editId : Date.now().toString();
    const data = Object.assign({}, form, {id:id});
    if(type==='members'){ if(editId) setMembers(p=>p.map(x=>x.id===editId?data:x)); else setMembers(p=>[data].concat(p)); }
    if(type==='kisan'){ if(editId) setKisans(p=>p.map(x=>x.id===editId?data:x)); else setKisans(p=>[data].concat(p)); }
    if(type==='agent'){ if(editId) setAgents(p=>p.map(x=>x.id===editId?data:x)); else setAgents(p=>[data].concat(p)); }
    if(type==='operator'){ if(editId) setOperators(p=>p.map(x=>x.id===editId?data:x)); else setOperators(p=>[data].concat(p)); }
    if(type==='helper'){ if(editId) setHelpers(p=>p.map(x=>x.id===editId?data:x)); else setHelpers(p=>[data].concat(p)); }
    if(type==='dealer'){ if(editId) setDealers(p=>p.map(x=>x.id===editId?data:x)); else setDealers(p=>[data].concat(p)); }
    if(type==='parts'){ if(editId) setParts(p=>p.map(x=>x.id===editId?data:x)); else setParts(p=>[data].concat(p)); }
    if(type==='notice'){ if(editId) setNotices(p=>p.map(x=>x.id===editId?data:x)); else setNotices(p=>[data].concat(p)); }
    setShow(false);
  };

  const getList=()=>{
    if(type==='members') return members; if(type==='kisan') return kisans; if(type==='agent') return agents;
    if(type==='operator') return operators; if(type==='helper') return helpers;
    if(type==='dealer') return dealers; if(type==='parts') return parts; return notices;
  };

  const openAtt=(p,t)=>{ setSel(p); setSelType(t); setNewDate(''); setAttShow(true); };
  const addDate=()=>{
    const dt = newDate.trim()? newDate.trim() : today();
    const old = sel && sel.upasthiti? sel.upasthiti : '';
    const neu = old? old + ', ' + dt : dt;
    const upd = Object.assign({}, sel, {upasthiti:neu});
    setSel(upd);
    if(selType==='operator') setOperators(a=>a.map(x=>x.id===sel.id?upd:x));
    else setHelpers(a=>a.map(x=>x.id===sel.id?upd:x));
    setNewDate('');
  };

  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
          <Text style={{fontSize:45}}>🌾</Text>
          <View style={{flex:1,alignItems:'center'}}>
            <Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
            <Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text>
            <Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text>
          </View>
          <Text style={{fontSize:45}}>🚜</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:6,alignItems:'center'}}>
          <Text style={{fontSize:20}}>🚜</Text>
          <Text style={{flex:1,textAlign:'center',color:'#5D4037',fontSize:11,fontWeight:'bold'}}>🌾 जय जवान जय किसान 🌾 धान की कटाई 🌾</Text>
          <Text style={{fontSize:20}}>🌾</Text>
        </View>
      </View>

      {view==='home' && <ScrollView><View style={{padding:12}}>{MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ if(i.key==='logout'){ setView('logout'); } else { setType(i.key); setView(i.key); } }}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>}

      {view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{MENU.find(m=>m.key===type)?.title || type} ({getList().length})</Text><Text></Text></View>
        <ScrollView contentContainerStyle={{paddingBottom:80}}>{getList().map(item=><View key={item.id} style={s.card}>
          <Text style={s.cName}>{item.name? item.name : item.vishay}</Text>
          <Text>{item.mobile? '📱 ' + item.mobile : ''} {item.pata? '| ' + item.pata : ''}</Text>
          {item.upasthiti? <Text>📆 {item.upasthiti}</Text> : null}
          {item.vivaran? <Text>{item.vivaran}</Text> : null}
          <View style={s.row}>
            {item.mobile? <><TouchableOpacity style={[s.b,{backgroundColor:'#4CAF50'}]} onPress={()=>call(item.mobile)}><Text style={s.bt}>कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.b,{backgroundColor:'#25D366'}]} onPress={()=>wa(item.mobile)}><Text style={s.bt}>व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.b,{backgroundColor:'#2196F3'}]} onPress={()=>sms(item.mobile)}><Text style={s.bt}>मैसेज</Text></TouchableOpacity></> : null}
            {type==='notice'? <><TouchableOpacity style={[s.b,{backgroundColor:'#25D366'}]} onPress={()=>{ const msg = (item.vishay||'') + ' - ' + (item.vivaran||''); Linking.openURL('https://wa.me/?text=' + encodeURIComponent(msg)); }}><Text style={s.bt}>व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.b,{backgroundColor:'#2196F3'}]} onPress={()=>{ const msg = (item.vishay||'') + ' - ' + (item.vivaran||''); Linking.openURL('sms:?body=' + encodeURIComponent(msg)); }}><Text style={s.bt}>मैसेज</Text></TouchableOpacity></> : null}
            {(type==='operator' || type==='helper')? <TouchableOpacity style={[s.b,{backgroundColor:'#607D8B'}]} onPress={()=>openAtt(item,type)}><Text style={s.bt}>📅 उपस्थिति</Text></TouchableOpacity> : null}
            <TouchableOpacity style={[s.b,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,item)}><Text style={s.bt}>एडिट</Text></TouchableOpacity>
            <TouchableOpacity style={[s.b,{backgroundColor:'#D32F2F'}]} onPress={()=>{ if(type==='members') setMembers(p=>p.filter(x=>x.id!==item.id)); if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==item.id)); if(type==='agent') setAgents(p=>p.filter(x=>x.id!==item.id)); if(type==='operator') setOperators(p=>p.filter(x=>x.id!==item.id)); if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==item.id)); if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==item.id)); if(type==='parts') setParts(p=>p.filter(x=>x.id!==item.id)); if(type==='notice') setNotices(p=>p.filter(x=>x.id!==item.id)); }}><Text style={s.bt}>🗑️ डिलीट</Text></TouchableOpacity>
          </View>
        </View>)}</ScrollView>
        <TouchableOpacity style={s.fab} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity>
      </View>}

      {view==='logout' && <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:20}}><View style={[s.card,{width:'90%',alignItems:'center',padding:25,borderRadius:15}]}><Text style={{fontSize:40}}>👋</Text><Text style={{fontSize:20,fontWeight:'bold',marginTop:10}}>लॉग आउट</Text><Text style={{textAlign:'center',color:'#666',marginVertical:15}}>क्या आप वाकई लॉग आउट करना चाहते हैं?</Text><TouchableOpacity style={[s.mBtn,{backgroundColor:'#212121',width:'100%',marginTop:10}]} onPress={()=>{ setMembers([]); setKisans([]); setAgents([]); setOperators([]); setHelpers([]); setDealers([]); setParts([]); setNotices([]); setView('home'); }}><Text style={s.mBtnT}>हाँ, लॉग आउट करें</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'#4CAF50',width:'100%',marginTop:10}]} onPress={()=>setView('home')}><Text style={s.mBtnT}>नहीं, होम पर रहें</Text></TouchableOpacity></View></View>}

      <Modal visible={attShow} animationType="slide"><View style={s.modalWrap}><View style={{padding:12}}><Text style={s.mTitle}>उपस्थिति - {sel? sel.name : ''}</Text><View style={{flexDirection:'row',marginTop:10}}><TextInput style={[s.in,{flex:1}]} value={newDate} onChangeText={setNewDate} placeholder="तारीख" /><TouchableOpacity style={[s.mBtn,{backgroundColor:'#4CAF50',marginLeft:8}]} onPress={addDate}><Text style={s.mBtnT}>+ जोड़ें</Text></TouchableOpacity></View><ScrollView style={{marginTop:15}}>{sel && sel.upasthiti? sel.upasthiti.split(',').map(x=>x.trim()).filter(Boolean).map((d,i)=><View key={i} style={{flexDirection:'row',justifyContent:'space-between',padding:12,borderBottomWidth:1,borderColor:'#eee'}}><Text>✅ {d}</Text><TouchableOpacity onPress={()=>{ const arr=(sel.upasthiti||'').split(',').map(x=>x.trim()).filter(Boolean); arr.splice(i,1); const neu=arr.join(', '); const upd=Object.assign({}, sel, {upasthiti:neu}); setSel(upd); if(selType==='operator') setOperators(a=>a.map(x=>x.id===sel.id?upd:x)); else setHelpers(a=>a.map(x=>x.id===sel.id?upd:x)); }}><Text style={{color:'red'}}>हटाएं</Text></TouchableOpacity></View>) : null}</ScrollView><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888',marginTop:20}]} onPress={()=>setAttShow(false)}><Text style={s.mBtnT}>बंद करें</Text></TouchableOpacity></View></View></Modal>

      <Modal visible={show} animationType="slide"><View style={s.modalWrap}><ScrollView style={{padding:12}}><Text style={s.mTitle}>{MENU.find(m=>m.key===type)?.title || type} फॉर्म</Text>
        {Object.keys(form).filter(k=>k!=='id').map(k=><View key={k}><Text style={s.l}>{(HINDI[type] && HINDI[type][k])? HINDI[type][k] : k}</Text><TextInput style={s.in} value={form[k]} onChangeText={t=>setForm(Object.assign({}, form, {[k]:t}))} /></View>)}
        <View style={s.mRow}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सेव</Text></TouchableOpacity></View>
      </ScrollView></View></Modal>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  headColorful:{backgroundColor:'#FFF3E0',margin:12,padding:15,borderRadius:15,alignItems:'center',borderWidth:2,borderColor:'#FF9800'},
  headTitle1:{fontWeight:'900',fontSize:16,color:'#B71C1C',textAlign:'center'},
  headTitle2:{fontWeight:'bold',fontSize:14,color:'#0D47A1',marginTop:4,textAlign:'center'},
  headTitle3:{fontWeight:'bold',fontSize:12,color:'#1B5E20',marginTop:4,textAlign:'center'},
  btn:{padding:16,borderRadius:12,marginBottom:10,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'bold'},
  sub:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:'#fff'},
  card:{backgroundColor:'#fff',margin:8,padding:10,borderRadius:10},
  cName:{fontWeight:'bold'},
  row:{flexDirection:'row',marginTop:6,flexWrap:'wrap'},
  b:{paddingHorizontal:10,paddingVertical:7,borderRadius:6,marginRight:6,marginBottom:6},
  bt:{color:'#fff',fontSize:11,fontWeight:'bold'},
  fab:{position:'absolute',right:16,bottom:16,width:50,height:50,borderRadius:25,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'},
  fabT:{color:'#fff',fontSize:24},
  l:{marginTop:8,fontWeight:'bold',fontSize:12},
  in:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginTop:2},
  mTitle:{fontWeight:'bold',fontSize:16,textAlign:'center',marginBottom:10},
  mRow:{flexDirection:'row',marginTop:15,marginBottom:30},
  mBtn:{flex:1,padding:12,borderRadius:8,alignItems:'center',marginRight:6},
  mBtnT:{color:'#fff',fontWeight:'bold'},
  modalWrap:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30}
});
