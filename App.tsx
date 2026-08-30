import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- SPLASH SCREEN ---
const SplashScreen = () => (
  <View style={sStyles.container}>
    <View style={sStyles.logoBox}><Text style={{fontSize: 80}}>🚜</Text></View>
    <Text style={sStyles.title}>महानदी हार्वेस्टर</Text>
    <Text style={sStyles.title2}>मालिक कल्याण संघ</Text>
    <Text style={sStyles.dist}>जिला कांकेर (छत्तीसगढ़)</Text>
    <View style={sStyles.panji}><Text style={sStyles.panjiText}>पंजीयन क्रमांक: 122202678489</Text></View>
    <Text style={sStyles.slogan}>एकता • सेवा • सहयोग</Text>
  </View>
);

// --- HOME SCREEN - Screenshot जैसा ---
const HomeScreen = ({ setScreen }) => {
  const btns = [
    { id: 'member', title: 'सदस्य पंजीकरण', color: '#4CAF50', icon: '👥' },
    { id: 'harvester', title: 'हार्वेस्टर सूची', color: '#1565C0', icon: '🚜' },
    { id: 'booking', title: 'किसान बुकिंग', color: '#FB8C00', icon: '🌾' },
    { id: 'notice', title: 'सूचना / नोटिस', color: '#7B1FA2', icon: '📢' },
    { id: 'gallery', title: 'गैलरी', color: '#00897B', icon: '🖼️' },
    { id: 'contact', title: 'संपर्क करें', color: '#E53935', icon: '📞' },
  ];
  return (
    <View style={styles.main}>
      <View style={styles.header}><Text style={styles.headerText}>महानदी हार्वेस्टर</Text></View>
      <ScrollView contentContainerStyle={{padding:12}}>
        <View style={styles.logoCard}>
          <View style={styles.logoCircle}><Text style={{fontSize:60}}>🚜</Text><Text style={styles.circleTxt}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={styles.sloganTxt}>एकता • सेवा • सहयोग</Text></View>
          <Text style={styles.orgTitle}>महानदी हार्वेस्टर</Text><Text style={styles.orgSub}>मालिक कल्याण संघ</Text><Text style={styles.dist}>जिला कांकेर (छत्तीसगढ़)</Text>
          <View style={styles.panjiBox}><Text style={styles.panjiText2}>पंजीयन क्रमांक: 122202678489</Text></View>
        </View>
        {btns.map(b => (
          <TouchableOpacity key={b.id} style={[styles.btn, {backgroundColor: b.color}]} onPress={() => setScreen(b.id)}>
            <Text style={styles.btnIcon}>{b.icon}</Text><Text style={styles.btnText}>{b.title}</Text><Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.footer}>
          <Text style={styles.fTxt}>📍 जिला कार्यालय - ग्राम लखनपुरी, तहसील- चारामा, जिला कांकेर (छत्तीसगढ़)</Text>
          <Text style={styles.fTxt}>📞 मोबाईल: 7000520873</Text>
          <Text style={styles.fTxt}>💬 WhatsApp: 9479025929</Text>
          <Text style={styles.fTxt}>✉️ Email: tarzankatlam206@gmail.com</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// --- REUSABLE CRUD TEMPLATE ---
const CrudScreen = ({ title, color, fields, storageKey, setScreen }) => {
  const [form, setForm] = useState({}); const [list, setList] = useState([]); const [editId, setEditId] = useState(null);
  useEffect(() => { load(); }, []);
  const load = async () => { const d = await AsyncStorage.getItem(storageKey); if(d) setList(JSON.parse(d)); };
  const saveAll = async (data) => { await AsyncStorage.setItem(storageKey, JSON.stringify(data)); setList(data); };
  const onSave = async () => {
    if(!form[fields[0].key]) return Alert.alert('पहला field भरना जरूरी है');
    if(editId){ const u = list.map(i => i.id===editId? {...i,...form} : i); await saveAll(u); setEditId(null); }
    else { const n = {id: Date.now().toString(),...form}; await saveAll([...list, n]); }
    setForm({});
  };
  const onEdit = (item) => { setForm(item); setEditId(item.id); };
  const onDelete = async (id) => { const f = list.filter(i=>i.id!==id); await saveAll(f); };

  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <View style={[styles.header, {backgroundColor: color}]}><TouchableOpacity onPress={()=>setScreen('home')}><Text style={styles.backBtn}>‹ Back</Text></TouchableOpacity><Text style={styles.headerText}>{title}</Text></View>
      <View style={{padding:12}}>
        {fields.map(f => (<TextInput key={f.key} placeholder={f.placeholder} value={form[f.key]||''} onChangeText={v=>setForm({...form, [f.key]: v})} style={styles.input}/>))}
        <TouchableOpacity style={[styles.saveBtn, {backgroundColor: color}]} onPress={onSave}><Text style={styles.saveTxt}>{editId?'Update करें':'Save करें'}</Text></TouchableOpacity>
      </View>
      <FlatList data={list} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={styles.card}><View style={{flex:1}}>{fields.map(f=><Text key={f.key} style={{fontSize:14}}><Text style={{fontWeight:'bold'}}>{f.placeholder}: </Text>{item[f.key]}</Text>)}</View>
        <View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>onEdit(item)} style={styles.eBtn}><Text>✏️</Text></TouchableOpacity><TouchableOpacity onPress={()=>onDelete(item.id)} style={styles.dBtn}><Text>🗑️</Text></TouchableOpacity></View></View>
      )}/>
    </View>
  );
};

// --- MAIN APP ---
export default function App() {
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState('home');
  useEffect(()=>{ setTimeout(()=>setSplash(false), 2500); }, []);

  if(splash) return <SplashScreen />;

  if(screen==='home') return <HomeScreen setScreen={setScreen} />;
  if(screen==='member') return <CrudScreen title="सदस्य पंजीकरण" color="#4CAF50" storageKey="MEMBERS" setScreen={setScreen} fields={[{key:'name', placeholder:'सदस्य का नाम'}, {key:'mobile', placeholder:'मोबाइल नंबर'}, {key:'village', placeholder:'गांव / तहसील'}]} />;
  if(screen==='harvester') return <CrudScreen title="हार्वेस्टर सूची" color="#1565C0" storageKey="HARVESTERS" setScreen={setScreen} fields={[{key:'owner', placeholder:'मालिक का नाम'}, {key:'number', placeholder:'हार्वेस्टर नंबर'}, {key:'model', placeholder:'मॉडल'}]} />;
  if(screen==='booking') return <CrudScreen title="किसान बुकिंग" color="#FB8C00" storageKey="BOOKINGS" setScreen={setScreen} fields={[{key:'kisan', placeholder:'किसान का नाम'}, {key:'acres', placeholder:'एकड़'}, {key:'date', placeholder:'तारीख'}, {key:'village', placeholder:'गांव'}]} />;
  if(screen==='notice') return <CrudScreen title="सूचना / नोटिस" color="#7B1FA2" storageKey="NOTICES" setScreen={setScreen} fields={[{key:'title', placeholder:'शीर्षक'}, {key:'desc', placeholder:'विवरण'}]} />;
  if(screen==='gallery') return <CrudScreen title="गैलरी" color="#00897B" storageKey="GALLERY" setScreen={setScreen} fields={[{key:'photo', placeholder:'फोटो का नाम / विवरण'}]} />;
  if(screen==='contact') return (
    <View style={{flex:1, backgroundColor:'#fff'}}><View style={[styles.header, {backgroundColor:'#E53935'}]}><TouchableOpacity onPress={()=>setScreen('home')}><Text style={styles.backBtn}>‹ Back</Text></TouchableOpacity><Text style={styles.headerText}>संपर्क करें</Text></View>
      <View style={{padding:16}}><View style={styles.footer}><Text style={styles.fTxt}>📍 लखनपुरी, चारामा, कांकेर</Text><Text style={styles.fTxt}>📞 7000520873</Text><Text style={styles.fTxt}>💬 9479025929</Text><Text style={styles.fTxt}>✉️ tarzankatlam206@gmail.com</Text></View>
      <TouchableOpacity style={[styles.saveBtn, {backgroundColor:'#25D366', marginTop:20}]} onPress={()=>Linking.openURL('https://wa.me/919479025929')}><Text style={styles.saveTxt}>WhatsApp करें</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.saveBtn, {backgroundColor:'#1976D2'}]} onPress={()=>Linking.openURL('tel:7000520873')}><Text style={styles.saveTxt}>कॉल करें</Text></TouchableOpacity></View></View>
  );
}

const styles = StyleSheet.create({
  main:{flex:1, backgroundColor:'#FFFEF7'}, header:{backgroundColor:'#1B5E20', paddingTop:50, paddingBottom:12, paddingHorizontal:12, flexDirection:'row', alignItems:'center'}, headerText:{color:'#fff', fontSize:19, fontWeight:'bold', marginLeft:10}, backBtn:{color:'#fff', fontSize:18},
  logoCard:{alignItems:'center', backgroundColor:'#fff', borderRadius:16, padding:15, elevation:4, marginBottom:15}, logoCircle:{width:180, height:180, borderRadius:90, borderWidth:6, borderColor:'#2E7D32', justifyContent:'center', alignItems:'center', backgroundColor:'#FFF8E1'}, circleTxt:{fontSize:10, fontWeight:'bold', textAlign:'center', color:'#1B5E20', marginTop:5}, sloganTxt:{fontSize:9, backgroundColor:'#1B5E20', color:'#fff', paddingHorizontal:8, marginTop:6, borderRadius:8},
  orgTitle:{fontSize:26, fontWeight:'bold', color:'#1B5E20', marginTop:12}, orgSub:{fontSize:20, fontWeight:'bold', color:'#C62828'}, dist:{fontSize:16, fontWeight:'600', marginTop:4}, panjiBox:{backgroundColor:'#1B5E20', borderRadius:10, paddingHorizontal:18, paddingVertical:7, marginTop:10}, panjiText2:{color:'#fff', fontWeight:'bold'},
  btn:{flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:16, borderRadius:14, marginVertical:5, elevation:3}, btnIcon:{fontSize:22, width:35}, btnText:{flex:1, color:'#fff', fontSize:18, fontWeight:'bold', textAlign:'center'}, arrow:{color:'#fff', fontSize:20, fontWeight:'bold'},
  footer:{backgroundColor:'#E8F5E9', borderRadius:12, padding:14, marginTop:16, borderWidth:1, borderColor:'#A5D6A7'}, fTxt:{fontSize:14, marginVertical:3, color:'#212121'},
  input:{borderWidth:1, borderColor:'#ccc', borderRadius:10, padding:12, marginVertical:6}, saveBtn:{padding:14, borderRadius:10, alignItems:'center', marginTop:8}, saveTxt:{color:'#fff', fontWeight:'bold', fontSize:16}, card:{flexDirection:'row', justifyContent:'space-between', backgroundColor:'#F1F8E9', margin:8, padding:12, borderRadius:10, elevation:2}, eBtn:{padding:8, marginRight:6, backgroundColor:'#FFF9C4', borderRadius:6}, dBtn:{padding:8, backgroundColor:'#FFCDD2', borderRadius:6}
});
const sStyles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#FFFEF7', justifyContent:'center', alignItems:'center'}, logoBox:{width:180, height:180, borderRadius:90, backgroundColor:'#fff', borderWidth:8, borderColor:'#2E7D32', justifyContent:'center', alignItems:'center', elevation:10},
  title:{fontSize:28, fontWeight:'bold', color:'#1B5E20', marginTop:20}, title2:{fontSize:22, fontWeight:'bold', color:'#B71C1C'}, dist:{fontSize:16, marginTop:8, fontWeight:'600'}, panji:{marginTop:15, backgroundColor:'#1B5E20', paddingHorizontal:20, paddingVertical:8, borderRadius:20}, panjiText:{color:'#fff', fontWeight:'bold'}, slogan:{marginTop:15, color:'#2E7D32', fontWeight:'bold'}
});
