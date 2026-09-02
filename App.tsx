import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, FlatList, BackHandler, Linking } from 'react-native';

type Category = 'सदस्य' | 'किसान' | 'एजेंट' | 'ऑपरेटर' | 'हेल्पर' | 'डीलर' | 'पार्ट्स विक्रेता' | 'सूचना / नोटिस';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState<any>(null);
  const [suchnaText, setSuchnaText] = useState('');

  const MY_PASSWORD = '2022';

  const [allData, setAllData] = useState<Record<Category, any[]>>({
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', mobile:'9479025929', block:'चारामा', harvesterNo:'6', count:'1', amount:'500', payment:'नगद', date:'12.4.2026', receiver:'प्रदीप साहू'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'9 बजे', advance:'5000', fullPayment:'', shikayat:'', anyaJankari:'खेत में पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': [],
    'सूचना / नोटिस': [{id:3, text:'कल सुबह 10 बजे सभी सदस्य मीटिंग में पहुंचे', date:'02.09.2026'}]
  });

  useEffect(() => { setTimeout(() => setShowSplash(false), 2000); }, []);
  useEffect(() => {
    const backAction = () => {
      if (detailItem) { setDetailItem(null); return true; }
      if (selectedCat) { setSelectedCat(null); return true; }
      return false;
    };
    const h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => h.remove();
  }, [selectedCat, detailItem]);

  if (showSplash) return <View style={styles.splashContainer}><Image source={require('./assets/splash.png')} style={styles.splashLogo} /><Text style={styles.splashTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text></View>;

  if (!isLoggedIn) {
    return (
      <View style={styles.loginWrap}>
        <Image source={require('./assets/login_logo.png')} style={styles.mainLogo} />
        <View style={styles.passBox}>
          <TextInput placeholder="पासवर्ड डालें" value={password} onChangeText={setPassword} secureTextEntry={!showPass} keyboardType="number-pad" style={styles.passInput} placeholderTextColor="#888"/>
          <TouchableOpacity onPress={()=>setShowPass(!showPass)}><Text style={styles.eyeText}>{showPass?'🙈':'👁️'}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={()=>{ if(password===MY_PASSWORD){ setIsLoggedIn(true); setPassword(''); } else Alert.alert('गलत पासवर्ड','पासवर्ड 2022 डालें'); }}>
          <Text style={styles.loginText}>लॉगिन करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const MenuButton = ({ title, color, icon }: any) => (
    <TouchableOpacity style={[styles.menuBtn, { backgroundColor: color }]} onPress={() => setSelectedCat(title)}>
      <Text style={styles.menuIcon}>{icon}</Text><Text style={styles.menuText}>{title}</Text><Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  if (selectedCat === 'सूचना / नोटिस') {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={()=>setSelectedCat(null)}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>सूचना / नोटिस</Text></View>
        <View style={styles.suchnaWriteBox}>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.suchnaAddBtn} onPress={()=>{ if(!suchnaText.trim()) return; setAllData(p=>({...p, ['सूचना / नोटिस']:[{id:Date.now(), text:suchnaText, date:new Date().toLocaleDateString()},...p['सूचना / नोटिस']]})); setSuchnaText(''); }}><Text style={styles.btnText}>जोड़ें</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={()=>Linking.openURL(`https://wa.me/?text=${encodeURIComponent(suchnaText)}`)}><Text style={styles.shareText}>व्हाट्सएप</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smsShareBtn} onPress={()=>Linking.openURL(`sms:?body=${encodeURIComponent(suchnaText)}`)}><Text style={styles.shareText}>एसएमएस</Text></TouchableOpacity>
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
      <View style={styles.detailOverlay}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{detailItem.name}</Text>
          <View style={styles.row}><Text style={styles.label}>किसान नाम:</Text><Text style={styles.value}>{detailItem.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>गांव:</Text><Text style={styles.value}>{detailItem.village}</Text></View>
          <View style={styles.row}><Text style={styles.label}>मोबाइल:</Text><Text style={styles.value}>{detailItem.mobile}</Text></View>
          <View style={styles.row}><Text style={styles.label}>तारीख:</Text><View style={styles.dateBox}><Text>📅 {detailItem.tareekh}</Text></View></View>
          <View style={styles.row}><Text style={styles.label}>समय:</Text><View style={styles.timeBox}><Text>⏰ {detailItem.samay}</Text></View></View>
          <View style={styles.row}><Text style={styles.label}>शिकायत:</Text><Text style={styles.value}>{detailItem.shikayat || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>अन्य जानकारी:</Text><View style={styles.anyaBox}><Text>{detailItem.anyaJankari}</Text></View></View>
          <TouchableOpacity style={styles.closeBtn} onPress={()=>setDetailItem(null)}><Text style={styles.btnText}>बंद</Text></TouchableOpacity>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.callBtn} onPress={()=>Linking.openURL(`tel:${detailItem.mobile}`)}><Text style={styles.contactText}>📞 कॉल</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waBtn} onPress={()=>Linking.openURL(`https://wa.me/91${detailItem.mobile}`)}><Text style={styles.contactText}>व्हाट्सएप</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smsBtn} onPress={()=>Linking.openURL(`sms:${detailItem.mobile}`)}><Text style={styles.contactText}>एसएमएस</Text></TouchableOpacity>
          </View>
        </View>
      </View>
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
      <View style={styles.topHeader}><Text style={styles.topTitle}>मालिक कल्याण संघ</Text><Text style={styles.topSub}>जिला कांकेर (छत्तीसगढ़)</Text><View style={styles.regPill}><Text style={styles.regPillText}>पंजीयन क्रमांक: 122202678489</Text></View></View>
      <View style={styles.menuContainer}>
        <MenuButton title="सदस्य" color="#4CAF50" icon="👥" />
        <MenuButton title="किसान" color="#FF9800" icon="🌾" />
        <MenuButton title="एजेंट" color="#2196F3" icon="🤝" />
        <MenuButton title="ऑपरेटर" color="#673AB7" icon="👨‍🔧" />
        <MenuButton title="हेल्पर" color="#E91E63" icon="🙋‍♂️" />
        <MenuButton title="डीलर" color="#795548" icon="🏢" />
        <MenuButton title="पार्ट्स विक्रेता" color="#009688" icon="⚙️" />
        <MenuButton title="सूचना / नोटिस" color="#9C27B0" icon="📢" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  splashContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  splashLogo: { width: 260, height: 260, resizeMode: 'contain' },
  splashTitle: { fontSize: 18, fontWeight: 'bold', color: '#103d0f', marginTop: 20 },
  loginWrap: { flex: 1, backgroundColor: '#0e3210', justifyContent: 'center', alignItems: 'center', padding: 20 },
  mainLogo: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#fff', marginBottom: 25 },
  passBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, width: '85%', alignItems: 'center', paddingHorizontal: 12, marginBottom: 15, borderWidth: 1, borderColor: '#4CAF50' },
  passInput: { flex: 1, padding: 14, fontSize: 18, color: '#000', fontWeight: 'bold' },
  eyeText: { fontSize: 18 },
  loginBtn: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 15, width: '85%', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  topHeader: { backgroundColor: '#fff', alignItems: 'center', padding: 15 },
  topTitle: { fontSize: 20, fontWeight: 'bold', color: '#a11d1d' },
  topSub: { fontSize: 14, color: '#333' },
  regPill: { backgroundColor: '#2e4a3a', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginTop: 12 },
  regPillText: { color: '#fff', fontSize: 12 },
  menuContainer: { padding: 12 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 18, marginBottom: 14 },
  menuIcon: { fontSize: 20, width: 30 },
  menuText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  menuArrow: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  listHeader: { backgroundColor: '#2e4a3a', padding: 12, flexDirection: 'row', alignItems: 'center' },
  bigBackBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, marginRight: 12 },
  bigBackIcon: { color: '#2e4a3a', fontSize: 22, fontWeight: 'bold', marginRight: 6 },
  bigBackText: { color: '#2e4a3a', fontSize: 16, fontWeight: 'bold' },
  listTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#fff', margin: 12, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  listItem: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 10, padding: 12 },
  listItemName: { fontWeight: 'bold' },
  listItemSub: { fontSize: 12, color: '#666' },
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 15 },
  detailCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  label: { width: 110, color: '#666', fontSize: 13 },
  value: { flex: 1, fontWeight: '600' },
  dateBox: { backgroundColor: '#FFF3E0', padding: 5, borderRadius: 6, borderWidth: 1, borderColor: '#FF9800', flex: 1 },
  timeBox: { backgroundColor: '#E3F2FD', padding: 5, borderRadius: 6, borderWidth: 1, borderColor: '#2196F3', flex: 1 },
  anyaBox: { flex: 1, backgroundColor: '#FFF9C4', borderWidth: 1, borderColor: '#FBC02D', borderRadius: 8, padding: 8 },
  closeBtn: { backgroundColor: '#9e9e9e', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  contactRow: { flexDirection: 'row', gap: 8, marginTop: 15 },
  callBtn: { flex: 1, backgroundColor: '#2e4a3a', padding: 13, borderRadius: 8, alignItems: 'center' },
  waBtn: { flex: 1, backgroundColor: '#25D366', padding: 13, borderRadius: 8, alignItems: 'center' },
  smsBtn: { flex: 1, backgroundColor: '#0084FF', padding: 13, borderRadius: 8, alignItems: 'center' },
  contactText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  suchnaWriteBox: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12 },
  suchnaInput: { borderWidth: 1, borderColor: '#9C27B0', borderRadius: 10, padding: 12, minHeight: 90, textAlignVertical: 'top' },
  shareRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  suchnaAddBtn: { flex: 1, backgroundColor: '#2e4a3a', padding: 12, borderRadius: 8, alignItems: 'center' },
  waShareBtn: { flex: 1, backgroundColor: '#25D366', padding: 12, borderRadius: 8, alignItems: 'center' },
  smsShareBtn: { flex: 1, backgroundColor: '#0084FF', padding: 12, borderRadius: 8, alignItems: 'center' },
  shareText: { color: '#fff', fontWeight: 'bold' },
  suchnaCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 10, borderRadius: 10, padding: 12, borderLeftWidth: 4, borderLeftColor: '#9C27B0' },
  suchnaDate: { fontSize: 11, color: '#666' },
  suchnaContent: { fontSize: 14, fontWeight: '500' },
});
