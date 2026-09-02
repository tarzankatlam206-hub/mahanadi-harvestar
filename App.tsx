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
    return React.createElement(View, {style: styles.splashContainer},
      React.createElement(Image, {source: require('./assets/splash.png'), style: styles.splashLogo}),
      React.createElement(Text, {style: styles.splashTitle}, 'महानदी हार्वेस्टर मालिक कल्याण संघ')
    );
  }

  if (!isLoggedIn) {
    return React.createElement(View, {style: styles.loginWrap},
      React.createElement(View, {style: styles.loginCenter},
        React.createElement(Image, {source: require('./assets/login_logo.png'), style: styles.mainLogo}),
        React.createElement(Text, {style: styles.loginTitle}, 'महानदी हार्वेस्टर मालिक कल्याण संघ'),
        React.createElement(View, {style: styles.addressBox},
          React.createElement(Text, {style: styles.addrHead}, 'जिला कार्यालय -'),
          React.createElement(Text, {style: styles.addrText}, 'पता - लखनपुरी, ब्लॉक/तहसील - चारामा'),
          React.createElement(Text, {style: styles.addrText}, 'जिला कांकेर छत्तीसगढ़ पिन 494336'),
          React.createElement(Text, {style: styles.addrText}, 'फोन - 7000520873 | व्हाट्सएप - 9479025929'),
          React.createElement(Text, {style: styles.addrEmail}, 'MahanadiHarvestar2026@gmail.com')
        ),
        React.createElement(View, {style: styles.passBox},
          React.createElement(TextInput, {placeholder:'पासवर्ड डालें', value:password, onChangeText:setPassword, secureTextEntry:showPass===false, keyboardType:'number-pad', style:styles.passInput}),
          React.createElement(TouchableOpacity, {onPress:function(){ setShowPass(!showPass); }}, React.createElement(Text, null, '👁️'))
        ),
        React.createElement(TouchableOpacity, {style: styles.loginBtn, onPress:function(){
          if(password===MY_PASSWORD){ setIsLoggedIn(true); } else { Alert.alert('गलत','2022 डालें'); }
        }}, React.createElement(Text, {style: styles.loginText}, 'लॉगिन करें'))
      )
    );
  }

  if (showAddForm) {
    var children = [];
    children.push(React.createElement(View, {style: styles.listHeader},
      React.createElement(TouchableOpacity, {style: styles.bigBackBtn, onPress:function(){ setShowAddForm(false); }}, React.createElement(Text, null, '← वापस')),
      React.createElement(Text, {style: styles.listTitle}, selectedCat + ' पंजीकरण')
    ));

    var formChildren = [];
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'किसान नाम:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.name || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {name:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'गांव:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.village || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {village:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'ब्लॉक:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.block || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {block:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'जिला:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.district || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {district:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'राज्य:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.state || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {state:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'मोबाइल:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.mobile || '', keyboardType:'phone-pad', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {mobile:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'तारीख:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.tareekh || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {tareekh:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'समय:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.samay || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {samay:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'एडवांस:'));
    formChildren.push(React.createElement(TextInput, {style: styles.inputBox, value:newForm.advance || '', keyboardType:'number-pad', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {advance:v})); }}));
    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'पूरा पेमेंट:'));
    formChildren.push(React.createElement(TextInput, {style: [styles.inputBox, {backgroundColor:'#E8F5E9'}], value:newForm.fullPayment || '', keyboardType:'number-pad', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {fullPayment:v})); }}));

    if(selectedCat === 'किसान'){
      formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'एकड़:'));
      formChildren.push(React.createElement(TextInput, {style: [styles.inputBox, {backgroundColor:'#E3F2FD'}], value:newForm.ekad || '', onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {ekad:v})); }}));
    }

    formChildren.push(React.createElement(Text, {style: styles.labelTitle}, 'अन्य जानकारी:'));
    formChildren.push(React.createElement(TextInput, {style: [styles.inputBox, {height:60}], value:newForm.anyaJankari || '', multiline:true, onChangeText:function(v){ setNewForm(Object.assign({}, newForm, {anyaJankari:v})); }}));
    formChildren.push(React.createElement(TouchableOpacity, {style: styles.saveBtnBig, onPress:function(){
      if(!newForm.name){ Alert.alert('नाम लिखें'); return; }
      var item = Object.assign({id: Date.now(), district:'कांकेर', state:'छत्तीसगढ़', block:'चारामा'}, newForm);
      var copy = Object.assign({}, allData);
      copy[selectedCat] = [item].concat(allData[selectedCat]);
      setAllData(copy); setShowAddForm(false); setNewForm({});
    }}, React.createElement(Text, {style: styles.btnText}, 'सेव करें')));

    children.push(React.createElement(View, {style: styles.formBox},...formChildren));
    return React.createElement(ScrollView, {style: styles.container},...children);
  }

  if (selectedCat === 'सूचना / नोटिस') {
    return React.createElement(View, {style: styles.container},
      React.createElement(View, {style: styles.listHeader},
        React.createElement(TouchableOpacity, {style: styles.bigBackBtn, onPress:function(){ setSelectedCat(null); }}, React.createElement(Text, null, '← वापस')),
        React.createElement(Text, {style: styles.listTitle}, 'सूचना / नोटिस')
      ),
      React.createElement(View, {style: styles.suchnaWriteBox},
        React.createElement(TextInput, {placeholder:'यहाँ सूचना लिखें...', value:suchnaText, onChangeText:setSuchnaText, multiline:true, style:styles.suchnaInput}),
        React.createElement(View, {style:{flexDirection:'row', marginTop:10}},
          React.createElement(TouchableOpacity, {style:[styles.smsShareBtn, {marginRight:8}], onPress:function(){ if(suchnaText.trim()===''){ Alert.alert('लिखें'); return; } Linking.openURL('sms:' + suchnaText); }}, React.createElement(Text, {style: styles.shareText}, 'मैसेज')),
          React.createElement(TouchableOpacity, {style:styles.waShareBtn, onPress:function(){ if(suchnaText.trim()===''){ Alert.alert('लिखें'); return; } Linking.openURL('https://wa.me/' + suchnaText); }}, React.createElement(Text, {style: styles.shareText}, 'व्हाट्सएप'))
        )
      )
    );
  }

  if (detailItem) {
    var detailChildren = [];
    detailChildren.push(React.createElement(Text, {style: styles.detailHeadName}, detailItem.name));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'किसान नाम:'), React.createElement(Text, {style: styles.detailValue}, detailItem.name)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'गांव:'), React.createElement(Text, {style: styles.detailValue}, detailItem.village)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'ब्लॉक:'), React.createElement(Text, {style: styles.detailValue}, detailItem.block)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'जिला:'), React.createElement(Text, {style: styles.detailValue}, detailItem.district)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'राज्य:'), React.createElement(Text, {style: styles.detailValue}, detailItem.state)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'मोबाइल:'), React.createElement(Text, {style: styles.detailValue}, detailItem.mobile)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'तारीख:'), React.createElement(View, {style: styles.dateBox}, React.createElement(Text, null, '📅 ' + detailItem.tareekh))));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'समय:'), React.createElement(View, {style: styles.timeBox}, React.createElement(Text, null, '⏰ ' + detailItem.samay))));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'एडवांस:'), React.createElement(Text, {style: styles.detailValue}, detailItem.advance)));
    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'पूरा पेमेंट:'), React.createElement(View, {style: styles.payBox}, React.createElement(Text, null, '💰 ' + detailItem.fullPayment))));

    if(detailItem.ekad && detailItem.ekad!== ''){
      detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'एकड़:'), React.createElement(View, {style: [styles.payBox, {backgroundColor:'#E3F2FD'}]}, React.createElement(Text, null, '🌾 ' + detailItem.ekad))));
    }

    detailChildren.push(React.createElement(View, {style: styles.detailRow}, React.createElement(Text, {style: styles.detailLabel}, 'अन्य जानकारी:'), React.createElement(View, {style: styles.anyaBox}, React.createElement(Text, null, detailItem.anyaJankari))));
    detailChildren.push(React.createElement(View, {style: {flexDirection:'row', marginTop:16}},
      React.createElement(TouchableOpacity, {style: [styles.updateBtn, {marginRight:10}], onPress:function(){ setEditForm(Object.assign({}, detailItem)); setIsEditing(true); }}, React.createElement(Text, {style: styles.btnText}, 'अपडेट')),
      React.createElement(TouchableOpacity, {style: styles.deleteBtn, onPress:function(){ var c=Object.assign({}, allData); c[selectedCat]=allData[selectedCat].filter(function(i){ return i.id!==detailItem.id; }); setAllData(c); setDetailItem(null); }}, React.createElement(Text, {style: styles.btnText}, 'डिलीट'))
    ));
    detailChildren.push(React.createElement(View, {style: {flexDirection:'row', marginTop:10}},
      React.createElement(TouchableOpacity, {style: [styles.callBtn, {marginRight:8}], onPress:function(){ Linking.openURL('tel:' + detailItem.mobile); }}, React.createElement(Text, {style: styles.smallBtnText}, 'कॉल')),
      React.createElement(TouchableOpacity, {style: [styles.waBtn, {marginRight:8}], onPress:function(){ Linking.openURL('https://wa.me/91' + detailItem.mobile); }}, React.createElement(Text, {style: styles.smallBtnText}, 'व्हाट्सएप')),
      React.createElement(TouchableOpacity, {style: styles.smsBtn, onPress:function(){ Linking.openURL('sms:' + detailItem.mobile); }}, React.createElement(Text, {style: styles.smallBtnText}, 'एसएमएस'))
    ));
    detailChildren.push(React.createElement(TouchableOpacity, {style: styles.wapasBtn, onPress:function(){ setDetailItem(null); }}, React.createElement(Text, {style: styles.wapasText}, '← वापस जाएं')));

    return React.createElement(ScrollView, {style: styles.container}, React.createElement(View, {style: styles.detailMainCard},...detailChildren));
  }

  if (selectedCat) {
    return React.createElement(View, {style: styles.container},
      React.createElement(View, {style: styles.listHeader},
        React.createElement(TouchableOpacity, {style: styles.bigBackBtn, onPress:function(){ setSelectedCat(null); }}, React.createElement(Text, null, '← वापस')),
        React.createElement(Text, {style: styles.listTitle}, selectedCat + ' सूची')
      ),
      React.createElement(View, {style: {margin:12}}, React.createElement(TextInput, {placeholder:'खोजें', value:search, onChangeText:setSearch, style:styles.searchBar})),
      React.createElement(FlatList, {data: allData[selectedCat].filter(function(i){ return (i.name||'').toLowerCase().indexOf(search.toLowerCase())!==-1; }), keyExtractor:function(i){ return String(i.id); }, renderItem:function(p){ return React.createElement(TouchableOpacity, {style: styles.listItem, onPress:function(){ setDetailItem(p.item); }}, React.createElement(Text, {style: styles.listItemName}, p.item.name), React.createElement(Text, {style: styles.listItemSub}, p.item.village + ' • ' + p.item.mobile)); }, contentContainerStyle:{paddingBottom:90}}),
      React.createElement(TouchableOpacity, {style: styles.fabPlus, onPress:function(){ setNewForm({}); setShowAddForm(true); }}, React.createElement(Text, {style: styles.fabText}, '+'))
    );
  }

  return React.createElement(ScrollView, {style: styles.container},
    React.createElement(View, {style: styles.topHeader},
      React.createElement(View, {style: styles.headerRow},
        React.createElement(Image, {source: require('./assets/login_logo.png'), style: styles.headerLogo}),
        React.createElement(View, null,
          React.createElement(Text, {style: styles.topTitle}, 'महानदी हार्वेस्टर'),
          React.createElement(Text, {style: styles.topTitle2}, 'मालिक कल्याण संघ'),
          React.createElement(Text, {style: styles.topSub}, 'जिला कांकेर छत्तीसगढ़')
        )
      ),
      React.createElement(View, {style: styles.regPill}, React.createElement(Text, {style: styles.regPillText}, 'पंजीयन क्रमांक: 122202678489'))
    ),
    React.createElement(View, {style: styles.menuContainer},
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#4CAF50'}], onPress:function(){ setSelectedCat('सदस्य'); }}, React.createElement(Text, {style: styles.menuText}, 'सदस्य'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#FF9800'}], onPress:function(){ setSelectedCat('किसान'); }}, React.createElement(Text, {style: styles.menuText}, 'किसान'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#2196F3'}], onPress:function(){ setSelectedCat('एजेंट'); }}, React.createElement(Text, {style: styles.menuText}, 'एजेंट'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#673AB7'}], onPress:function(){ setSelectedCat('ऑपरेटर'); }}, React.createElement(Text, {style: styles.menuText}, 'ऑपरेटर'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#E91E63'}], onPress:function(){ setSelectedCat('हेल्पर'); }}, React.createElement(Text, {style: styles.menuText}, 'हेल्पर'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#795548'}], onPress:function(){ setSelectedCat('डीलर'); }}, React.createElement(Text, {style: styles.menuText}, 'डीलर'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#009688'}], onPress:function(){ setSelectedCat('पार्ट्स विक्रेता'); }}, React.createElement(Text, {style: styles.menuText}, 'पार्ट्स विक्रेता'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: [styles.menuBtn, {backgroundColor:'#BA68C8'}], onPress:function(){ setSelectedCat('सूचना / नोटिस'); }}, React.createElement(Text, {style: styles.menuText}, 'सूचना / नोटिस'), React.createElement(Text, {style: styles.menuArrow}, '›')),
      React.createElement(TouchableOpacity, {style: styles.logoutHomeBtn, onPress:function(){ setIsLoggedIn(false); }}, React.createElement(Text, {style: styles.logoutHomeText}, '🚪 लॉगआउट - बाहर जाएं'))
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
  mainLogo: { width: 
