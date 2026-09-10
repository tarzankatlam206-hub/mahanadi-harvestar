import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SettingTab({notices,members,kisans,agents,operators,helpers,dealers,parts,mechanics,anyas,s,setType,setView,setTab}:any){
  const [newPass,setNewPass]=useState('');
  const changePassword=async()=>{ if(newPass.trim().length<4){alert('कम से कम 4 अंक का पासवर्ड रखें');return;} await AsyncStorage.setItem('appPass',newPass.trim()); setNewPass(''); alert('पासवर्ड बदल गया'); };
  return(
    <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
      <Text style={{fontWeight:'900',fontSize:18,textAlign:'center'}}>⚙️ सेटिंग</Text>
      <View style={s.card}>
        <Text style={{fontWeight:'900',fontSize:15,marginBottom:10}}>📢 सूचना / नोटिस</Text>
        <TouchableOpacity style={{backgroundColor:'#B07BE6',padding:14,borderRadius:10,alignItems:'center'}} onPress={()=>{setType('notice'); setView('notice'); setTab('home');}}>
          <Text style={{color:'#fff',fontWeight:'900'}}>📋 सूचना / नोटिस देखें</Text>
        </TouchableOpacity>
        <Text style={{fontSize:12,color:'#888',marginTop:6,textAlign:'center'}}>कुल नोटिस: {notices.length}</Text>
      </View>
      <View style={s.card}>
        <Text style={{fontWeight:'900',fontSize:15}}>🔑 पासवर्ड बदलें</Text>
        <TextInput style={s.inp} value={newPass} onChangeText={setNewPass} placeholder="नया पासवर्ड लिखें" secureTextEntry={true} keyboardType="number-pad"/>
        <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:12,borderRadius:8,marginTop:10,alignItems:'center'}} onPress={changePassword}><Text style={{color:'#fff',fontWeight:'900'}}>पासवर्ड सुरक्षित करें</Text></TouchableOpacity>
      </View>
      <View style={s.card}>
        <Text style={{fontWeight:'900',fontSize:15}}>📊 कुल डाटा</Text>
        <Text style={{marginTop:6}}>सदस्य: {members.length} | किसान: {kisans.length} | एजेंट: {agents.length}</Text>
        <Text>ऑपरेटर: {operators.length} | हेल्पर: {helpers.length} | डीलर: {dealers.length}</Text>
        <Text>पार्ट्स: {parts.length} | मैकेनिक: {mechanics.length} | अन्य: {anyas.length} | नोटिस: {notices.length}</Text>
      </View>
    </ScrollView>
  );
}
