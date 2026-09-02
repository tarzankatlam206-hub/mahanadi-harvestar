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
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9479025929', tareekh:'12.4.2026', samay:'10 बजे', advance:'500', fullPayment:'15000', ekad:'', anyaJankari:'कोई जानकारी नहीं'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'9 बजे', advance:'5000', fullPayment:'15000', ekad:'5 एकड़', anyaJankari:'खेत में पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': [],
    'सूचना / नोटिस': []
  });

  useEffect(function(){ setTimeout(function(){ setShowSplash(false); }, 2000); }, []);
  useEffect(function(){
    var backAction = function(){
      if (showAddForm) { setShowAddForm(false); return true; }
      if (isEditing) { setIsEditing(false); return true; }
      if (detailItem) { setDetailItem(null); return true; }
      if (selectedCat) { setSelectedCat(null); return true; }
      return false;
    };
    var h = BackHandler.addEventListener('hardwareBackPress', backAction);
    return function(){ h.remove(); };
  }, [selectedCat, detailItem, isEditing, showAddForm]);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require('./assets/splash.png')} style={styles.splashLogo} />
        <Text style={styles.splashTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.loginWrap}>
        <View style={styles.loginCenter}>
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
            <TextInput placeholder="पासवर्ड डालें" value={password} onChangeText={setPassword} secureTextEntry={!showPass} keyboardType="number-pad" style={styles.passInput} placeholderTextColor="#8a8a8a" />
            <TouchableOpacity onPress={function(){ setShowPass(!showPass); }}><Text>👁️</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={function(){ if(password===MY_PASSWORD){ setIsLoggedIn(true); } else Alert.alert('गलत पासवर्ड','2022 डालें'); }}>
            <Text style={styles.loginText}>लॉगिन करें</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function MenuButton(props){
    var icons = {'सदस्य':'👥','किसान':'🌾','एजेंट':'🤝','ऑपरेटर':'👨‍🔧','हेल्पर':'🙋‍♂️','डीलर':'🏢','पार्ट्स विक्रेता':'⚙️','सूचना / नोटिस':'📢'};
    return (
      <TouchableOpacity style={[styles.menuBtn, { backgroundColor: props.color }]} onPress={function(){ setSelectedCat(props.title); setShowAddForm(false); setSearch(''); }}>
        <Text style={styles.menuIcon}>{icons[props.title] || '•'}</Text>
        <Text style={styles.menuText}>{props.title}</Text>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>
    );
  }

  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={function(){ setShowAddForm(false); }}><Text style={styles.bigBackText}>← वापस</Text></TouchableOpacity><Text style={styles.listTitle}>{selectedCat} पंजीकरण</Text></View>
        <View style={styles.formBox}>
          <Text style={styles.labelTitle}>किसान नाम:</Text><TextInput style={styles.inputBox} placeholder="नाम लिखें" value={newForm.name || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {name:v})); }} />
          <Text style={styles.labelTitle}>गांव:</Text><TextInput style={styles.inputBox} placeholder="गांव" value={newForm.village || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {village:v})); }} />
          <Text style={styles.labelTitle}>ब्लॉक:</Text><TextInput style={styles.inputBox} placeholder="ब्लॉक" value={newForm.block || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {block:v})); }} />
          <Text style={styles.labelTitle}>जिला:</Text><TextInput style={styles.inputBox} placeholder="जिला" value={newForm.district || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {district:v})); }} />
          <Text style={styles.labelTitle}>राज्य:</Text><TextInput style={styles.inputBox} placeholder="राज्य" value={newForm.state || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {state:v})); }} />
          <Text style={styles.labelTitle}>मोबाइल:</Text><TextInput style={styles.inputBox} placeholder="मोबाइल" keyboardType="phone-pad" value={newForm.mobile || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {mobile:v})); }} />
          <Text style={styles.labelTitle}>तारीख:</Text><TextInput style={styles.inputBox} placeholder="20.9.2026" value={newForm.tareekh || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {tareekh:v})); }} />
          <Text style={styles.labelTitle}>समय:</Text><TextInput style={styles.inputBox} placeholder="10 बजे" value={newForm.samay || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {samay:v})); }} />
          <Text style={styles.labelTitle}>एडवांस:</Text><TextInput style={styles.inputBox} placeholder="5000" keyboardType="number-pad" value={newForm.advance || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {advance:v})); }} />
          <Text style={styles.labelTitle}>पूरा पेमेंट:</Text><TextInput style={[styles.inputBox, {backgroundColor:'#E8F5E9', borderColor:'#4CAF50'}]} placeholder="15000" keyboardType="number-pad" value={newForm.fullPayment || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {fullPayment:v})); }} />
          {selectedCat === 'किसान'? (
            <View><Text style={styles.labelTitle}>एकड़:</Text><TextInput style={[styles.inputBox, {backgroundColor:'#E3F2FD', borderColor:'#2196F3'}]} placeholder="5 एकड़" value={newForm.ekad || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {ekad:v})); }} /></View>
          ) : null}
          <Text style={styles.labelTitle}>अन्य जानकारी:</Text><TextInput style={[styles.inputBox, {height:60, backgroundColor:'#FFF9C4', borderColor:'#FBC02D'}]} placeholder="खेत में पानी है" multiline value={newForm.anyaJankari || ''} onChangeText={function(v){ setNewForm(Object.assign({}, newForm, {anyaJankari:v})); }} />
          <TouchableOpacity style={styles.saveBtnBig} onPress={function(){
            if(!newForm.name){ Alert.alert('नाम लिखें'); return; }
            var item = Object.assign({id: Date.now(), district: newForm.district||'कांकेर', state: newForm.state||'छत्तीसगढ़', block: newForm.block||'चारामा', anyaJankari: newForm.anyaJankari||'कोई जानकारी नहीं'}, newForm);
            var copy = Object.assign({}, allData);
            copy[selectedCat] = [item].concat(allData[selectedCat]);
            setAllData(copy); setShowAddForm(false); setNewForm({});
          }}><Text style={styles.btnText}>✅ सेव करें</Text></TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (selectedCat === 'सूचना / नोटिस') {
    return (
      <View style={styles.container}>
        <View style={styles.listHeader}><TouchableOpacity style={styles.bigBackBtn} onPress={function(){ setSelectedCat(null); }}><Text style={styles.bigBackText}>← वापस</Text></TouchableOpacity><Text style={styles.listTitle}>सूचना / नोटिस</Text></View>
        <View style={styles.suchnaWriteBox}>
          <Text style={styles.suchnaLabel}>नई सूचना लिखें:</Text>
          <TextInput placeholder="यहाँ सूचना लिखें..." value={suchnaText} onChangeText={setSuchnaText} multiline style={styles.suchnaInput} />
          <View style={{flexDirection:'row', marginTop:10}}>
            <TouchableOpacity style={[styles.smsShareBtn, {marginRight:8}]} onPress={function(){ if(!suchnaText.trim()){ Alert.alert('पहले लिखें'); return; } Linking.openURL('sms:?body=' + suchnaText); }}><Text style={styles.shareText}>💬 मैसेज</Text></TouchableOpacity>
            <TouchableOpacity style={styles.waShareBtn} onPress={function(){ if(!suchnaText.trim()){ Alert.alert('पहले लिखें'); return; } Linking.openURL('https://wa.me/?text=' + suchnaText); }}><Text style={styles.shareText}>व्हाट्सएप</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (detailItem) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.detailMainCard}>
          <Text style={styles.detailHeadName}>{detailItem.name}</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>किसान नाम:</Text><Text style={styles.detailValue}>{detailItem.name}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>गांव:</Text><Text style={styles.detailValue}>{detailItem.village}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>ब्लॉक:</Text><Text style={styles.detailValue}>{detailItem.block || 'चारामा'}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>जिला:</Text><Text style={styles.detailValue}>{detailItem.district || 'कांकेर'}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>राज्य:</Text><Text style={styles.detailValue}>{detailItem.state || 'छत्तीसगढ़'}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>मोबाइल:</Text><Text style={styles.detailValue}>{detailItem.mobile}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>तारीख:</Text><View style={styles.dateBox}><Text style={styles.dateText}>📅 {detailItem.tareekh}</Text></View></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>समय:</Text><View style={styles.timeBox}><Text style={styles.timeText}>⏰ {detailItem.samay}</Text></View></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>एडवांस:</Text><Text style={styles.detailValue}>{detailItem.advance}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>पूरा पेमेंट:</Text><View style={styles.payBox}><Text style={styles.payText}>💰 {detailItem.fullPayment || '15000'}</Text></View></View>
          {detailItem.ekad? <View style={styles.detailRow}><Text style={styles.detailLabel}>एकड़:</Text><View style={[styles.payBox, {backgroundColor:'#E3F2FD', borderColor:'#90CAF9'}]}><Text style={styles.payText}>🌾 {detailItem.ekad}</Text></View></View> : null}
          <View style={styles.detailRow}><Text style={styles.detailLabel}>अन्य जानकारी:</Text><View style={styles.anyaBox}><Text style={styles.anyaText}>{detailItem.anyaJankari || 'कोई जानकारी नहीं'}</Text></View></View>

          {isEditing? (
            <View style={{marginTop:12}}>
              <TextInput style={styles.inputBox} value={editForm.name} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {name:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.village} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {village:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.block} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {block:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.mobile} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {mobile:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.tareekh} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {tareekh:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.samay} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {samay:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.advance} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {advance:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.fullPayment} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {fullPayment:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.ekad} placeholder="एकड़" onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {ekad:v})); }} />
              <TextInput style={styles.inputBox} value={editForm.anyaJankari} onChangeText={function(v){ setEditForm(Object.assign({}, editForm, {anyaJankari:v})); }} />
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={[styles.updateBtn, {marginRight:8}]} onPress={function(){ var c=Object.assign({}, allData); c[selectedCat]=allData[selectedCat].map(function(i){ return i.id===detailItem.id? editForm : i; }); setAllData(c); setDetailItem(editForm); setIsEditing(false); }}><Text style={styles.btnText}>सेव</Text></TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={function(){ setIsEditing(false); }}><Text style={styles.btnText}>रद्द</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={{flexDirection:'row', marginTop:16}}>
                <TouchableOpacity style={[styles.updateBtn, {marginRight:10}]} onPress={function(){ setEditForm(Object.assign({}, detailItem)); setIsEditing(true); }}><Text style={styles.btnText}>अपडेट</Text></TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={function(){ Alert.alert('डिलीट?', 'हटाना है?', [{text:'नहीं'},{text:'हाँ', onPress:function(){ var c=Object.assign({}, allData); c[selectedCat]=allData[selectedCat].filter(function(i){ return i.id!==detailItem.id; }); setAllData(c); setDetailItem(null); }}]); }}><Text style={styles.btnText}>डिलीट</Text></TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', marginTop:10}}>
                <TouchableOpacity style={[styles.callBtn, {marginRight:8}]} onPress={function(){ Linking.openURL('tel:' + detailItem.mobile); }}><Text style={styles.smallBtnText}>कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.waBtn, {marginRight:8}]} onPress={function(){ Linking.openURL('https://wa.me/91' + detailItem.mobile); }}><Text style={styles.smallBtnText}>व्हाट्सएप</Text></TouchableOpacity
