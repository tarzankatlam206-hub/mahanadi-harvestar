import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, FlatList, BackHandler, Linking } from 'react-native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({});
  const [suchnaText, setSuchnaText] = useState('');

  const [allData, setAllData] = useState({
    'सदस्य': [{id:1, name:'टार्जन कतलाम', village:'पिपरौद', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9479025929', tareekh:'12.4.2026', samay:'10 बजे', advance:'500', fullPayment:'15000', ekad:'', anyaJankari:'कोई जानकारी नहीं'}],
    'किसान': [{id:2, name:'रामविलास साहू', village:'मैनपुर', block:'चारामा', district:'कांकेर', state:'छत्तीसगढ़', mobile:'9303706824', tareekh:'20.9.2026', samay:'9 बजे', advance:'5000', fullPayment:'15000', ekad:'5 एकड़', anyaJankari:'खेत में पानी है'}],
    'एजेंट': [], 'ऑपरेटर': [], 'हेल्पर': [], 'डीलर': [], 'पार्ट्स विक्रेता': []
  });

  useEffect(function(){ setTimeout(function(){ setShowSplash(false); }, 2000); }, []);
  
  if(showSplash){
    return React.createElement(View, {style: styles.splashContainer},
      React.createElement(Image, {source: require('./assets/splash.png'), style: styles.splashLogo}),
      React.createElement(Text, {style: styles.splashTitle}, 'महानदी हार्वेस्टर')
    );
  }

  if(isLoggedIn == false){
    return React.createElement(View, {style: styles.loginWrap},
      React.createElement(View, {style: styles.loginCenter},
        React.createElement(Image, {source: require('./assets/login_logo.png'), style: styles.mainLogo}),
        React.createElement(Text, {style: styles.loginTitle}, 'महानदी हार्वेस्टर मालिक कल्याण संघ'),
        React.createElement(View, {style: styles.addressBox},
          React.createElement(Text, {style: styles.addrText}, 'पंजीयन क्रमांक: 122202678489')
        ),
        React.createElement(View, {style: styles.passBox},
          React.createElement(TextInput, {placeholder:'पासवर्ड', value:password, onChangeText:setPassword, secureTextEntry:true, style:styles.passInput})
        ),
        React.createElement(TouchableOpacity, {style: styles.loginBtn, onPress:function(){
          if(password == '2022'){ setIsLoggedIn(true); } else { Alert.alert('गलत','2022 डालें'); }
        }}, React.createElement(Text, {style: styles.loginText}, 'लॉगिन'))
      )
    );
  }

  return React.createElement(ScrollView, {style: styles.container},
    React.createElement(View, {style: styles.topHeader},
      React.createElement(Text, {style: styles.topTitle}, 'महानदी हार्वेस्टर मालिक कल्याण संघ'),
      React.createElement(View, {style: styles.regPill}, React.createElement(Text, {style: styles.regPillText}, 'पंजीयन क्रमांक: 122202678489'))
    ),
    React.createElement(View, {style: styles.menuContainer},
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#4CAF50'}], onPress:function(){ setSelectedCat('सदस्य'); }}, React.createElement(Text, {style: styles.menuText}, 'सदस्य')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#FF9800'}], onPress:function(){ setSelectedCat('किसान'); }}, React.createElement(Text, {style: styles.menuText}, 'किसान')),
      React.createElement(TouchableOpacity, {style: styles.logoutHomeBtn, onPress:function(){ setIsLoggedIn(false); }}, React.createElement(Text, {style: styles.logoutHomeText}, 'लॉगआउट'))
    )
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  splashContainer: { flex: 1, backgroundColor: '#0e3210', justifyContent: 'center', alignItems: 'center' },
  splashLogo: { width: 280, height: 280, resizeMode: 'contain' },
  splashTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  loginWrap: { flex: 1, backgroundColor: '#1a5c1a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  loginCenter: { width: '100%', alignItems: 'center' },
  mainLogo: { width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: '#fff', backgroundColor: '#fff' },
  loginTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 14 },
  addressBox: { backgroundColor: '#2e7d32', borderRadius: 14, padding: 12, width: '100%', marginBottom: 16 },
  addrText: { color: '#e8f5e9', fontSize: 11 },
  passBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, width: '100%', alignItems: 'center', paddingHorizontal: 14, marginBottom: 12, height: 50 },
  passInput: { flex: 1, fontSize: 14 },
  loginBtn: { backgroundColor: '#4CAF50', borderRadius: 12, height: 50, width: '100%', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold' },
  topHeader: { backgroundColor: '#fff', padding: 14, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  topTitle: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32', textAlign:'center' },
  regPill: { backgroundColor: '#3d5a4c', borderRadius: 16, padding: 6, marginTop: 10, alignSelf: 'center' },
  regPillText: { color: '#fff', fontSize: 11 },
  menuContainer: { padding: 12 },
  menuBtn: { borderRadius: 14, padding: 15, marginBottom: 10, alignItems:'center' },
  menuText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutHomeBtn: { backgroundColor: '#d35d5d', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  logoutHomeText: { color: '#fff', fontWeight: 'bold' }
});
