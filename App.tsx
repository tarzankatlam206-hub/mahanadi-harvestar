import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, Alert, Modal, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MASTER_CODE = "122202678489";
const STORAGE_KEYS = {
  PASSWORD: "@mahanadi_pwd",
  HINT: "@mahanadi_hint",
  MEMBERS: "@mahanadi_members",
  FARMERS: "@mahanadi_farmers",
  OPERATORS: "@mahanadi_operators",
  AGENTS: "@mahanadi_agents",
  DEALERS: "@mahanadi_dealers",
  PARTS: "@mahanadi_parts",
};

type Member = { id: string; name: string; village: string; mobile: string; tractor: string; date: string; };
type Farmer = { id: string; name: string; village: string; mobile: string; crop: string; acre: string; date: string; };
type Operator = { id: string; name: string; mobile: string; license: string; exp: string; date: string; };
type Agent = { id: string; name: string; mobile: string; area: string; commission: string; date: string; };
type Dealer = { id: string; shop: string; name: string; mobile: string; city: string; date: string; };
type Part = { id: string; name: string; number: string; price: string; stock: string; date: string; };
type TabType = "members" | "farmers" | "operators" | "agents" | "dealers" | "parts";

export default function App() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [storedPwd, setStoredPwd] = useState("");
  const [storedHint, setStoredHint] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [inputPwd, setInputPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newHint, setNewHint] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("members");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const pwd = await AsyncStorage.getItem(STORAGE_KEYS.PASSWORD);
    const hint = await AsyncStorage.getItem(STORAGE_KEYS.HINT);
    if (!pwd) setIsFirstTime(true); else { setIsFirstTime(false); setStoredPwd(pwd); if(hint) setStoredHint(hint); }
    const m = await AsyncStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (m) setMembers(JSON.parse(m)); else {
      const sample: Member[] = [{ id: "1", name: "रामेश्वर साहू", village: "भाटापारा", mobile: "9827123456", tractor: "CG04 AB 1234", date: new Date().toLocaleDateString() }];
      setMembers(sample); await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(sample));
    }
    const f = await AsyncStorage.getItem(STORAGE_KEYS.FARMERS); if(f) setFarmers(JSON.parse(f));
    const o = await AsyncStorage.getItem(STORAGE_KEYS.OPERATORS); if(o) setOperators(JSON.parse(o));
    const a = await AsyncStorage.getItem(STORAGE_KEYS.AGENTS); if(a) setAgents(JSON.parse(a));
    const d = await AsyncStorage.getItem(STORAGE_KEYS.DEALERS); if(d) setDealers(JSON.parse(d));
    const p = await AsyncStorage.getItem(STORAGE_KEYS.PARTS); if(p) setParts(JSON.parse(p));
  };

  const savePassword = async () => {
    if (!newPwd || newPwd.length < 4) { Alert.alert("पासवर्ड 4 अक्षर का होना चाहिए"); return; }
    if (newPwd!== confirmPwd) { Alert.alert("पासवर्ड मेल नहीं खाता"); return; }
    await AsyncStorage.setItem(STORAGE_KEYS.PASSWORD, newPwd);
    await AsyncStorage.setItem(STORAGE_KEYS.HINT, newHint || "कोई हिंट नहीं");
    setStoredPwd(newPwd); setStoredHint(newHint); setIsFirstTime(false); setLoggedIn(true);
    setNewPwd(""); setConfirmPwd(""); setNewHint("");
  };

  const handleLogin = () => {
    if (inputPwd === storedPwd || inputPwd === MASTER_CODE) { setLoggedIn(true); setInputPwd(""); }
    else Alert.alert("गलत पासवर्ड", "हिंट: " + storedHint + "\nमास्टर कोड 122202678489 डालें");
  };

  const saveData = async (tab: TabType, list: any[]) => {
    const keyMap: any = { members: STORAGE_KEYS.MEMBERS, farmers: STORAGE_KEYS.FARMERS, operators: STORAGE_KEYS.OPERATORS, agents: STORAGE_KEYS.AGENTS, dealers: STORAGE_KEYS.DEALERS, parts: STORAGE_KEYS.PARTS };
    await AsyncStorage.setItem(keyMap[tab], JSON.stringify(list));
  };

  const handleAdd = async () => {
    const id = Date.now().toString(); const date = new Date().toLocaleDateString();
    if (activeTab === "members") { if (!form.name ||!form.mobile) { Alert.alert("नाम और मोबाइल जरूरी"); return; } const l = [{ id, name: form.name, village: form.village||"", mobile: form.mobile, tractor: form.tractor||"", date },...members]; setMembers(l); await saveData("members", l); }
    if (activeTab === "farmers") { const l = [{ id, name: form.name, village: form.village||"", mobile: form.mobile, crop: form.crop||"", acre: form.acre||"", date },...farmers]; setFarmers(l); await saveData("farmers", l); }
    if (activeTab === "operators") { const l = [{ id, name: form.name, mobile: form.mobile, license: form.license||"", exp: form.exp||"", date },...operators]; setOperators(l); await saveData("operators", l); }
    if (activeTab === "agents") { const l = [{ id, name: form.name, mobile: form.mobile, area: form.area||"", commission: form.commission||"", date },...agents]; setAgents(l); await saveData("agents", l); }
    if (activeTab === "dealers") { const l = [{ id, shop: form.shop, name: form.name||"", mobile: form.mobile, city: form.city||"", date },...dealers]; setDealers(l); await saveData("dealers", l); }
    if (activeTab === "parts") { const l = [{ id, name: form.name, number: form.number||"", price: form.price, stock: form.stock||"", date },...parts]; setParts(l); await saveData("parts", l); }
    setForm({}); setShowAddModal(false);
  };

  const getFilteredData = () => {
    const s = search.toLowerCase();
    if (activeTab === "members") return members.filter(m => m.name.toLowerCase().includes(s) || m.mobile.includes(s));
    if (activeTab === "farmers") return farmers.filter(m => m.name.toLowerCase().includes(s));
    if (activeTab === "operators") return operators;
    if (activeTab === "agents") return agents;
    if (activeTab === "dealers") return dealers;
    if (activeTab === "parts") return parts;
    return [];
  };

  if (isFirstTime === null) return <View style={styles.center}><Text>लोड हो रहा है...</Text></View>;

  if (isFirstTime) {
    return (<SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.authWrap}><Text style={styles.logo}>🌾</Text><Text style={styles.authTitle}>महानदी हार्वेस्टर</Text><Text style={styles.authSub}>पहली बार? पासवर्ड बनाएं</Text><TextInput style={styles.input} placeholder="नया पासवर्ड" secureTextEntry={!showPwd} value={newPwd} onChangeText={setNewPwd}/><TextInput style={styles.input} placeholder="फिर से पासवर्ड" secureTextEntry={!showPwd} value={confirmPwd} onChangeText={setConfirmPwd}/><TextInput style={styles.input} placeholder="हिंट" value={newHint} onChangeText={setNewHint}/><TouchableOpacity style={styles.greenBtn} onPress={savePassword}><Text style={styles.greenBtnText}>पासवर्ड बनाएं</Text></TouchableOpacity></ScrollView></SafeAreaView>);
  }

  if (!loggedIn) {
    return (<SafeAreaView style={styles.container}><View style={styles.authWrap}><Text style={styles.logo}>🌾</Text><Text style={styles.authTitle}>लॉगिन करें</Text><TextInput style={styles.input} placeholder="पासवर्ड" secureTextEntry={!showPwd} value={inputPwd} onChangeText={setInputPwd}/><TouchableOpacity style={styles.greenBtn} onPress={handleLogin}><Text style={styles.greenBtnText}>लॉगिन</Text></TouchableOpacity><Text style={{marginTop:10,color:'#666'}}>हिंट: {storedHint}</Text></View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}><ScrollView horizontal showsHorizontalScrollIndicator={false}>{(["members","farmers","operators","agents","dealers","parts"] as TabType[]).map(t=>(<TouchableOpacity key={t} style={[styles.tab, activeTab===t && styles.tabActive]} onPress={()=>setActiveTab(t)}><Text style={[styles.tabText, activeTab===t && styles.tabTextActive]}>{t}</Text></TouchableOpacity>))}</ScrollView></View>
      <TextInput style={styles.searchInput} placeholder="खोजें..." value={search} onChangeText={setSearch}/>
      <FlatList data={getFilteredData()} keyExtractor={i=>i.id} renderItem={({item})=> (<View style={styles.card}><Text style={styles.cardTitle}>{item.name || item.shop}</Text><Text style={styles.cardSub}>{item.mobile || item.price}</Text><View style={{flexDirection:'row',marginTop:6}}>{item.mobile && <><TouchableOpacity style={styles.callBtn} onPress={()=>Linking.openURL(`tel:${item.mobile}`)}><Text style={styles.callText}>कॉल</Text></TouchableOpacity><TouchableOpacity style={styles.waBtn} onPress={()=>Linking.openURL(`https://wa.me/91${item.mobile}`)}><Text style={styles.waText}>WhatsApp</Text></TouchableOpacity></>}</View></View>)} />
      <TouchableOpacity style={styles.fab} onPress={()=>setShowAddModal(true)}><Text style={{color:'#fff',fontSize:24}}>+</Text></TouchableOpacity>
      <Modal visible={showAddModal} animationType="slide" transparent><View style={styles.modalWrap}><View style={styles.modalBox}><Text style={{fontWeight:'bold',marginBottom:10}}>नया जोड़ें - {activeTab}</Text><TextInput style={styles.input} placeholder="नाम / दुकान" value={form.name || form.shop || ""} onChangeText={v=>setForm({...form, name:v, shop:v})}/><TextInput style={styles.input} placeholder="मोबाइल / कीमत" value={form.mobile || form.price || ""} onChangeText={v=>setForm({...form, mobile:v, price:v})}/><TextInput style={styles.input} placeholder="गांव / शहर" value={form.village || form.city || ""} onChangeText={v=>setForm({...form, village:v, city:v})}/><View style={{flexDirection:'row',gap:10}}><TouchableOpacity style={[styles.greenBtn,{flex:1}]} onPress={handleAdd}><Text style={styles.greenBtnText}>सेव करें</Text></TouchableOpacity><TouchableOpacity style={[styles.greenBtn,{flex:1,backgroundColor:'#888'}]} onPress={()=>setShowAddModal(false)}><Text style={styles.greenBtnText}>बंद</Text></TouchableOpacity></View></View></View></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f5f5'}, center:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#0f4d1c'}, authWrap:{flex:1,justifyContent:'center',padding:20}, logo:{fontSize:60,textAlign:'center'}, authTitle:{fontSize:22,fontWeight:'bold',textAlign:'center',color:'#0f4d1c',marginVertical:10}, authSub:{textAlign:'center',color:'#666',marginBottom:15},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:10,backgroundColor:'#fff'}, greenBtn:{backgroundColor:'#0f4d1c',padding:14,borderRadius:8,alignItems:'center'}, greenBtnText:{color:'#fff',fontWeight:'bold'},
  tabBar:{backgroundColor:'#fff',paddingVertical:8,borderBottomWidth:1,borderColor:'#ddd'}, tab:{paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:'#e0e0e0',marginHorizontal:4}, tabActive:{backgroundColor:'#0f4d1c'}, tabText:{color:'#333'}, tabTextActive:{color:'#fff'}, searchInput:{margin:10,backgroundColor:'#fff',borderRadius:8,padding:10,borderWidth:1,borderColor:'#ccc'},
  card:{backgroundColor:'#fff',marginHorizontal:10,marginBottom:8,padding:12,borderRadius:10}, cardTitle:{fontWeight:'bold',fontSize:16}, cardSub:{color:'#555',marginTop:4},
  callBtn:{backgroundColor:'#0f4d1c',paddingHorizontal:12,paddingVertical:6,borderRadius:6,marginRight:8}, callText:{color:'#fff'}, waBtn:{backgroundColor:'#25D366',paddingHorizontal:12,paddingVertical:6,borderRadius:6}, waText:{color:'#fff'},
  fab:{position:'absolute',bottom:20,right:20,width:56,height:56,borderRadius:28,backgroundColor:'#0f4d1c',justifyContent:'center',alignItems:'center'}, modalWrap:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:20}, modalBox:{backgroundColor:'#fff',borderRadius:12,padding:16}
});
