import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput} from 'react-native';
import {EXPENSE_CATS} from './shared';
export default function ExpenseTab({expenses,setExpenses,s}:any){
  const [expCat,setExpCat]=useState('डीजल');
  const [expVivaran,setExpVivaran]=useState('');
  const [expRashi,setExpRashi]=useState('');
  const [expTarikh,setExpTarikh]=useState('');
  const [expLiter,setExpLiter]=useState('');
  const totalExpense=expenses.reduce((a:any,e:any)=>a+(parseFloat(e.rashi)||0),0);
  const catList=expenses.filter((e:any)=>(e.cat||'अन्य')===expCat);
  const catTotal=catList.reduce((a:any,e:any)=>a+(parseFloat(e.rashi)||0),0);
  const literTotal=catList.reduce((a:any,e:any)=>a+(parseFloat(e.liter)||0),0);
  const addExpense=()=>{
    if(expCat==='डीजल'){
      if(!expTarikh.trim()){alert('तिथि लिखें');return;}
      if(!expLiter.trim()){alert('लीटर लिखें');return;}
      if(!expRashi.trim()){alert('राशि लिखें');return;}
      const e={id:Date.now().toString(),cat:expCat,tarikh:expTarikh,liter:expLiter,rashi:expRashi,vivaran:'डीजल '+expLiter+' लीटर'};
      setExpenses((p:any)=>[e,...p]); setExpTarikh(''); setExpLiter(''); setExpRashi('');
    }else{
      if(!expRashi.trim()){alert('राशि लिखें');return;}
      const e={id:Date.now().toString(),cat:expCat,vivaran:expVivaran||expCat,tarikh:expTarikh||new Date().toLocaleDateString('hi-IN'),rashi:expRashi,liter:''};
      setExpenses((p:any)=>[e,...p]); setExpVivaran(''); setExpRashi(''); setExpTarikh('');
    }
  };
  return(
    <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
      <Text style={{fontWeight:'900',fontSize:18,textAlign:'center',color:'#B71C1C'}}>💸 खर्च का हिसाब</Text>
      <View style={[s.inp,{backgroundColor:'#FFEBEE',marginTop:10}]}><Text style={{fontWeight:'900',fontSize:16,textAlign:'center',color:'#B71C1C'}}>कुल खर्च: ₹ {totalExpense}</Text></View>
      <Text style={{fontWeight:'900',marginTop:14,marginBottom:6}}>खर्च की श्रेणी चुनें:</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        {EXPENSE_CATS.map(c=>(
          <TouchableOpacity key={c} onPress={()=>setExpCat(c)} style={{backgroundColor:expCat===c?'#B71C1C':'#fff',borderWidth:1,borderColor:'#B71C1C',paddingHorizontal:14,paddingVertical:10,borderRadius:20,marginRight:8,marginBottom:8}}>
            <Text style={{color:expCat===c?'#fff':'#B71C1C',fontWeight:'900'}}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {expCat==='डीजल'?(
        <View style={{marginTop:12,backgroundColor:'#E3F2FD',padding:12,borderRadius:10,borderWidth:2,borderColor:'#1565C0'}}>
          <Text style={{fontSize:15,fontWeight:'900',color:'#0D47A1',textAlign:'center'}}>⛽ डीजल - तिथि / लीटर / राशि</Text>
          <Text style={{fontWeight:'bold',marginTop:10}}>तिथि</Text>
          <TextInput style={s.inp} value={expTarikh} onChangeText={setExpTarikh} placeholder="तिथि जैसे 10/09/2026"/>
          <Text style={{fontWeight:'bold',marginTop:8}}>लीटर</Text>
          <TextInput style={s.inp} value={expLiter} onChangeText={setExpLiter} placeholder="लीटर लिखें" keyboardType="numeric"/>
          <Text style={{fontWeight:'bold',marginTop:8}}>राशि ₹</Text>
          <TextInput style={s.inp} value={expRashi} onChangeText={setExpRashi} placeholder="राशि ₹" keyboardType="numeric"/>
          <TouchableOpacity style={{backgroundColor:'#1565C0',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={addExpense}><Text style={{color:'#fff',fontWeight:'900'}}>➕ डीजल खर्च जोड़ें</Text></TouchableOpacity>
        </View>
      ):(
        <View style={{marginTop:8}}>
          <Text style={{fontWeight:'bold',marginTop:8}}>चुनी हुई श्रेणी: <Text style={{color:'#B71C1C'}}>{expCat}</Text></Text>
          <Text style={{fontWeight:'bold',marginTop:12}}>विवरण</Text><TextInput style={s.inp} value={expVivaran} onChangeText={setExpVivaran} placeholder={expCat+" का विवरण लिखें"}/>
          <Text style={{fontWeight:'bold',marginTop:8}}>राशि</Text><TextInput style={s.inp} value={expRashi} onChangeText={setExpRashi} placeholder="राशि ₹" keyboardType="numeric"/>
          <Text style={{fontWeight:'bold',marginTop:8}}>तारीख</Text><TextInput style={s.inp} value={expTarikh} onChangeText={setExpTarikh} placeholder="तारीख जैसे 10/09/2026"/>
          <TouchableOpacity style={{backgroundColor:'#D32F2F',padding:14,borderRadius:10,marginTop:12,alignItems:'center'}} onPress={addExpense}><Text style={{color:'#fff',fontWeight:'900'}}>➕ खर्च जोड़ें ({expCat})</Text></TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
