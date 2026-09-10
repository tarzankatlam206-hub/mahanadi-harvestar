import React from 'react';
import {View,Text,ScrollView} from 'react-native';
export default function DueTab({kisans,operators,helpers,mechanics,anyas,s}:any){
  const arr:any[]=[];
  kisans.forEach((x:any)=>{const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'किसान',name:x.name,mobile:x.mobile,amt:b});});
  operators.forEach((x:any)=>{const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'ऑपरेटर',name:x.name,mobile:x.mobile,amt:b});});
  helpers.forEach((x:any)=>{const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'हेल्पर',name:x.name,mobile:x.mobile,amt:b});});
  mechanics.forEach((x:any)=>{const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'मैकेनिक',name:x.name,mobile:x.mobile,amt:b});});
  anyas.forEach((x:any)=>{const b=parseFloat(x.bachatRashi||'0')||0; if(b>0) arr.push({cat:'अन्य',name:x.name,mobile:x.mobile,amt:b});});
  const totalDue=arr.reduce((a,e)=>a+e.amt,0);
  return(
    <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
      <Text style={{fontWeight:'900',fontSize:18,textAlign:'center',color:'#E65100'}}>📒 देय राशि (बचत बाकी)</Text>
      <View style={[s.inp,{backgroundColor:'#FFF3E0',marginTop:10}]}><Text style={{fontWeight:'900',fontSize:16,textAlign:'center',color:'#E65100'}}>कुल देय: ₹ {totalDue}</Text></View>
      {arr.map((d,i)=>(
        <View key={i} style={s.card}><Text style={{fontWeight:'bold'}}>{d.cat} - {d.name}</Text><Text>मोबाइल: {d.mobile||'-'}</Text><Text style={{fontWeight:'900',color:'#D32F2F'}}>बाकी: ₹{d.amt}</Text></View>
      ))}
      {arr.length===0 && <Text style={{textAlign:'center',marginTop:20,color:'#888'}}>कोई देय राशि नहीं है</Text>}
    </ScrollView>
  );
}
