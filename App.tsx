import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, FlatList, BackHandler, Linking } from 'react-native';

type Category = 'सदस्य' | 'किसान' | 'एजेंट' | 'ऑपरेटर' | 'हेल्पर' | 'डीलर' | 'पार्ट्स विक्रेता' | 'सूचना / नोटिस';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState<any>(null);
  const [suchnaText, setSuchnaText] = useState('');

  const [allData, setAllData] = useState<Record<Category, any[]>>({
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', mobile:'9479025929', block:'चारामा', harvesterNo:'6', count:'1', amount:'500', payment:'नगद', date:'12.4.2026', receiver:'प्रदीप साहू', post:'जिला मीडिया प्रभारी'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'9 बजे', advance:'5000', fullPayment:'', shikayat:'', anyaJankari:'खेत में थोड़ा पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': [],
    'सूचना / नोटिस': [{id:3, text:'कल सुबह 10 बजे सभी सदस्य मीटिंग में पहुंचे', date:'02.09.2026'}]
  });

  useEffect(() => { setTimeout(() => setShowSplash(false), 2000); }, []);
  useEffect(() => {
    const backAction = () => {
      if (detailItem) { setDetailItem(null); return true; }
      if (selectedCat) { setSelectedCat(null); setSearch(''); return true; }
      return false;
    };
    const h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => h.remove();
  }, [selectedCat, detailItem]);

  const openCall = (m:string) => Linking.openURL(`tel:${m}`);
  const openWA = (m:string) => Linking.openURL(`https://wa.me/91${m}?text=नमस्ते, महानदी हार्वेस्टर संघ से`);
  const openSMS = (m:string) => Linking.openURL(`sms:${m}?body=नमस्ते, महानदी हार्वेस्टर संघ से`);
  const shareWA = (t:string) => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(t)}`);
  const shareSMS = (t:string) => Linking.openURL(`sms:?body=${encodeURIComponent(t)}`);

  const MenuButton = ({ title, color, icon }: any) => (
    <TouchableOpacity style={[styles.menuBtn, { backgroundColor: color }]} onPress={() => setSelectedCat(title)}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  if (showSplash) return <View style={styles.splashContainer}><Image source={require('./assets/splash.png')} style={styles.splashLogo} /><Text style={styles.splashTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text></View>;
  if (!isLoggedIn) return <View style={styles.loginWrap}><Image source={require('./assets/login_logo.png')} style={styles.mainLogo} /><TouchableOpacity style={styles.loginBtn} onPress={() => setIsLoggedIn(true)}><Text style={styles.loginText}>लॉगिन करें</Text></TouchableOpacity></View>;

  // सूचना / नोटिस - पूरा हिंदी + लिखने की जगह + शेयर
  if (selectedCat === 'सूचना / नोटिस') {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={() => setSelectedCat(null)}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>सूचना / नोटिस</Text></View>
        <View style={styles.suchnaWriteBox}>
          <Text style={styles.suchnaLabel}>नई सूचना लिखें:</Text>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.suchnaAddBtn} onPress={() => { if(!suchnaText.trim()) return; setAllData(p=>({...p, ['सूचना / नोटिस']:[{id:Date.now(), text:suchnaText, date:new Date().toLocaleDateString()}, ...p['सूचना / नोटिस']]})); setSuchnaText(''); }}><Text style={styles.btnText}>जोड़ें</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={() => shareWA(suchnaText)}><Text style={styles.shareText}>व्हाट्सएप</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smsShareBtn} onPress={() => shareSMS(suchnaText)}><Text style={styles.shareText}>एसएमएस</Text></TouchableOpacity>
          </View>
        </View>
        <FlatList data={allData['सूचना / नोटिस']} keyExtractor={i=>i.id.toString()} renderItem={({item})=>(
          <View style={styles.suchnaCard}><Text style={styles.suchnaDate}>📅 {item.date}</Text><Text style={styles.suchnaContent}>{item.text}</Text><View style={styles.suchnaCardBtns}><TouchableOpacity style={styles.smallWaBtn} onPress={()=>shareWA(item.text)}><Text style={styles.smallBtnText}>व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={styles.smallSmsBtn} onPress={()=>shareSMS(item.text)}><Text style={styles.smallBtnText}>एसएमएस</Text></TouchableOpacity></View></View>
        )}/>
      </View>
    );
  }

  // किसान डिटेल - तारीख समय अलग, शिकायत, अन्य जानकारी
  if (detailItem) {
    return (
      <View style={styles.detailOverlay}>
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{detailItem.name}</Text>
          <View style={styles.row}><Text style={styles.label}>किसान नाम *:</Text><Text style={styles.value}>{detailItem.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>गांव:</Text><Text style={styles.value}>{detailItem.village}</Text></View>
          <View style={styles.row}><Text style={styles.label}>ब्लॉक:</Text><Text style={styles.value}>{detailItem.block}</Text></View>
          <View style={styles.row}><Text style={styles.label}>जिला:</Text><Text style={styles.value}>{detailItem.district || 'कांकेर'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>राज्य:</Text><Text style={styles.value}>{detailItem.state || 'छत्तीसगढ़'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>मोबाइल:</Text><Text style={styles.value}>{detailItem.mobile}</Text></View>
          <View style={styles.row}><Text style={styles.label}>तारीख:</Text><View style={styles.dateBox}><Text style={styles.value}>📅 {detailItem.tareekh || detailItem.date}</Text></View></View>
          <View style={styles.row}><Text style={styles.label}>समय:</Text><View style={styles.timeBox}><Text style={styles.value}>⏰ {detailItem.samay || '-'}</Text></View></View>
          <View style={styles.row}><Text style={styles.label}>एडवांस पेमेंट:</Text><Text style={styles.value}>{detailItem.advance || detailItem.amount || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>पूरा पेमेंट:</Text><Text style={styles.value}>{detailItem.fullPayment || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>शिकायत:</Text><Text style={styles.value}>{detailItem.shikayat || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>अन्य जानकारी:</Text><View style={styles.anyaBox}><Text style={styles.anyaText}>{detailItem.anyaJankari || 'कोई जानकारी नहीं'}</Text></View></View>

          <View style={styles.actionRow}><TouchableOpacity style={styles.updateBtn}><Text style={styles.btnText}>अपडेट</Text></TouchableOpacity><TouchableOpacity style={styles.deleteBtn} onPress={()=>{ setAllData(p=>({...p, [selectedCat!]: p[selectedCat!].filter((x:any)=>x.id!==detailItem.id)})); setDetailItem(null); }}><Text style={styles.btnText}>डिलीट</Text></TouchableOpacity></View>
          <TouchableOpacity style={styles.closeBtn} onPress={()=>setDetailItem(null)}><Text style={styles.btnText}>बंद</Text></TouchableOpacity>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.callBtn} onPress={()=>openCall(detailItem.mobile)}><Text style={styles.contactText}>📞 कॉल</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waBtn} onPress={()=>openWA(detailItem.mobile)}><Text style={styles.contactText}>व्हाट्सएप</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smsBtn} onPress={()=>openSMS(detailItem.mobile)}><Text style={styles.contactText}>एसएमएस</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (selectedCat) {
    const list = allData[selectedCat].filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={()=>{ setSelectedCat(null); setSearch(''); }}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>{selectedCat} सूची</Text></View>
        <TextInput placeholder="खोजें: नाम, मोबाइल, गांव" value={search} onChangeText={setSearch} style={styles.searchBar} />
        <FlatList data={list} keyExtractor={i=>i.id.toString()} renderItem={({item})=>(
          <TouchableOpacity style={styles.listItem} onPress={()=>setDetailItem(item)}><Text style={styles.listItemName}>{item.name}</Text><Text style={styles.listItemSub}>{item.village} • {item.mobile}</Text></TouchableOpacity>
        )}/>
        <TouchableOpacity style={styles.addBtn} onPress={()=>{ const id=Date.now(); setAllData(p=>({...p, [selectedCat]:[...p[selectedCat], {id, name:`नया ${selectedCat}`, village:'गांव', mobile:'9000000000', tareekh:new Date().toLocaleDateString(), samay:'10 बजे', anyaJankari:''}]})) }}><Text style={styles.addBtnText}>+ नया {selectedCat} जोड़ें</Text></TouchableOpacity>
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
  topHeader: { backgroundColor: '#fff', alignItems: 'center', padding: 15, borderBottomWidth:1, borderColor:'#eee' },
  topTitle: { fontSize: 20, fontWeight: 'bold', color: '#a11d1d' },
  topSub: { fontSize: 14, color: '#333', marginTop: 2 },
  regPill: { backgroundColor: '#2e4a3a', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginTop: 12 },
  regPillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  menuContainer: { padding: 12 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 18, marginBottom: 14, elevation: 2 },
  menuIcon: { fontSize: 20, width: 30 },
  menuText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  menuArrow: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  loginWrap: { flex: 1, backgroundColor: '#103d0f', justifyContent: 'center', alignItems: 'center' },
  mainLogo: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#fff' },
  loginBtn: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 15, marginTop: 20, paddingHorizontal: 40 },
  loginText: { color: '#fff', fontWeight: 'bold' },
  listHeader: { backgroundColor: '#2e4a3a', padding: 12, flexDirection: 'row', alignItems: 'center', elevation:3 },
  bigBackBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, marginRight: 12 },
  bigBackIcon: { color: '#2e4a3a', fontSize: 22, fontWeight: 'bold', marginRight: 6 },
  bigBackText: { color: '#2e4a3a', fontSize: 16, fontWeight: 'bold' },
  listTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#fff', margin: 12, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  listItem: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 10, padding: 12, elevation:1 },
  listItemName: { fontWeight: 'bold', fontSize: 15 },
  listItemSub: { fontSize: 12, color: '#666', marginTop: 2 },
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 15 },
  detailCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, maxHeight:'90%' },
  detailTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems:'center' },
  label: { width: 120, color: '#666', fontSize: 13, fontWeight:'600' },
  value: { flex: 1, fontWeight: '600', fontSize: 13 },
  dateBox: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth:1, borderColor:'#FF9800', flex:1 },
  timeBox: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth:1, borderColor:'#2196F3', flex:1 },
  anyaBox: { flex:1, backgroundColor:'#FFF9C4', borderWidth:1, borderColor:'#FBC02D', borderRadius:8, padding:8, minHeight:45 },
  anyaText: { fontSize:13, color:'#333' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  updateBtn: { flex: 1, backgroundColor: '#4a7a5e', padding: 12, borderRadius: 8, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#e05a4a', padding: 12, borderRadius: 8, alignItems: 'center' },
  closeBtn: { backgroundColor: '#9e9e9e', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, gap: 8 },
  callBtn: { flex: 1, backgroundColor: '#2e4a3a', paddingVertical: 13, borderRadius: 8, alignItems: 'center' },
  waBtn: { flex: 1, backgroundColor: '#25D366', paddingVertical: 13, borderRadius: 8, alignItems: 'center' },
  smsBtn: { flex: 1, backgroundColor: '#0084FF', paddingVertical: 13, borderRadius: 8, alignItems: 'center' },
  contactText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  addBtn: { backgroundColor: '#0f4d1c', margin: 15, borderRadius: 10, padding: 15, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  suchnaWriteBox: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12, elevation:2 },
  suchnaLabel: { fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
  suchnaInput: { borderWidth: 1, borderColor: '#9C27B0', borderRadius: 10, padding: 12, minHeight: 90, textAlignVertical:'top' },
  shareRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  suchnaAddBtn: { flex:1, backgroundColor: '#2e4a3a', padding: 12, borderRadius: 8, alignItems: 'center' },
  waShareBtn: { flex:1, backgroundColor: '#25D366', padding: 12, borderRadius: 8, alignItems: 'center' },
  smsShareBtn: { flex:1, backgroundColor: '#0084FF', padding: 12, borderRadius: 8, alignItems: 'center' },
  shareText: { color: '#fff', fontWeight: 'bold' },
  suchnaCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 10, borderRadius: 10, padding: 12, borderLeftWidth:4, borderLeftColor:'#9C27B0' },
  suchnaDate: { fontSize: 11, color: '#666', marginBottom: 4 },
  suchnaContent: { fontSize: 14, fontWeight: '500' },
  suchnaCardBtns: { flexDirection: 'row', gap: 8, marginTop: 10 },
  smallWaBtn: { backgroundColor: '#25D366', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  smallSmsBtn: { backgroundColor: '#0084FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  smallBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
