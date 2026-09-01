// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, SafeAreaView, ScrollView, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MASTER="122202678489";
const K={PWD:"@pwd",H:"@h",M:"@m",F:"@f",O:"@o",A:"@a",D:"@d",P:"@p"};

const FIELDS={
 members:[ {k:"name",p:"नाम *"}, {k:"village",p:"गांव"}, {k:"mobile",p:"मोबाइल *"}, {k:"block",p:"ब्लॉक"}, {k:"harvesterNo",p:"हार्वेस्टर नम्बर"}, {k:"harvesterCount",p:"हार्वेस्टर संख्या"}, {k:"amount",p:"राशि"}, {k:"payMode",p:"भुगतान माध्यम"}, {k:"payDate",p:"भुगतान की तारीख"}, {k:"receiver",p:"राशि प्राप्तकर्ता"}, {k:"post",p:"संगठन में पद"} ],
 farmers:[ {k:"name",p:"किसान नाम *"}, {k:"village",p:"गांव"}, {k:"block",p:"ब्लॉक"}, {k:"district",p:"जिला"}, {k:"state",p:"राज्य"}, {k:"mobile",p:"मोबाइल"}, {k:"dateTime",p:"तारीख समय"}, {k:"advance",p:"एडवांस पेमेंट"}, {k:"fullPay",p:"पूरा पेमेंट"}, {k:"complaint",p:"शिकायत"} ],
 operators:[ {k:"name",p:"ऑपरेटर नाम *"}, {k:"village",p:"गांव"}, {k:"block",p:"ब्लॉक"}, {k:"district",p:"जिला"}, {k:"state",p:"राज्य"}, {k:"mobile",p:"मोबाइल"}, {k:"advance",p:"एडवांस पेमेंट"}, {k:"fullPay",p:"पूरा पेमेंट"}, {k:"attendance",p:"टोटल उपस्थिति"}, {k:"complaint",p:"शिकायत"} ],
 agents:[ {k:"name",p:"एजेंट नाम *"}, {k:"village",p:"गांव"}, {k:"block",p:"ब्लॉक"}, {k:"district",p:"जिला"}, {k:"state",p:"राज्य"}, {k:"mobile",p:"मोबाइल"}, {k:"advance",p:"एडवांस पेमेंट"}, {k:"fullPay",p:"पूरा पेमेंट"}, {k:"workDays",p:"टोटल कार्य दिवस"}, {k:"complaint",p:"शिकायत"} ],
 dealers:[ {k:"shop",p:"डीलर नाम *"}, {k:"block",p:"ब्लॉक"}, {k:"district",p:"जिला"}, {k:"state",p:"राज्य"}, {k:"mobile",p:"मोबाइल"}, {k:"advance",p:"एडवांस पेमेंट"}, {k:"fullPay",p:"पूरा पेमेंट"}, {k:"complaint",p:"शिकायत"} ],
 parts:[ {k:"shop",p:"दुकान का नाम *"}, {k:"owner",p:"मालिक का नाम"}, {k:"address",p:"पता"}, {k:"block",p:"ब्लॉक"}, {k:"district",p:"जिला"}, {k:"state",p:"राज्य"}, {k:"mobile",p:"मोबाइल"}, {k:"advance",p:"एडवांस पेमेंट"}, {k:"fullPay",p:"पूरा पेमेंट"}, {k:"complaint",p:"शिकायत"} ]
};

const MENU=[
 {id:"members", title:"सदस्य पंजीकरण", color:"#4CAF50", icon:"👥"},
 {id:"members", title:"हार्वेस्टर सूची", color:"#1976D2", icon:"🚜", isList:true},
 {id:"farmers", title:"किसान बुकिंग", color:"#FF8F00", icon:"🌾"},
 {id:"operators", title:"सूचना / नोटिस", color:"#7B1FA2", icon:"📢", static:true},
 {id:"agents", title:"गैलरी", color:"#0097A7", icon:"🖼️", static:true},
 {id:"contact", title:"संपर्क करें", color:"#E53935", icon:"📞", static:true},
];

export default function App(){
  const [first,setFirst]=useState(null); const [pwd,setPwd]=useState(""); const [hint,setHint]=useState("");
  const [logged,setLogged]=useState(false); const [inPwd,setInPwd]=useState(""); const [np,setNp]=useState(""); const [cp,setCp]=useState(""); const [nh,setNh]=useState("");
  const [screen,setScreen]=useState("home"); const [tab,setTab]=useState("members"); const [search,setSearch]=useState("");
  const [list,setList]=useState({members:[],farmers:[],operators:[],agents:[],dealers:[],parts:[]});
  const [form,setForm]=useState({}); const [show,setShow]=useState(false); const [detail,setDetail]=useState(null);

  useEffect(()=>{(async()=>{
    const p=await AsyncStorage.getItem(K.PWD); const h=await AsyncStorage.getItem(K.H);
    if(!p) setFirst(true); else{ setFirst(false); setPwd(p); if(h) setHint(h); }
    const keys={members:K.M,farmers:K.F,operators:K.O,agents:K.A,dealers:K.D,parts:K.P};
    const n={}; for(let k in keys){ const v=await AsyncStorage.getItem(keys[k]); n[k]=v? JSON.parse(v):[]; } setList(n);
  })();},[]);

  const upd=(k,v)=>{ const c={}; for(let x in form) c[x]=form[x]; c[k]=v; setForm(c); };
  const saveAll=async(newLists)=>{ const keys={members:K.M,farmers:K.F,operators:K.O,agents:K.A,dealers:K.D,parts:K.P}; for(let k in keys) await AsyncStorage.setItem(keys[k], JSON.stringify(newLists[k])); setList(newLists); };
  const handleSave=async()=>{
    const id=form.id? form.id : Date.now().toString(); const obj={}; for(let kk in form) obj[kk]=form[kk]; obj.id=id;
    if(!obj.name &&!obj.shop){ Alert.alert("नाम लिखें"); return; }
    const nl={}; for(let k in list) nl[k]=list[k].slice(); const arr=nl[tab]; let idx=-1; for(let i=0;i<arr.length;i++) if(arr[i].id===id) idx=i;
    if(idx>=0) arr[idx]=obj; else arr.unshift(obj); await saveAll(nl); setForm({}); setShow(false); setDetail(null);
  };
  const doDel=async(t,id)=>{ const nl={}; for(let k in list) nl[k]=list[k].slice(); nl[t]=nl[t].filter(function(x){return x.id!==id}); await saveAll(nl); setDetail(null); };
  const filtered=()=>{ const s=search.toLowerCase(); const arr=list[tab]||[]; const r=[]; for(let i=0;i<arr.length;i++){ const m=arr[i]; const a=(m.name? m.name : (m.shop? m.shop : "")).toLowerCase(); const b=m.mobile? m.mobile : ""; const c=(m.village? m.address? m.address : m.village : "").toLowerCase(); const d=m.harvesterNo? m.harvesterNo.toLowerCase() : ""; if(a.indexOf(s)>=0||b.indexOf(s)>=0||c.indexOf(s)>=0||d.indexOf(s)>=0) r.push(m); } return r; };

  if(first===null) return <View style={st.c}><Text>लोड...</Text></View>;
  if(first) return (<SafeAreaView style={st.container}><ScrollView contentContainerStyle={st.auth}><Text style={st.logo}>🌾</Text><Text style={st.t1}>महानदी हार्वेस्टर मालिक कल्याण संघ जिला कांकेर</Text><TextInput style={st.inp} placeholder="नया पासवर्ड" secureTextEntry value={np} onChangeText={setNp}/><TextInput style={st.inp} placeholder="फिर से" secureTextEntry value={cp} onChangeText={setCp}/><TextInput style={st.inp} placeholder="हिंट" value={nh} onChangeText={setNh}/><TouchableOpacity style={st.btn} onPress={async()=>{ if(np.length<4||np!==cp){Alert.alert("गलत"); return;} await AsyncStorage.setItem(K.PWD,np); await AsyncStorage.setItem(K.H,nh); setFirst(false); setLogged(true);}}><Text style={st.btnT}>शुरू करें</Text></TouchableOpacity></ScrollView></SafeAreaView>);
  if(!logged) return (<SafeAreaView style={st.container}><View style={st.auth}><Text style={st.logo}>🌾</Text><Text style={st.t1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><TextInput style={st.inp} placeholder="पासवर्ड" secureTextEntry value={inPwd} onChangeText={setInPwd}/><TouchableOpacity style={st.btn} onPress={()=>{ if(inPwd===pwd||inPwd===MASTER) setLogged(true); else Alert.alert("गलत","हिंट:"+hint); }}><Text style={st.btnT}>लॉगिन</Text></TouchableOpacity></View></SafeAreaView>);

  if(screen==="home"){
    return (
    <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
      <View style={st.topHeader}><Text style={st.topHeaderT}>महानदी हार्वेस्टर</Text></View>
      <ScrollView contentContainerStyle={{paddingBottom:20}}>
        <View style={{alignItems:'center', padding:15}}>
          <Text style={{fontSize:80}}>🌾</Text>
          <Text style={{fontSize:26,fontWeight:'900',color:'#1B5E20',marginTop:5}}>महानदी हार्वेस्टर</Text>
          <Text style={{fontSize:20,fontWeight:'800',color:'#C62828'}}>मालिक कल्याण संघ</Text>
          <Text style={{fontSize:15,fontWeight:'600',marginTop:2}}>जिला कांकेर (छत्तीसगढ़)</Text>
          <View style={{backgroundColor:'#0f4d1c',paddingHorizontal:18,paddingVertical:8,borderRadius:8,marginTop:10}}><Text style={{color:'#fff',fontWeight:'bold',fontSize:13}}>पंजीयन क्रमांक: 122202678489</Text></View>
        </View>
        <View style={{paddingHorizontal:15, gap:10}}>
          {MENU.map(function(m,i){return (
            <TouchableOpacity key={i} style={[st.menuBtn,{backgroundColor:m.color}]} onPress={function(){
              if(m.id==="contact"){ setScreen("contact"); }
              else if(m.static){ Alert.alert(m.title,"जल्द आ रहा है"); }
              else { setTab(m.id); setScreen("list"); }
            }}>
              <Text style={st.menuIcon}>{m.icon}</Text>
              <Text style={st.menuTitle}>{m.title}</Text>
              <Text style={st.menuArrow}>›</Text>
            </TouchableOpacity>
          )})}
        </View>
        <View style={st.contactBox}>
          <View style={st.contactRow}><Text style={st.contactIcon}>📍</Text><Text style={st.contactTxt}>जिला कार्यालय - ग्राम लखनपुरी, तहसील- चारामा, जिला कांकेर</Text></View>
          <TouchableOpacity style={st.contactRow} onPress={function(){Linking.openURL("tel:7000520873")}}><Text style={st.contactIcon}>📞</Text><Text style={st.contactTxt}>मोबाईल: 7000520873</Text></TouchableOpacity>
          <TouchableOpacity style={st.contactRow} onPress={function(){Linking.openURL("https://wa.me/919479025929")}}><Text style={st.contactIcon}>🟢</Text><Text style={st.contactTxt}>WhatsApp: 9479025929</Text></TouchableOpacity>
          <TouchableOpacity style={st.contactRow} onPress={function(){Linking.openURL("mailto:tarzankatlam206@gmail.com")}}><Text style={st.contactIcon}>✉️</Text><Text style={st.contactTxt}>Email: tarzankatlam206@gmail.com</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
  }

  if(screen==="contact"){
    return (<SafeAreaView style={st.container}><View style={st.head}><TouchableOpacity onPress={function(){setScreen("home")}}><Text style={st.back}>‹ वापस</Text></TouchableOpacity><Text style={st.headT}>संपर्क करें</Text></View><View style={st.contactBox}><Text style={{fontWeight:'bold',fontSize:16,marginBottom:10}}>जिला कार्यालय</Text><Text>ग्राम लखनपुरी, तहसील चारामा, जिला कांकेर</Text><Text style={{marginTop:15}}>मोबाईल: 7000520873</Text><Text>WhatsApp: 9479025929</Text><Text>Email: tarzankatlam206@gmail.com</Text><TouchableOpacity style={[st.btn,{marginTop:20}]} onPress={function(){Linking.openURL("tel:7000520873")}}><Text style={st.btnT}>कॉल करें</Text></TouchableOpacity></View></SafeAreaView>)
  }

  return (<SafeAreaView style={st.container}>
    <View style={st.head}><TouchableOpacity onPress={function(){setScreen("home")}}><Text style={st.back}>‹ होम</Text></TouchableOpacity><Text style={st.headT}>{tab} सूची</Text></View>
    <TextInput style={st.search} placeholder="खोजें: नाम, मोबाइल, गांव" value={search} onChangeText={setSearch}/>
    <FlatList data={filtered()} keyExtractor={function(i){return i.id}} contentContainerStyle={{paddingBottom:90}} renderItem={function(o){ const item=o.item; return <TouchableOpacity style={st.card} onPress={function(){setDetail(item)}}><Text style={st.cardT}>{item.name? item.name : item.shop}</Text><Text style={st.cardS}>{item.village? item.village : ""} {item.block? item.block : ""}</Text><Text style={st.cardS}>मो: {item.mobile? item.mobile : ""}</Text></TouchableOpacity>}}/>
    <TouchableOpacity style={st.fab} onPress={function(){setForm({}); setShow(true)}}><Text style={{color:'#fff',fontSize:30}}>+</Text></TouchableOpacity>
    <Modal visible={show} transparent animationType="slide"><View style={st.mW}><View style={st.mB}><ScrollView>
      <Text style={{fontWeight:'bold',textAlign:'center',fontSize:16,marginBottom:10}}>{form.id? "अपडेट" : "नया"} - {tab}</Text>
      {FIELDS[tab].map(function(f){return <TextInput key={f.k} style={st.inp} placeholder={f.p} value={form[f.k]? form[f.k] : ""} onChangeText={function(v){upd(f.k,v)}}/>})}
      <View style={{flexDirection:'row',gap:10,marginTop:10}}><TouchableOpacity style={[st.btn,{flex:1}]} onPress={handleSave}><Text style={st.btnT}>सेव</Text></TouchableOpacity><TouchableOpacity style={[st.btn,{flex:1,backgroundColor:'#888'}]} onPress={function(){setShow(false)}}><Text style={st.btnT}>बंद</Text></TouchableOpacity></View>
    </ScrollView></View></View></Modal>
    <Modal visible={detail? true : false} transparent animationType="slide"><View style={st.mW}><View style={st.mB}><ScrollView>
      <Text style={{fontWeight:'bold',textAlign:'center',fontSize:18,color:'#0f4d1c'}}>{detail? (detail.name? detail.name : detail.shop) : ""}</Text>
      {detail && <View style={{marginTop:10}}>{FIELDS[tab].map(function(f){return <View key={f.k} style={{flexDirection:'row',paddingVertical:4,borderBottomWidth:0.5,borderColor:'#eee'}}><Text style={{fontWeight:'bold',width:110}}>{f.p}:</Text><Text style={{flex:1}}>{detail[f.k]? detail[f.k] : ""}</Text></View>})}</View>}
      <View style={{flexDirection:'row',gap:8,marginTop:12}}><TouchableOpacity style={[st.btn,{flex:1}]} onPress={function(){ if(detail){ setForm(detail); setShow(true);} }}><Text style={st.btnT}>अपडेट</Text></TouchableOpacity><TouchableOpacity style={[st.btn,{flex:1,backgroundColor:'#d32f2f'}]} onPress={function(){ if(detail) doDel(tab, detail.id); }}><Text style={st.btnT}>डिलीट</Text></TouchableOpacity></View>
      <TouchableOpacity style={[st.btn,{backgroundColor:'#888',marginTop:10}]} onPress={function(){setDetail(null)}}><Text style={st.btnT}>बंद</Text></TouchableOpacity>
      {detail && detail.mobile? <View style={{flexDirection:'row',gap:8,marginTop:10}}><TouchableOpacity style={st.call} onPress={function(){Linking.openURL("tel:"+detail.mobile)}}><Text style={{color:'#fff'}}>कॉल</Text></TouchableOpacity><TouchableOpacity style={st.wa} onPress={function(){Linking.openURL("https://wa.me/91"+detail.mobile)}}><Text style={{color:'#fff'}}>WhatsApp</Text></TouchableOpacity></View> : null}
    </ScrollView></View></View></Modal>
  </SafeAreaView>);
}
const st=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'}, c:{flex:1,justifyContent:'center',alignItems:'center'}, auth:{flexGrow:1,justifyContent:'center',padding:20}, logo:{fontSize:60,textAlign:'center'},
  t1:{fontSize:14,fontWeight:'bold',textAlign:'center',color:'#0f4d1c'}, inp:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:8,backgroundColor:'#fff'},
  btn:{backgroundColor:'#0f4d1c',padding:14,borderRadius:8,alignItems:'center'}, btnT:{color:'#fff',fontWeight:'bold'},
  topHeader:{backgroundColor:'#0f4d1c',padding:14}, topHeaderT:{color:'#fff',fontWeight:'bold',fontSize:16},
  menuBtn:{flexDirection:'row',alignItems:'center',paddingVertical:14,paddingHorizontal:15,borderRadius:12}, menuIcon:{fontSize:20,width:35,color:'#fff'}, menuTitle:{flex:1,color:'#fff',fontSize:15,fontWeight:'bold',textAlign:'center'}, menuArrow:{color:'#fff',fontSize:24,fontWeight:'bold'},
  contactBox:{margin:15,backgroundColor:'#f0fdf4',borderRadius:12,padding:12,borderWidth:1,borderColor:'#c8e6c9'}, contactRow:{flexDirection:'row',marginBottom:8,alignItems:'flex-start'}, contactIcon:{width:25,fontSize:16}, contactTxt:{flex:1,fontSize:13,color:'#222',lineHeight:18},
  head:{backgroundColor:'#0f4d1c',padding:12,flexDirection:'row',alignItems:'center'}, headT:{color:'#fff',fontWeight:'bold',fontSize:13,flex:1,textAlign:'center'}, back:{color:'#fff',fontSize:14,fontWeight:'bold'},
  search:{margin:10,backgroundColor:'#fff',borderRadius:8,padding:10,borderWidth:1,borderColor:'#ccc'},
  card:{backgroundColor:'#fff',marginHorizontal:10,marginBottom:6,padding:10,borderRadius:8}, cardT:{fontWeight:'bold',color:'#0f4d1c'}, cardS:{fontSize:12,color:'#555',marginTop:2},
  fab:{position:'absolute',bottom:20,right:20,width:55,height:55,borderRadius:27,backgroundColor:'#0f4d1c',justifyContent:'center',alignItems:'center'},
  mW:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:15}, mB:{backgroundColor:'#fff',borderRadius:10,padding:12,maxHeight:'90%'},
  call:{backgroundColor:'#0f4d1c',padding:10,borderRadius:6,marginRight:8}, wa:{backgroundColor:'#25D366',padding:10,borderRadius:6}
});
