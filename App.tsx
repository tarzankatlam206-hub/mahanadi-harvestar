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
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', mobile:'9479025929', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', tareekh:'12.4.2026', samay:'10 बजे', advance:'500', fullPayment:'15000', anyaJankari:'कोई जानकारी नहीं'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'12 बजे', advance:'5000', fullPayment:'15000', anyaJankari:'खेत में पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': [],
    'सूचना / नोटिस': []
  });

  useEffect(() => { setTimeout(function(){ setShowSplash(false); }, 2000); }, []);
  useEffect(() => {
    const backAction = function(){
      if (showAddForm) { setShowAddForm(false); return true; }
      if (isEditing) { setIsEditing(false); return true; }
      if (detailItem) { setDetailItem(null); return true; }
      if (selectedCat) { setSelectedCat(null); return true; }
      if (isLoggedIn) {
        Alert.alert('बाहर जाना है?', 'लॉगिन पेज पर जाना चाहते हैं?', [
          {text:'नहीं', style:'cancel'},
          {text:'हाँ', onPress:function(){ setIsLoggedIn(false); setPassword(''); }}
        ]);
        return true;
      }
      return false;
    };
    const h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return function(){ h.remove(); };
  }, [selectedCat, detailItem, isEditing, isLoggedIn, showAddForm]);

  if (showSplash) {
    return React.createElement(View, {style: styles.splashContainer},
      React.createElement(Image, {source: require('./assets/splash.png'), style: styles.splashLogo}),
      React.createElement(Text, {style: styles.splashTitle}, 'महानदी हार्वेस्टर मालिक कल्याण संघ')
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.loginWrap}>
        <Image source={require('./assets/login_logo.png')} style={styles.mainLogo} />
        <Text style={styles.loginTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
        <View style={styles.addressBox}>
          <Text style={styles.addrText}>पता - लखनपुरी, ब्लॉक - चारामा, जिला कांकेर 494336</Text>
          <Text style={styles.addrText}>फोन - 7000520873 | व्हाट्सएप - 9479025929</Text>
        </View>
        <View style={styles.passBox}>
          <TextInput placeholder="पासवर्ड" value={password} onChangeText={setPassword} secureTextEntry={!showPass} keyboardType="number-pad" style={styles.passInput} />
          <TouchableOpacity onPress={function(){ setShowPass(!showPass); }}><Text>👁️</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={function(){ if(password===MY_PASSWORD){ setIsLoggedIn(true); } else Alert.alert('गलत','2022 डालें'); }}>
          <Text style={styles.loginText}>लॉगिन करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function MenuButton(props){
    return (
      <TouchableOpacity style={[styles.menuBtn, { backgroundColor: props.color }]} onPress={function(){ setSelectedCat(props.title); setShowAddForm(false); }}>
        <Text style={styles.menuText}>{props.title}</Text>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>
    );
  }

  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={function(){ setShowAddForm(false); }}><Text>← वापस</Text></TouchableOpacity><Text style={styles.listTitle}>{selectedCat} जोड़ें</Text></View>
        <View style={styles.formBox}>
          <TextInput style={styles.editInput} placeholder="नाम" value={newForm.name || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {name:v})); }} />
          <TextInput style={styles.editInput} placeholder="गांव" value={newForm.village || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {village:v})); }} />
          <TextInput style={styles.editInput} placeholder="मोबाइल" value={newForm.mobile || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {mobile:v})); }} />
          <TextInput style={styles.editInput} placeholder="तारीख" value={newForm.tareekh || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {tareekh:v})); }} />
          <TextInput style={styles.editInput} placeholder="पूरा पेमेंट" value={newForm.fullPayment || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {fullPayment:v})); }} />
          <TouchableOpacity style={styles.saveBtn} onPress={function(){
            if(!newForm.name){ Alert.alert('नाम लिखें'); return; }
            var item = Object.assign({id: Date.now(), district:'कांकेर', state:'छत्तीसगढ़'}, newForm);
            var copy = Object.assign({}, allData);
            copy[selectedCat] = [item].concat(allData[selectedCat]);
            setAllData(copy);
            setShowAddForm(false); setNewForm({});
          }}><Text style={styles.btnText}>सेव करें</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (selectedCat === 'सूचना / नोटिस') {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={function(){ setSelectedCat(null); }}><Text>← वापस</Text></TouchableOpacity><Text style={styles.listTitle}>सूचना / नोटिस</Text></View>
        <View style={styles.suchnaWriteBox}>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={{flexDirection:'row', marginTop:10}}>
            <TouchableOpacity style={[styles.smsShareBtn, {marginRight:8}]} onPress={function(){
              if(!suchnaText.trim()){ Alert.alert('लिखें'); return; }
              Linking.openURL('sms:?body=' + suchnaText);
            }}><Text style={styles.shareText}>मैसेज</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={function(){
              if(!suchnaText.trim()){ Alert.alert('लिखें'); return; }
              Linking.openURL('https://wa.me/?text=' + suchnaText);
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
          {isEditing? (
            <View>
              <TextInput style={styles.editInput} value={editForm.name} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {name:v})); }} />
              <TextInput style={styles.editInput} value={editForm.village} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {village:v})); }} />
              <TextInput style={styles.editInput} value={editForm.tareekh} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {tareekh:v})); }} />
              <TextInput style={styles.editInput} value={editForm.fullPayment} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {fullPayment:v})); }} />
              <View style={{flexDirection:'row', marginTop:12}}>
                <TouchableOpacity style={[styles.saveBtn, {marginRight:8}]} onPress={function(){
                  var copy = Object.assign({}, allData);
                  copy[selectedCat] = allData[selectedCat].map(function(i){ return i.id === detailItem.id? editForm : i; });
                  setAllData(copy); setDetailItem(editForm); setIsEditing(false);
                }}><Text style={styles.btnText}>सेव</Text></TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={function(){ setIsEditing(false); }}><Text style={styles.btnText}>रद्द</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.detailTitle}>{detailItem.name}</Text>
              <Text>गांव: {detailItem.village}</Text>
              <Text>तारीख: {detailItem.tareekh}</Text>
              <View style={styles.fullPayBox}><Text>💰 पूरा पेमेंट: {detailItem.fullPayment}</Text></View>
              <View style={{flexDirection:'row', marginTop:12}}>
                <TouchableOpacity style={[styles.editMainBtn, {marginRight:8}]} onPress={function(){ setEditForm(Object.assign({}, detailItem)); setIsEditing(true); }}><Text style={styles.btnText}>अपडेट</Text></TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={function(){
                  var copy = Object.assign({}, allData);
                  copy[selectedCat] = allData[selectedCat].filter(function(i){ return i.id!== detailItem.id; });
                  setAllData(copy); setDetailItem(null);
                }}><Text style={styles.btnText}>डिलीट</Text></TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', marginTop:12}}>
                <TouchableOpacity style={[styles.callBtn, {marginRight:8}]} onPress={function(){ Linking.openURL('tel:' + detailItem.mobile); }}><Text style={styles.contactText}>कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.waBtn, {marginRight:8}]} onPress={function(){ Linking.openURL('https://wa.me/91' + detailItem.mobile); }}><Text style={styles.contactText}>व्हाट्सएप</Text></TouchableOpacity>
                <TouchableOpacity style={styles.smsBtn} onPress={function(){ Linking.openURL('sms:' + detailItem.mobile); }}><Text style={styles.contactText}>एसएमएस</Text></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.wapasBtn} onPress={function(){ setDetailItem(null); }}><Text style={styles.wapasText}>← वापस जाएं</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  if (selectedCat) {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={function(){ setSelectedCat(null); }}><Text>← वापस</Text></TouchableOpacity><Text style={styles.listTitle}>{selectedCat}</Text></View>
        <View style={{flexDirection:'row', margin:12}}>
          <TextInput placeholder="खोजें" value={search} onChangeText={setSearch} style={[styles.searchBar, {flex:1, marginRight:8}]} />
          <TouchableOpacity style={styles.addBtn} onPress={function(){ setShowAddForm(true); }}><Text style={styles.addBtnText}>+ जोड़ें</Text></TouchableOpacity>
        </View>
        <FlatList data={allData[selectedCat].filter(function(i){ return (i.name||'').toLowerCase().indexOf(search.toLowerCase())!== -1; })} keyExtractor={function(i){ return String(i.id); }} renderItem={function(props){
          var item = props.item;
          return <TouchableOpacity style={styles.listItem} onPress={function(){ setDetailItem(item); }}><Text>{item.name} - {item.village}</Text></TouchableOpacity>;
        }}/>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <Image source={require('./assets/login_logo.png')} style={styles.headerLogo} />
          <View><Text style={styles.topTitle}>महानदी हार्वेस्टर</Text><Text style={styles.topTitle2}>मालिक कल्याण संघ</Text><Text style={styles.topSub}>जिला कांकेर</Text></View>
        </View>
        <View style={styles.regPill}>
          <Text style={styles.regPillLabel}>पंजीयन क्रमांक:</Text>
          <Text style={styles.regPillNumber}>122202678489</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <MenuButton title="सदस्य" color="#4CAF50" />
        <MenuButton title="किसान" color="#FF9800" />
        <MenuButton title="एजेंट" color="#2196F3" />
        <MenuButton title="ऑपरेटर" color="#673AB7" />
        <MenuButton title="हेल्पर" color="#E91E63" />
        <MenuButton title="डीलर" color="#795548" />
        <MenuButton title="पार्ट्स विक्रेता" color="#009688" />
        <MenuButton title="सूचना / नोटिस" color="#9C27B0" />
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
  addressBox: { backgroundColor: '#1b4d1e', borderRadius: 12, padding: 12, width: '92%', marginBottom: 15 },
  addrText: { color: '#c8e6c9', fontSize: 12 },
  passBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, width: '92%', alignItems: 'center', paddingHorizontal: 12, marginBottom: 15 },
  passInput: { flex: 1, padding: 14, fontSize: 18, color: '#000' },
  loginBtn: { backgroundColor: '#4CAF50', borderRadius: 10, padding: 15, width: '92%', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  topHeader: { backgroundColor: '#fff', padding: 15, paddingTop: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerLogo: { width: 65, height: 65, borderRadius: 32, marginRight: 12 },
  topTitle: { fontSize: 18, fontWeight: 'bold', color: '#1b5e20' },
  topTitle2: { fontSize: 18, fontWeight: 'bold', color: '#a11d1d' },
  topSub: { fontSize: 13, color: '#333' },
  regPill: { backgroundColor: '#2e4a3a', borderRadius: 15, padding: 8, marginTop: 14, alignSelf: 'center', width: '98%', alignItems: 'center' },
  regPillLabel: { color: '#c8e6c9', fontSize: 12 },
  regPillNumber: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  menuContainer: { padding: 12, marginTop: 8 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingVertical: 18, paddingHorizontal: 18, marginBottom: 14 },
  menuText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  menuArrow: { color: '#fff', fontSize: 22 },
  listHeader: { backgroundColor: '#2e4a3a', padding: 12, flexDirection: 'row', alignItems: 'center' },
  bigBackBtn: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, marginRight: 12 },
  listTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  addBtn: { backgroundColor: '#2e4a3a', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  formBox: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12 },
  listItem: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 10, padding: 12 },
  detailOverlay: { flex: 1, backgroundColor: '#f2f2f2' },
  detailCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, margin: 12 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  editInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#4CAF50', borderRadius: 8, padding: 10, marginBottom: 8 },
  saveBtn: { flex: 1, backgroundColor: '#2e7d32', padding: 13, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { flex: 1, backgroundColor: '#9e9e9e', padding: 13, borderRadius: 8, alignItems: 'center' },
  editMainBtn: { flex: 1, backgroundColor: '#4a6741', padding: 14, borderRadius: 10, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#b94a48', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  callBtn: { flex: 1, backgroundColor: '#2e4a3a', padding: 14, borderRadius: 10, alignItems: 'center' },
  waBtn: { flex: 1, backgroundColor: '#25D366', padding: 14, borderRadius: 10, alignItems: 'center' },
  smsBtn: { flex: 1, backgroundColor: '#4a90d9', padding: 14, borderRadius: 10, alignItems: 'center' },
  contactText: { color: '#fff', fontWeight: 'bold' },
  wapasBtn: { backgroundColor: '#8a8a8a', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  wapasText: { color: '#fff', fontWeight: 'bold' },
  fullPayBox: { backgroundColor: '#E8F5E9', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#4CAF50', marginTop: 5 },
  suchnaWriteBox: { backgroundColor: '#fff', margin: 12, borderRadius: 12, padding: 12 },
  suchnaInput: { borderWidth: 1, borderColor: '#9C27B0', borderRadius: 10, padding: 12, minHeight: 90, backgroundColor: '#fafafa' },
  smsShareBtn: { flex: 1, backgroundColor: '#4a90d9', padding: 15, borderRadius: 10, alignItems: 'center' },
  waShareBtn: { flex: 1, backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center' },
  shareText: { color: '#fff', fontWeight: 'bold' },
});
