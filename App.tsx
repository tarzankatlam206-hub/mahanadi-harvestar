import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert, Modal, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MASTER_CODE = "122202678489";
const KEYS = { PWD: "@mahanadi_pwd", HINT: "@mahanadi_hint", MEMBERS: "@mahanadi_members", FARMERS: "@mahanadi_farmers", OPERATORS: "@mahanadi_operators", AGENTS: "@mahanadi_agents", DEALERS: "@mahanadi_dealers", PARTS: "@mahanadi_parts" };
type TabType = "members"|"farmers"|"operators"|"agents"|"dealers"|"parts";

export default function App(){
  const [isFirstTime,setIsFirstTime]=useState<boolean|null>(null);
  const [storedPwd,setStoredPwd]=useState(""); const [storedHint,setStoredHint]=useState("");
  const [loggedIn,setLoggedIn]=useState(false); const [inputPwd,setInputPwd]=useState("");
  const [newPwd,setNewPwd]=useState(""); const [confirmPwd,setConfirmPwd]=useState(""); const [newHint,setNewHint]=useState("");
  const [activeTab,setActiveTab]=useState<TabType>("members"); const [search,setSearch]=useState("");
  const [members,setMembers]=useState<any[]>([]); const [farmers,setFarmers]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]);
  const [showAddModal,setShowAddModal]=useState(false); const [form,setForm]=useState<any>({});

  useEffect(()=>{ (async()=>{
    const pwd=await AsyncStorage.getItem(KEYS.PWD); const hint=await AsyncStorage.getItem(KEYS.HINT);
    if(!pwd) setIsFirstTime(true); else { setIsFirstTime(false); setStoredPwd(pwd); if(hint) setStoredHint(hint); }
    const m=await AsyncStorage.getItem(KEYS.MEMBERS); if(m) setMembers(JSON.parse(m));
    const f=await AsyncStorage.getItem(KEYS.FARMERS); if(f) setFarmers(JSON.parse(f));
    const o=await AsyncStorage.getItem(KEYS.OPERATORS); if(o) setOperators(JSON.parse(o));
    const a=await AsyncStorage.getItem(KEYS.AGENTS); if(a) setAgents(JSON.parse(a));
    const d=await AsyncStorage.getItem(KEYS.DEALERS); if(d) setDealers(JSON.parse(d));
    const p=await AsyncStorage.getItem(KEYS.PARTS); if(p) setParts(JSON.parse(p));
  })(); },[]);

  const savePassword=async()=>{
    if(newPwd.length<4){Alert.alert("4 अक्षर का पासवर्ड"); return;}
    if(newPwd!==confirmPwd){Alert.alert("पासवर्ड मेल नहीं खाता"); return;}
    await AsyncStorage.setItem(KEYS.PWD,newPwd); await AsyncStorage.setItem(KEYS.HINT,newHint||"");
    setStoredPwd(newPwd); setStoredHint(newHint); setIsFirstTime(false); setLoggedIn(true);
  };
  const handleLogin=()=>{ if(inputPwd===storedPwd||inputPwd===MASTER_CODE){setLoggedIn(true); setInputPwd("");} else Alert.alert("गलत पासवर्ड","हिंट: "+storedHint+"\nमास्टर: 122202678489"); };

  const saveList=async(tab:TabType,list:any[])=>{
    const map:any={members:KEYS.MEMBERS,farmers:KEYS.FARMERS,operators:KEYS.OPERATORS,agents:KEYS.AGENTS,dealers:KEYS.DEALERS,parts:KEYS.PARTS};
    await AsyncStorage.setItem(map[tab],JSON.stringify(list));
  };
  const handleAdd=async()=>{
    const id=Date.now().toString(); const date=new Date().toLocaleDateString();
    if(activeTab==="members"){
      if(!form.name||!form.mobile){Alert.alert("नाम और मोबाइल जरूरी"); return;}
      const item={id,date,...form}; const l=[item,...members]; setMembers(l); await saveList("members",l);
    } else if(activeTab==="farmers"){ const l=[{id,date,...form},...farmers]; setFarmers(l); await saveList("farmers",l); }
    else if(activeTab==="operators"){ const l=[{id,date,...form},...operators]; setOperators(l); await saveList("operators",l); }
    else if(activeTab==="agents"){ const l=[{id,date,...form},...agents]; setAgents(l); await saveList("agents",l); }
    else if(activeTab==="dealers"){ const l=[{id,date,...form},...dealers]; setDealers(l); await saveList("dealers",l); }
    else if(activeTab==="parts"){ const l=[{id,date,...form},...parts]; setParts(l); await saveList("parts",l); }
    setForm({}); setShowAddModal(false);
  };
  const handleDelete=(tab:TabType,id:string)=>{
    Alert.alert("डिलीट करें?","पक्का डिलीट करना है?",[{text:"नहीं",style:"cancel"},{text:"हाँ",style:"destructive",onPress:async()=>{
      if(tab==="members"){const l=members.filter(x=>x.id!==id); setMembers(l); await saveList(tab,l);}
      if(tab==="farmers"){const l=farmers.filter(x=>x.id!==id); setFarmers(l); await saveList(tab,l);}
      if(tab==="operators"){const l=operators.filter(x=>x.id!==id); setOperators(l); await saveList(tab,l);}
      if(tab==="agents"){const l=agents.filter(x=>x.id!==id); setAgents(l); await saveList(tab,l);}
      if(tab==="dealers"){const l=dealers.filter(x=>x.id!==id); setDealers(l); await saveList(tab,l);}
      if(tab==="parts"){const l=parts.filter(x=>x.id!==id); setParts(l); await saveList(tab,l);}
    }}]);
  };

  const getData=()=>{
    const s=search.toLowerCase();
    if(activeTab==="members") return members.filter(m=>(m.name||"").toLowerCase().includes(s)||(m.mobile||"").includes(s)||(m.village||"").toLowerCase().includes(s));
    if(activeTab==="farmers") return farmers.filter(m=>(m.name||"").toLowerCase().includes(s));
    if(activeTab==="operators") return operators; if(activeTab==="agents") return agents; if(activeTab==="dealers") return dealers; if(activeTab==="parts") return parts; return [];
  };

  const renderForm=()=>{
    if(activeTab==="members") return (<>
      <TextInput style={st.input} placeholder="नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/>
      <TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={v=>setForm({...form,village:v})}/>
      <TextInput style={st.input} placeholder="मोबाइल *" keyboardType="phone-pad" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/>
      <TextInput style={st.input} placeholder="ब्लॉक" value={form.block||""} onChangeText={v=>setForm({...form,block:v})}/>
      <TextInput style={st.input} placeholder="जिला" value={form.district||""} onChangeText={v=>setForm({...form,district:v})}/>
      <TextInput style={st.input} placeholder="ट्रैक्टर/हार्वेस्टर नंबर" value={form.tractor||""} onChangeText={v=>setForm({...form,tractor:v})}/>
      <TextInput style={st.input} placeholder="कंपनी (John Deere etc)" value={form.company||""} onChangeText={v=>setForm({...form,company:v})}/>
      <TextInput style={st.input} placeholder="मॉडल" value={form.model||""} onChangeText={v=>setForm({...form,model:v})}/>
      <TextInput style={st.input} placeholder="राशि" keyboardType="numeric" value={form.amount||""} onChangeText={v=>setForm({...form,amount:v})}/>
      <TextInput style={st.input} placeholder="पता" value={form.address||""} onChangeText={v=>setForm({...form,address:v})}/>
    </>);
    if(activeTab==="farmers") return (<><TextInput style={st.input} placeholder="किसान नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/><TextInput style={st.input} placeholder="गांव" value={form.village||""} onChangeText={v=>setForm({...form,village:v})}/><TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/><TextInput style={st.input} placeholder="फसल" value={form.crop||""} onChangeText={v=>setForm({...form,crop:v})}/><TextInput style={st.input} placeholder="एकड़" value={form.acre||""} onChangeText={v=>setForm({...form,acre:v})}/></>);
    if(activeTab==="operators") return (<><TextInput style={st.input} placeholder="ऑपरेटर नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/><TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/><TextInput style={st.input} placeholder="लाइसेंस" value={form.license||""} onChangeText={v=>setForm({...form,license:v})}/><TextInput style={st.input} placeholder="अनुभव" value={form.exp||""} onChangeText={v=>setForm({...form,exp:v})}/></>);
    if(activeTab==="agents") return (<><TextInput style={st.input} placeholder="एजेंट नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/><TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/><TextInput style={st.input} placeholder="क्षेत्र" value={form.area||""} onChangeText={v=>setForm({...form,area:v})}/><TextInput style={st.input} placeholder="कमीशन %" value={form.commission||""} onChangeText={v=>setForm({...form,commission:v})}/></>);
    if(activeTab==="dealers") return (<><TextInput style={st.input} placeholder="दुकान नाम *" value={form.shop||""} onChangeText={v=>setForm({...form,shop:v})}/><TextInput style={st.input} placeholder="मालिक नाम" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/><TextInput style={st.input} placeholder="मोबाइल *" value={form.mobile||""} onChangeText={v=>setForm({...form,mobile:v})}/><TextInput style={st.input} placeholder="शहर" value={form.city||""} onChangeText={v=>setForm({...form,city:v})}/></>);
    if(activeTab==="parts") return (<><TextInput style={st.input} placeholder="पार्ट नाम *" value={form.name||""} onChangeText={v=>setForm({...form,name:v})}/><TextInput style={st.input} placeholder="नंबर" value={form.number||""} onChangeText={v=>setForm({...form,number:v})}/><TextInput style={st.input} placeholder="कीमत *" value={form.price||""} onChangeText={v=>setForm({...form,price:v})}/><TextInput style={st.input} placeholder="स्टॉक" value={form.stock||""} onChangeText={v=>setForm({...form,stock:v})}/></>);
    return null;
  };

  if(isFirstTime===null) return <View style={st.center}><Text>लोड...</Text></View>;
  if(isFirstTime) return (<SafeAreaView style={st.container}><ScrollView contentContainerStyle={st.authWrap}><Text style={st.logo}>🌾</Text><Text style={st.authTitle}>महानदी हार्वेस्टर</Text><TextInput style={st.input} placeholder="नया पासवर्ड" secureTextEntry value={newPwd} onChangeText={setNewPwd}/><TextInput style={st.input} placeholder="फिर से पासवर्ड" secureTextEntry value={confirmPwd} onChangeText={setConfirmPwd}/><TextInput style={st.input} placeholder="हिंट" value={newHint} onChangeText={setNewHint}/><TouchableOpacity style={st.greenBtn} onPress={savePassword}><Text style={st.greenBtnText}>पासवर्ड बनाएं</Text></TouchableOpacity></ScrollView></SafeAreaView>);
  if(!loggedIn) return (<SafeAreaView style={st.container}><View style={st.authWrap}><Text style={st.logo}>🌾</Text><Text style={st.authTitle}>लॉगिन</Text><TextInput style={st.input} placeholder="पासवर्ड" secureTextEntry value={inputPwd} onChangeText={setInputPwd}/><TouchableOpacity style={st.greenBtn} onPress={handleLogin}><Text style={st.greenBtnText}>लॉगिन</Text></TouchableOpacity><Text style={{marginTop:10}}>हिंट: {storedHint}</Text></View></SafeAreaView>);

  return (
    <SafeAreaView style={st.container}>
      <View style={st.header}><Text style={st.headerTitle}>महानदी हार्वेस्टर संघ</Text></View>
      <View style={st.tabBar}><ScrollView horizontal showsHorizontalScrollIndicator={false}>{(["members","farmers","operators","agents","dealers","parts"] as TabType[]).map(t=>(<TouchableOpacity key={t} style={[st.tab, activeTab===t && st.tabActive]} onPress={()=>setActiveTab(t)}><Text style={[st.tabText, activeTab===t && st.tabTextActive]}>{t.toUpperCase()}</Text></TouchableOpacity>))}</ScrollView></View>
      <TextInput style={st.searchInput} placeholder="खोजें... नाम, गांव, मोबाइल" value={search} onChangeText={setSearch}/>
      <FlatList data={getData()} keyExtractor={i=>i.id} contentContainerStyle={{paddingBottom:80}} renderItem={({item})=> (
        <View style={st.card}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={st.cardTitle}>{item.name||item.shop}</Text>
            <TouchableOpacity onPress={()=>handleDelete(activeTab,item.id)} style={st.deleteBtn}><Text style={{color:'#fff',fontWeight:'bold'}}>🗑️ डिलीट</Text></TouchableOpacity>
          </View>
          {activeTab==="members" && <><Text style={st.cardSub}>गांव: {item.village} | ब्लॉक: {item.block} | जिला: {item.district}</Text><Text style={st.cardSub}>ट्रैक्टर: {item.tractor} | {item.company} {item.model}</Text><Text style={st.cardSub}>राशि: ₹{item.amount} | पता: {item.address}</Text><Text style={st.cardSub}>📱 {item.mobile}</Text></>}
          {activeTab!=="members" && activeTab!=="parts" && <Text style={st.cardSub}>📱 {item.mobile}</Text>}
          {activeTab==="parts" && <Text style={st.cardSub}>नंबर: {item.number} | ₹{item.price} | स्टॉक: {item.stock}</Text>}
          <View style={{flexDirection:'row',marginTop:8}}>
            {item.mobile && activeTab!=="parts" && <>
              <TouchableOpacity style={st.callBtn} onPress={()=>Linking.openURL(`tel:${item.mobile}`)}><Text style={st.callText}>📞 कॉल</Text></TouchableOpacity>
              <TouchableOpacity style={st.waBtn} onPress={()=>Linking.openURL(`https://wa.me/91${item.mobile}`)}><Text style={st.waText}>💬 WhatsApp</Text></TouchableOpacity>
            </>}
            <Text style={{marginLeft:'auto',fontSize:10,color:'#888'}}>{item.date}</Text>
          </View>
        </View>
      )}/>
      <TouchableOpacity style={st.fab} onPress={()=>setShowAddModal(true)}><Text style={{color:'#fff',fontSize:30}}>+</Text></TouchableOpacity>
      <Modal visible={showAddModal} animationType="slide" transparent><View style={st.modalWrap}><View style={st.modalBox}><ScrollView><Text style={{fontWeight:'bold',fontSize:18,marginBottom:10,textAlign:'center'}}>नया {activeTab} जोड़ें</Text>{renderForm()}<View style={{flexDirection:'row',gap:10,marginTop:10}}><TouchableOpacity style={[st.greenBtn,{flex:1}]} onPress={handleAdd}><Text style={st.greenBtnText}>💾 सेव करें</Text></TouchableOpacity><TouchableOpacity style={[st.greenBtn,{flex:1,backgroundColor:'#888'}]} onPress={()=>setShowAddModal(false)}><Text style={st.greenBtnText}>बंद</Text></TouchableOpacity></View></ScrollView></View></View></Modal>
    </SafeAreaView>
  );
}
const st=StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'}, center:{flex:1,justifyContent:'center',alignItems:'center'}, authWrap:{flex:1,justifyContent:'center',padding:20}, logo:{fontSize:60,textAlign:'center'}, authTitle:{fontSize:22,fontWeight:'bold',textAlign:'center',color:'#0f4d1c',marginVertical:10},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:10,backgroundColor:'#fff'}, greenBtn:{backgroundColor:'#0f4d1c',padding:14,borderRadius:8,alignItems:'center'}, greenBtnText:{color:'#fff',fontWeight:'bold'},
  header:{backgroundColor:'#0f4d1c',padding:12}, headerTitle:{color:'#fff',fontWeight:'bold',textAlign:'center',fontSize:18},
  tabBar:{backgroundColor:'#fff',paddingVertical:8,borderBottomWidth:1,borderColor:'#ddd'}, tab:{paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:'#e0e0e0',marginHorizontal:4}, tabActive:{backgroundColor:'#0f4d1c'}, tabText:{color:'#333',fontSize:12}, tabTextActive:{color:'#fff'}, searchInput:{margin:10,backgroundColor:'#fff',borderRadius:8,padding:10,borderWidth:1,borderColor:'#ccc'},
  card:{backgroundColor:'#fff',marginHorizontal:10,marginBottom:8,padding:12,borderRadius:10,elevation:2}, cardTitle:{fontWeight:'bold',fontSize:16,color:'#0f4d1c'}, cardSub:{color:'#555',marginTop:4,fontSize:13},
  callBtn:{backgroundColor:'#0f4d1c',paddingHorizontal:12,paddingVertical:6,borderRadius:6,marginRight:8}, callText:{color:'#fff'}, waBtn:{backgroundColor:'#25D366',paddingHorizontal:12,paddingVertical:6,borderRadius:6}, waText:{color:'#fff'},
  deleteBtn:{backgroundColor:'#d32f2f',paddingHorizontal:10,paddingVertical:4,borderRadius:6}, fab:{position:'absolute',bottom:20,right:20,width:60,height:60,borderRadius:30,backgroundColor:'#0f4d1c',justifyContent:'center',alignItems:'center',elevation:5},
  modalWrap:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:20}, modalBox:{backgroundColor:'#fff',borderRadius:12,padding:16,maxHeight:'90%'}
});
