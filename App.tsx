import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, FlatList, BackHandler, Linking } from 'react-native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [suchnaText, setSuchnaText] = useState('');
  const MY_PASSWORD = '2022';

  const [allData, setAllData] = useState({
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', mobile:'9479025929', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', amount:'500', date:'12.4.2026', tareekh:'12.4.2026', samay:'10 बजे', advance:'500', fullPayment:'-', shikayat:'-', anyaJankari:'कोई जानकारी नहीं'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'9 बजे', advance:'5000', amount:'5000', fullPayment:'-', shikayat:'-', anyaJankari:'खेत में पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': [],
    'सूचना / नोटिस': [{id:3, text:'कल सुबह 10 बजे सभी सदस्य मीटिंग में पहुंचे', date:'02.09.2026'}]
  });

  useEffect(() => { setTimeout(() => setShowSplash(false), 2000); }, []);
  useEffect(() => {
    const backAction = () => {
      if (isEditing) { setIsEditing(false); return true; }
      if (detailItem) { setDetailItem(null); return true; }
      if (selectedCat) { setSelectedCat(null); return true; }
      if (isLoggedIn) {
        Alert.alert('बाहर जाना है?', 'क्या आप लॉगिन पेज पर जाना चाहते हैं?', [
          {text:'नहीं', style:'cancel'},
          {text:'हाँ', onPress:()=>{ setIsLoggedIn(false); setPassword(''); }}
        ]);
        return true;
      }
      return false;
    };
    const h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => h.remove();
  }, [selectedCat, detailItem, isEditing, isLoggedIn]);

  const handleEdit = () => { setEditForm(Object.assign({}, detailItem)); setIsEditing(true); };
  const handleUpdate = () => {
    if (!selectedCat) return;
    const updated = allData[selectedCat].map(i => i.id === detailItem.id? editForm : i);
    setAllData(Object.assign({}, allData, {[selectedCat]: updated}));
    setDetailItem(editForm); setIsEditing(false);
    Alert.alert('सफल', 'अपडेट हो गया');
  };
  const handleDelete = () => {
    Alert.alert('डिलीट करें?', 'हटाना चाहते हैं?', [
      {text:'नहीं', style:'cancel'},
      {text:'हाँ', onPress:()=>{
        const filtered = allData[selectedCat].filter(i=>i.id!==detailItem.id);
        setAllData(Object.assign({}, allData, {[selectedCat]: filtered}));
        setDetailItem(null); setIsEditing(false);
      }}
    ]);
  };

  if (showSplash) return <View style={styles.splashContainer}><Image source={require('./assets/splash.png')} style={styles.splashLogo} /><Text style={styles.splashTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text></View>;

  if (!isLoggedIn) {
    return (
      <View style={styles.loginWrap}>
        <Image source={require('./assets/login_logo.png')} style={styles.mainLogo} />
        <Text style={styles.loginTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
        <View style={styles.addressBox}>
          <Text style={styles.addrHead}>जिला कार्यालय -</Text>
          <Text style={styles.addrText}>पता - लखनपुरी, ब्लॉक/तहसील - चारामा</Text>
          <Text style={styles.addrText}>जिला कांकेर छत्तीसगढ़ पिन 494336</Text>
          <Text style={styles.addrText}>फोन - 7000520873 | व्हाट्सएप - 9479025929</Text>
          <Text style={styles.addrEmail}>MahanadiHarvestar2026@gmail.com</Text>
        </View>
        <View style={styles.passBox}>
          <TextInput placeholder="पासवर्ड डालें" value={password} onChangeText={setPassword} secureTextEntry={!showPass} keyboardType="number-pad" style={styles.passInput} placeholderTextColor="#888"/>
          <TouchableOpacity onPress={()=>setShowPass(!showPass)}><Text style={styles.eyeText}>{showPass?'🙈':'👁️'}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={()=>{ if(password===MY_PASSWORD){ setIsLoggedIn(true); } else Alert.alert('गलत पासवर्ड','2022 डालें'); }}>
          <Text style={styles.loginText}>लॉगिन करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const MenuButton = ({ title, color, icon }) => (
    <TouchableOpacity style={[styles.menuBtn, { backgroundColor: color }]} onPress={() => setSelectedCat(title)}>
      <Text style={styles.menuIcon}>{icon}</Text><Text style={styles.menuText}>{title}</Text><Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  if (selectedCat === 'सूचना / नोटिस') {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={()=>setSelectedCat(null)}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>सूचना / नोटिस</Text></View>
        <View style={styles.suchnaWriteBox}>
          <Text style={styles.suchnaLabel}>नई सूचना लिखें:</Text>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.suchnaAddBtn} onPress={()=>{ if(!suchnaText.trim()) return; setAllData(Object.assign({}, allData, {['सूचना / नोटिस']:[{id:Date.now(), text:suchnaText, date:'02.09.2026'},...allData['सूचना / नोटिस']]})); setSuchnaText(''); }}><Text style={styles.btnText}>जोड़ें</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={()=>Linking.openURL('https://wa.me/?text='+encodeURIComponent(suchnaText))}><Text style={styles.shareText}>व्हाट्सएप</Text></TouchableOpacity>
          </View>
        </View>
        <FlatList data={allData['सूचना / नोटिस']} keyExtractor={i=>i.id.toString()} renderItem={({item})=>(
          <View style={styles.suchnaCard}><Text style={styles.suchnaDate}>📅 {item.date}</Text><Text style={styles.suchnaContent}>{item.text}</Text></View>
        )}/>
      </View>
    );
  }

  if (detailItem) {
    return (
      <ScrollView style={styles.detailOverlay}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{isEditing? 'एडिट करें' : detailItem.name}</Text>
          {isEditing? (
            <View>
              <Text style={styles.editLabel}>नाम</Text><TextInput style={styles.editInput} value={editForm.name} onChangeText={v=>setEditForm(Object.assign({}, editForm, {name:v}))} />
              <Text style={styles.editLabel}>गांव</Text><TextInput style={styles.editInput} value={editForm.village} onChangeText={v=>setEditForm(Object.assign({}, editForm, {village:v}))} />
              <Text style={styles.editLabel}>मोबाइल</Text><TextInput style={styles.editInput} value={editForm.mobile} onChangeText={v=>setEditForm(Object.assign({}, editForm, {mobile:v}))} />
              <Text style={styles.editLabel}>तारीख</Text><TextInput style={styles.editInput} value={editForm.tareekh} onChangeText={v=>setEditForm(Object.assign({}, editForm, {tareekh:v}))} />
              <Text style={styles.editLabel}>समय</Text><TextInput style={styles.editInput} value={editForm.samay} onChangeText={v=>setEditForm(Object.assign({}, editForm, {samay:v}))} />
              <View style={styles.editBtnRow}>
                <TouchableOpacity style={[styles.saveBtn, {marginRight:8}]} onPress={handleUpdate}><Text style={styles.btnText}>सेव करें</Text></TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={()=>setIsEditing(false)}><Text style={styles.btnText}>रद्द</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.row}><Text style={styles.label}>किसान नाम:</Text><Text style={styles.value}>{detailItem.name}</Text></View>
              <View style={styles.row}><Text style={styles.label}>गांव:</Text><Text style={styles.value}>{detailItem.village}</Text></View>
              <View style={styles.row}><Text style={styles.label}>ब्लॉक:</Text><Text style={styles.value}>{detailItem.block}</Text></View>
              <View style={styles.row}><Text style={styles.label}>जिला:</Text><Text style={styles.value}>{detailItem.district}</Text></View>
              <View style={styles.row}><Text style={styles.label}>राज्य:</Text><Text style={styles.value}>{detailItem.state}</Text></View>
              <View style={styles.row}><Text style={styles.label}>मोबाइल:</Text><Text style={styles.value}>{detailItem.mobile}</Text></View>
              <View style={styles.row}><Text style={styles.label}>तारीख:</Text><View style={styles.dateBox}><Text>📅 {detailItem.tareekh}</Text></View></View>
              <View style={styles.row}><Text style={styles.label}>समय:</Text><View style={styles.timeBox}><Text>⏰ {detailItem.samay}</Text></View></View>
              <View style={styles.row}><Text style={styles.label}>एडवांस:</Text><Text style={styles.value}>{detailItem.advance}</Text></View>
              <View style={styles.row}><Text style={styles.label}>अन्य जानकारी:</Text><View style={styles.anyaBox}><Text>{detailItem.anyaJankari}</Text></View></View>

              <View style={styles.editBtnRow}>
                <TouchableOpacity style={[styles.editMainBtn, {marginRight:8}]} onPress={handleEdit}><Text style={styles.btnText}>अपडेट</Text></TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}><Text style={styles.btnText}>डिलीट</Text></TouchableOpacity>
              </View>

              <View style={styles.contactRow}>
                <TouchableOpacity style={[styles.callBtn, {marginRight:8}]} onPress={()=>Linking.openURL('tel:'+detailItem.mobile)}><Text style={styles.contactText}>कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.waBtn, {marginRight:8}]} onPress={()=>Linking.openURL('https://wa.me/91'+detailItem.mobile)}><Text style={styles.contactText}>व्हाट्सएप</Text></TouchableOpacity>
                <TouchableOpacity style={styles.smsBtn} onPress={()=>Linking.openURL('sms:'+detailItem.mobile)}><Text style={styles.contactText}>एसएमएस</Text></TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.wapasBtn} onPress={()=>setDetailItem(null)}><Text style={styles.wapasText}>← वापस जाएं</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  if (selectedCat) {
    const list = allData[selectedCat].filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={()=>setSelectedCat(null)}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>{selectedCat} सूची</Text></View>
        <TextInput placeholder="खोजें: नाम, मोबाइल, गांव" value={search} onChangeText={setSearch} style={styles.searchBar} />
        <FlatList data={list} keyExtractor={i=>i.id.toString()} renderItem={({item})=>(
          <TouchableOpacity style={styles.listItem} onPress={()=>setDetailItem(item)}><Text style={styles.listItemName}>{item.name}</Text><Text style={styles.listItemSub}>{item.village} • {item.mobile}</Text></TouchableOpacity>
        )}/>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.headerRow}><Image source={require('./assets/login_logo.png')} style={styles.headerLogo} /><View style={styles.headerTextBox}><Text style={styles.topTitle}>महानदी हार्वेस्टर</Text><Text style={styles.topTitle2}>मालिक कल्याण संघ</Text><Text style={styles.topSub}>जिला कांकेर छत्तीसगढ़</Text></View></View>
        <View style={styles.regPill}><Text style={styles.regPillText}>पंजीयन क्रमांक: 122202678489</Text></View>
      </View>
      <View style={styles.menuContainer}>
        <MenuButton title="सदस्य" color="#4CAF50" icon="👥" /><MenuButton title="किसान" color="#FF9800" icon="🌾" /><MenuButton title="एजेंट" color="#2196F3" icon="🤝" /><MenuButton title="ऑपरेटर" color="#673AB7" icon="👨‍🔧" /><MenuButton title="हेल्पर" color="#E91E63" icon="🙋‍♂️" /><MenuButton title="डीलर" color="#795548" icon="🏢" /><MenuButton title="पार्ट्स विक्रेता" color="#009688" icon="⚙️" /><MenuButton title="सूचना / नोटिस" color="#9C27B0" icon="📢" />
        <TouchableOpacity style={styles.logoutHomeBtn} onPress={()=>{ setIsLoggedIn(false); setPassword(''); }}><Text style={styles.logoutHomeText}>🚪 लॉगआउट - बाहर जाएं</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  splashContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  splashLogo: { width: 260, height: 260, resizeMode: 'contain' },
  splashTitle: { fontSize: 18, fontWeight: 'bold', color: '#103d0f', marginTop: 20 },
  loginWrap: { flex: 1, backgroundColor: '#0e3210', justifyContent: 'center', alignItems: 'center', padding: 15 },
  mainLogo: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#fff', marginBottom: 8 },
  loginTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  addressBox: { backgroundColor: '#1b4d1e', borderRadius: 12, padding: 12, width: '92%', marginBottom: 15, borderWidth: 1, borderColor: '#4CAF50' },
  addrHead: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  addrText: { color: '#c8e6c9', fontSize: 12, lineHeight: 18 },
  addrEmail: { color: '#81c784', fontSize: 12, marginTop: 5, fontWeight: 'bold' },
  passBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, width: '92%', alignItems: 'center', paddingHorizontal: 12, marginBottom: 15 },
  passInput: { flex: 1, padding: 14, fontSize: 18, color: '#000', fontWeight: 'bold' },
  eyeText: { fontSize: 18 },
  loginBtn: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 15, width: '92%', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  topHeader: { backgroundColor: '#fff', padding: 15, paddingTop: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 65, height: 65, borderRadius: 32, borderWidth: 1, borderColor: '#4CAF50', marginRight: 12 },
  headerTextBox: {},
  topTitle: { fontSize: 18, fontWeight: 'bold', color: '#1b5e20' },
  topTitle2: { fontSize: 18, fontWeight: 'bold', color: '#a11d1d' },
  topSub: { fontSize: 13, color: '#333', fontWeight: '600' },
  regPill: { backgroundColor: '#2e4a3a', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginTop: 14, alignSelf: 'center' },
  regPillText: { color: '#fff', fontSize: 12 },
  menuContainer: { padding: 12, marginTop: 8 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 18, marginBottom: 14 },
  menuIcon: { fontSize: 20, width: 30 },
  menuText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  menuArrow: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  logoutHomeBtn: { backgroundColor: '#c62828', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  logoutHomeText: { color: '#fff', fontWeight: 'bold' },
  listHeader: { backgroundColor: '#2e4a3a', padding: 12, flexDirection: 'row', alignItems: 'center' },
  bigBackBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, marginRight: 12 },
  bigBackIcon: { color: '#2e4a3a', fontSize: 22, fontWeight: 'bold', marginRight: 6 },
  bigBackText: { color: '#2e4a3a', fontSize: 16, fontWeight: 'bold' },
  listTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#fff', margin: 12, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  listItem: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 10, padding: 12 },
  listItemName: { fontWeight: 'bold' },
  listItemSub: { fontSize: 12, color: '#666' },
  detailOverlay: { flex: 1, backgroundColor: '#f2f2f2' },
  detailCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, margin: 12 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  label: { width: 110, color: '#666', fontSize: 13 },
  value: { flex: 1, fontWeight: '600' },
  dateBox: { backgroundColor: '#FFF3E0', padding: 5, borderRadius: 6, borderWidth: 1, borderColor: '#FF9800', flex: 1 },
  timeBox: { backgroundColor: '#E3F2FD', padding: 5, borderRadius: 6, borderWidth: 1, borderColor: '#2196F3', flex: 1 },
  anyaBox: { flex: 1, backgroundColor: '#FFF9C4', borderWidth: 1, borderColor: '#FBC02D', borderRadius: 8, padding: 8 },
  editLabel: { fontSize: 12, color: '#2e4a3a', fontWeight: 'bold', marginTop: 8, marginBottom: 2 },
  editInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#4CAF50', borderRadius: 8, padding: 10, fontSize: 14 },
  editBtnRow: { flexDirection: 'row', marginTop: 12 },
  saveBtn: { flex: 1, backgroundColor: '#2e7d32', padding: 13, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { flex: 1, backgroundColor: '#9e9e9e', padding: 13, borderRadius: 8, alignItems: 'center' },
  editMainBtn: { flex: 1, backgroundColor: '#4a6741', padding: 14, borderRadius: 10, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#b94a48', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  contactRow: { flexDirection: 'row', marginTop: 15 },
  callBtn: { flex: 1, backgroundColor: '#2e4a3a', padding: 14, borderRadius: 10, alignItems: 'center' },
  waBtn: { flex: 1, backgroundColor: '#25D366', padding: 14, borderRadius: 10, alignItems: 'center' },
  smsBtn: { flex: 1, backgroundColor: '#4a90d9', padding: 14, borderRadius: 10, alignItems: 'center' },
  contactText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  wapasBtn: { backgroundColor: '#8a8a8a', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  wapasText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  suchnaWriteBox: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12 },
  suchnaLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  suchnaInput: { borderWidth: 1, borderColor: '#9C27B0', borderRadius: 10, padding: 12, minHeight: 90, textAlignVertical: 'top', backgroundColor: '#fafafa' },
  shareRow: { flexDirection: 'row', marginTop: 10 },
  suchnaAddBtn: { flex: 1, backgroundColor: '#2e4a3a', padding: 13, borderRadius: 10, alignItems: 'center', marginRight: 8 },
  waShareBtn: { flex: 1, backgroundColor: '#25D366', padding: 13, borderRadius: 10, alignItems: 'center' },
  shareText: { color: '#fff', fontWeight: 'bold' },
  suchnaCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 10, borderRadius: 10, padding: 12, borderLeftWidth: 4, borderLeftColor: '#9C27B0' },
  suchnaDate: { fontSize: 11, color: '#666', marginBottom: 4 },
  suchnaContent: { fontSize: 14, fontWeight: '500' },
});
