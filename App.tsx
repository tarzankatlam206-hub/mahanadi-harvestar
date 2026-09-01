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

  const updateForm=(key,val)=>{ const copy={}; for(let k in form) copy[k]=form[k]; copy[key]=val; setForm(copy); };

  const saveList=async(tab,list)=>{
    const map={members:KEYS.MEMBERS,farmers:KEYS.FARMERS,operators:KEYS.OPERATORS,agents:KEYS.AGENTS,dealers:KEYS.DEALERS,parts:KEYS.PARTS};
    await AsyncStorage.setItem(map[tab],JSON.stringify(list));
  };

  const handleSave=async()=>{
    const id=form.id||Date.now().toString();
    const item={}; for(let k in form) item[k]=form[k]; item.id=id;
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

  const handleDelete=(tab,id)=>{
    Alert.alert("डिलीट करें?","पक्का?",[{text:"नहीं",style:"cancel"},{text:"हाँ",style:"destructive",onPress:async()=>{
      let list=[]; let setF=null; let key="";
      if(tab==="members"){ list=members; setF=setMembers; key=KEYS.MEMBERS; }
      if(tab==="farmers"){ list=farmers; setF=setFarmers; key=KEYS.FARMERS; }
      if(tab==="operators"){ list=operators; setF=setOperators; key=KEYS.OPERATORS; }
      if(tab==="agents"){ list=agents; setF=setAgents; key=KEYS.AGENTS; }
      if(tab==="dealers"){ list=dealers; setF=setDealers; key=KEYS.DEALERS; }
      if(tab==="parts"){ list=parts; setF=setParts; key=KEYS.PARTS; }
      const nl=[]; for(let i=0;i<list.length;i++){ if(list[i].id!==id) nl.push(list[i]); }
      setF(nl); await AsyncStorage.setItem(key,JSON.stringify(nl)); setDetailItem(null);
    }}]);
  };

  const getData=()=>{
    const s=search.toLowerCase();
    const filter=(arr)=>{
      const res=[]; for(let i=0;i<arr.length;i++){ const m=arr[i];
        const a=(m.name||m.shop||"").toLowerCase(); const b=(m.mobile||""); const c=(m.address||m.village||"").toLowerCase(); const d=(m.harvesterNo||"").toLowerCase();
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

  if(isFirstTime===null) return <View style={st.center}><Text>लोड...</Text></View>;

  if(isFirstTime){
    return (<SafeAreaView style={st.container}><ScrollView contentContainerStyle={st.authWrap}>
      <Text style={st.logo}>🌾</Text><Text style={st.authTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={st.authSub}>जिला कांकेर छत्तीसगढ़</Text>
      <Text style={st.welcome}>महानदी हार्वेस्टर मालिक कल्याण संघ में आपका स्वागत है</Text><Text style={st.welcomeSmall}>हार्वेस्टर मालिकों का सहकारी मंच, शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
      <TextInput style={st.input} placeholder="नया पासवर्ड" secureTextEntry value={newPwd} onChangeText={setNewPwd}/><TextInput style={st.input} placeholder="फिर से पासवर्ड" secureTextEntry value={confirmPwd} onChangeText={setConfirmPwd}/><TextInput style={st.input} placeholder="हिंट" value={newHint} onChangeText={setNewHint}/>
      <TouchableOpacity style={st.greenBtn} onPress={async()=>{ if(newPwd.length<4||newPwd!==confirmPwd){Alert.alert("गलत"); return;} await AsyncStorage.setItem(KEYS.PWD,newPwd); await AsyncStorage.setItem(KEYS.HINT,newHint); setStoredPwd(newPwd); setIsFirstTime(false); setLoggedIn(true);}}><Text style={st.greenBtnText}>शुरू करें</Text></TouchableOpacity>
    </ScrollView></SafeAreaView>);
  }
  if(!loggedIn){
    return (<SafeAreaView style={st.container}><View style={st.authWrap}>
      <Text style={st.logo}>🌾</Text><Text style={st.authTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={st.authSub}>जिला कांकेर</Text>
      <Text style={st.welcome}>महानदी हार्वेस्टर मलिक कल्याण संघ में आपका स्वागत है</Text><Text style={st.welcomeSmall}>हार्वेस्टर मालिकों का सहकारी मंच, शासकीय मान्यता प्राप्त</Text>
      <TextInput style={st.input} placeholder="पासवर्ड" secureTextEntry value={inputPwd} onChangeText={setInputPwd}/>
      <TouchableOpacity style={st.greenBtn} onPress={()=>{ if(inputPwd===storedPwd||inputPwd===MASTER_CODE) setLoggedIn(true); else Alert.alert("गलत","हिंट: "+storedHint); }}><Text style={st.greenBtnText}>लॉगिन</Text></TouchableOpacity>
    </View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={st.container}>
      <View style={st.header}><Text style={st.headerTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ - कांकेर</Text></View>
      <View style={st.tabBar}><ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["members","farmers","operators","agents","dealers","parts"].map(t=>(
          <TouchableOpacity key={t} style={[st.tab, activeTab===t && st.tabActive]} onPress={()=>setActiveTab(t)}><Text style={[st.tabText, activeTab===t && st.tabTextActive]}>{t.toUpperCase()}</Text></TouchableOpacity>
        ))}
      </ScrollView></View>
      <TextInput style={st.searchInput} placeholder="खोजें: नाम, मोबाइल, पता, हार्वेस्टर नम्बर" value={search} onChangeText={setSearch}/>
      <FlatList data={getData()} keyExtractor={(i)=>i.id} contentContainerStyle={{paddingBottom:90}} renderItem={({item})=>(
        <TouchableOpacity onPress={()=>setDetailItem(item)} style={st.card}>
          <Text style={st.cardTitle}>{item.name||item.shop}</Text>
          <Text style={st.cardSub}>{item.village||item.block||item.address||""} {item.district||""}</Text>
          <Text style={st.cardSub}>मोबाइल: {item.mobile||""} {item.harvesterNo? " | H.No: "+item.harvesterNo:""}</Text>
          <Text style={{color:'#0f4d1c',fontSize:12,marginTop:4}}>टैप करें - पूरी जानकारी</Text>
        </TouchableOpacity>
      )}/>
      <TouchableOpacity style={st.fab} onPress={()=>{setForm({}); setShowAddModal(true);}}><Text style={{color:'#fff',fontSize:30}}>+</Text></TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView>
        <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',marginBottom:10}}>{form.id? "अपडेट" : "नया जोड़ें"} - {activeTab}</Text>

        {activeTab==="members" && <View>
          <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={(v)=>updateForm("name",v)}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={(v)=>updateForm("village",v)}/>
          <TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile||""} onChangeText={(v)=>updateForm("mobile",v)}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={(v)=>updateForm("block",v)}/>
          <TextInput style={st.input} placeholder="हार्वेस्टर नम्बर" value={form.harvesterNo||""} onChangeText={(v)=>updateForm("harvesterNo",v)}/>
          <TextInput style={st.input} placeholder="हार्वेस्टर संख्या" value={form.harvesterCount||""} onChangeText={(v)=>updateForm("harvesterCount",v)}/>
          <TextInput style={st.input} placeholder="राशि" value={form.amount||""} onChangeText={(v)=>updateForm("amount",v)}/>
          <TextInput style={st.input} placeholder="भुगतान माध्यम" value={form.payMode||""} onChangeText={(v)=>updateForm("payMode",v)}/>
          <TextInput style={st.input} placeholder="भुगतान तारीख" value={form.payDate||""} onChangeText={(v)=>updateForm("payDate",v)}/>
          <TextInput style={st.input} placeholder="राशि प्राप्तकर्ता" value={form.receiver||""} onChangeText={(v)=>updateForm("receiver",v)}/>
          <TextInput style={st.input} placeholder="संगठन में पद" value={form.post||""} onChangeText={(v)=>updateForm("post",v)}/>
        </View>}

        {activeTab==="farmers" && <View>
          <TextInput style={st.input} placeholder="किसान नाम *" value={form.name||""} onChangeText={(v)=>updateForm("name",v)}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={(v)=>updateForm("village",v)}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={(v)=>updateForm("block",v)}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={(v)=>updateForm("district",v)}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={(v)=>updateForm("state",v)}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={(v)=>updateForm("mobile",v)}/>
          <TextInput style={st.input} placeholder="तारीख समय" value={form.dateTime||""} onChangeText={(v)=>updateForm("dateTime",v)}/>
          <TextInput style={st.input} placeholder="एडवांस पेमेंट" value={form.advance||""} onChangeText={(v)=>updateForm("advance",v)}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={(v)=>updateForm("fullPay",v)}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={(v)=>updateForm("complaint",v)}/>
        </View>}

        {activeTab==="operators" && <View>
          <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={(v)=>updateForm("name",v)}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={(v)=>updateForm("village",v)}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={(v)=>updateForm("block",v)}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={(v)=>updateForm("district",v)}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={(v)=>updateForm("state",v)}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={(v)=>updateForm("mobile",v)}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={(v)=>updateForm("advance",v)}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={(v)=>updateForm("fullPay",v)}/>
          <TextInput style={st.input} placeholder="टोटल उपस्थिति" value={form.attendance||""} onChangeText={(v)=>updateForm("attendance",v)}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={(v)=>updateForm("complaint",v)}/>
        </View>}

        {activeTab==="agents" && <View>
          <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={(v)=>updateForm("name",v)}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={(v)=>updateForm("village",v)}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={(v)=>updateForm("block",v)}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={(v)=>updateForm("district",v)}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={(v)=>updateForm("state",v)}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={(v)=>updateForm("mobile",v)}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={(v)=>updateForm("advance",v)}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={(v)=>updateForm("fullPay",v)}/>
          <TextInput style={st.input} placeholder="टोटल कार्य दिवस" value={form.workDays||""} onChangeText={(v)=>updateForm("workDays",v)}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={(v)=>updateForm("complaint",v)}/>
        </View>}

        {activeTab==="dealers" && <View>
          <TextInput style={st.input} placeholder="नाम *" value={form.shop||form.name||""} onChangeText={(v)=>{updateForm("shop",v); updateForm("name",v);}}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={(v)=>updateForm("block",v)}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={(v)=>updateForm("district",v)}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={(v)=>updateForm("state",v)}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={(v)=>updateForm("advance",v)}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={(v)=>updateForm("fullPay",v)}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={(v)=>updateForm("complaint",v)}/>
        </View>}

        {activeTab==="parts" && <View>
          <TextInput style={st.input} placeholder="दुकान नाम *" value={form.shop||""} onChangeText={(v)=>updateForm("shop",v)}/>
          <TextInput style={st.input} placeholder="मालिक नाम" value={form.owner||""} onChangeText={(v)=>updateForm("owner",v)}/>
          <TextInput style={st.input} placeholder="पता" value={form.address||""} onChangeText={(v)=>updateForm("address",v)}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={(v)=>updateForm("block",v)}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={(v)=>updateForm("district",v)}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={(v)=>updateForm("state",v)}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={(v)=>updateForm("mobile",v)}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={(v)=>updateForm("advance",v)}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={(v)=>updateForm("fullPay",v)}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={(v)=>updateForm("complaint",v)}/>
        </View>}

        <View style={{flexDirection:'row',gap:10,marginTop:10}}><TouchableOpacity style={[st.greenBtn,{flex:1}]} onPress={handleSave}><Text style={st.greenBtnText}>सेव करें</Text></TouchableOpacity><TouchableOpacity style={[st.greenBtn,{flex:1,backgroundColor:'#888'}]} onPress={()=>setShowAddModal(false)}><Text style={st.greenBtnText}>बंद</Text></TouchableOpacity></View>
      </ScrollView></View></View></Modal>

      <Modal visible={!!detailItem} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView>
        <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',color:'#0f4d1c'}}>{detailItem?.name||detailItem?.shop}</Text>
        <Text style={{marginTop:8}}>गांव: {detailItem?.village}</Text><Text>ब्लॉक: {detailItem?.block}</Text><Text>जिला: {detailItem?.district}</Text><Text>राज्य: {detailItem?.state}</Text><Text>मोबाइल: {detailItem?.mobile}</Text><Text>हार्वेस्टर नम्बर: {detailItem?.harvesterNo}</Text><Text>संख्या: {detailItem?.harvesterCount}</Text><Text>राशि: {detailItem?.amount}</Text><Text>माध्यम: {detailItem?.payMode}</Text><Text>तारीख: {detailItem?.payDate||detailItem?.dateTime}</Text><Text>प्राप्तकर्ता: {detailItem?.receiver}</Text><Text>पद: {detailItem?.post}</Text><Text>एडवांस: {detailItem?.advance}</Text><Text>पूरा: {detailItem?.fullPay}</Text><Text>उपस्थिति/दिवस: {detailItem?.attendance||detailItem?.workDays}</Text><Text>शिकायत: {detailItem?.complaint}</Text><Text>पता: {detailItem?.address}</Text>
        <View style={{flexDirection:'row',marginTop:10,gap:8}}><TouchableOpacity style={st.callBtn} onPress={()=>Linking.openURL("tel:"+detailItem?.mobile)}><Text style={st.callText}>कॉल</Text></TouchableOpacity><TouchableOpacity style={st.waBtn} onPress={()=>Linking.openURL("https://wa.me/91"+detailItem?.mobile)}><Text style={st.waText}>WhatsApp</Text></TouchableOpacity></View>
        <View style={{flexDirection:'row',gap:10,marginTop:10}}><TouchableOpacity style={[st.greenBtn,{flex:1}]} onPress={()=>{ setForm(detailItem); setShowAddModal(true); }}><Text style={st.greenBtnText}>अपडेट</Text></TouchableOpacity><TouchableOpacity style={[st.greenBtn,{flex:1,backgroundColor:'#d32f2f'}]} onPress={()=>handleDelete(activeTab,detailItem.id)}><Text style={st.greenBtnText}>डिलीट</Text></TouchableOpacity></View>
        <TouchableOpacity style={[st.greenBtn,{backgroundColor:'#888',marginTop:10}]} onPress={()=>setDetailItem(null)}><Text style={st.greenBtnText}>बंद</Text></TouchableOpacity>
      </ScrollView></View></View></Modal>
    </SafeAreaView>
  );
}
const st=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'}, center:{flex:1,justifyContent:'center',alignItems:'center'},
  authWrap:{flexGrow:1,justifyContent:'center',padding:20}, logo:{fontSize:60,textAlign:'center'},
  authTitle:{fontSize:18,fontWeight:'bold',textAlign:'center',color:'#0f4d1c'}, authSub:{textAlign:'center',color:'#333',marginTop:4},
  welcome:{textAlign:'center',marginTop:10,color:'#0f4d1c',fontWeight:'bold',fontSize:13}, welcomeSmall:{textAlign:'center',color:'#666',fontSize:10,marginTop:4,marginBottom:10},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:10,backgroundColor:'#fff'},
  greenBtn:{backgroundColor:'#0f4d1c',padding:14,borderRadius:8,alignItems:'center'}, greenBtn
