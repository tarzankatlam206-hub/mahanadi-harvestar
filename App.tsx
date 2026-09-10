import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseTab from './ExpenseTab';
import DueTab from './DueTab';
import SettingTab from './SettingTab';
import { HOME_MENU, MENU } from './shared';

const HINDI: any = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि (बाकी)',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 helper: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 dealer: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 mechanic: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 anya: {name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',anyaJankari:'अन्य जानकारी'}
};

export default function App(){
  const [tab,setTab]=useState('home');
  const [type,setType]=useState<any>(null);
  const [view,setView]=useState('splash');
  const [pass,setPass]=useState('');
  const [members,setMembers]=useState<any[]>([]);
  const [kisans,setKisans]=useState<any[]>([]);
  const [agents,setAgents]=useState<any[]>([]);
  const [operators,setOperators]=useState<any[]>([]);
  const [helpers,setHelpers]=useState<any[]>([]);
  const [dealers,setDealers]=useState<any[]>([]);
  const [parts,setParts]=useState<any[]>([]);
  const [mechanics,setMechanics]=useState<any[]>([]);
  const [anyas,setAnyas]=useState<any[]>([]);
  const [notices,setNotices]=useState<any[]>([]);
  const [expenses,setExpenses]=useState<any[]>([]);

  useEffect(()=>{
    (async()=>{
      const keys=['members','kisans','agents','operators','helpers','dealers','parts','mechanics','anyas','notices','expenses'];
      const setters=[setMembers,setKisans,setAgents,setOperators,setHelpers,setDealers,setParts,setMechanics,setAnyas,setNotices,setExpenses];
      for(let i=0;i<keys.length;i++){
        try{ const v=await AsyncStorage.getItem(keys[i]); if(v) setters[i](JSON.parse(v)); }catch(e){}
      }
      setTimeout(()=>setView('login'),1500);
    })();
  },[]);

  useEffect(()=>{
    AsyncStorage.setItem('members',JSON.stringify(members)).catch(()=>{});
  },[members]);
  useEffect(()=>{ AsyncStorage.setItem('kisans',JSON.stringify(kisans)).catch(()=>{}); },[kisans]);
  useEffect(()=>{ AsyncStorage.setItem('expenses',JSON.stringify(expenses)).catch(()=>{}); },[expenses]);

  const s=StyleSheet.create({
    inp:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:10,marginTop:6,backgroundColor:'#fff'},
    card:{backgroundColor:'#fff',borderRadius:10,padding:12,marginTop:10,borderWidth:1,borderColor:'#eee'},
  });

  if(view==='splash'){
    return(<View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#1B5E20'}}><Text style={{color:'#fff',fontSize:22,fontWeight:'900'}}>महानदी हार्वेस्टर</Text><Text style={{color:'#fff',marginTop:8}}>मालिक कल्याण संघ, कांकेर</Text></View>);
  }
  if(view==='login'){
    return(
      <View style={{flex:1,justifyContent:'center',padding:20,backgroundColor:'#E8F5E9'}}>
        <Text style={{fontSize:20,fontWeight:'900',textAlign:'center',marginBottom:16}}>लॉगिन</Text>
        <TextInput style={s.inp} value={pass} onChangeText={setPass} placeholder="पासवर्ड लिखें" secureTextEntry={true} keyboardType="number-pad"/>
        <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={async()=>{
          const sv=await AsyncStorage.getItem('appPass'); const ok=sv||'2022';
          if(pass===ok){ setView('main'); } else { alert('गलत पासवर्ड'); }
        }}><Text style={{color:'#fff',fontWeight:'900'}}>अंदर जाएं</Text></TouchableOpacity>
      </View>
    );
  }

  return(
    <SafeAreaView style={{flex:1,backgroundColor:'#F5F5F5'}}>
      {tab==='home' && type===null && (
        <ScrollView contentContainerStyle={{padding:12,paddingBottom:120}}>
          <Text style={{fontSize:18,fontWeight:'900',textAlign:'center',marginVertical:10}}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
            {HOME_MENU.map(m=>(
              <TouchableOpacity key={m.key} onPress={()=>setType(m.key)} style={{width:'48%',backgroundColor:m.color,padding:18,borderRadius:12,marginBottom:10,alignItems:'center'}}>
                <Text style={{color:'#fff',fontWeight:'900',fontSize:15}}>{m.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={()=>setType('notice')} style={{backgroundColor:'#B07BE6',padding:16,borderRadius:12,alignItems:'center',marginTop:6}}>
            <Text style={{color:'#fff',fontWeight:'900'}}>सूचना / नोटिस</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {tab==='home' && type!==null && (
        <View style={{flex:1,padding:12}}>
          <TouchableOpacity onPress={()=>setType(null)} style={{backgroundColor:'#333',padding:10,borderRadius:8,alignItems:'center',marginBottom:10}}>
            <Text style={{color:'#fff',fontWeight:'900'}}>← वापस</Text>
          </TouchableOpacity>
          <Text style={{textAlign:'center',fontWeight:'900',fontSize:16}}>{type} - जल्द पूरा फॉर्म यहां आएगा</Text>
          <Text style={{textAlign:'center',color:'#888',marginTop:8}}>आपका पुराना 883 वाला फॉर्म कोड यहां जोड़ देंगे</Text>
        </View>
      )}
      {tab==='expense' && <ExpenseTab expenses={expenses} setExpenses={setExpenses} s={s}/>}
      {tab==='due' && <DueTab kisans={kisans} operators={operators} helpers={helpers} mechanics={mechanics} anyas={anyas} s={s}/>}
      {tab==='setting' && <SettingTab notices={notices} members={members} kisans={kisans} agents={agents} operators={operators} helpers={helpers} dealers={dealers} parts={parts} mechanics={mechanics} anyas={anyas} s={s} setType={setType} setView={setView} setTab={setTab}/>}

      <View style={{flexDirection:'row',position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',paddingVertical:8}}>
        {[{k:'home',t:'होम'},{k:'expense',t:'खर्च'},{k:'due',t:'देय राशि'},{k:'setting',t:'सेटिंग'}].map(b=>(
          <TouchableOpacity key={b.k} onPress={()=>{setTab(b.k); setType(null);}} style={{flex:1,alignItems:'center',padding:6}}>
            <Text style={{fontWeight:'900',color:tab===b.k?'#2E7D32':'#888'}}>{b.t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
