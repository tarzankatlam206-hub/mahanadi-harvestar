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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({});
  const MY_PASSWORD = '2022';

  const [allData, setAllData] = useState({
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', mobile:'9479025929', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', harvesterNo:'6', membershipAmount:'500', payment:'नगद', date:'12.4.2026', tareekh:'12.4.2026', samay:'10 बजे', advance:'500', fullPayment:'15000', shikayat:'-', anyaJankari:'कोई जानकारी नहीं'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'12 बजे', advance:'5000', fullPayment:'15000', shikayat:'-', anyaJankari:'खेत में पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': [],
    'सूचना / नोटिस': []
  });

  useEffect(() => { setTimeout(() => setShowSplash(false), 2000); }, []);
  useEffect(() => {
    const backAction = () => {
      if (showAddForm) { setShowAddForm(false); return true; }
      if (isEditing) { setIsEditing(false); return true; }
      if (detailItem) { setDetailItem(null); return true; }
      if (selectedCat) { setSelectedCat(null); return true; }
      if (isLoggedIn) {
        Alert.alert('बाहर जाना है?', 'लॉगिन पेज पर जाना चाहते हैं?', [
          {text:'नहीं', style:'cancel'},
          {text:'हाँ', onPress:()=>{ setIsLoggedIn(false); setPassword(''); }}
        ]);
        return true;
      }
      return false;
    };
    const h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => h.remove();
  }, [selectedCat, detailItem, isEditing, isLoggedIn, showAddForm]);

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

  const MenuButton = ({ title, color, icon }) => (
    <TouchableOpacity style={[styles.menuBtn, { backgroundColor: color }]} onPress={() => { setSelectedCat(title); setShowAddForm(false); setSearch(''); }}>
      <Text style={styles.menuIcon}>{icon}</Text><Text style={styles.menuText}>{title}</Text><Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={()=>setShowAddForm(false)}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>{selectedCat} पंजीकरण</Text></View>
        <View style={styles.formBox}>
          <Text style={styles.editLabel}>नाम *</Text><TextInput style={styles.editInput} value={newForm.name || ''} onChangeText={v=>setNewForm({...newForm, name:v})} />
          <Text style={styles.editLabel}>गांव</Text><TextInput style={styles.editInput} value={newForm.village || ''} onChangeText={v=>setNewForm({...newForm, village:v})} />
          <Text style={styles.editLabel}>ब्लॉक</Text><TextInput style={styles.editInput} value={newForm.block || ''} onChangeText={v=>setNewForm({...newForm, block:v})} />
          <Text style={styles.editLabel}>जिला</Text><TextInput style={styles.editInput} value={newForm.district || ''} onChangeText={v=>setNewForm({...newForm, district:v})} />
          <Text style={styles.editLabel}>राज्य</Text><TextInput style={styles.editInput} value={newForm.state || ''} onChangeText={v=>setNewForm({...newForm, state:v})} />
          <Text style={styles.editLabel}>मोबाइल</Text><TextInput style={styles.editInput} value={newForm.mobile || ''} onChangeText={v=>setNewForm({...newForm, mobile:v})} keyboardType="phone-pad" />
          <Text style={styles.editLabel}>तारीख</Text><TextInput style={styles.editInput} value={newForm.tareekh || ''} onChangeText={v=>setNewForm({...newForm, tareekh:v})} />
          <Text style={styles.editLabel}>समय</Text><TextInput style={styles.editInput} value={newForm.samay || ''} onChangeText={v=>setNewForm({...newForm, samay:v})} />
          <Text style={styles.editLabel}>एडवांस</Text><TextInput style={styles.editInput} value={newForm.advance || ''} onChangeText={v=>setNewForm({...newForm, advance:v})} keyboardType="number-pad" />
          <Text style={styles.editLabel}>पूरा पेमेंट</Text><TextInput style={styles.editInput} value={newForm.fullPayment || ''} onChangeText={v=>setNewForm({...newForm, fullPayment:v})} keyboardType="number-pad" />
          <Text style={styles.editLabel}>अन्य जानकारी</Text><TextInput style={[styles.editInput, {height:70}]} value={newForm.anyaJankari || ''} onChangeText={v=>setNewForm({...newForm, anyaJankari:v})} multiline />
          <TouchableOpacity style={styles.saveBtn} onPress={()=>{
            if(!newForm.name){ Alert.alert('नाम लिखें'); return; }
            const item = {id: Date.now(),...newForm, district: newForm.district||'कांकेर', state: newForm.state||'छत्तीसगढ़', shikayat: '-'};
            setAllData({...allData, [selectedCat]: [item,...allData[selectedCat]]});
            setNewForm({}); setShowAddForm(false);
            Alert.alert('जोड़ा गया');
          }}><Text style={styles.btnText}>✅ सेव करें</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (selectedCat === 'सूचना / नोटिस') {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={()=>setSelectedCat(null)}><Text style={styles.bigBackIcon}>←</Text><Text style={styles.bigBackText}>वापस</Text></TouchableOpacity><Text style={styles.listTitle}>सूचना / नोटिस</Text></View>
        <View style={styles.suchnaWriteBox}>
          <Text style={styles.suchnaLabel}>नई सूचना लिखें:</Text>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={styles.shareRow}>
            <TouchableOpacity style={[styles.smsShareBtn, {marginRight:8}]} onPress={()=>{
              if(!suchnaText.trim()){ Alert.alert('पहले लिखें'); return; }
              Linking.openURL('sms:?body='+encodeURIComponent(suchnaText));
            }}><Text style={styles.shareText}>💬 मैसेज</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={()=>{
              if(!suchnaText.trim()){ Alert.alert('पहले लिखें'); return; }
              Linking.openURL('https://wa.me/?text='+encodeURIComponent(suchnaText));
            }}><Text style={styles.shareText}>व्हाट्सएप</Text></TouchableOpacity>
          </View>
        </View>
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
              <Text style={styles.editLabel}>नाम</Text><TextInput style={styles.editInput} value={editForm.name} onChangeText={v=>setEditForm({...editForm, name:v})} />
              <Text style={styles.editLabel}>गांव</Text><TextInput style={styles.editInput} value={editForm.village} onChangeText={v=>setEditForm({...editForm, village:v})} />
              <Text style={styles.editLabel}>ब्लॉक</Text><TextInput style={styles.editInput} value={editForm.block} onChangeText={v=>setEditForm({...editForm, block:v})} />
              <Text style={styles.editLabel}>जिला</Text><TextInput style={styles.editInput} value={editForm.district} onChangeText={v=>setEditForm({...editForm, district:v})} />
              <Text style={styles.editLabel}>राज्य</Text><TextInput style={styles.editInput} value={editForm.state} onChangeText={v=>setEditForm({...editForm, state:v})} />
              <Text style={styles.editLabel}>मोबाइल</Text><TextInput style={styles.editInput} value={editForm.mobile} onChangeText={v=>setEditForm({...editForm, mobile:v})} />
              <Text style={styles.editLabel}>तारीख</Text><TextInput style={styles.editInput} value={editForm.tareekh} onChangeText={v=>setEditForm({...editForm, tareekh:v})} />
              <Text style={styles.editLabel}>समय</Text><TextInput style={styles.editInput} value={editForm.samay} onChangeText={v=>setEditForm({...editForm, samay:v})} />
              <Text style={styles.editLabel}>एडवांस</Text><TextInput style={styles.editInput} value={String(editForm.advance || '')} onChangeText={v=>setEditForm({...editForm, advance:v})} />
              <Text style={styles.editLabel}>पूरा पेमेंट</Text><TextInput style={styles.editInput} value={String(editForm.fullPayment || '')} onChangeText={v=>setEditForm({...editForm, fullPayment:v})} />
              <Text style={styles.editLabel}>शिकायत</Text><TextInput style={styles.editInput} value={editForm.shikayat} onChangeText={v=>setEditForm({...editForm, shikayat:v})} />
              <Text style={styles.editLabel}>अन्य जानकारी</Text><TextInput style={[styles.editInput, {height:70}]} value={editForm.anyaJankari} onChangeText={v=>setEditForm({...editForm, anyaJankari:v})} multiline />
              <View style={styles.editBtnRow}>
                <TouchableOpacity style={[styles.saveBtn, {marginRight:8}]} onPress={()=>{ const u = allData[selectedCat].map(i => i.id === detailItem.id? editForm : i); setAllData({...allData, [selectedCat]: u}); setDetailItem(editForm); setIsEditing(false); }}><Text style={styles.btnText}>💾 सेव करें</Text></TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={()=>setIsEditing(false)}><Text style={styles.btnText}>रद्द</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.row}><Text style={styles.label}>नाम:</Text><Text style={styles.value}>{detailItem.name}</Text></View>
              <View style={styles.row}><Text style={styles.label}>गांव:</Text><Text style={styles.value}>{detailItem.village}</Text></View>
              <View style={styles.row}><Text style={styles.label}>ब्लॉक:</Text><Text style={styles.value}>{detailItem.block}</Text></View>
              <View style={styles.row}><Text style={styles.label}>जिला:</Text><Text style={styles.value}>{detailItem.district}</Text></View>
              <View style={styles.row}><Text style={styles.label}>राज्य:</Text><Text style={styles.value}>{detailItem.state}</Text></View>
              <View style={styles.row}><Text style={styles.label}>मोबाइल:</Text><Text style={styles.value}>{detailItem.mobile}</Text></View>
              <View style={styles.row}><Text style={styles.label}>तारीख:</Text><View style={styles.dateBox}><Text>📅 {detailItem.tareekh}</Text></View></View>
              <View style={styles.row}><Text style={styles.label}>समय:</Text><View style={styles.timeBox}><Text>⏰ {detailItem.samay}</Text></View></View>
              <View style={styles.row}><Text style={styles.label}>एडवांस:</Text><Text style={styles.value}>{detailItem.advance}</Text></View>
              <View style={styles.row}><Text style={styles.label}>पूरा पेमेंट:</Text><View style={styles.fullPayBox}><Text style={styles.fullPayText}>💰 {detailItem.fullPayment}</Text></View></View>
              <View style={styles.row}><Text style={styles.label}>अन्य जानकारी:</Text><View style={styles.anyaBox}><Text>{detailItem.anyaJankari}</Text></View></View>
              <View style={styles.editBtnRow}>
                <TouchableOpacity style={[styles.editMainBtn, {marginRight:8}]} onPress={()=>{ setEditForm({...detailItem}); setIsEditing(true); }}><Text style={styles.btnText}>अपडेट</Text></TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={()=>{ Alert.alert('डिलीट?', 'हटाना है?', [{text:'नहीं', style:'cancel'}, {text:'हाँ', onPress:()=>{ const f = allData[selectedCat].filter(i=>i.id!==detailItem.id); setAllData({...allData, [selectedCat]: f}); setDetailItem(null); }}]); }}><Text style={styles.btnText}>डिलीट</Text></TouchableOpacity>
              </View>
              <View style={styles.contactRow}>
                <TouchableOpacity style={[styles.callBtn, {marginRight:8}]} onPress={()=>Linking.openURL('tel:'+detailItem.mobile)}><Text style={styles.contactText}>कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.waBtn, {marginRight:8}]} onPress={()=>Linking.openURL('https://wa.me/91'+detailItem.mobile)}><Text style={styles.contactText}>व्हाट्सएप</Text></TouchableOpacity>
                <TouchableOpacity style={styles.smsBtn} onPress={()=>Linking.openURL('sms:'+detailItem.mobile)}><Text style={styles.contactText}>एसएमएस</Text></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.wapasBtn} onPress={()=>setDetailItem(null)}><Text style={styles.wapasText}>← वापस जाएं</
