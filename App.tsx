import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert, Modal, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MASTER_CODE = "122202678489";
const KEYS = { PWD: "@pwd", MEMBERS: "@members", FARMERS: "@farmers", OPERATORS: "@operators", AGENTS: "@agents", DEALERS: "@dealers", PARTS: "@parts", HINT: "@hint" };
type TabType = "members"|"farmers"|"operators"|"agents"|"dealers"|"parts";

export default function App(){
  const [isFirstTime,setIsFirstTime]=useState<any>(null);
  const [storedPwd,setStoredPwd]=useState(""); const [storedHint,setStoredHint]=useState("");
  const [loggedIn,setLoggedIn]=useState(false); const [inputPwd,setInputPwd]=useState("");
  const [newPwd,setNewPwd]=useState(""); const [confirmPwd,setConfirmPwd]=useState(""); const [newHint,setNewHint]=useState("");
  const [activeTab,setActiveTab]=useState<TabType>("members"); const [search,setSearch]=useState("");
  const [members,setMembers]=useState<any[]>([]); const [farmers,setFarmers]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]);
  const [showAddModal,setShowAddModal]=useState(false); const [form,setForm]=useState<any>({}); const [detailItem,setDetailItem]=useState<any>(null);

  useEffect(()=>{ (async()=>{
    const pwd=await AsyncStorage.getItem(KEYS.PWD); const hint=await AsyncStorage.getItem(KEYS.HINT);
    if(!pwd) setIsFirstTime(true); else { setIsFirstTime(false); setStoredPwd(pwd); if(hint) setStoredHint(hint); }
    const load=async(k:string,set:any)=>{ const v=await AsyncStorage.getItem(k); if(v) set(JSON.parse(v)); };
    load(KEYS.MEMBERS,setMembers); load(KEYS.FARMERS,setFarmers); load(KEYS.OPERATORS,setOperators); load(KEYS.AGENTS,setAgents); load(KEYS.DEALERS,setDealers); load(KEYS.PARTS,setParts);
  })(); },[]);

  const saveList=async(tab:TabType,list:any[])=>{
    const map:any={members:KEYS.MEMBERS,farmers:KEYS.FARMERS,operators:KEYS.OPERATORS,agents:KEYS.AGENTS,dealers:KEYS.DEALERS,parts:KEYS.PARTS};
    await AsyncStorage.setItem(map[tab],JSON.stringify(list));
  };

  const handleSave=async()=>{
    const id=form.id||Date.now().toString();
    const item={...form,id};
    if(!item.name &&!item.shop){ Alert.alert("नाम जरूरी है"); return; }
    let list:any[]=[]; let set:any=null;
    if(activeTab==="members"){ list=members; set=setMembers; }
    if(activeTab==="farmers"){ list=farmers; set=setFarmers; }
    if(activeTab==="operators"){ list=operators; set=setOperators; }
    if(activeTab==="agents"){ list=agents; set=setAgents; }
    if(activeTab==="dealers"){ list=dealers; set=setDealers; }
    if(activeTab==="parts"){ list=parts; set=setParts; }
    const idx=list.findIndex((x:any)=>x.id===id);
    let newList:any[]; if(idx>=0){ newList=[...list]; newList[idx]=item; } else { newList=[item,...list]; }
    set(newList); await saveList(activeTab,newList); setForm({}); setShowAddModal(false); setDetailItem(null);
  };

  const handleDelete=async(tab:TabType,id:string)=>{
    Alert.alert("डिलीट करें?","पक्का डिलीट करना है?",[{text:"नहीं",style:"cancel"},{text:"हाँ",style:"destructive",onPress:async()=>{
      let l:any[]=[]; let set:any=null; let key="";
      if(tab==="members"){ l=members; set=setMembers; key=KEYS.MEMBERS; }
      if(tab==="farmers"){ l=farmers; set=setFarmers; key=KEYS.FARMERS; }
      if(tab==="operators"){ l=operators; set=setOperators; key=KEYS.OPERATORS; }
      if(tab==="agents"){ l=agents; set=setAgents; key=KEYS.AGENTS; }
      if(tab==="dealers"){ l=dealers; set=setDealers; key=KEYS.DEALERS; }
      if(tab==="parts"){ l=parts; set=setParts; key=KEYS.PARTS; }
      const nl=l.filter((x:any)=>x.id!==id); set(nl); await AsyncStorage.setItem(key,JSON.stringify(nl)); setDetailItem(null);
    }}]);
  };

  const getData=()=>{
    const s=search.toLowerCase();
    const filter=(arr:any[])=>arr.filter((m:any)=>{
      const a=(m.name||m.shop||"").toLowerCase(); const b=(m.mobile||""); const c=(m.address||m.village||"").toLowerCase(); const d=(m.harvesterNo||"").toLowerCase();
      return a.includes(s) || b.includes(s) || c.includes(s) || d.includes(s);
    });
    if(activeTab==="members") return filter(members);
    if(activeTab==="farmers") return filter(farmers);
    if(activeTab==="operators") return filter(operators);
    if(activeTab==="agents") return filter(agents);
    if(activeTab==="dealers") return filter(dealers);
    if(activeTab==="parts") return filter(parts);
    return [];
  };

  if(isFirstTime===null) return <View style={st.center}><Text>लोड हो रहा है...</Text></View>;

  if(isFirstTime){
    return (
      <SafeAreaView style={st.container}><ScrollView contentContainerStyle={st.authWrap}>
        <Text style={st.logo}>🌾</Text>
        <Text style={st.authTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
        <Text style={st.authSub}>जिला कांकेर, छत्तीसगढ़</Text>
        <Text style={st.welcome}>महानदी हार्वेस्टर मालिक कल्याण संघ में आपका स्वागत है</Text>
        <Text style={st.welcomeSmall}>हार्वेस्टर मालिकों का सहकारी मंच, शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
        <TextInput style={st.input} placeholder="नया पासवर्ड" secureTextEntry value={newPwd} onChangeText={setNewPwd}/>
        <TextInput style={st.input} placeholder="फिर से पासवर्ड" secureTextEntry value={confirmPwd} onChangeText={setConfirmPwd}/>
        <TextInput style={st.input} placeholder="हिंट" value={newHint} onChangeText={setNewHint}/>
        <TouchableOpacity style={st.greenBtn} onPress={async()=>{ if(newPwd.length<4||newPwd!==confirmPwd){Alert.alert("पासवर्ड गलत"); return;} await AsyncStorage.setItem(KEYS.PWD,newPwd); await AsyncStorage.setItem(KEYS.HINT,newHint); setStoredPwd(newPwd); setIsFirstTime(false); setLoggedIn(true);}}><Text style={st.greenBtnText}>शुरू करें</Text></TouchableOpacity>
      </ScrollView></SafeAreaView>
    );
  }

  if(!loggedIn){
    return (
      <SafeAreaView style={st.container}><View style={st.authWrap}>
        <Text style={st.logo}>🌾</Text>
        <Text style={st.authTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
        <Text style={st.authSub}>जिला कांकेर (छ.ग.)</Text>
        <Text style={st.welcome}>महानदी हार्वेस्टर मलिक कल्याण संघ में आपका स्वागत है</Text>
        <Text style={st.welcomeSmall}>हार्वेस्टर मालिकों का सहकारी मंच, शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
        <TextInput style={st.input} placeholder="पासवर्ड" secureTextEntry value={inputPwd} onChangeText={setInputPwd}/>
        <TouchableOpacity style={st.greenBtn} onPress={()=>{ if(inputPwd===storedPwd||inputPwd===MASTER_CODE) setLoggedIn(true); else Alert.alert("गलत पासवर्ड","हिंट: "+storedHint); }}><Text style={st.greenBtnText}>लॉगिन</Text></TouchableOpacity>
      </View></SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={st.container}>
      <View style={st.header}><Text style={st.headerTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ - कांकेर</Text></View>
      <View style={st.tabBar}><ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(["members","farmers","operators","agents","dealers","parts"] as TabType[]).map(t=>(
          <TouchableOpacity key={t} style={[st.tab, activeTab===t && st.tabActive]} onPress={()=>setActiveTab(t)}><Text style={[st.tabText, activeTab===t && st.tabTextActive]}>{t.toUpperCase()}</Text></TouchableOpacity>
        ))}
      </ScrollView></View>
      <TextInput style={st.searchInput} placeholder="खोजें: नाम, मोबाइल, पता, हार्वेस्टर नम्बर" value={search} onChangeText={setSearch}/>
      <FlatList data={getData()} keyExtractor={(i:any)=>i.id} contentContainerStyle={{paddingBottom:90}} renderItem={({item}:any)=>(
        <TouchableOpacity onPress={()=>setDetailItem(item)} style={st.card}>
          <Text style={st.cardTitle}>{item.name||item.shop}</Text>
          <Text style={st.cardSub}>{item.village||item.block||item.address||""} {item.district||""} {item.state||""}</Text>
          <Text style={st.cardSub}>मोबाइल: {item.mobile||""} {item.harvesterNo? " | H.No: "+item.harvesterNo:""}</Text>
          <Text style={{color:'#0f4d1c',marginTop:4,fontSize:12}}>टैप करें - पूरी जानकारी देखें</Text>
        </TouchableOpacity>
      )}/>
      <TouchableOpacity style={st.fab} onPress={()=>{setForm({}); setShowAddModal(true);}}><Text style={{color:'#fff',fontSize:30}}>+</Text></TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView>
        <Text style={{fontWeight:'bold',fontSize:18,textAlign:'center',marginBottom:10}}>{form.id? "अपडेट" : "नया जोड़ें"} - {activeTab}</Text>
        {activeTab==="members" && <>
          <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={v=>setForm({...form,village:v})}/>
          <TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
          <TextInput style={st.input} placeholder="हार्वेस्टर नम्बर" value={form.harvesterNo||""} onChangeText={v=>setForm({...form,harvesterNo:v})}/>
          <TextInput style={st.input} placeholder="हार्वेस्टर संख्या" value={form.harvesterCount||""} onChangeText={v=>setForm({...form,harvesterCount:v})}/>
          <TextInput style={st.input} placeholder="राशि" value={form.amount||""} onChangeText={v=>setForm({...form,amount:v})}/>
          <TextInput style={st.input} placeholder="भुगतान माध्यम" value={form.payMode||""} onChangeText={v=>setForm({...form,payMode:v})}/>
          <TextInput style={st.input} placeholder="भुगतान तारीख" value={form.payDate||""} onChangeText={v=>setForm({...form,payDate:v})}/>
          <TextInput style={st.input} placeholder="राशि प्राप्तकर्ता" value={form.receiver||""} onChangeText={v=>setForm({...form,receiver:v})}/>
          <TextInput style={st.input} placeholder="संगठन में पद" value={form.post||""} onChangeText={v=>setForm({...form,post:v})}/>
        </>}
        {activeTab==="farmers" && <>
          <TextInput style={st.input} placeholder="किसान नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={v=>setForm({...form,village:v})}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={v=>setForm({...form,district:v})}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={v=>setForm({...form,state:v})}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/>
          <TextInput style={st.input} placeholder="तारीख समय" value={form.dateTime||""} onChangeText={v=>setForm({...form,dateTime:v})}/>
          <TextInput style={st.input} placeholder="एडवांस पेमेंट" value={form.advance||""} onChangeText={v=>setForm({...form,advance:v})}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={v=>setForm({...form,fullPay:v})}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={v=>setForm({...form,complaint:v})}/>
        </>}
        {activeTab==="operators" && <>
          <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={v=>setForm({...form,village:v})}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={v=>setForm({...form,district:v})}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={v=>setForm({...form,state:v})}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={v=>setForm({...form,advance:v})}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={v=>setForm({...form,fullPay:v})}/>
          <TextInput style={st.input} placeholder="टोटल उपस्थिति" value={form.attendance||""} onChangeText={v=>setForm({...form,attendance:v})}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={v=>setForm({...form,complaint:v})}/>
        </>}
        {activeTab==="agents" && <>
          <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/>
          <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={v=>setForm({...form,village:v})}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={v=>setForm({...form,district:v})}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={v=>setForm({...form,state:v})}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={v=>setForm({...form,advance:v})}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={v=>setForm({...form,fullPay:v})}/>
          <TextInput style={st.input} placeholder="टोटल कार्य दिवस" value={form.workDays||""} onChangeText={v=>setForm({...form,workDays:v})}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={v=>setForm({...form,complaint:v})}/>
        </>}
        {activeTab==="dealers" && <>
          <TextInput style={st.input} placeholder="नाम *" value={form.shop||form.name||""} onChangeText={v=>setForm({...form,shop:v,name:v})}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={v=>setForm({...form,district:v})}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={v=>setForm({...form,state:v})}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={v=>setForm({...form,advance:v})}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={v=>setForm({...form,fullPay:v})}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={v=>setForm({...form,complaint:v})}/>
        </>}
        {activeTab==="parts" && <>
          <TextInput style={st.input} placeholder="दुकान नाम *" value={form.shop||""} onChangeText={v=>setForm({...form,shop:v})}/>
          <TextInput style={st.input} placeholder="मालिक नाम" value={form.owner||""} onChangeText={v=>setForm({...form,owner:v})}/>
          <TextInput style={st.input} placeholder="पता" value={form.address||""} onChangeText={v=>setForm({...form,address:v})}/>
          <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
          <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={v=>setForm({...form,district:v})}/>
          <TextInput style={st.input} placeholder="राज्य" value={form.state||""} onChangeText={v=>setForm({...form,state:v})}/>
          <TextInput style={st.input} placeholder="मोबाइल" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/>
          <TextInput style={st.input} placeholder="एडवांस" value={form.advance||""} onChangeText={v=>setForm({...form,advance:v})}/>
          <TextInput style={st.input} placeholder="पूरा पेमेंट" value={form.fullPay||""} onChangeText={v=>setForm({...form,fullPay:v})}/>
          <TextInput style={st.input} placeholder="शिकायत" value={form.complaint||""} onChangeText={v=>setForm({...form,complaint:v})}/>
        </>}
        <View style={{flexDirection:'row',gap:10,marginTop:10}}><TouchableOpacity style={[st.greenBtn,{flex:1}]} onPress={handleSave}><Text style={st.greenBtnText}>सेव करें</Text></TouchableOpacity><TouchableOpacity style={[st.greenBtn,{flex:1,backgroundColor:'#888'}]} onPress={()=>setShowAddModal(false)}><Text style={st.greenBtnText}>बंद</Text></TouchableOpacity></View>
      </ScrollView></View></View></Modal>

      <Modal visible={!!detailItem} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView>
        <Text style={{fontWeight:'bold',fontSize:20,textAlign:'center',color:'#0f4d1c'}}>{detailItem?.name||detailItem?.shop}</Text>
        {detailItem && <View style={{marginTop:10}}>
          <Text>नाम: {detailItem.name||detailItem.shop}</Text>
          <Text>गांव: {detailItem.village||""}</Text>
          <Text>ब्लॉक: {detailItem.block||""}</Text>
          <Text>जिला: {detailItem.district||""}</Text>
          <Text>राज्य: {detailItem.state||""}</Text>
          <Text>मोबाइल: {detailItem.mobile||""}</Text>
          <Text>हार्वेस्टर नम्बर: {detailItem.harvesterNo||""}</Text>
          <Text>हार्वेस्टर संख्या: {detailItem.harvesterCount||""}</Text>
          <Text>राशि: {detailItem.amount||""}</Text>
          <Text>भुगतान माध्यम: {detailItem.payMode||""}</Text>
          <Text>तारीख: {detailItem.payDate||detailItem.dateTime||""}</Text>
          <Text>प्राप्तकर्ता: {detailItem.receiver||""}</Text>
          <Text>पद: {detailItem.post||""}</Text>
          <Text>एडवांस: {detailItem.advance||""}</Text>
          <Text>पूरा पेमेंट: {detailItem.fullPay||""}</Text>
          <Text>उपस्थिति/कार्य दिवस: {detailItem.attendance||detailItem.workDays||""}</Text>
          <Text>शिकायत: {detailItem.complaint||""}</Text>
          <Text>पता: {detailItem.address||""}</Text>
        </View>}
        <View style={{flexDirection:'row',marginTop:12,gap:8}}>
          <TouchableOpacity style={st.callBtn} onPress={()=>Linking.openURL(`tel:${detailItem?.mobile}`)}><Text style={st.callText}>कॉल</Text></TouchableOpacity>
          <TouchableOpacity style={st.waBtn} onPress={()=>Linking.openURL(`https://wa.me/91${detailItem?.mobile}`)}><Text style={st.waText}>WhatsApp</Text></TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',gap:10,marginTop:12}}>
          <TouchableOpacity style={[st.greenBtn,{flex:1}]} onPress={()=>{ setForm(detailItem); setShowAddModal(true); }}><Text style={st.greenBtnText}>अपडेट</Text></TouchableOpacity>
          <TouchableOpacity style={[st.greenBtn,{flex:1,backgroundColor:'#d32f2f'}]} onPress={()=>handleDelete(activeTab,detailItem.id)}><Text style={st.greenBtnText}>डिलीट</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={[st.greenBtn,{backgroundColor:'#888',marginTop:10}]} onPress={()=>setDetailItem(null)}><Text style={st.greenBtnText}>बंद</Text></TouchableOpacity>
      </ScrollView></View></View></Modal>

    </SafeAreaView>
  );
}
const st=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'}, center:{flex:1,justifyContent:'ce
