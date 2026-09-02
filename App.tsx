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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [suchnaText, setSuchnaText] = useState('');
  const MY_PASSWORD = '2022';

  const [allData, setAllData] = useState<Record<Category, any[]>>({
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', mobile:'9479025929', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', amount:'500', date:'12.4.2026', tareekh:'12.4.2026', samay:'10 बजे', advance:'500', fullPayment:'-', shikayat:'-', anyaJankari:'कोई जानकारी नहीं'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'9 बजे', advance:'5000', fullPayment:'-', amount:'5000', shikayat:'-', anyaJankari:'खेत में पानी है'}],
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
        Alert.alert('बाहर जाना है?', 'क्या आप होम पेज से लॉगिन पेज पर जाना चाहते हैं?', [
          {text:'नहीं', style:'cancel'},
          {text:'हाँ', onPress:()=>{ setIsLoggedIn(false); setPassword(''); setSelectedCat(null); setDetailItem(null); setIsEditing(false); }}
        ]);
        return true;
      }
      return false;
    };
    const h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => h.remove();
  }, [selectedCat, detailItem, isEditing, isLoggedIn]);

  const handleEdit = () => { setEditForm({...detailItem}); setIsEditing(true); };
  const handleUpdate = () => {
    if (!selectedCat) return;
    setAllData(prev => ({...prev, [selectedCat]: prev[selectedCat].map(i => i.id === detailItem.id? {...editForm} : i) }));
    setDetailItem({...editForm}); setIsEditing(false); Alert.alert('सफल', 'अपडेट हो गया');
  };
  const handleDelete = () => {
    Alert.alert('डिलीट करें?', 'क्या आप इसे हटाना चाहते हैं?', [
      {text:'नहीं', style:'cancel'},
      {text:'हाँ', onPress:()=>{
        if(!selectedCat) return;
        setAllData(prev=>({...prev, [selectedCat]: prev[selectedCat].filter(i=>i.id!==detailItem.id)}));
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
          <Text style={styles.addrText}>फोन नम्बर - 7000520873</Text>
          <Text style={styles.addrText}>व्हाट्सएप - 9479025929</Text>
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
          <Text style={styles.suchnaLabel}>नई सूचना लिखें:</Text>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.suchnaAddBtn} onPress={()=>{ if(!suchnaText.trim()) return; setAllData(p=>({...p, ['सूचना / नोटिस']:[{id:Date.now(), text:suchnaText, date:new Date().toLocaleDateString('en-GB')},...p['सूचना / नोटिस']]})); setSuchnaText(''); }}><Text style={styles.btnText}>जोड़ें</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={()=>Linking.openURL(`https://wa.me/?text=${encodeURIComponent(suchnaText)}`)}><Text style={styles.shareText}>व्हाट्स
