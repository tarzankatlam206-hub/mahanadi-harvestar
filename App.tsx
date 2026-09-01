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

  const upd=(k,v)=>{ const c={...form}; c[k]=v; setForm(c); };
  const saveAll=async(newLists)=>{ const keys={members:K.M,farmers:K.F,operators:K.O,agents:K.A,dealers:K.D,parts:K.P}; for(let k in keys) await AsyncStorage.setItem(keys[k], JSON.stringify(newLists[k])); setList(newLists); };
  const handleSave=async()=>{
    const id=form.id? form.id : Date.now().toString(); const obj={...form, id};
    if(!obj.name &&!obj.shop){ Alert.alert("नाम लिखें"); return; }
    const nl={}; for(let k in list) nl[k]=list[k].slice(); const arr=nl[tab]; let idx=arr.findIndex(x=>x.id===id);
    if(idx>=0) arr[idx]=obj; else arr.unshift(obj); await saveAll(nl); setForm({}); setShow(false); setDetail(null);
  };
  const doDel=async(t,id)=>{ const nl={...list}; nl[t]=nl[t].filter(x=>x.id!==id); await saveAll(nl); setDetail(null); };
  const filtered=()=>{ const s=search.toLowerCase(); return (list[tab]||[]).filter(m=>{ const a=(m.name||m.shop||"").toLowerCase(); const b=m.mobile||""; const c=(m.village||m.address||"").toLowerCase(); const d=(m.harvesterNo||"").toLowerCase(); return a.includes(s)||b.includes(s)||c.includes(s)||d.includes(s); }); };

  if(first===null) return <View style={st.c}><Text>लोड...</Text></View>;
  if(first) return (<SafeAreaView style={st.container}><ScrollView contentContainerStyle={st.auth}><Text style={st.logo}>🌾</Text><Text style={st.t1}>महानदी हार्वेस्टर मालिक कल्याण संघ जिला कांकेर छत्तीसगढ़</Text><TextInput style={st.inp} placeholder="नया पासवर्ड" secureTextEntry value={np} onChangeText={setNp}/><TextInput style={st.inp} placeholder="फिर से" secureTextEntry value={cp} onChangeText={setCp}/><TextInput style={st.inp} placeholder="हिंट" value={nh} onChangeText={setNh}/><TouchableOpacity style={st.btn} onPress={async()=>{ if(np.length<4||np!==cp){Alert.alert("गलत"); return;} await AsyncStorage.setItem(K.PWD,np); await AsyncStorage.setItem(K.H,nh); setFirst(false); setLogged(true);}}><Text style={st.btnT}>शुरू करें</Text></TouchableOpacity></ScrollView></SafeAreaView>);
  if(!logged) return (<SafeAreaView style={st.container}><View style={st.auth}><Text style={st.logo}>🌾</Text><Text style={st.t1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><TextInput style={st.inp} placeholder="पासवर्ड" secureTextEntry value={inPwd} onChangeText={setInPwd}/><TouchableOpacity style={st.btn} onPress={()=>{ if(inPwd===pwd||inPwd===MASTER) setLogged(true); else Alert.alert("गलत","हिंट:"+hint); }}><Text style={st.btnT}>लॉगिन</Text></TouchableOpacity></View></SafeAreaView>);

  // HOME SCREEN - फोटो जैसा डिज़ाइन
  if(screen==="home"){
    return (
    <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
      <View style={st.topHeader}><Text style={st.topHeaderT}>महानदी हार्वेस्टर</Text></View>
      <ScrollView contentContainerStyle={{paddingBottom:20}}>
        <View style={{alignItems:'center', padding:15}}>
          <Image source={require('./assets/mahanadi_icon_512.png')} style={{width:180,height:180,resizeMode:'contain'}} />
          <Text style={{fontSize:28,fontWeight:'900',color:'#1B5E20',marginTop:10}}>महानदी हार्वेस्टर</Text>
          <Text style={{fontSize:22,fontWeight:'800',color:'#C62828'}}>मालिक कल्याण संघ</Text>
          <Text style={{fontSize:16,fontWeight:'600',marginTop:2}}>जिला कांकेर (छत्तीसगढ़)</Text>
          <View style={{backgroundColor:'#0f4d1c',paddingHorizontal:18,paddingVertical:8,borderRadius:8,marginTop:10}}><Text style={{color:'#fff',fontWeight:'bold',fontSize:14}}>पंजीयन क्रमांक: 122202678489</Text></View>
        </View>

        <View style={{paddingHorizontal:15, gap:10}}>
          {MENU.map((m,i)=>(
            <TouchableOpacity key={i} style={[st.menuBtn,{backgroundColor:m.color}]} onPress={()=>{
              if(m.id==="contact"){ setScreen("contact"); }
              else if(m.static){ setScreen("static"); }
              else { setTab(m.id); setScreen("list"); if(m.isList){ setForm({}); } }
            }}>
              <Text style={st.menuIcon}>{m.icon}</Text>
              <Text style={st.menuTitle}>{m.title}</Text>
              <Text style={st.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={st.contactBox}>
          <View style={st.contactRow}><Text style={st.contactIcon}>📍</Text><Text style={st.contactTxt}>जिला कार्यालय - ग्राम लखनपुरी,{'\n'}तहसील- चारामा, जिला कांकेर (छत्तीसगढ़)</Text></View>
          <TouchableOpacity style={st.contactRow} onPress={()=>Linking.openURL("tel:7000520873")}><Text style={st.contactIcon}>📞</Text><Text style={st.contactTxt}>मोबाईल: 7000520873</Text></TouchableOpacity>
          <TouchableOpacity style={st.contactRow} onPress={()=>Linking.openURL("https://wa.me/919479025929")}><Text style={st.contactIcon}>🟢</Text><Text style={st.contactTxt}>WhatsApp: 9479025929</Text></TouchableOpacity>
          <TouchableOpacity style={st.contactRow} onPress={()=>Linking.openURL("mailto:tarzankatlam206@gmail.com")}><Text style={st.contactIcon}>✉️</Text><Text style={st.contactTxt}>Email: tarzankatlam206@gmail.com</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
  }

  if(screen==="contact"){
    return (<SafeAreaView style={st.container}><View style={st.head}><TouchableOpacity onPress={()=>setScreen("home")}><Text style={st.back}>‹ वापस</Text></TouchableOpacity><Text style={st.headT}>संपर्क करें</Text></View><View style={st.contactBox}><Text style={{fontWeight:'bold',fontSize:
