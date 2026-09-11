import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image, FlatList, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASTER_RAW } from './master_data';

const HOME_MENU = [
  {title:'सदस्य',color:'#6ABF69',key:'members'},
  {title:'किसान',color:'#F5A623',key:'kisan'},
  {title:'एजेंट',color:'#5AC8FA',key:'agent'},
  {title:'ऑपरेटर',color:'#9B7ED8',key:'operator'},
  {title:'हेल्पर',color:'#E94E6B',key:'helper'},
  {title:'डीलर',color:'#A07C6D',key:'dealer'},
  {title:'पार्ट्स विक्रेता',color:'#4DB6AC',key:'parts'},
  {title:'मैकेनिक',color:'#795548',key:'mechanic'},
  {title:'अन्य',color:'#607D8B',key:'anya'},
];

const MENU = [
...HOME_MENU,
  {title:'सूचना / नोटिस',color:'#B07BE6',key:'notice'},
  {title:'लॉग आउट',color:'#212121',key:'logout'},
];

const EXPENSE_CATS = ['डीजल','पेट्रोल','पार्ट्स','मैकेनिक','ऑपरेटर','हेल्पर','एजेंट','खाना खर्च','अन्य'];

const HINDI = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',bhugtanTarikh:'भुगतान की तारीख',bhugtanMadhyam:'भुगतान माध्यम',rashiPraptakarta:'राशि प्राप्तकर्ता',gadiSankhya:'गाड़ी संख्या',company:'कंपनी',model:'मॉडल',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',agreement:'एग्रीमेंट',check:'चेक',karyadivas:'कार्यदिवस',totalGhanta:'टोटल घंटा/समय',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि प्राप्त',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि प्राप्त',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि',totalRashi:'टोटल राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां'},
 helper: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि',totalRashi:'टोटल राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां'},
 dealer: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',company:'कंपनी',showroomPata:'शोरूम पता',serviceCenter:'सर्विस सेंटर',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',dukaanNaam:'दुकान का नाम',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',partsPrakar:'पार्ट्स प्रकार',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि',anyaJankari:'अन्य जानकारी'},
 mechanic: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 anya: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',mobile:'मोबाइल नंबर',anyaJankari:'अन्य जानकारी'}
};

const FULL = {
 members: {name:'',pata:'',block:'',jila:'',rajya:'',mobile:'',pad:'',harvesterNumber:'',sadasyataShulk:'',bhugtanTarikh:'',bhugtanMadhyam:'',rashiPraptakarta:'',gadiSankhya:'',company:'',model:'',anyaJankari:''},
 kisan: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',fasal:'धान',ekad:'',kataiTarikh:'',samay:'',totalGhanta:'',totalKaryadivas:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],fasalList:[]},
 agent: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',agreement:'',check:'',karyadivas:'',totalGhanta:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[]},
 operator: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',totalRashi:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advance:'',advanceList:[]},
 helper: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',totalRashi:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advanceList:[]},
 dealer: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',company:'',showroomPata:'',serviceCenter:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[]},
 parts: {name:'',dukaanNaam:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',partsPrakar:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[]},
 mechanic: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],karyaList:[]},
 anya: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',kulRashi:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],karyaList:[]},
 notice: {vishay:'',tarikh:'',vivaran:'',mobile:'',anyaJankari:''}
};

function ghantaToMinute(val) {
  if(val===null||val===undefined||val==='') return 0;
  var s=String(val).trim();
  if(s.indexOf('.')===-1){ var h=parseInt(s,10)||0; return h*60; }
  var parts=s.split('.'); var hh=parseInt(parts[0]||'0',10)||0;
  var mStr=(parts[1]||'').slice(0,2); var mm=parseInt(mStr||'0',10)||0; return hh*60+mm;
}
function minuteToGhantaText(totalMin) {
  var h=Math.floor(totalMin/60); var m=totalMin%60; return h+' घंटा '+m+' मिनट';
}
function getUpasthitiDates(item) {
  if(!item) return [];
  if(Array.isArray(item.upasthitiDates)) return item.upasthitiDates;
  if(item.upasthiti && typeof item.upasthiti==='string' && item.upasthiti.trim()!==''){
    return item.upasthiti.split(',').map(function(x){return x.trim();}).filter(function(x){return x!=='';});
  }
  return [];
}
function getAdvanceList(item) {
  if(!item) return [];
  if(Array.isArray(item.advanceList)) return item.advanceList;
  return [];
}
function getFasalList(item) {
  if(!item) return [];
  if(Array.isArray(item.fasalList) && item.fasalList.length>0) return item.fasalList;
  if(item.kataiTarikh || item.samay || item.ekad || item.totalGhanta){
    var t=(item.kataiTarikh||'').trim(); var sm=(item.samay||'').trim(); var e=(item.ekad||'').trim(); var g=(item.totalGhanta||'').trim();
    if(t||sm||e||g) return [{date:t,samay:sm,ekad:e,ghanta:g}];
  }
  return [];
}
function getKaryaList(item) {
  if(!item) return [];
  if(Array.isArray(item.karyaList)) return item.karyaList;
  return [];
}
function getKaryaTotal(item) {
  var list=getKaryaList(item);
  return list.reduce(function(s,e){return s+(parseFloat(e.amount)||0);},0);
}
function getFasalGhantaTotal(item) {
  var list=getFasalList(item); var totalMin=0;
  list.forEach(function(e){ totalMin+=ghantaToMinute(e.ghanta); });
  return minuteToGhantaText(totalMin);
}
function getAdvanceTotal(f, t) {
  var list=getAdvanceList(f);
  var sum=list.reduce(function(s,e){return s+(parseFloat(e.amount)||0);},0);
  if(sum===0){ var advKey=t==='operator'?'advance':'advanceRashi'; sum=parseFloat(f[advKey]||'0')||0; }
  return sum;
}
function calcBachat(f, t) {
  var total=parseFloat(f['kulRashi']||'0')||0;
  var adv=getAdvanceTotal(f,t);
  return String(total-adv);
}
var BOTTOM_KEYS = ['totalKaryadivas','upasthiti','upasthitiDates','advance','advanceRashi','bachatRashi','totalRashi','pooraRashi','advanceList','ekad','kataiTarikh','samay','totalGhanta','fasalList','karyaList','kulRashi'];
var KISAN_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList'];
var AGENT_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList'];
var OPERATOR_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','totalRashi','advanceList'];
var HELPER_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','totalRashi','advanceList'];
var DEALER_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList'];
var PARTS_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList'];
var KISAN_FASAL_KEYS = ['ekad','kataiTarikh','samay','totalGhanta','fasalList'];
var MECHANIC_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList','karyaList'];
var ANYA_BOTTOM = ['kulRashi','advanceRashi','bachatRashi','pooraRashi','advanceList','karyaList'];

var RowItem = memo(function RowItem(props){
  var it = props.it;
  var type = props.type;
  var money = ['kisan','agent','operator','helper','dealer','parts','mechanic','anya'].indexOf(type)!== -1;
  var advT = money? getAdvanceTotal(it,type) : 0;
  var bachat = money? calcBachat(it,type) : '0';
  var mechLike = type==='mechanic'||type==='anya';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={function(){props.onOpen(it);}}>
      <View style={s.card}>
        <Text style={{fontWeight:'bold',fontSize:16,color:'#0D47A1'}}>{it.name||it.vishay} 👁️</Text>
        <Text>{it.mobile||''} {it.pata||''}</Text>
        {type==='members' && it.harvesterNumber? <Text style={{fontSize:13,fontWeight:'bold',color:'#4E342E',marginTop:2}}>मोनो/हार्वेस्टर नं.: {it.harvesterNumber}</Text> : null}
        {money? <Text style={{fontSize:13,fontWeight:'bold',color:'#1B5E20',marginTop:4}}>💰 टोटल: ₹{it.kulRashi||'0'} | एडवांस: ₹{advT} | बचत: ₹{bachat}</Text> : null}
        {(type==='operator'||type==='helper')? <Text style={{fontSize:12,color:'#555'}}>📅 उपस्थिति: {getUpasthitiDates(it).length} दिन</Text> : null}
        {type==='kisan'? <Text style={{fontSize:12,color:'#555'}}>🌾 घंटा: {getFasalGhantaTotal(it)}</Text> : null}
        {mechLike? <Text style={{fontSize:12,color:'#555'}}>🔧 कार्य: {getKaryaList(it).length} | राशि: ₹{getKaryaTotal(it)}</Text> : null}
        <Text style={{fontSize:11,color:'#888',marginTop:4}}>पूरी जानकारी देखने के लिए क्लिक करें</Text>
        {it.mobile? (<View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={function(){Linking.openURL('tel:'+it.mobile);}}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={function(){Linking.openURL('https://wa.me/91'+String(it.mobile).replace(/\D/g,'').slice(-10));}}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={function(){Linking.openURL('sms:'+it.mobile);}}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>) : null}
        <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={function(){props.onEdit(it);}}><Text style={s.smT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={function(){props.onDel(it);}}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity></View>
      </View>
    </TouchableOpacity>
  );
});

export default function App(){
  var _use = useState('home'); var view=_use[0]; var setView=_use[1];
  var _tab = useState('home'); var tab=_tab[0]; var setTab=_tab[1];
  var _m1 = useState([]); var members=_m1[0]; var setMembers=_m1[1];
  var _m2 = useState([]); var kisans=_m2[0]; var setKisans=_m2[1];
  var _m3 = useState([]); var agents=_m3[0]; var setAgents=_m3[1];
  var _m4 = useState([]); var operators=_m4[0]; var setOperators=_m4[1];
  var _m5 = useState([]); var helpers=_m5[0]; var setHelpers=_m5[1];
  var _m6 = useState([]); var dealers=_m6[0]; var setDealers=_m6[1];
  var _m7 = useState([]); var parts=_m7[0]; var setParts=_m7[1];
  var _m8 = useState([]); var mechanics=_m8[0]; var setMechanics=_m8[1];
  var _m9 = useState([]); var anyas=_m9[0]; var setAnyas=_m9[1];
  var _m10 = useState([]); var notices=_m10[0]; var setNotices=_m10[1];
  var _m11 = useState([]); var expenses=_m11[0]; var setExpenses=_m11[1];
  var _m12 = useState([]); var orders=_m12[0]; var setOrders=_m12[1];
  var _mi = useState(false); var masterImported=_mi[0]; var setMasterImported=_mi[1];
  var _sof = useState(false); var showOrderForm=_sof[0]; var setShowOrderForm=_sof[1];
  var _on = useState(''); var ordName=_on[0]; var setOrdName=_on[1];
  var _op = useState(''); var ordPata=_op[0]; var setOrdPata=_op[1];
  var _ob = useState(''); var ordBlock=_ob[0]; var setOrdBlock=_ob[1];
  var _oj = useState('कांकेर'); var ordJila=_oj[0]; var setOrdJila=_oj[1];
  var _or = useState('छत्तीसगढ़'); var ordRajya=_or[0]; var setOrdRajya=_or[1];
  var _om = useState(''); var ordMobile=_om[0]; var setOrdMobile=_om[1];
  var _ok = useState(''); var ordKarya=_ok[0]; var setOrdKarya=_ok[1];
  var _od = useState(''); var ordDinank=_od[0]; var setOrdDinank=_od[1];
  var _os = useState(''); var ordSamay=_os[0]; var setOrdSamay=_os[1];
  var _oe = useState(''); var ordEkad=_oe[0]; var setOrdEkad=_oe[1];
  var _oei = useState(null); var ordEditId=_oei[0]; var setOrdEditId=_oei[1];
  var _odl = useState(null); var orderDel=_odl[0]; var setOrderDel=_odl[1];
  var _ec = useState('डीजल'); var expCat=_ec[0]; var setExpCat=_ec[1];
  var _ev = useState(''); var expVivaran=_ev[0]; var setExpVivaran=_ev[1];
  var _er = useState(''); var expRashi=_er[0]; var setExpRashi=_er[1];
  var _et = useState(''); var expTarikh=_et[0]; var setExpTarikh=_et[1];
  var _el = useState(''); var expLiter=_el[0]; var setExpLiter=_el[1];
  var _np = useState(''); var newPass=_np[0]; var setNewPass=_np[1];
  var _sp = useState('2022'); var storedPass=_sp[0]; var setStoredPass=_sp[1];
  var _fm = useState({}); var form=_fm[0]; var setForm=_fm[1];
  var _sh = useState(false); var show=_sh[0]; var setShow=_sh[1];
  var _ty = useState('members'); var type=_ty[0]; var setType=_ty[1];
  var _ei = useState(null); var editId=_ei[0]; var setEditId=_ei[1];
  var _se = useState(''); var search=_se[0]; var setSearch=_se[1];
  var _spl = useState(true); var splash=_spl[0]; var setSplash=_spl[1];
  var _pr = useState(0); var progress=_pr[0]; var setProgress=_pr[1];
  var _il = useState(false); var isLogin=_il[0]; var setIsLogin=_il[1];
  var _pw = useState(''); var pass=_pw[0]; var setPass=_pw[1];
  var _ld = useState(false); var loaded=_ld[0]; var setLoaded=_ld[1];
  var _di = useState(null); var detailItem=_di[0]; var setDetailItem=_di[1];
  var _dli = useState(null); var deleteItem=_dli[0]; var setDeleteItem=_dli[1];
  var _nd = useState(''); var newDate=_nd[0]; var setNewDate=_nd[1];
  var _ad = useState(''); var advDate=_ad[0]; var setAdvDate=_ad[1];
  var _aa = useState(''); var advAmt=_aa[0]; var setAdvAmt=_aa[1];
  var _fd = useState(''); var fasalDate=_fd[0]; var setFasalDate=_fd[1];
  var _fk = useState(''); var fasalKarya=_fk[0]; var setFasalKarya=_fk[1];
  var _ft = useState(''); var fasalTroli=_ft[0]; var setFasalTroli=_ft[1];
  var _fs = useState(''); var fasalSamay=_fs[0]; var setFasalSamay=_fs[1];
  var _fe = useState(''); var fasalEkad=_fe[0]; var setFasalEkad=_fe[1];
  var _fg = useState(''); var fasalGhanta=_fg[0]; var setFasalGhanta=_fg[1];
  var _kd = useState(''); var karyaDate=_kd[0]; var setKaryaDate=_kd[1];
  var _kw = useState(''); var karyaWork=_kw[0]; var setKaryaWork=_kw[1];
  var _ka = useState(''); var karyaAmt=_ka[0]; var setKaryaAmt=_ka[1];

  var MASTER_DATA = MASTER_RAW.map(function(r, i){
    return {
      id: 'master_' + i + '_' + r[3],
      name: r[0], pata: r[1], block: r[2], jila: 'कांकेर', rajya: 'छत्तीसगढ़',
      mobile: r[3], pad: r[5] || 'सदस्य', harvesterNumber: r[4],
      sadasyataShulk: r[11] || '500', bhugtanTarikh: r[10],
      bhugtanMadhyam: r[9] || 'नकद', rashiPraptakarta: r[12],
      gadiSankhya: r[6], company: r[7], model: r[8], anyaJankari: ''
    };
  });

  function importMasterData(){
    setMembers(function(prev){
      var ex = {};
      prev.forEach(function(x){ ex[x.name + '_' + x.mobile] = true; });
      var fr = MASTER_DATA.filter(function(m){ return!ex[m.name + '_' + m.mobile]; });
      setTimeout(function(){ alert(fr.length > 0? fr.length + ' सदस्य जुड़ गए!' : 'पहले से जुड़े हैं'); }, 300);
      return fr.concat(prev);
    });
    setMasterImported(true);
  }

  useEffect(function(){
    (async function(){ try{
      var m=await AsyncStorage.getItem('members'); if(m) setMembers(JSON.parse(m));
      var k=await AsyncStorage.getItem('kisans'); if(k) setKisans(JSON.parse(k));
      var a=await AsyncStorage.getItem('agents'); if(a) setAgents(JSON.parse(a));
      var o=await AsyncStorage.getItem('operators'); if(o) setOperators(JSON.parse(o));
      var h=await AsyncStorage.getItem('helpers'); if(h) setHelpers(JSON.parse(h));
      var d=await AsyncStorage.getItem('dealers'); if(d) setDealers(JSON.parse(d));
      var p=await AsyncStorage.getItem('parts'); if(p) setParts(JSON.parse(p));
      var mc=await AsyncStorage.getItem('mechanics'); if(mc) setMechanics(JSON.parse(mc));
      var an=await AsyncStorage.getItem('anyas'); if(an) setAnyas(JSON.parse(an));
      var n=await AsyncStorage.getItem('notices'); if(n) setNotices(JSON.parse(n));
      var ex=await AsyncStorage.getItem('expenses'); if(ex) setExpenses(JSON.parse(ex));
      var od=await AsyncStorage.getItem('orders'); if(od) setOrders(JSON.parse(od));
      var mi=await AsyncStorage.getItem('masterImported'); if(mi==='yes') setMasterImported(true);
      var pw=await AsyncStorage.getItem('appPass'); if(pw) setStoredPass(pw);
      var lg=await AsyncStorage.getItem('isLogin'); if(lg==='yes') setIsLogin(true);
    }catch(e){} setLoaded(true); })();
  },[]);

  useEffect(function(){
    var val=0;
    var interval=setInterval(function(){ val+=1; if(val>=100){ val=100; clearInterval(interval); setTimeout(function(){setSplash(false);},500); } setProgress(val); },100);
    return function(){clearInterval(interval);};
  },[]);

  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('members',JSON.stringify(members)); },[members,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('kisans',JSON.stringify(kisans)); },[kisans,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('agents',JSON.stringify(agents)); },[agents,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('operators',JSON.stringify(operators)); },[operators,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('helpers',JSON.stringify(helpers)); },[helpers,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('dealers',JSON.stringify(dealers)); },[dealers,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('parts',JSON.stringify(parts)); },[parts,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('mechanics',JSON.stringify(mechanics)); },[mechanics,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('anyas',JSON.stringify(anyas)); },[anyas,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('expenses',JSON.stringify(expenses)); },[expenses,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('orders',JSON.stringify(orders)); },[orders,loaded]);
  useEffect(function(){ if(!loaded) return; AsyncStorage.setItem('masterImported',masterImported?'yes':'no'); },[masterImported,loaded]);

  useEffect(function(){
    function onBackPress(){
      if(showOrderForm){setShowOrderForm(false);clearOrderForm();return true;}
      if(deleteItem){setDeleteItem(null);return true;}
      if(detailItem){setDetailItem(null);return true;}
      if(show){setShow(false);return true;}
      if(view!=='home'){setView('home');return true;}
      if(isLogin&&view==='home'){AsyncStorage.setItem('isLogin','no');setIsLogin(false);return true;}
      return false;
    }
    var sub=BackHandler.addEventListener('hardwareBackPress',onBackPress);
    return function(){sub.remove();};
  },[view,show,showOrderForm,isLogin,detailItem,deleteItem]);

  function doLogin(){
    if(pass===storedPass){ setIsLogin(true); AsyncStorage.setItem('isLogin','yes'); setPass(''); }
    else alert('गलत पासवर्ड!');
  }
  async function doLogout(){
    await AsyncStorage.setItem('isLogin','no');
    setIsLogin(false); setView('home'); setTab('home');
    if(Platform.OS==='android'){ BackHandler.exitApp(); }
  }
  function isMechanicLike(t){ return t==='mechanic'||t==='anya'; }
  function isMoneyType(t){ return ['kisan','agent','operator','helper','dealer','parts','mechanic','anya'].indexOf(t)!== -1; }
  function getSearchPlaceholder(){ return type==='members'? 'सर्च करें (नाम / मोनो नं. / मोबाइल नं.)' : 'सर्च करें (नाम / मोबाइल नं. / पता)'; }
  function sumKul(list){ return list.reduce(function(s,e){ return s + (parseFloat(e.kulRashi||'0')||0); }, 0); }
  function sumAdv(list,t){ return list.reduce(function(s,e){ return s + getAdvanceTotal(e,t); }, 0); }
  function sumBachat(list,t){ return list.reduce(function(s,e){ return s + (parseFloat(calcBachat(e,t))||0); }, 0); }

  var totalMemberRashi = members.reduce(function(s,e){ return s + (parseFloat(e.sadasyataShulk||'0')||0); }, 0);
  var totalKisanRashi = sumKul(kisans);
  var totalKisanAdvance = sumAdv(kisans,'kisan');
  var totalKisanBachat = sumBachat(kisans,'kisan');
  var totalAgentRashi = sumKul(agents);
  var totalAgentAdvance = sumAdv(agents,'agent');
  var totalAgentBachat = sumBachat(agents,'agent');
  var totalOperatorRashi = sumKul(operators);
  var totalOperatorAdvance = sumAdv(operators,'operator');
  var totalOperatorBachat = sumBachat(operators,'operator');
  var totalHelperRashi = sumKul(helpers);
  var totalHelperAdvance = sumAdv(helpers,'helper');
  var totalHelperBachat = sumBachat(helpers,'helper');
  var totalDealerRashi = sumKul(dealers);
  var totalDealerAdvance = sumAdv(dealers,'dealer');
  var totalDealerBachat = sumBachat(dealers,'dealer');
  var totalPartsRashi = sumKul(parts);
  var totalPartsAdvance = sumAdv(parts,'parts');
  var totalPartsBachat = sumBachat(parts,'parts');
  var totalMechanicRashi = sumKul(mechanics);
  var totalMechanicAdvance = sumAdv(mechanics,'mechanic');
  var totalMechanicBachat = sumBachat(mechanics,'mechanic');
  var totalAnyaRashi = sumKul(anyas);
  var totalAnyaAdvance = sumAdv(anyas,'anya');
  var totalAnyaBachat = sumBachat(anyas,'anya');

  function clearOrderForm(){ setOrdName(''); setOrdPata(''); setOrdBlock(''); setOrdJila('कांकेर'); setOrdRajya('छत्तीसगढ़'); setOrdMobile(''); setOrdKarya(''); setOrdDinank(''); setOrdSamay(''); setOrdEkad(''); setOrdEditId(null); }
  function saveOrder(){
    if(!ordName.trim()){alert('किसान का नाम लिखें');return;}
    if(!ordMobile.trim()){alert('मोबाइल नंबर लिखें');return;}
    var data={id:ordEditId||Date.now().toString(),name:ordName.trim(),pata:ordPata.trim(),block:ordBlock.trim(),jila:ordJila.trim(),rajya:ordRajya.trim(),mobile:ordMobile.trim(),karya:ordKarya.trim(),dinank:ordDinank.trim(),samay:ordSamay.trim(),ekad:ordEkad.trim()};
    setOrders(function(p){ return ordEditId? p.map(function(x){return x.id===ordEditId?data:x;}) : [data].concat(p); });
    var wasEdit=!!ordEditId;
    clearOrderForm();
    setShowOrderForm(false);
    alert(wasEdit?'ऑर्डर अपडेट हो गया':'ऑर्डर जुड़ गया');
  }
  function editOrder(o){
    setOrdName(o.name||''); setOrdPata(o.pata||''); setOrdBlock(o.block||''); setOrdJila(o.jila||'कांकेर'); setOrdRajya(o.rajya||'छत्तीसगढ़');
    setOrdMobile(o.mobile||''); setOrdKarya(o.karya||''); setOrdDinank(o.dinank||''); setOrdSamay(o.samay||''); setOrdEkad(o.ekad||'');
    setOrdEditId(o.id);
    setShowOrderForm(true);
  }
  function delOrder(id){ setOrderDel(id); }
  function confirmDelOrder(){
    var id=orderDel;
    setOrders(function(p){return p.filter(function(x){return x.id!==id;});});
    if(ordEditId===id) clearOrderForm();
    setOrderDel(null);
  }
  function getOrderList(){
    if(!search || search.trim()==='') return orders;
    var q=search.trim().toLowerCase();
    return orders.filter(function(o){
      var all=[o.name||'',o.mobile||'',o.pata||'',o.block||'',o.jila||'',o.rajya||'',o.karya||'',o.dinank||'',o.ekad||''].join(' ').toLowerCase();
      return all.indexOf(q)!==-1;
    });
  }

  function openForm(t,item){
    setType(t); setEditId(item?item.id:null);
    var base=FULL[t]||{};
    var merged=item?Object.assign({},JSON.parse(JSON.stringify(base)),item):JSON.parse(JSON.stringify(base));
    if((t==='operator'||t==='helper')){
      merged.upasthitiDates=getUpasthitiDates(merged);
      merged.advanceList=getAdvanceList(merged);
      merged.bachatRashi=calcBachat(merged,t);
      merged.pooraRashi=merged.kulRashi||'0';
      merged.totalRashi=merged.kulRashi||'0';
      merged.totalKaryadivas=String(getUpasthitiDates(merged).length);
    }
    if(t==='kisan'){
      merged.advanceList=getAdvanceList(merged);
      merged.fasalList=getFasalList(merged);
      merged.bachatRashi=calcBachat(merged,t);
      merged.pooraRashi=merged.kulRashi||'0';
    }
    if(t==='agent' || t==='dealer' || t==='parts'){
      merged.advanceList=getAdvanceList(merged);
      merged.bachatRashi=calcBachat(merged,t);
      merged.pooraRashi=merged.kulRashi||'0';
    }
    if(isMechanicLike(t)){
      merged.advanceList=getAdvanceList(merged);
      merged.karyaList=getKaryaList(merged);
      merged.bachatRashi=calcBachat(merged,t);
      merged.pooraRashi=merged.kulRashi||'0';
    }
    setForm(merged);
    setNewDate(''); setAdvDate(''); setAdvAmt('');
    setFasalDate(''); setFasalKarya(''); setFasalTroli(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta('');
    setKaryaDate(''); setKaryaWork(''); setKaryaAmt('');
    setShow(true);
  }
  function updateFormField(k,t){
    var nf=Object.assign({},form); nf[k]=t;
    if(isMoneyType(type)&&k==='kulRashi'){ nf.bachatRashi=calcBachat(nf,type); nf.pooraRashi=t; if(type==='operator'||type==='helper') nf.totalRashi=t; }
    setForm(nf);
  }
  function addUpasthitiDate(){
    var d=newDate.trim(); if(!d){alert('पहले तारीख लिखें');return;}
    var cur=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    if(cur.indexOf(d)!==-1){alert('यह तारीख पहले से जुड़ी है');return;}
    var updated=cur.concat([d]);
    setForm(Object.assign({},form,{upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}));
    setNewDate('');
  }
  function removeUpasthitiDate(d){
    var cur=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    var updated=cur.filter(function(x){return x!==d;});
    setForm(Object.assign({},form,{upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}));
  }
  function addAdvanceEntry(){
    var d=advDate.trim(); var a=advAmt.trim();
    if(!d){alert('एडवांस की तारीख लिखें');return;}
    if(!a){alert('एडवांस राशि लिखें');return;}
    var cur=getAdvanceList(form);
    var updated=cur.concat([{date:d,amount:a}]);
    var nf=Object.assign({},form,{advanceList:updated});
    if(isMoneyType(type)){ nf.bachatRashi=calcBachat(nf,type); nf.pooraRashi=nf.kulRashi||'0'; if(type==='operator'||type==='helper') nf.totalRashi=nf.kulRashi||'0'; }
    setForm(nf); setAdvDate(''); setAdvAmt('');
  }
  function removeAdvanceEntry(idx){
    var cur=getAdvanceList(form);
    var updated=cur.filter(function(_,i){return i!==idx;});
    var nf=Object.assign({},form,{advanceList:updated});
    if(isMoneyType(type)){ nf.bachatRashi=calcBachat(nf,type); nf.pooraRashi=nf.kulRashi||'0'; if(type==='operator'||type==='helper') nf.totalRashi=nf.kulRashi||'0'; }
    setForm(nf);
  }
  function addFasalEntry(){
    var d=fasalDate.trim(); var ky=fasalKarya.trim(); var tr=fasalTroli.trim(); var sm=fasalSamay.trim(); var ek=fasalEkad.trim(); var gh=fasalGhanta.trim();
    if(!d){alert('तारीख लिखें');return;}
    if(!ky){alert('कार्य लिखें');return;}
    if(!sm){alert('समय लिखें');return;}
    if(!ek){alert('एकड़ लिखें');return;}
    if(!gh){alert('घंटा लिखें');return;}
    var cur=getFasalList(form);
    var updated=cur.concat([{date:d,karya:ky,troli:tr,samay:sm,ekad:ek,ghanta:gh}]);
    setForm(Object.assign({},form,{fasalList:updated}));
    setFasalDate(''); setFasalKarya(''); setFasalTroli(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta('');
  }
  function removeFasalEntry(idx){
    var cur=getFasalList(form);
    var updated=cur.filter(function(_,i){return i!==idx;});
    setForm(Object.assign({},form,{fasalList:updated}));
  }
  function addKaryaEntry(){
    var d=karyaDate.trim(); var w=karyaWork.trim(); var a=karyaAmt.trim();
    if(!d){alert('कार्य की तारीख लिखें');return;}
    if(!w){alert('कार्य लिखें');return;}
    if(!a){alert('राशि लिखें');return;}
    var cur=getKaryaList(form);
    var updated=cur.concat([{date:d,work:w,amount:a}]);
    setForm(Object.assign({},form,{karyaList:updated}));
    setKaryaDate(''); setKaryaWork(''); setKaryaAmt('');
  }
  function removeKaryaEntry(idx){
    var cur=getKaryaList(form);
    var updated=cur.filter(function(_,i){return i!==idx;});
    setForm(Object.assign({},form,{karyaList:updated}));
  }

  function save(){
    var id=editId||Date.now().toString();
    var data=Object.assign({},form,{id:id});
    if((type==='operator'||type==='helper')){
      var dates=getUpasthitiDates(data);
      data.upasthitiDates=dates; data.upasthiti=dates.join(', ');
      data.totalKaryadivas=String(dates.length);
      data.advanceList=getAdvanceList(data);
      data.bachatRashi=calcBachat(data,type);
      data.pooraRashi=data.kulRashi||'0';
      data.totalRashi=data.kulRashi||'0';
    }
    if(type==='kisan'){
      data.advanceList=getAdvanceList(data);
      data.fasalList=getFasalList(data);
      if(data.fasalList.length>0){
        var last=data.fasalList[data.fasalList.length-1];
        data.kataiTarikh=last.date||''; data.samay=last.samay||''; data.ekad=last.ekad||'';
      }
      data.totalGhanta=getFasalGhantaTotal(data);
      data.bachatRashi=calcBachat(data,type);
      data.pooraRashi=data.kulRashi||'0';
    }
    if(type==='agent'||type==='dealer'||type==='parts'){
      data.advanceList=getAdvanceList(data);
      data.bachatRashi=calcBachat(data,type);
      data.pooraRashi=data.kulRashi||'0';
    }
    if(isMechanicLike(type)){
      data.advanceList=getAdvanceList(data);
      data.karyaList=getKaryaList(data);
      data.bachatRashi=calcBachat(data,type);
      data.pooraRashi=data.kulRashi||'0';
    }
    if(type==='members') setMembers(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='kisan') setKisans(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='agent') setAgents(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='operator') setOperators(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='helper') setHelpers(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='dealer') setDealers(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='parts') setParts(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='mechanic') setMechanics(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='anya') setAnyas(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    if(type==='notice') setNotices(function(p){return editId?p.map(function(x){return x.id===editId?data:x;}):[data].concat(p);});
    setShow(false);
  }

  function getFullList(){
    if(type==='members') return members;
    else if(type==='kisan') return kisans;
    else if(type==='agent') return agents;
    else if(type==='operator') return operators;
    else if(type==='helper') return helpers;
    else if(type==='dealer') return dealers;
    else if(type==='parts') return parts;
    else if(type==='mechanic') return mechanics;
    else if(type==='anya') return anyas;
    else return notices;
  }

  function getList(){
    var l=getFullList();
    if(!search || search.trim()==='') return l;
    var qClean=search.trim();
    var q=qClean.toLowerCase();
    if(type==='members'){
      var isDigits=/^[0-9]+$/.test(qClean);
      return l.filter(function(it){
        if(isDigits){
          var tokens=String(it.harvesterNumber||'').split(',').map(function(x){return x.trim();}).filter(function(x){return x!=='';});
          if(tokens.some(function(t){return t===qClean;})) return true;
          if(qClean.length>=4){
            var mobDigits=String(it.mobile||'').replace(/\D/g,'');
            if(mobDigits!=='' && mobDigits.indexOf(qClean)!==-1) return true;
          }
          return false;
        }
        var mob=String(it.mobile||'').toLowerCase();
        var nm=String(it.name||'').toLowerCase();
        var pt=[it.pata||'',it.block||'',it.jila||''].join(' ').toLowerCase();
        if(mob.indexOf(q)!==-1) return true;
        if(nm.indexOf(q)!==-1) return true;
        if(pt.indexOf(q)!==-1) return true;
        return false;
      });
    }
    var isNumeric=/^[0-9]+$/.test(qClean);
    return l.filter(function(it){
      var mobileField=String(it.mobile||'').toLowerCase();
      var nameField=String(it.name||it.vishay||'').toLowerCase();
      var otherFields=[it.pata||'',it.block||'',it.jila||''].join(' ').toLowerCase();
      if(isNumeric){
        if(mobileField.indexOf(q)!==-1) return true;
        if(nameField.indexOf(q)!==-1) return true;
        if(otherFields.indexOf(q)!==-1) return true;
        return false;
      } else {
        var all=Object.keys(it).map(function(k){return String(it[k]);}).join(' ').toLowerCase();
        return all.indexOf(q)!==-1;
      }
    });
  }

  function confirmDelete(){
    if(!deleteItem) return;
    var it=deleteItem;
    if(type==='members') setMembers(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='kisan') setKisans(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='agent') setAgents(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='operator') setOperators(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='helper') setHelpers(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='dealer') setDealers(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='parts') setParts(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='mechanic') setMechanics(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='anya') setAnyas(function(p){return p.filter(function(x){return x.id!==it.id;});});
    if(type==='notice') setNotices(function(p){return p.filter(function(x){return x.id!==it.id;});});
    setDeleteItem(null);
  }

  function addExpense(){
    if(expCat==='डीजल'||expCat==='पेट्रोल'){
      if(!expTarikh.trim()){alert('तिथि लिखें');return;}
      if(!expLiter.trim()){alert('लीटर लिखें');return;}
      if(!expRashi.trim()){alert('राशि लिखें');return;}
      var e={id:Date.now().toString(),cat:expCat,tarikh:expTarikh,liter:expLiter,rashi:expRashi,vivaran:expCat+' '+expLiter+' लीटर'};
      setExpenses(function(p){return [e].concat(p);});
      setExpTarikh(''); setExpLiter(''); setExpRashi(''); setExpVivaran('');
    }else{
      if(!expRashi.trim()){alert('राशि लिखें');return;}
      var e2={id:Date.now().toString(),cat:expCat,vivaran:expVivaran||expCat,tarikh:expTarikh||new Date().toLocaleDateString('hi-IN'),rashi:expRashi,liter:''};
      setExpenses(function(p){return [e2].concat(p);});
      setExpVivaran(''); setExpRashi(''); setExpTarikh('');
    }
  }

  var totalExpense=expenses.reduce(function(s,e){return s+(parseFloat(e.rashi)||0);},0);
  function getExpCatList(){ return expenses.filter(function(e){return (e.cat||'अन्य')===expCat;}); }
  function getExpCatTotal(){ return getExpCatList().reduce(function(s,e){return s+(parseFloat(e.rashi)||0);},0); }
  function getExpCatLiterTotal(){ return getExpCatList().reduce(function(s,e){return s+(parseFloat(e.liter)||0);},0); }

  function getDueList(){
    var arr=[];
    function push(list,cat,tkey){ list.forEach(function(x){ var b=parseFloat(calcBachat(x,tkey))||0; if(b>0) arr.push({cat:cat,name:x.name,mobile:x.mobile,amt:b}); }); }
    push(kisans,'किसान','kisan'); push(agents,'एजेंट','agent'); push(operators,'ऑपरेटर','operator'); push(helpers,'हेल्पर','helper');
    push(dealers,'डीलर','dealer'); push(parts,'पार्ट्स विक्रेता','parts'); push(mechanics,'मैकेनिक','mechanic'); push(anyas,'अन्य','anya');
    return arr;
  }
  var totalDue=getDueList().reduce(function(s,e){return s+e.amt;},0);

  function changePassword(){
    if(newPass.trim().length<4){alert('कम से कम 4 अंक का पासवर्ड रखें');return;}
    AsyncStorage.setItem('appPass',newPass.trim());
    setStoredPass(newPass.trim()); setNewPass('');
    alert('पासवर्ड बदल गया');
  }

  function renderMoneySection(){
    if(!isMoneyType(type)) return null;
    var advList=getAdvanceList(form);
    var advTotal=getAdvanceTotal(form,type);
    return (
      <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 टोटल राशि / एडवांस / बचत</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>टोटल राशि (आप डालेंगे)</Text>
        <TextInput style={[s.inp,{borderWidth:2,borderColor:'#E65100'}]} value={form.kulRashi} onChangeText={function(t){updateFormField('kulRashi',t);}} keyboardType="numeric" placeholder="" />
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{advTotal}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="" keyboardType="numeric" />
        </View>
        <TouchableOpacity style={{backgroundColor:'#FF9800',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addAdvanceEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:140,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {advList.map(function(e,idx){
          return (
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold'}}>{idx+1}. {e.date} - ₹{e.amount}</Text>
            <TouchableOpacity onPress={function(){removeAdvanceEntry(idx);}}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
          </View>
          );
        })}
        </ScrollView>
        <View style={[s.inp,{backgroundColor:'#E8F5E9',marginTop:10,borderWidth:2,borderColor:'#2E7D32'}]}>
          <Text style={{fontWeight:'900',color:'#1B5E20',fontSize:17,textAlign:'center'}}>बचत राशि (बाकी): ₹ {form.bachatRashi||'0'}</Text>
          <Text style={{fontSize:11,color:'#666',textAlign:'center',marginTop:2}}>टोटल ({form.kulRashi||'0'}) - एडवांस ({advTotal})</Text>
        </View>
      </View>
    );
  }

  function renderKisanFasalSection(){
    if(type!=='kisan') return null;
    var list=getFasalList(form);
    var ghText=getFasalGhantaTotal(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#E8F5E9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#1B5E20',textAlign:'center'}}>🌾 कार्य विवरण - तिथि / कार्य / ट्रॉली / समय / एकड़ / घंटा</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>विवरण - टोटल: {list.length} प्रविष्टि | टोटल घंटा: {ghText}</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>तिथि</Text>
        <TextInput style={[s.inp,{marginTop:4}]} value={fasalDate} onChangeText={setFasalDate} placeholder="" />
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>कार्य</Text>
        <TextInput style={[s.inp,{marginTop:4}]} value={fasalKarya} onChangeText={setFasalKarya} placeholder="" />
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>ट्रॉली</Text>
        <TextInput style={[s.inp,{marginTop:4}]} value={fasalTroli} onChangeText={setFasalTroli} placeholder="" keyboardType="numeric" />
        <View style={{flexDirection:'row',marginTop:8}}>
          <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:'bold'}}>समय</Text><TextInput style={[s.inp,{marginTop:4}]} value={fasalSamay} onChangeText={setFasalSamay} placeholder="" /></View>
          <View style={{flex:1,marginLeft:6}}><Text style={{fontSize:12,fontWeight:'bold'}}>एकड़</Text><TextInput style={[s.inp,{marginTop:4}]} value={fasalEkad} onChangeText={setFasalEkad} placeholder="" keyboardType="numeric" /></View>
          <View style={{flex:1,marginLeft:6}}><Text style={{fontSize:12,fontWeight:'bold'}}>घंटा</Text><TextInput style={[s.inp,{marginTop:4}]} value={fasalGhanta} onChangeText={setFasalGhanta} placeholder="" keyboardType="numeric" /></View>
        </View>
        <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addFasalEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {list.map(function(e,idx){
          return (
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. तिथि: {e.date} | कार्य: {e.karya||'-'} | ट्रॉली: {e.troli||'-'} | समय: {e.samay} | एकड़: {e.ekad} | घंटा: {e.ghanta}</Text>
            <TouchableOpacity onPress={function(){removeFasalEntry(idx);}}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
          </View>
          );
        })}
        </ScrollView>
      </View>
    );
  }

  function renderMechanicKaryaSection(){
    if(!isMechanicLike(type)) return null;
    var list=getKaryaList(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#EFEBE9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#795548'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#3E2723',textAlign:'center'}}>🔧 कार्य - तिथि / कार्य / राशि</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>कार्य विवरण - टोटल: {list.length} प्रविष्टि | टोटल राशि: ₹{getKaryaTotal(form)}</Text>
        <TextInput style={[s.inp,{marginTop:6}]} value={karyaDate} onChangeText={setKaryaDate} placeholder="" />
        <TextInput style={[s.inp,{marginTop:6}]} value={karyaWork} onChangeText={setKaryaWork} placeholder="" />
        <TextInput style={[s.inp,{marginTop:6}]} value={karyaAmt} onChangeText={setKaryaAmt} placeholder="" keyboardType="numeric" />
        <TouchableOpacity style={{backgroundColor:'#795548',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addKaryaEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ कार्य जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {list.map(function(e,idx){
          return (
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. तिथि: {e.date} | कार्य: {e.work} | राशि: ₹{e.amount}</Text>
            <TouchableOpacity onPress={function(){removeKaryaEntry(idx);}}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
          </View>
          );
        })}
        </ScrollView>
      </View>
    );
  }

  function renderBottomSection(){
    if(!(type==='operator'||type==='helper')) return null;
    var dates=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    return (
      <View style={{marginTop:16,backgroundColor:'#E8F5E9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#1B5E20',textAlign:'center'}}>📅 उपस्थिति व टोटल कार्यदिवस</Text>
        <View style={[s.inp,{backgroundColor:'#fff',marginTop:8}]}><Text style={{fontWeight:'900',color:'#1B5E20',fontSize:16,textAlign:'center'}}>{form.totalKaryadivas||'0'} दिन</Text></View>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>उपस्थिति तिथियां - टोटल: {dates.length} दिन</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={newDate} onChangeText={setNewDate} placeholder="" />
          <TouchableOpacity style={{backgroundColor:'#2E7D32',paddingHorizontal:14,justifyContent:'center',borderRadius:8,marginLeft:6}} onPress={addUpasthitiDate}><Text style={{color:'#fff',fontWeight:'bold'}}>जोड़ें</Text></TouchableOpacity>
        </View>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {dates.map(function(d,idx){
          return (
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold'}}>{idx+1}. {d}</Text>
            <TouchableOpacity onPress={function(){removeUpasthitiDate(d);}}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
          </View>
          );
        })}
        </ScrollView>
      </View>
    );
  }

  function getFormKeys(){
    return Object.keys(form).filter(function(k){
      if(k==='id') return false;
      if(BOTTOM_KEYS.indexOf(k)!==-1) return false;
      if(type==='kisan' && (KISAN_BOTTOM.indexOf(k)!==-1||KISAN_FASAL_KEYS.indexOf(k)!==-1)) return false;
      if(type==='agent' && AGENT_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='operator' && OPERATOR_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='helper' && HELPER_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='dealer' && DEALER_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='parts' && PARTS_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='mechanic' && MECHANIC_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='anya' && ANYA_BOTTOM.indexOf(k)!==-1) return false;
      return true;
    });
  }
  function getDetailKeys(){
    return Object.keys(FULL[type]||{}).filter(function(k){
      if(k==='id') return false;
      if(BOTTOM_KEYS.indexOf(k)!==-1) return false;
      if(type==='kisan' && (KISAN_BOTTOM.indexOf(k)!==-1||KISAN_FASAL_KEYS.indexOf(k)!==-1)) return false;
      if(type==='agent' && AGENT_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='operator' && OPERATOR_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='helper' && HELPER_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='dealer' && DEALER_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='parts' && PARTS_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='mechanic' && MECHANIC_BOTTOM.indexOf(k)!==-1) return false;
      if(type==='anya' && ANYA_BOTTOM.indexOf(k)!==-1) return false;
      return true;
    });
  }

  function renderBottomNav(){
    return (
    <View style={s.navBar}>
      <TouchableOpacity style={s.navBtn} onPress={function(){setTab('home');setView('home');setSearch('');}}><Text style={[s.navTxt,{color:tab==='home'?'#2E7D32':'#666'}]}>🏠{'\n'}होम</Text></TouchableOpacity>
      <TouchableOpacity style={s.navBtn} onPress={function(){setTab('expense');setView('home');setSearch('');}}><Text style={[s.navTxt,{color:tab==='expense'?'#2E7D32':'#666'}]}>💸{'\n'}खर्च</Text></TouchableOpacity>
      <TouchableOpacity style={s.navBtn} onPress={function(){setTab('order');setView('home');setSearch('');}}><Text style={[s.navTxt,{color:tab==='order'?'#2E7D32':'#666'}]}>📝{'\n'}ऑर्डर</Text></TouchableOpacity>
      <TouchableOpacity style={s.navBtn} onPress={function(){setTab('setting');setView('home');}}><Text style={[s.navTxt,{color:tab==='setting'?'#2E7D32':'#666'}]}>⚙️{'\n'}सेटिंग</Text></TouchableOpacity>
    </View>
    );
  }

  function renderOrderTab(){
    var olist=getOrderList();
    return (
    <View style={{flex:1}}>
      <View style={{backgroundColor:'#E3F2FD',marginHorizontal:8,marginTop:8,padding:10,borderRadius:8,borderWidth:1,borderColor:'#0D47A1'}}>
        <Text style={{fontWeight:'900',fontSize:15,color:'#0D47A1',textAlign:'center'}}>📝 कुल ऑर्डर: {orders.length}{search.trim()!==''? ' | सर्च में मिले: '+olist.length : ''}</Text>
      </View>
      <View style={[s.search,{borderColor:'#0D47A1'}]}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder="सर्च करें (नाम / मोबाइल नं. / पता / कार्य)" /></View>
      <FlatList
        style={{flex:1}}
        data={olist}
        keyExtractor={function(it){return String(it.id);}}
        renderItem={function(row){
          var o=row.item;
          return (
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15,color:'#0D47A1'}}>🌾 {o.name}</Text>
              <Text style={{fontSize:13,marginTop:4}}>📍 पता: {o.pata||'-'} | ब्लॉक: {o.block||'-'}</Text>
              <Text style={{fontSize:13}}>🏘️ जिला: {o.jila||'-'} | राज्य: {o.rajya||'-'}</Text>
              <Text style={{fontSize:13}}>📞 मोबाइल: {o.mobile||'-'}</Text>
              <Text style={{fontSize:13}}>🔧 कार्य: {o.karya||'-'}</Text>
              <Text style={{fontSize:13}}>📅 दिनांक: {o.dinank||'-'} | ⏰ समय: {o.samay||'-'} | 🌾 एकड़: {o.ekad||'-'}</Text>
              {o.mobile? (<View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={function(){Linking.openURL('tel:'+o.mobile);}}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={function(){Linking.openURL('https://wa.me/91'+String(o.mobile).replace(/\D/g,'').slice(-10));}}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={function(){Linking.openURL('sms:'+o.mobile);}}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity>
              </View>) : null}
              <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={function(){editOrder(o);}}><Text style={s.smT}>✏️ एडिट</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={function(){delOrder(o.id);}}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{paddingBottom:90}}
      />
      <TouchableOpacity style={[s.fab,{bottom:90}]} onPress={function(){clearOrderForm();setShowOrderForm(true);}}><Text style={s.fabT}>+</Text></TouchableOpacity>
      <Modal visible={showOrderForm} animationType="slide">
        <View style={s.modal}>
          <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',fontSize:16,textAlign:'center',color:'#0D47A1'}}>{ordEditId?'✏️ ऑर्डर अपडेट करें':'📝 नया ऑर्डर जोड़ें'}</Text>
            <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>किसान का नाम *</Text>
            <TextInput style={s.inp} value={ordName} onChangeText={setOrdName} placeholder="" />
            <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>पता</Text>
            <TextInput style={s.inp} value={ordPata} onChangeText={setOrdPata} placeholder="" />
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>ब्लॉक</Text><TextInput style={s.inp} value={ordBlock} onChangeText={setOrdBlock} placeholder="" /></View>
              <View style={{flex:1,marginLeft:6}}><Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>जिला</Text><TextInput style={s.inp} value={ordJila} onChangeText={setOrdJila} placeholder="" /></View>
            </View>
            <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>राज्य</Text>
            <TextInput style={s.inp} value={ordRajya} onChangeText={setOrdRajya} placeholder="" />
            <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>मोबाइल नंबर *</Text>
            <TextInput style={s.inp} value={ordMobile} onChangeText={setOrdMobile} placeholder="" keyboardType="numeric" />
            <Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>कार्य</Text>
            <TextInput style={s.inp} value={ordKarya} onChangeText={setOrdKarya} placeholder="" />
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}><Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>दिनांक</Text><TextInput style={s.inp} value={ordDinank} onChangeText={setOrdDinank} placeholder="" /></View>
              <View style={{flex:1,marginLeft:6}}><Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>समय</Text><TextInput style={s.inp} value={ordSamay} onChangeText={setOrdSamay} placeholder="" /></View>
              <View style={{flex:1,marginLeft:6}}><Text style={{fontSize:12,fontWeight:'bold',marginTop:8}}>एकड़</Text><TextInput style={s.inp} value={ordEkad} onChangeText={setOrdEkad} placeholder="" keyboardType="numeric" /></View>
            </View>
          </ScrollView>
          <View style={s.modalBottom}>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={function(){setShowOrderForm(false);clearOrderForm();}}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#0D47A1'}]} onPress={saveOrder}><Text style={s.mBtnT}>{ordEditId?'✔️ अपडेट करें':'सुरक्षित करें'}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={!!orderDel} transparent={true} animationType="fade" onRequestClose={function(){setOrderDel(null);}}>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}}>
          <View style={{backgroundColor:'#fff',borderRadius:14,padding:20,width:'90%',alignItems:'center',borderWidth:2,borderColor:'#D32F2F'}}>
            <Text style={{fontSize:18,fontWeight:'900',color:'#B71C1C',textAlign:'center'}}>क्या आप सच में यह ऑर्डर हटाना चाहते हैं?</Text>
            <View style={{flexDirection:'row',marginTop:20,width:'100%'}}>
              <TouchableOpacity style={{flex:1,backgroundColor:'#D32F2F',padding:14,borderRadius:10,alignItems:'center',marginRight:8}} onPress={confirmDelOrder}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>हाँ, हटाएं</Text></TouchableOpacity>
              <TouchableOpacity style={{flex:1,backgroundColor:'#2E7D32',padding:14,borderRadius:10,alignItems:'center'}} onPress={function(){setOrderDel(null);}}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>नहीं</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {renderBottomNav()}
    </View>
    );
  }

  function renderExpenseTab(){
    var catList=getExpCatList();
    return (
    <View style={{flex:1}}>
      <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
        <Text style={{fontWeight:'900',fontSize:18,textAlign:'center',color:'#B71C1C'}}>💸 खर्च का हिसाब</Text>
        <View style={[s.inp,{backgroundColor:'#FFEBEE',marginTop:10}]}><Text style={{fontWeight:'900',fontSize:16,textAlign:'center',color:'#B71C1C'}}>कुल खर्च: ₹ {totalExpense}</Text></View>
        <Text style={{fontWeight:'900',marginTop:14,marginBottom:6}}>खर्च की श्रेणी चुनें:</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
          {EXPENSE_CATS.map(function(c){
            return (
            <TouchableOpacity key={c} onPress={function(){setExpCat(c);}} style={{backgroundColor:expCat===c?'#B71C1C':'#fff',borderWidth:1,borderColor:'#B71C1C',paddingHorizontal:14,paddingVertical:10,borderRadius:20,marginRight:8,marginBottom:8}}>
              <Text style={{color:expCat===c?'#fff':'#B71C1C',fontWeight:'900'}}>{c}</Text>
            </TouchableOpacity>
            );
          })}
        </View>
        {expCat==='डीजल'||expCat==='पेट्रोल'? (
          <View style={{marginTop:12,backgroundColor:'#E3F2FD',padding:12,borderRadius:10,borderWidth:2,borderColor:'#1565C0'}}>
            <Text style={{fontSize:15,fontWeight:'900',color:'#0D47A1',textAlign:'center'}}>⛽ {expCat} - तिथि / लीटर / राशि</Text>
            <Text style={{fontWeight:'bold',marginTop:10}}>तिथि</Text>
            <TextInput style={s.inp} value={expTarikh} onChangeText={setExpTarikh} placeholder="" />
            <Text style={{fontWeight:'bold',marginTop:8}}>लीटर</Text>
            <TextInput style={s.inp} value={expLiter} onChangeText={setExpLiter} placeholder="" keyboardType="numeric" />
            <Text style={{fontWeight:'bold',marginTop:8}}>राशि ₹</Text>
            <TextInput style={s.inp} value={expRashi} onChangeText={setExpRashi} placeholder="" keyboardType="numeric" />
            <TouchableOpacity style={{backgroundColor:'#1565C0',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={addExpense}><Text style={{color:'#fff',fontWeight:'900'}}>➕ {expCat} खर्च जोड़ें</Text></TouchableOpacity>
            <View style={{marginTop:12,backgroundColor:'#fff',borderRadius:10,padding:10,borderWidth:1,borderColor:'#1565C0'}}>
              <Text style={{fontWeight:'900',color:'#0D47A1',textAlign:'center'}}>{expCat} खर्च बॉक्स - टोटल: {catList.length} प्रविष्टि | {getExpCatLiterTotal()} लीटर | ₹{getExpCatTotal()}</Text>
              <ScrollView style={{maxHeight:200,marginTop:8}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {catList.map(function(e,idx){
                return (
                <View key={e.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#E3F2FD',padding:8,borderRadius:6,marginTop:6}}>
                  <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. {e.tarikh} | {e.liter} लीटर | ₹{e.rashi}</Text>
                  <TouchableOpacity onPress={function(){setExpenses(function(p){return p.filter(function(x){return x.id!==e.id;});});}}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
                </View>
                );
              })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <View style={{marginTop:8}}>
            <Text style={{fontWeight:'bold',marginTop:8}}>चुनी हुई श्रेणी: <Text style={{color:'#B71C1C'}}>{expCat}</Text></Text>
            <Text style={{fontWeight:'bold',marginTop:12}}>विवरण</Text><TextInput style={s.inp} value={expVivaran} onChangeText={setExpVivaran} placeholder="" />
            <Text style={{fontWeight:'bold',marginTop:8}}>राशि</Text><TextInput style={s.inp} value={expRashi} onChangeText={setExpRashi} placeholder="" keyboardType="numeric" />
            <Text style={{fontWeight:'bold',marginTop:8}}>तारीख</Text><TextInput style={s.inp} value={expTarikh} onChangeText={setExpTarikh} placeholder="" />
            <TouchableOpacity style={{backgroundColor:'#D32F2F',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={addExpense}><Text style={{color:'#fff',fontWeight:'900'}}>➕ खर्च जोड़ें ({expCat})</Text></TouchableOpacity>
            <View style={{marginTop:12,backgroundColor:'#fff',borderRadius:10,padding:10,borderWidth:1,borderColor:'#D32F2F'}}>
              <Text style={{fontWeight:'900',color:'#B71C1C',textAlign:'center'}}>{expCat} खर्च बॉक्स - टोटल: {catList.length} प्रविष्टि | ₹{getExpCatTotal()}</Text>
              <ScrollView style={{maxHeight:200,marginTop:8}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {catList.map(function(e){
                return (
                <View key={e.id} style={s.card}><Text style={{fontWeight:'900',color:'#B71C1C'}}>[{e.cat}] {e.vivaran}</Text><Text>₹{e.rashi} | {e.tarikh}</Text>
                <TouchableOpacity onPress={function(){setExpenses(function(p){return p.filter(function(x){return x.id!==e.id;});});}}><Text style={{color:'red',fontWeight:'bold',marginTop:6}}>हटाएं</Text></TouchableOpacity></View>
                );
              })}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
      {renderBottomNav()}
    </View>
    );
  }

  if(splash){
    return (
      <View style={s.splash}>
        <Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" />
        <View style={s.loadBox}>
          <Text style={s.loadText}>लोड हो रहा है... {progress}%</Text>
          <View style={s.barBg}><View style={[s.barFill,{width:progress+'%'}]} /></View>
          <Text style={s.loadSub}>{progress} / 100</Text>
        </View>
      </View>
    );
  }

  if(!isLogin){
    return (
      <SafeAreaView style={s.loginSafe}>
        <ScrollView contentContainerStyle={s.loginScroll} showsVerticalScrollIndicator={false}>
          <View style={s.welcomeHeader}>
            <Text style={s.welcomeTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ{'\n'}जिला कांकेर (छत्तीसगढ़) में आपका स्वागत है</Text>
            <Text style={s.welcomeSub}>हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच,{'\n'}शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
          </View>
          <View style={s.loginBox}>
            <Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" />
            <Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text>
            <TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" />
            <TouchableOpacity style={s.loginBtn} onPress={doLogin}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity>
          </View>
          <View style={s.addressBox}>
            <Text style={s.addressTitle}>जिला कार्यालय</Text>
            <Text style={s.addressText}>पता- लखनपुरी, मेन रोड़, N.H.30,{'\n'}जिला सहकारी बैंक के सामने,{'\n'}ब्लॉक-चारामा, जिला-कांकेर (छत्तीसगढ़)</Text>
            <Text style={s.phoneText}>फोन नम्बर- 9479025929</Text>
            <Text style={s.emailText} numberOfLines={1} ellipsizeMode="tail">ईमेल- mahanadiharvestar2026@gmail.com</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  var totalCount=getFullList().length;
  var filteredList=getList();
  var menuTitle=MENU.find(function(m){return m.key===type;});
  var menuTitleText=menuTitle?menuTitle.title:'';

  return (
    <SafeAreaView style={s.safe}>
      {tab==='home' && view==='home'? (
        <View style={s.headColorful}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
            <Text style={{fontSize:32}}>🌾</Text>
            <View style={{flex:1,alignItems:'center',paddingHorizontal:6}}>
              <Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
              <Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text>
              <View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View>
            </View>
            <Text style={{fontSize:32}}>🚜</Text>
          </View>
        </View>
      ) : null}

      {tab==='expense'? renderExpenseTab() : null}
      {tab==='order'? renderOrderTab() : null}

      {tab==='setting'? (
        <View style={{flex:1}}>
          <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',fontSize:18,textAlign:'center'}}>⚙️ सेटिंग</Text>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15,marginBottom:10}}>📢 सूचना / नोटिस</Text>
              <TouchableOpacity style={{backgroundColor:'#B07BE6',padding:14,borderRadius:10,alignItems:'center'}} onPress={function(){ setType('notice'); setView('notice'); setTab('home'); setSearch(''); }}>
                <Text style={{color:'#fff',fontWeight:'900'}}>📋 सूचना / नोटिस देखें</Text>
              </TouchableOpacity>
              <Text style={{fontSize:12,color:'#888',marginTop:6,textAlign:'center'}}>कुल नोटिस: {notices.length}</Text>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>🔑 पासवर्ड बदलें</Text>
              <TextInput style={s.inp} value={newPass} onChangeText={setNewPass} placeholder="नया पासवर्ड लिखें" secureTextEntry={true} keyboardType="number-pad" />
              <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:12,borderRadius:8,marginTop:10,alignItems:'center'}} onPress={changePassword}><Text style={{color:'#fff',fontWeight:'900'}}>पासवर्ड सुरक्षित करें</Text></TouchableOpacity>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>📊 कुल डाटा</Text>
              <Text style={{marginTop:6}}>सदस्य: {members.length} | किसान: {kisans.length} | एजेंट: {agents.length}</Text>
              <Text>ऑपरेटर: {operators.length} | हेल्पर: {helpers.length} | डीलर: {dealers.length}</Text>
              <Text>पार्ट्स: {parts.length} | मैकेनिक: {mechanics.length} | अन्य: {anyas.length} | नोटिस: {notices.length}</Text>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>🏢 संस्था जानकारी</Text>
              <Text style={{marginTop:6}}>महानदी हार्वेस्टर मालिक कल्याण संघ, जिला कांकेर</Text>
              <Text>पंजीयन क्रमांक 122202678489</Text>
              <Text>फोन: 9479025929</Text>
            </View>
            <View style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15,marginBottom:10,color:'#D32F2F'}}>🚪 लॉग आउट</Text>
              <TouchableOpacity style={{backgroundColor:'#212121',padding:16,borderRadius:10,alignItems:'center'}} onPress={function(){ setTab('home'); setView('logout'); }}>
                <Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>लॉग आउट करें</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {renderBottomNav()}
        </View>
      ) : null}

      {tab==='home' && view==='home'? (
        <ScrollView>
          <View style={{padding:12,paddingBottom:90}}>
            {HOME_MENU.map(function(i){
              return (
              <TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={function(){ setType(i.key); setView(i.key); setSearch(''); }}>
                <Text style={s.btnTxt}>{i.title}</Text>
              </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : null}

      {tab==='home' && view!=='home' && view!=='logout'? (
        <View style={{flex:1}}>
          <View style={s.sub}>
            <TouchableOpacity onPress={function(){setView('home');}}><Text>← वापस</Text></TouchableOpacity>
            <Text>{menuTitleText} ({filteredList.length})</Text>
            <Text></Text>
          </View>
          <View style={{backgroundColor:'#E8F5E9',marginHorizontal:8,marginTop:8,padding:10,borderRadius:8,borderWidth:1,borderColor:'#2E7D32'}}>
            <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>कुल {menuTitleText}: {totalCount}{search.trim()!==''? ' | सर्च में मिले: '+filteredList.length : ''}</Text>
            {type==='members'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि (सदस्यता शुल्क): ₹{totalMemberRashi}</Text> : null}
            {type==='kisan'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalKisanRashi} | एडवांस: ₹{totalKisanAdvance} | बचत: ₹{totalKisanBachat}</Text> : null}
            {type==='agent'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalAgentRashi} | एडवांस: ₹{totalAgentAdvance} | बचत: ₹{totalAgentBachat}</Text> : null}
            {type==='operator'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalOperatorRashi} | एडवांस: ₹{totalOperatorAdvance} | बचत: ₹{totalOperatorBachat}</Text> : null}
            {type==='helper'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalHelperRashi} | एडवांस: ₹{totalHelperAdvance} | बचत: ₹{totalHelperBachat}</Text> : null}
            {type==='dealer'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalDealerRashi} | एडवांस: ₹{totalDealerAdvance} | बचत: ₹{totalDealerBachat}</Text> : null}
            {type==='parts'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalPartsRashi} | एडवांस: ₹{totalPartsAdvance} | बचत: ₹{totalPartsBachat}</Text> : null}
            {type==='mechanic'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalMechanicRashi} | एडवांस: ₹{totalMechanicAdvance} | बचत: ₹{totalMechanicBachat}</Text> : null}
            {type==='anya'? <Text style={{fontWeight:'900',fontSize:14,color:'#0D47A1',textAlign:'center',marginTop:4}}>💰 कुल राशि: ₹{totalAnyaRashi} | एडवांस: ₹{totalAnyaAdvance} | बचत: ₹{totalAnyaBachat}</Text> : null}
          </View>
          <View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder={getSearchPlaceholder()} /></View>
          {type==='members' &&!masterImported? (
            <TouchableOpacity style={{backgroundColor:'#1B5E20',margin:8,padding:14,borderRadius:10,alignItems:'center'}} onPress={importMasterData}>
              <Text style={{color:'#fff',fontWeight:'900'}}>📥 मास्टर डेटा से सदस्य जोड़ें</Text>
            </TouchableOpacity>
          ) : null}
          <FlatList
            style={{flex:1}}
            data={filteredList}
            keyExtractor={function(it){return String(it.id);}}
            renderItem={function(row){
              var it=row.item;
              return <RowItem it={it} type={type} onOpen={setDetailItem} onEdit={function(x){openForm(type,x);}} onDel={setDeleteItem} />;
            }}
            initialNumToRender={15}
            maxToRenderPerBatch={15}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={{paddingBottom:90}}
          />
          <TouchableOpacity style={[s.fab,{bottom:90}]} onPress={function(){openForm(type,null);}}><Text style={s.fabT}>+</Text></TouchableOpacity>
        </View>
      ) : null}

      {tab==='home' && view==='logout'? (
        <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center',padding:15,paddingBottom:80}}>
          <View style={[s.card,{width:'95%',alignItems:'center',padding:20,paddingBottom:30}]}>
            <TouchableOpacity style={{backgroundColor:'#212121',width:'100%',marginTop:10,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={doLogout}>
              <Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>हाँ, लॉग आउट करें</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'#2E7D32',width:'100%',marginTop:20,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={function(){setView('home');}}>
              <Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>नहीं, वापस जाएं</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}

      {tab==='home'? renderBottomNav() : null}

      <Modal visible={show} animationType="slide">
        <View style={s.modal}>
          <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{menuTitleText} फॉर्म</Text>
            {getFormKeys().map(function(k){
              var lbl=(HINDI[type]&&HINDI[type][k])?HINDI[type][k]:k;
              return (
              <View key={k} style={{marginTop:8}}>
                <Text style={{fontSize:12,fontWeight:'bold'}}>{lbl}</Text>
                <TextInput style={s.inp} value={form[k]} onChangeText={function(t){updateFormField(k,t);}} placeholder="" />
              </View>
              );
            })}
            {renderBottomSection()}
            {renderMoneySection()}
            {renderMechanicKaryaSection()}
            {renderKisanFasalSection()}
          </ScrollView>
          <View style={s.modalBottom}>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={function(){setShow(false);}}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!deleteItem} transparent={true} animationType="fade" onRequestClose={function(){setDeleteItem(null);}}>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:20}}>
          <View style={{backgroundColor:'#fff',borderRadius:14,padding:20,width:'90%',alignItems:'center',borderWidth:2,borderColor:'#D32F2F'}}>
            <Text style={{fontSize:18,fontWeight:'900',color:'#B71C1C',textAlign:'center'}}>क्या आप सच में हटाना चाहते हैं?</Text>
            <Text style={{fontSize:14,color:'#333',textAlign:'center',marginTop:10}}>{deleteItem? (deleteItem.name || deleteItem.vishay || '') : ''}</Text>
            <View style={{flexDirection:'row',marginTop:20,width:'100%'}}>
              <TouchableOpacity style={{flex:1,backgroundColor:'#D32F2F',padding:14,borderRadius:10,alignItems:'center',marginRight:8}} onPress={confirmDelete}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>हाँ, हटाएं</Text></TouchableOpacity>
              <TouchableOpacity style={{flex:1,backgroundColor:'#2E7D32',padding:14,borderRadius:10,alignItems:'center'}} onPress={function(){setDeleteItem(null);}}><Text style={{color:'#fff',fontWeight:'900',fontSize:16}}>नहीं</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!detailItem} animationType="slide" onRequestClose={function(){setDetailItem(null);}}>
        <SafeAreaView style={s.modal}>
          <ScrollView style={{padding:14}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',textAlign:'center',fontSize:18,color:'#B71C1C',marginBottom:4}}>{menuTitleText} - पूरी जानकारी</Text>
            <Text style={{textAlign:'center',fontSize:12,color:'#888',marginBottom:12}}>बायोडाटा डिटेल</Text>
            {detailItem? getDetailKeys().map(function(k){
              var lbl=(HINDI[type]&&HINDI[type][k])?HINDI[type][k]:k;
              return (
              <View key={k} style={s.detailRow}>
                <Text style={s.detailLabel}>{lbl}</Text>
                <Text style={s.detailValue}>{detailItem[k]||'-'}</Text>
              </View>
              );
            }) : null}
            {detailItem && isMoneyType(type)? (
              <View style={{backgroundColor:'#FFF8E1',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#FF9800'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#E65100',textAlign:'center'}}>💰 टोटल राशि / एडवांस / बचत</Text>
                <Text style={{fontSize:14,marginTop:6}}>टोटल राशि: ₹{detailItem.kulRashi||'0'}</Text>
                <Text style={{fontSize:14,marginTop:2}}>एडवांस टोटल: ₹{getAdvanceTotal(detailItem,type)}</Text>
                <Text style={{fontWeight:'900',fontSize:16,color:'#1B5E20',marginTop:6}}>बचत राशि (बाकी): ₹{calcBachat(detailItem,type)}</Text>
                <Text style={{fontSize:12,color:'#666',marginTop:4}}>टोटल ({detailItem.kulRashi||'0'}) - एडवांस ({getAdvanceTotal(detailItem,type)})</Text>
                {getAdvanceList(detailItem).map(function(e,i){
                  return <Text key={i} style={{fontSize:13,marginTop:2}}>{i+1}. {e.date} - ₹{e.amount}</Text>;
                })}
                {(type==='operator'||type==='helper')? <Text style={{fontSize:13,marginTop:6}}>📅 उपस्थिति: {getUpasthitiDates(detailItem).length} दिन</Text> : null}
                {type==='kisan'? <Text style={{fontSize:13,marginTop:6}}>🌾 कार्य प्रविष्टि: {getFasalList(detailItem).length} | {getFasalGhantaTotal(detailItem)}</Text> : null}
                {isMechanicLike(type)? <Text style={{fontSize:13,marginTop:6}}>🔧 कार्य: {getKaryaList(detailItem).length} | ₹{getKaryaTotal(detailItem)}</Text> : null}
              </View>
            ) : null}
            {detailItem && detailItem.mobile? (
              <View style={{flexDirection:'row',marginTop:14,flexWrap:'wrap',justifyContent:'center'}}>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={function(){Linking.openURL('tel:'+detailItem.mobile);}}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={function(){Linking.openURL('https://wa.me/91'+String(detailItem.mobile).replace(/\D/g,'').slice(-10));}}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity>
                <TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={function(){Linking.openURL('sms:'+detailItem.mobile);}}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
          <View style={s.modalBottom}>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#FF9800'}]} onPress={function(){ var it=detailItem; setDetailItem(null); if(it) openForm(type,it); }}><Text style={s.mBtnT}>✏️ एडिट करें</Text></TouchableOpacity>
            <TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={function(){setDetailItem(null);}}><Text style={s.mBtnT}>वापस जाएं</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

var s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  headColorful:{backgroundColor:'#FFF8E1',margin:10,padding:14,borderRadius:16,borderWidth:2,borderColor:'#FFB300',elevation:4},
  headTitle1:{fontWeight:'900',fontSize:17,color:'#B71C1C',textAlign:'center'},
  headTitle2:{fontWeight:'800',fontSize:14,color:'#0D47A1',marginTop:5,textAlign:'center',backgroundColor:'#E3F2FD',paddingHorizontal:10,paddingVertical:2,borderRadius:10},
  regBox:{backgroundColor:'#1B5E20',paddingHorizontal:12,paddingVertical:3,borderRadius:20,marginTop:6},
  headTitle3:{fontWeight:'900',fontSize:11,color:'#FFEB3B',textAlign:'center'},
  btn:{padding:16,borderRadius:12,marginBottom:10,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'bold'},
  sub:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:'#fff'},
  search:{flexDirection:'row',backgroundColor:'#fff',margin:8,paddingHorizontal:10,borderRadius:8,alignItems:'center',borderWidth:1,borderColor:'#FF9800'},
  card:{backgroundColor:'#fff',margin:8,padding:12,borderRadius:8},
  sm:{paddingHorizontal:14,paddingVertical:8,borderRadius:8,marginRight:8,marginBottom:6},
  smT:{color:'#fff',fontSize:13,fontWeight:'bold'},
  fab:{position:'absolute',right:16,bottom:16,width:56,height:56,borderRadius:28,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'},
  fabT:{color:'#fff',fontSize:28},
  inp:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginTop:4},
  mBtn:{flex:1,padding:12,borderRadius:8,alignItems:'center',marginRight:6},
  mBtnT:{color:'#fff',fontWeight:'bold'},
  modal:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  modalBottom:{flexDirection:'row',padding:12,paddingBottom:30,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',elevation:10},
  splash:{flex:1,backgroundColor:'#000',justifyContent:'flex-end'},
  splashImage:{position:'absolute',width:'100%',height:'100%'},
  loadBox:{width:'100%',paddingHorizontal:30,paddingBottom:60,alignItems:'center',backgroundColor:'rgba(0,0,0,0.55)',paddingTop:18},
  loadText:{color:'#fff',fontSize:18,fontWeight:'bold',marginBottom:10},
  loadSub:{color:'#FFEB3B',fontSize:14,fontWeight:'bold',marginTop:8},
  barBg:{width:'100%',height:12,backgroundColor:'rgba(255,255,255,0.3)',borderRadius:6,overflow:'hidden'},
  barFill:{height:'100%',backgroundColor:'#4CAF50',borderRadius:6},
  detailRow:{backgroundColor:'#fff',borderRadius:8,padding:10,marginBottom:8,borderLeftWidth:4,borderLeftColor:'#FF9800'},
  detailLabel:{fontSize:12,fontWeight:'bold',color:'#888'},
  detailValue:{fontSize:15,fontWeight:'600',color:'#212121',marginTop:3},
  loginSafe:{flex:1,backgroundColor:'#FFF3E0'},
  loginScroll:{flexGrow:1,justifyContent:'flex-start',alignItems:'center',paddingVertical:20,paddingHorizontal:10,paddingBottom:50},
  welcomeHeader:{width:'92%',backgroundColor:'#E8F5E9',borderRadius:14,padding:14,alignItems:'center',borderWidth:2,borderColor:'#2E7D32',marginBottom:15},
  welcomeTitle:{fontWeight:'900',fontSize:15,color:'#B71C1C',textAlign:'center',lineHeight:22},
  welcomeSub:{fontWeight:'700',fontSize:12,color:'#0D47A1',textAlign:'center',marginTop:8,lineHeight:18,backgroundColor:'#FFF9C4',paddingHorizontal:10,paddingVertical:6,borderRadius:8},
  loginBox:{width:'90%',backgroundColor:'#fff',padding:25,borderRadius:15,alignItems:'center',borderWidth:2,borderColor:'#FF9800'},
  loginLogo:{width:120,height:120,marginBottom:10},
  sloganText:{fontWeight:'900',fontSize:14,color:'#1B5E20',textAlign:'center',marginTop:6,marginBottom:4},
  loginInput:{width:'100%',borderWidth:1,borderColor:'#FF9800',borderRadius:8,padding:12,marginTop:20,textAlign:'center',fontSize:18},
  loginBtn:{width:'100%',backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:15,alignItems:'center'},
  loginBtnT:{color:'#fff',fontWeight:'bold',fontSize:16},
  addressBox:{width:'92%',marginTop:15,marginBottom:30,backgroundColor:'#fff',borderRadius:12,padding:12,alignItems:'center',borderWidth:1,borderColor:'#FFB300'},
  addressTitle:{fontWeight:'900',fontSize:14,color:'#B71C1C',marginBottom:6},
  addressText:{fontSize:12,color:'#333',textAlign:'center',lineHeight:18,marginTop:2},
  phoneText:{fontSize:13,color:'#000',textAlign:'center',fontWeight:'900',marginTop:6,lineHeight:20},
  emailText:{fontSize:11,color:'#333',textAlign:'center',marginTop:4},
  navBar:{flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',paddingVertical:8,paddingBottom:18,position:'absolute',bottom:0,left:0,right:0,elevation:10},
  navBtn:{flex:1,alignItems:'center',justifyContent:'center'},
  navTxt:{fontSize:12,fontWeight:'bold',textAlign:'center',lineHeight:18},
});
