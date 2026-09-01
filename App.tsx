// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert, Modal, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MASTER_CODE = "122202678489";
const KEYS = { PWD: "@pwd", MEMBERS: "@m", FARMERS: "@f", OPERATORS: "@o", AGENTS: "@a", DEALERS: "@d", PARTS: "@p", HINT: "@h" };

export default function App(){
  const [isFirstTime,setIsFirstTime]=useState(null);
  const [storedPwd,setStoredPwd]=useState(""); const [storedHint,setStoredHint]=useState("");
  const [loggedIn,setLoggedIn]=useState(false); const [inputPwd,setInputPwd]=useState("");
  const [newPwd,setNewPwd]=useState(""); const [confirmPwd,setConfirmPwd]=useState(""); const [newHint,setNewHint]=useState("");
  const [activeTab,setActiveTab]=useState("members"); const [search,setSearch]=useState("");
  const [members,setMembers]=useState([]); const [farmers,setFarmers]=useState([]); const [operators,setOperators]=useState([]); const [agents,setAgents]=useState([]); const [dealers,setDealers]=useState([]); const [parts,setParts]=useState([]);
  const [showAddModal,setShowAddModal]=useState(false); const [form,setForm]=useState({}); const [detailItem,setDetailItem]=useState(null);

  useEffect(()=>{ (async()=>{
    const pwd=await AsyncStorage.getItem(KEYS.PWD); const hint=await AsyncStorage.getItem(KEYS.HINT);
    if(!pwd) setIsFirstTime(true); else { setIsFirstTime(false); setStoredPwd(pwd); if(hint) setStoredHint(hint); }
    const load=async(k,set)=>{ const v=await AsyncStorage.getItem(k); if(v) set(JSON.parse(v)); };
    load(KEYS.MEMBERS,setMembers); load(KEYS.FARMERS,setFarmers); load(KEYS.OPERATORS,setOperators); load(KEYS.AGENTS,setAgents); load(KEYS.DEALERS,setDealers); load(KEYS.PARTS,setParts);
  })(); },[]);

  const updateForm=(key,val)=>{ const copy={}; for(let k in form){ copy[k]=form[k]; } copy[key]=val; setForm(copy); };

  const saveList=async(tab,list)=>{
    const map={members:KEYS.MEMBERS,farmers:KEYS.FARMERS,operators:KEYS.OPERATORS,agents:KEYS.AGENTS,dealers:KEYS.DEALERS,parts:KEYS.PARTS};
    await AsyncStorage.setItem(map[tab],JSON.stringify(list));
  };

  const handleSave=async()=>{
    const id=form.id? form.id : Date.now().toString();
    const item={}; for(let k in form){ item[k]=form[k]; } item.id=id;
    if(!item.name &&!item.shop){ Alert.alert("नाम जरूरी"); return; }
    let list=[]; let setF=null;
    if(activeTab==="members"){ list=members; setF=setMembers; }
    if(activeTab==="farmers"){ list=farmers; setF=setFarmers; }
    if(activeTab==="operators"){ list=operators; setF=setOperators; }
    if(activeTab==="agents"){ list=agents; setF=setAgents; }
    if(activeTab==="dealers"){ list=dealers; setF=setDealers; }
    if(activeTab==="parts"){ list=parts; setF=setParts; }
    let idx=-1; for(let i=0;i<list.length;i++){ if(list[i].id===id) idx=i; }
    let newList; if(idx>=0){ newList=list.slice(); newList[idx]=item; } else { newList=[item].concat(list); }
    setF(newList); await saveList(activeTab,newList); setForm({}); setShowAddModal(false); setDetailItem(null);
  };

  const getData=()=>{
    const s=search.toLowerCase();
    const filter=(arr)=>{
      const res=[]; for(let i=0;i<arr.length;i++){ const m=arr[i];
        const a=m.name? m.name.toLowerCase() : (m.shop? m.shop.toLowerCase() : "");
        const b=m.mobile? m.mobile : "";
        const c=m.address? m.address.toLowerCase() : (m.village? m.village.toLowerCase() : "");
        const d=m.harvesterNo? m.harvesterNo.toLowerCase() : "";
        if(a.indexOf(s)>=0 || b.indexOf(s)>=0 || c.indexOf(s)>=0 || d.indexOf(s)>=0) res.push(m);
      } return res;
    };
    if(activeTab==="members") return filter(members);
    if(activeTab==="farmers") return filter(farmers);
    if(activeTab==="operators") return filter(operators);
    if(activeTab==="agents") return filter(agents);
    if(activeTab==="dealers") return filter(dealers);
    if(activeTab==="parts") return filter(parts);
    return [];
  };

  const doDelete=async(tab,id)=>{
    let list=[]; let setF=null; let key="";
    if(tab==="members"){ list=members; setF=setMembers; key=KEYS.MEMBERS; }
    if(tab==="farmers"){ list=farmers; setF=setFarmers; key=KEYS.FARMERS; }
    if(tab==="operators"){ list=operators; setF=setOperators; key=KEYS.OPERATORS; }
    if(tab==="agents"){ list=agents; setF=setAgents; key=KEYS.AGENTS; }
    if(tab==="dealers"){ list=dealers; setF=setDealers; key=KEYS.DEALERS; }
    if(tab==="parts"){ list=parts; setF=setParts; key=KEYS.PARTS; }
    const nl=[]; for(let i=0;i<list.length;i++){ if(list[i].id!==id) nl.push(list[i]); }
    setF(nl); await AsyncStorage.setItem(key,JSON.stringify(nl)); setDetailItem(null);
  };

  if(isFirstTime===null) return <View style={st.center}><Text>लोड...</Text></View>;

  if(isFirstTime){
    return (<SafeAreaView style={st.container}><ScrollView contentContainerStyle={st.authWrap}>
      <Text style={st.logo}>🌾</Text><Text style={st.authTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ जिला कांकेर छत्तीसगढ़</Text>
      <Text style={st.welcome}>महानदी हार्वेस्टर मालिक कल्याण संघ में आपका स्वागत है</Text><Text style={st.welcomeSmall}>हार्वेस्टर मालिकों का सहकारी मंच, शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
      <TextInput style={st.input} placeholder="नया पासवर्ड" secureTextEntry value={newPwd} onChangeText={setNewPwd}/><TextInput style={st.input} placeholder="फिर से" secureTextEntry value={confirmPwd} onChangeText={setConfirmPwd}/><TextInput style={st.input} placeholder="हिंट" value={newHint} onChangeText={setNewHint}/>
      <TouchableOpacity style={st.greenBtn} onPress={async()=>{ if(newPwd.length<4||newPwd!==confirmPwd){Alert.alert("गलत"); return;} await AsyncStorage.setItem(KEYS.PWD,newPwd); await AsyncStorage.setItem(KEYS.HINT,newHint); setIsFirstTime(false); setLoggedIn(true);}}><Text style={st.greenBtnText}>शुरू करें</Text></TouchableOpacity>
    </ScrollView></SafeAreaView>);
  }
  if(!loggedIn){
    return (<SafeAreaView style={st.container}><View style={st.authWrap}>
      <Text style={st.logo}>🌾</Text><Text style={st.authTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={st.welcome}>स्वागत है</Text><Text style={st.welcomeSmall}>सहकारी मंच, शासकीय मान्यता प्राप्त</Text>
      <TextInput style={st.input} placeholder="पासवर्ड" secureTextEntry value={inputPwd} onChangeText={setInputPwd}/>
      <TouchableOpacity style={st.greenBtn} onPress={()=>{ if(inputPwd===storedPwd||inputPwd===MASTER_CODE) setLoggedIn(true); else Alert.alert("गलत","हिंट: "+storedHint); }}><Text style={st.greenBtnText}>लॉगिन</Text></TouchableOpacity>
    </View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={st.container}>
      <View style={st.header}><Text style={st.headerTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ - कांकेर</Text></View>
      <View style={st.tabBar}><ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["members","farmers","operators","agents","dealers","parts"].map(function(t){ return (
          <TouchableOpacity key={t} style={[st.tab, activeTab===t && st.tabActive]} onPress={function(){setActiveTab(t)}}><Text style={[st.tabText, activeTab===t && st.tabTextActive]}>{t.toUpperCase()}</Text></TouchableOpacity>
        );})}
      </ScrollView></View>
      <TextInput style={st.searchInput} placeholder="खोजें: नाम, मोबाइल, पता, हार्वेस्टर नम्बर" value={search} onChangeText={setSearch}/>
      <FlatList data={getData()} keyExtractor={function(i){return i.id}} contentContainerStyle={{paddingBottom:90}} renderItem={function({item}){ return (
        <TouchableOpacity onPress={function(){setDetailItem(item)}} style={st.card}>
          <Text style={st.cardTitle}>{item.name? item.name : item.shop}</Text>
          <Text style={st.cardSub}>{item.village? item.village : ""} {item.block? item.block : ""}</Text>
          <Text style={st.cardSub}>मोबाइल: {item.mobile? item.mobile : ""} {item.harvesterNo? " H.No: "+item.harvesterNo : ""}</Text>
          <Text style={{color:'#0f4d1c',fontSize:12,marginTop:4}}>टैप करें - पूरी जानकारी + अपडेट + डिलीट</Text>
        </TouchableOpacity>
      );}}/>
      <TouchableOpacity style={st.fab} onPress={function(){setForm({}); setShowAddModal(true);}}><Text style={{color:'#fff',fontSize:30}}>+</Text></TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView>
        <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',marginBottom:10}}>{form.id? "अपडेट" : "नया जोड़ें"} - {activeTab}</Text>
        {activeTab==="members" && <View>
          <TextInput style={st.input} placeholder="नाम *" value={form.name? form.name : ""} onChangeText={function(v){updateForm("name",v)}}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village? form.village : ""} onChangeText={function(v){updateForm("village",v)}}/>
          <TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile? form.mobile : ""} onChangeText={function(v){updateForm("mobile",v)}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block? form.block : ""} onChangeText={function(v){updateForm("block",v)}}/>
          <TextInput style={st.input} placeholder="हार्वेस्टर नम्बर" value={form.harvesterNo? form.harvesterNo : ""} onChangeText={function(v){updateForm("harvesterNo",v)}}/>
          <TextInput style={st.input} placeholder="हार्वेस्टर संख्या" value={form.harvesterCount? form.harvesterCount : ""} onChangeText={function(v){updateForm("harvesterCount",v)}}/>
          <TextInput style={st.input} placeholder="राशि" value={form.amount? form.amount : ""} onChangeText={function(v){updateForm("amount",v)}}/>
          <TextInput style={st.input} placeholder="भुगतान माध्यम" value={form.payMode? form.payMode : ""} onChangeText={function(v){updateForm("payMode",v)}}/>
          <TextInput style={st.input} placeholder="भुगतान तारीख" value={form.payDate? form.payDate : ""} onChangeText={function(v){updateForm("payDate",v)}}/>
          <TextInput style={st.input} placeholder="राशि प्राप्तकर्ता" value={form.receiver? form.receiver : ""} onChangeText={function(v){updateForm("receiver",v)}}/>
          <TextInput style={st.input} placeholder="संगठन में पद" value={form.post? form.post : ""} onChangeText={function(v){updateForm("post",v)}}/>
        </View>}
        {activeTab==="farmers" && <View>
          <TextInput style={st.input} placeholder="किसान नाम" value={form.name? form.name : ""} onChangeText={function(v){updateForm("name",v)}}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village? form.village : ""} onChangeText={function(v){updateForm("village",v)}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block? form.block : ""} onChangeText={function(v){updateForm("block",v)}}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district? form.district : ""} onChangeText={function(v){updateForm("district",v)}}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state? form.state : ""} onChangeText={function(v){updateForm("state",v)}}/>
          <TextInput style={st.input} placeholder="तारीख समय" value={form.dateTime? form.dateTime : ""} onChangeText={function(v){updateForm("dateTime",v)}}/>
          <TextInput style={st.input} placeholder="एडवांस पेमेंट" value={form.advance? form.advance : ""} onChangeText={function(v){updateForm("advance",v)}}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay? form.fullPay : ""} onChangeText={function(v){updateForm("fullPay",v)}}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint? form.complaint : ""} onChangeText={function(v){updateForm("complaint",v)}}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile? form.mobile : ""} onChangeText={function(v){updateForm("mobile",v)}}/>
        </View>}
        {activeTab==="operators" && <View>
          <TextInput style={st.input} placeholder="नाम" value={form.name? form.name : ""} onChangeText={function(v){updateForm("name",v)}}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village? form.village : ""} onChangeText={function(v){updateForm("village",v)}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block? form.block : ""} onChangeText={function(v){updateForm("block",v)}}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district? form.district : ""} onChangeText={function(v){updateForm("district",v)}}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state? form.state : ""} onChangeText={function(v){updateForm("state",v)}}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance? form.advance : ""} onChangeText={function(v){updateForm("advance",v)}}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay? form.fullPay : ""} onChangeText={function(v){updateForm("fullPay",v)}}/>
          <TextInput style={st.input} placeholder="टोटल उपस्थिति" value={form.attendance? form.attendance : ""} onChangeText={function(v){updateForm("attendance",v)}}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint? form.complaint : ""} onChangeText={function(v){updateForm("complaint",v)}}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile? form.mobile : ""} onChangeText={function(v){updateForm("mobile",v)}}/>
        </View>}
        {activeTab==="agents" && <View>
          <TextInput style={st.input} placeholder="नाम" value={form.name? form.name : ""} onChangeText={function(v){updateForm("name",v)}}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village? form.village : ""} onChangeText={function(v){updateForm("village",v)}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block? form.block : ""} onChangeText={function(v){updateForm("block",v)}}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district? form.district : ""} onChangeText={function(v){updateForm("district",v)}}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state? form.state : ""} onChangeText={function(v){updateForm("state",v)}}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance? form.advance : ""} onChangeText={function(v){updateForm("advance",v)}}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay? form.fullPay : ""} onChangeText={function(v){updateForm("fullPay",v)}}/>
          <TextInput style={st.input} placeholder="कार्य दिवस" value={form.workDays? form.workDays : ""} onChangeText={function(v){updateForm("workDays",v)}}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint? form.complaint : ""} onChangeText={function(v){updateForm("complaint",v)}}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile? form.mobile : ""} onChangeText={function(v){updateForm("mobile",v)}}/>
        </View>}
        {activeTab==="dealers" && <View>
          <TextInput style={st.input} placeholder="नाम" value={form.shop? form.shop : ""} onChangeText={function(v){updateForm("shop",v); updateForm("name",v);}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block? form.block : ""} onChangeText={function(v){updateForm("block",v)}}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district? form.district : ""} onChangeText={function(v){updateForm("district",v)}}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state? form.state : ""} onChangeText={function(v){updateForm("state",v)}}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance? form.advance : ""} onChangeText={function(v){updateForm("advance",v)}}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay? form.fullPay : ""} onChangeText={function(v){updateForm("fullPay",v)}}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint? form.complaint : ""} onChangeText={function(v){updateForm("complaint",v)}}/>
        </View>}
        {activeTab==="parts" && <View>
          <TextInput style={st.input} placeholder="दुकान नाम" value={form.shop? form.shop : ""} onChangeText={function(v){updateForm("shop",v)}}/>
          <TextInput style={st.input} placeholder="मालिक नाम" value={form.owner? form.owner : ""} onChangeText={function(v){updateForm("owner",v)}}/>
          <TextInput style={st.input} placeholder="पता" value={form.address? form.address : ""} onChangeText={function(v){updateForm("address",v)}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block? form.block : ""} onChangeText={function(v){updateForm("block",v)}}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district? form.district : ""} onChangeText={function(v){updateForm("district",v)}}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state? form.state : ""} onChangeText={function(v){updateForm("state",v)}}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance? form.advance : ""} onChangeText={function(v){updateForm("advance",v)}}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay? form.fullPay : ""} onChangeText={function(v){updateForm("fullPay",v)}}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint? form.complaint : ""} onChangeText={function(v){updateForm("complaint",v)}}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile? form.mobile : ""} onChangeText={function(v){updateForm("mobile",v)}}/>
        </View>}
        <View style={{flexDirection:'row',gap:10,marginTop:10}}><TouchableOpacity style={[st.greenBtn,{flex:1}]} onPress={handleSave}><Text style={st.greenBtnText}>सेव</Text></TouchableOpacity><TouchableOpacity style={[st.greenBtn,{flex:1,backgroundColor:'#888'}]} onPress={function(){setShowAddModal(false)}}><Text style={st.greenBtnText}>बंद</Text></TouchableOpacity></View>
      </ScrollView></View></View></Modal>

      <Modal visible={detailItem? true : false} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView>
        <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',color:'#0f4d1c'}}>{detailItem? (detailItem.name? detailItem.name : detailItem.shop) : ""}</Text>
        {detailItem && <View style={{marginTop:10}}>
          <Text>गांव: {detailItem.village? detailItem.village : ""}</Text><Text>ब्लॉक: {detailItem.block? detailItem.block : ""}</Text><Text>जिला: {detailItem.district? detailItem.district : ""}</Text><Text>राज्य: {detailItem.state? detailItem.state : ""}</Text><Text>मोबाइल: {detailItem.mobile? detailItem.mobile : ""}</Text><Text>हार्वेस्टर नम्बर: {detailItem.harvesterNo? detailItem.harvesterNo : ""}</Text><Text>संख्या: {detailItem.harvesterCount? detailItem.harvesterCount : ""}</Text><Text>राशि: {detailItem.amount? detailItem.amount : ""}</Text><Text>माध्यम: {detailItem.payMode? detailItem.payMode : ""}</Text><Text>तारीख: {detailItem.payDate? detailItem.payDate : (detailItem.dateTime? detailItem.dateTime : "")}</Text><Text>प्राप्तकर्ता: {detailItem.receiver? detailItem.receiver : ""}</Text><Text>पद: {detailItem.post? detailItem.post : ""}</Text><Text>एडवांस: {detailItem.advance? detailItem.advance : ""}</Text><Text>पूरा: {detailItem.fullPay? detailItem.fullPay : ""}</Text><Text>उपस्थिति: {detailItem.attendance? detailItem.attendance : (detailItem.workDays? detailItem.workDays : "")}</Text><Text>शिकायत: {detailItem.complaint? detailItem.complaint : ""}</Text><Text>पता: {detailItem.address? detailItem.address : ""}</Text>
        </View>}
        <View style={{flexDirection:'row',gap:10,margin
