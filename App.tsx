import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  FlatList, StyleSheet, Linking, Alert, Modal, SafeAreaView
} from 'react-native';
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
  const [storedPwd, setStoredPwd] = useState<string>("");
  const [storedHint, setStoredHint] = useState<string>("");
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

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const pwd = await AsyncStorage.getItem(STORAGE_KEYS.PASSWORD);
      const hint = await AsyncStorage.getItem(STORAGE_KEYS.HINT);
      if (!pwd) {
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
        setStoredPwd(pwd);
        if (hint) setStoredHint(hint);
      }
      const m = await AsyncStorage.getItem(STORAGE_KEYS.MEMBERS);
      const f = await AsyncStorage.getItem(STORAGE_KEYS.FARMERS);
      const o = await AsyncStorage.getItem(STORAGE_KEYS.OPERATORS);
      const a = await AsyncStorage.getItem(STORAGE_KEYS.AGENTS);
      const d = await AsyncStorage.getItem(STORAGE_KEYS.DEALERS);
      const p = await AsyncStorage.getItem(STORAGE_KEYS.PARTS);
      if (m) setMembers(JSON.parse(m));
      if (f) setFarmers(JSON.parse(f));
      if (o) setOperators(JSON.parse(o));
      if (a) setAgents(JSON.parse(a));
      if (d) setDealers(JSON.parse(d));
      if (p) setParts(JSON.parse(p));
      if (!m) {
        const sample: Member[] = [
          { id: "1", name: "रामेश्वर साहू", village: "भाटापारा", mobile: "9827123456", tractor: "CG04 AB 1234", date: new Date().toLocaleDateString() },
          { id: "2", name: "दिलीप वर्मा", village: "बलौदाबाजार", mobile: "9827987654", tractor: "CG04 CD 5678", date: new Date().toLocaleDateString() },
        ];
        setMembers(sample);
        await AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(sample));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const savePassword = async () => {
    if (!newPwd || newPwd.length < 4) {
      Alert.alert("त्रुटि", "पासवर्ड कम से कम 4 अक्षर का होना चाहिए");
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("त्रुटि", "पासवर्ड मेल नहीं खाता");
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.PASSWORD, newPwd);
    await AsyncStorage.setItem(STORAGE_KEYS.HINT, newHint || "कोई हिंट नहीं");
    setStoredPwd(newPwd);
    setStoredHint(newHint);
    setIsFirstTime(false);
    setNewPwd("");
    setConfirmPwd("");
    setNewHint("");
    Alert.alert("सफल", "पासवर्ड बना दिया गया!");
  };

  const handleLogin = () => {
    if (inputPwd === storedPwd || inputPwd === MASTER_CODE) {
      setIsFirstTime(false);
      setInputPwd("");
    } else {
      Alert.alert("गलत पासवर्ड", "हिंट: " + storedHint + "\nभूल गए? मास्टर कोड 122202678489 डालें");
    }
  };

  const handleLogout = () => {
    setIsFirstTime(false);
    setInputPwd("");
    setActiveTab("members");
  };

  const callNumber = (num: string) => {
    Linking.openURL("tel:" + num);
  };

  const whatsappNumber = (num: string) => {
    Linking.openURL("https://wa.me/91" + num + "?text=" + encodeURIComponent("नमस्ते, महानदी हार्वेस्टर संघ से बात करनी है।"));
  };

  const generateId = () => Date.now().toString() + Math.random().toString().slice(2, 5);

  const saveData = async (tab: TabType, list: any[]) => {
    const keyMap: any = {
      members: STORAGE_KEYS.MEMBERS,
      farmers: STORAGE_KEYS.FARMERS,
      operators: STORAGE_KEYS.OPERATORS,
      agents: STORAGE_KEYS.AGENTS,
      dealers: STORAGE_KEYS.DEALERS,
      parts: STORAGE_KEYS.PARTS,
    };
    await AsyncStorage.setItem(keyMap[tab], JSON.stringify(list));
  };

  const handleAdd = async () => {
    const id = generateId();
    const date = new Date().toLocaleDateString();
    if (activeTab === "members") {
      if (!form.name || !form.mobile) { Alert.alert("नाम और मोबाइल जरूरी है"); return; }
      const newList = [{ id, name: form.name, village: form.village || "", mobile: form.mobile, tractor: form.tractor || "", date }, ...members];
      setMembers(newList); await saveData("members", newList);
    } else if (activeTab === "farmers") {
      if (!form.name || !form.mobile) { Alert.alert("नाम और मोबाइल जरूरी है"); return; }
      const newList = [{ id, name: form.name, village: form.village || "", mobile: form.mobile, crop: form.crop || "", acre: form.acre || "", date }, ...farmers];
      setFarmers(newList); await saveData("farmers", newList);
    } else if (activeTab === "operators") {
      if (!form.name || !form.mobile) { Alert.alert("नाम और मोबाइल जरूरी है"); return; }
      const newList = [{ id, name: form.name, mobile: form.mobile, license: form.license || "", exp: form.exp || "", date }, ...operators];
      setOperators(newList); await saveData("operators", newList);
    } else if (activeTab === "agents") {
      if (!form.name || !form.mobile) { Alert.alert("नाम और मोबाइल जरूरी है"); return; }
      const newList = [{ id, name: form.name, mobile: form.mobile, area: form.area || "", commission: form.commission || "", date }, ...agents];
      setAgents(newList); await saveData("agents", newList);
    } else if (activeTab === "dealers") {
      if (!form.shop || !form.mobile) { Alert.alert("दुकान और मोबाइल जरूरी है"); return; }
      const newList = [{ id, shop: form.shop, name: form.name || "", mobile: form.mobile, city: form.city || "", date }, ...dealers];
      setDealers(newList); await saveData("dealers", newList);
    } else if (activeTab === "parts") {
      if (!form.name || !form.price) { Alert.alert("पार्ट नाम और कीमत जरूरी है"); return; }
      const newList = [{ id, name: form.name, number: form.number || "", price: form.price, stock: form.stock || "", date }, ...parts];
      setParts(newList); await saveData("parts", newList);
    }
    setForm({}); setShowAddModal(false);
  };

  const handleDelete = async (tab: TabType, id: string) => {
    Alert.alert("डिलीट करें?", "क्या आप पक्का डिलीट करना चाहते हैं?", [
      { text: "नहीं", style: "cancel" },
      {
        text: "हाँ", style: "destructive", onPress: async () => {
          if (tab === "members") { const l = members.filter(x => x.id !== id); setMembers(l); await saveData(tab, l); }
          if (tab === "farmers") { const l = farmers.filter(x => x.id !== id); setFarmers(l); await saveData(tab, l); }
          if (tab === "operators") { const l = operators.filter(x => x.id !== id); setOperators(l); await saveData(tab, l); }
          if (tab === "agents") { const l = agents.filter(x => x.id !== id); setAgents(l); await saveData(tab, l); }
          if (tab === "dealers") { const l = dealers.filter(x => x.id !== id); setDealers(l); await saveData(tab, l); }
          if (tab === "parts") { const l = parts.filter(x => x.id !== id); setParts(l); await saveData(tab, l); }
        }
      }
    ]);
  };

  const getFilteredData = () => {
    const s = search.toLowerCase();
    if (activeTab === "members") return members.filter(m => m.name.toLowerCase().includes(s) || m.village.toLowerCase().includes(s) || m.mobile.includes(s));
    if (activeTab === "farmers") return farmers.filter(m => m.name.toLowerCase().includes(s) || m.village.toLowerCase().includes(s) || m.mobile.includes(s));
    if (activeTab === "operators") return operators.filter(m => m.name.toLowerCase().includes(s) || m.mobile.includes(s));
    if (activeTab === "agents") return agents.filter(m => m.name.toLowerCase().includes(s) || m.area.toLowerCase().includes(s));
    if (activeTab === "dealers") return dealers.filter(m => m.shop.toLowerCase().includes(s) || m.city.toLowerCase().includes(s));
    if (activeTab === "parts") return parts.filter(m => m.name.toLowerCase().includes(s) || m.number.toLowerCase().includes(s));
    return [];
  };

  const renderAddForm = () => {
    if (activeTab === "members") {
      return (<>
        <TextInput style={styles.input} placeholder="नाम *" value={form.name || ""} onChangeText={v => setForm({ ...form, name: v })} />
        <TextInput style={styles.input} placeholder="गांव" value={form.village || ""} onChangeText={v => setForm({ ...form, village: v })} />
        <TextInput style={styles.input} placeholder="मोबाइल *" keyboardType="phone-pad" value={form.mobile || ""} onChangeText={v => setForm({ ...form, mobile: v })} />
        <TextInput style={styles.input} placeholder="ट्रैक्टर नंबर" value={form.tractor || ""} onChangeText={v => setForm({ ...form, tractor: v })} />
      </>);
    }
    if (activeTab === "farmers") {
      return (<>
        <TextInput style={styles.input} placeholder="किसान नाम *" value={form.name || ""} onChangeText={v => setForm({ ...form, name: v })} />
        <TextInput style={styles.input} placeholder="गांव" value={form.village || ""} onChangeText={v => setForm({ ...form, village: v })} />
        <TextInput style={styles.input} placeholder="मोबाइल *" keyboardType="phone-pad" value={form.mobile || ""} onChangeText={v => setForm({ ...form, mobile: v })} />
        <TextInput style={styles.input} placeholder="फसल (धान, गेहूं)" value={form.crop || ""} onChangeText={v => setForm({ ...form, crop: v })} />
        <TextInput style={styles.input} placeholder="एकड़" value={form.acre || ""} onChangeText={v => setForm({ ...form, acre: v })} />
      </>);
    }
    if (activeTab === "operators") {
      return (<>
        <TextInput style={styles.input} placeholder="ऑपरेटर नाम *" value={form.name || ""} onChangeText={v => setForm({ ...form, name: v })} />
        <TextInput style={styles.input} placeholder="मोबाइल *" keyboardType="phone-pad" value={form.mobile || ""} onChangeText={v => setForm({ ...form, mobile: v })} />
        <TextInput style={styles.input} placeholder="लाइसेंस नंबर" value={form.license || ""} onChangeText={v => setForm({ ...form, license: v })} />
        <TextInput style={styles.input} placeholder="अनुभव (साल)" value={form.exp || ""} onChangeText={v => setForm({ ...form, exp: v })} />
      </>);
    }
    if (activeTab === "agents") {
      return (<>
        <TextInput style={styles.input} placeholder="एजेंट नाम *" value={form.name || ""} onChangeText={v => setForm({ ...form, name: v })} />
        <TextInput style={styles.input} placeholder="मोबाइल *" keyboardType="phone-pad" value={form.mobile || ""} onChangeText={v => setForm({ ...form, mobile: v })} />
        <TextInput style={styles.input} placeholder="क्षेत्र" value={form.area || ""} onChangeText={v => setForm({ ...form, area: v })} />
        <TextInput style={styles.input} placeholder="कमीशन %" value={form.commission || ""} onChangeText={v => setForm({ ...form, commission: v })} />
      </>);
    }
    if (activeTab === "dealers") {
      return (<>
        <TextInput style={styles.input} placeholder="दुकान नाम *" value={form.shop || ""} onChangeText={v => setForm({ ...form, shop: v })} />
        <TextInput style={styles.input} placeholder="मालिक नाम" value={form.name || ""} onChangeText={v => setForm({ ...form, name: v })} />
        <TextInput style={styles.input} placeholder="मोबाइल *" keyboardType="phone-pad" value={form.mobile || ""} onChangeText={v => setForm({ ...form, mobile: v })} />
        <TextInput style={styles.input} placeholder="शहर" value={form.city || ""} onChangeText={v => setForm({ ...form, city: v })} />
      </>);
    }
    if (activeTab === "parts") {
      return (<>
        <TextInput style={styles.input} placeholder="पार्ट नाम *" value={form.name || ""} onChangeText={v => setForm({ ...form, name: v })} />
        <TextInput style={styles.input} placeholder="पार्ट नंबर" value={form.number || ""} onChangeText={v => setForm({ ...form, number: v })} />
        <TextInput style={styles.input} placeholder="कीमत *" keyboardType="numeric" value={form.price || ""} onChangeText={v => setForm({ ...form, price: v })} />
        <TextInput style={styles.input} placeholder="स्टॉक" value={form.stock || ""} onChangeText={v => setForm({ ...form, stock: v })} />
      </>);
    }
    return null;
  };

  const renderCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.cardTitle}>
            {activeTab === "dealers" ? item.shop : activeTab === "parts" ? item.name : item.name}
          </Text>
          <TouchableOpacity onPress={() => handleDelete(activeTab, item.id)}><Text style={{ color: "red" }}>✕</Text></TouchableOpacity>
        </View>
        {activeTab === "members" && <><Text style={styles.cardSub}>गांव: {item.village} | ट्रैक्टर: {item.tractor}</Text><Text style={styles.cardSub}>📱 {item.mobile}</Text></>}
        {activeTab === "farmers" && <><Text style={styles.cardSub}>गांव: {item.village} | फसल: {item.crop} | {item.acre} एकड़</Text><Text style={styles.cardSub}>📱 {item.mobile}</Text></>}
        {activeTab === "operators" && <><Text style={styles.cardSub}>लाइसेंस: {item.license} | अनुभव: {item.exp} साल</Text><Text style={styles.cardSub}>📱 {item.mobile}</Text></>}
        {activeTab === "agents" && <><Text style={styles.cardSub}>क्षेत्र: {item.area} | कमीशन: {item.commission}%</Text><Text style={styles.cardSub}>📱 {item.mobile}</Text></>}
        {activeTab === "dealers" && <><Text style={styles.cardSub}>मालिक: {item.name} | शहर: {item.city}</Text><Text style={styles.cardSub}>📱 {item.mobile}</Text></>}
        {activeTab === "parts" && <><Text style={styles.cardSub}>नंबर: {item.number} | स्टॉक: {item.stock}</Text><Text style={styles.cardSub}>₹ {item.price}</Text></>}
        <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
          {item.mobile && activeTab !== "parts" && <>
            <TouchableOpacity style={styles.callBtn} onPress={() => callNumber(item.mobile)}><Text style={styles.callText}>📞 कॉल</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waBtn} onPress={() => whatsappNumber(item.mobile)}><Text style={styles.waText}>💬 WhatsApp</Text></TouchableOpacity>
          </>}
          <Text style={{ marginLeft: "auto", fontSize: 10, color: "#888" }}>{item.date}</Text>
        </View>
      </View>
    );
  };

  if (isFirstTime === null) {
    return <View style={[styles.center, { backgroundColor: "#0f4d1c" }]}><Text style={{ color: "white", fontSize: 18 }}>लोड हो रहा है...</Text></View>;
  }

  if (isFirstTime) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authWrap}>
          <Text style={styles.logo}>🌾</Text>
          <Text style={styles.authTitle}>महानदी हार्वेस्टर</Text>
          <Text style={styles.authSub}>पहली बार? अपना पासवर्ड बनाएं</Text>
          <TextInput style={styles.input} placeholder="नया पासवर्ड (4+ अक्षर)" secureTextEntry={!showPwd} value={newPwd} onChangeText={setNewPwd} />
          <TextInput style={styles.input} placeholder="पासवर्ड फिर से लिखें" secureTextEntry={!showPwd} value={confirmPwd} onChangeText={setConfirmPwd} />
          <TextInput style={styles.input} placeholder="पासवर्ड हिंट (जैसे: मेरा गांव)" value={newHint} onChangeText={setNewHint} />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)}><Text style={{ color: "#0f4d1c", marginBottom: 12 }}>{showPwd ? "🙈 छुपाएं" : "👁️ दिखाएं"}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.greenBtn} onPress={savePassword}><Text style={styles.greenBtnText}>पासवर्ड बनाएं और शुरू करें</Text></TouchableOpacity>
          <Text style={{ marginTop: 16, color: "#666", fontSize: 12, textAlign: "center" }}>मास्टर कोड: 122202678489 (भूलने पर काम आएगा)</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (storedPwd && isFirstTime === false && inputPwd !== undefined && storedPwd !== "" && false === false) {
    // placeholder to avoid ts confusion
  }

  // Login check - if user not logged in yet (we use a simple flag via empty input and a state)
  const [loggedIn, setLoggedIn] = useState(false);
  // We need to re-evaluate loggedIn persistence using effect - simpler: use separate component logic
  // To keep within single file, we manage via local state and AsyncStorage for session
  // This duplicate logic is handled below

  return <MainApp
    storedPwd={storedPwd}
    storedHint={storedHint}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    search={search}
    setSearch={setSearch}
    members={members}
    farmers={farmers}
    operators={operators}
    agents={agents}
    dealers={dealers}
    parts={parts}
    showAddModal={showAddModal}
    setShowAddModal={setShowAddModal}
    form={form}
    setForm={setForm}
    renderAddForm={renderAddForm}
    handleAdd={handleAdd}
    getFilteredData={getFilteredData}
    renderCard={renderCard}
    callNumber={callNumber}
    whatsappNumber={whatsappNumber}
    handleLogout={() => { setIsFirstTime(null); setTimeout(() => { setIsFirstTime(false); }, 100); }}
  />;
}

function MainApp(props: any) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [inputPwd, setInputPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = () => {
    if (inputPwd === props.storedPwd || inputPwd === MASTER_CODE) {
      setLoggedIn(true);
    } else {
      Alert.alert("गलत पासवर्ड", "हिंट: " + props.storedHint + "\nमास्टर कोड 122202678489 ट्राई करें");
    }
  };

  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authWrap}>
          <Text style={styles.logo}>🌾</Text>
          <Text style={styles.authTitle}>महानदी में स्वागत है</Text>
          <Text style={styles.authSub}>पासवर्ड डालें</Text>
          <TextInput style={styles.input} placeholder="पासवर्ड लिखें" secureTextEntry={!showPwd} value={inputPwd} onChangeText={setInputPwd} />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)}><Text style={{ color: "#0f4d1c", marginBottom: 12 }}>{showPwd ? "🙈 छुपाएं" : "👁️ दिखाएं"}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.greenBtn} onPress={handleLogin}><Text style={styles.greenBtnText}>लॉगिन करें</Text></TouchableOpacity>
 
