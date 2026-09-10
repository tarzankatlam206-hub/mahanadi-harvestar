import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseTab from './ExpenseTab';
import DueTab from './DueTab';
import SettingTab from './SettingTab';
import { HOME_MENU } from './shared';
import { getAdvanceList, getAdvanceTotal, calcCommonBachat, calcKisanBachat } from './shared';

const HINDI:any = {
  members:{name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर नम्बर',sadasyataShulk:'सदस्यता शुल्क',anyaJankari:'अन्य जानकारी'},
  kisan:{name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  agent:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  operator:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  helper:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  dealer:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  parts:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  mechanic:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  anya:{name:'नाम *',pata:'पता',mobile:'मोबाइल नंबर *',kulRashi:'टोटल राशि',advanceRashi:'एडवांस राशि',bachatRashi:'बचत राशि (बाकी)',anyaJankari:'अन्य जानकारी'},
  notice:{vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',anyaJankari:'अन्य जानकारी'}
};
const KEYS = ['members','kisans','agents','operators','helpers','dealers','parts','mechanics','anyas','notices','expenses'];

export default function App(){
  const [tab,setTab]=useState('home');
  const [type,setType]=useState<any>(null);
  const [view,setView]=useState('splash');
  const [pass,setPass]=useState('');
  const [search,setSearch]=useState('');
  const [form,setForm]=useState<any>({});
  const [editingId,setEditingId]=useState<any>(null);
  const [advAmt,setAdvAmt]=useState('');
  const [advDate,setAdvDate]=useState('');
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

  const allData:any = {members,kisans,agents,operators,helpers,dealers,parts,mechanics,anya:anyas,notice:notices};
  const setters:any = {members:setMembers,kisans:setKisans,agents:setAgents,operators:setOperators,helpers:setHelpers,dealers:setDealers,parts:setParts,mechanics:setMechanics,anya:setAnyas,notice:setNotices};

  useEffect(()=>{ (async()=>{
    for(let k of KEYS){ try{ const v=await AsyncStorage.getItem(k); if(v){ const d=JSON.parse(v);
      if(k==='members')setMembers(d); if(k==='kisans')setKisans(d); if(k==='agents')setAgents(d);
      if(k==='operators')setOperators(d); if(k==='helpers')setHelpers(d); if(k==='dealers')setDealers(d);
      if(k==='parts')setParts(d); if(k==='mechanics')setMechanics(d); if(k==='anyas')setAnyas(d);
      if(k==='notices')setNotices(d); if(k==='expenses')setExpenses(d);
    }}catch(e){}
    }
    setTimeout(()=>setView('login'),1200);
  })(); },[]);

  const saveAll = (k:string, d:any[])=>{ AsyncStorage.setItem(k, JSON.stringify(d)).catch(()=>{}); };

  const s=StyleSheet.create({
    inp:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:10,marginTop:6,backgroundColor:'#fff'},
    card:{backgroundColor:'#fff',borderRadius:10,padding:12,marginTop:10,borderWidth:1,borderColor:'#eee'},
    btn:{backgroundColor:'#2E7D32',padding:14,borderRadius:10,marginTop:12,alignItems:'center'},
  });

  const getList = ()=>{ if(!type) return []; return allData[type]||[]; };

  const filtered = getList().filter((it:any)=>{
    if(!search.trim()) return true;
    const q=search.toLowerCase();
    return Object.values(it).join(' ').toLowerCase().includes(q);
  });

  const openAdd = ()=>{ setForm({}); setEditingId(null); setAdvAmt(''); setAdvDate(''); };
  const openEdit = (it:any)=>{ setForm({...it}); setEditingId(it.id); };

  const calcBachat = (f:any)=>{
    if(type==='kisan') return calcKisanBachat(f);
    if(['agent','operator','helper','dealer','parts','mechanic','anya'].includes(type)) return calcCommonBachat(f,type);
    return f.bachatRashi||'';
  };

  const handleSave = ()=>{
    if(!form.name?.trim()){ alert('नाम लिखें'); return; }
    const bachat = calcBachat(form);
    const data = {...form, bachatRashi: bachat, id: editingId||Date.now().toString()};
    const list = getList();
    let nd;
    if(editingId){ nd = list.map((x:any)=>x.id===editingId?data:x); } else { nd = [data,...list]; }
    setters[type](nd);
    const key = type==='anya'?'anyas':type==='notice'?'notices':type+'s';
    saveAll(key, nd);
    setForm({}); setEditingId(null); setSearch('');
  };

  const addAdvance = ()=>{
    if(!advAmt.trim()){ alert('एडवांस राशि लिखें'); return; }
    const entry = {amount:advAmt, date: advDate||new Date().toLocaleDateString('hi-IN')};
    const nl = [...getAdvanceList(form), entry];
    const nf = {...form, advanceList:nl};
    nf.bachatRashi = calcBachat(nf);
    setForm(nf); setAdvAmt(''); setAdvDate('');
  };

  if(view==='splash') return(<View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#1B5E20'}}><Text style={{color:'#fff',fontSize:22,fontWeight:'900'}}>महानदी हार्वेस्टर</Text><Text style={{color:'#fff',marginTop:8}}>मालिक कल्याण संघ, कांकेर</Text></View>);
  if(view==='login') return(
    <View style={{flex:1,justifyContent:'center',padding:20,backgroundColor:'#E8F5E9'}}>
      <Text style={{fontSize:20,fontWeight:'900',textAlign:'center',marginBottom:16}}>लॉगिन</Text>
      <TextInput style={s.inp} value={pass} onChangeText={setPass} placeholder="पासवर्ड लिखें" secureTextEntry keyboardType="number-pad"/>
      <TouchableOpacity style={s.btn} onPress={async()=>{ const sv=await AsyncStorage.getItem('appPass'); if(pass===(sv||'2022')) setView('main'); else alert('गलत पासवर्ड'); }}>
        <Text style={{color:'#fff',fontWeight:'900'}}>अंदर जाएं</Text></TouchableOpacity>
    </View>
  );

  return(
    <SafeAreaView style={{flex:1,backgroundColor:'#F5F5F5'}}>
      {tab==='home' &&!type && (
        <ScrollView contentContainerStyle={{padding:12,paddingBottom:120}}>
          <Text style={{fontSize:18,fontWeight:'900',textAlign:'center',marginVertical:10}}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
            {HOME_MENU.map(m=>(
              <TouchableOpacity key={m.key} onPress={()=>{setType(m.key); openAdd();}} style={{width:'48%',backgroundColor:m.color,padding:18,borderRadius:12,marginBottom:10,alignItems:'center'}}>
                <Text style={{color:'#fff',fontWeight:'900'}}>{m.title}</Text>
                <Text style={{color:'#fff',fontSize:12,marginTop:4}}>कुल: {(allData[m.key]||[]).length}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={()=>{setType('notice'); openAdd();}} style={{backgroundColor:'#B07BE6',padding:16,borderRadius:12,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'900'}}>सूचना / नोटिस ({notices.length})</Text></TouchableOpacity>
        </ScrollView>
      )}

      {tab==='home' && type && (
        <ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}>
          <TouchableOpacity onPress={()=>setType(null)} style={{backgroundColor:'#333',padding:10,borderRadius:8,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'900'}}>← वापस</Text></TouchableOpacity>
          <Text style={{fontSize:16,fontWeight:'900',textAlign:'center',marginTop:10}}>{(HOME_MENU.find(x=>x.key===type)?.title)||'सूचना'} - {editingId?'एडिट करें':'नया जोड़ें'}</Text>

          <TextInput style={s.inp} value={search} onChangeText={setSearch} placeholder="🔍 खोजें - नाम, पता, मोबाइल"/>

          {Object.keys(HINDI[type]||{}).map(k=>{
            if(k==='bachatRashi') return(
              <View key={k}><Text style={{fontWeight:'bold',marginTop:10}}>{HINDI[type][k]} (ऑटो)</Text>
              <View style={[s.inp,{backgroundColor:'#FFF3E0'}]}><Text style={{fontWeight:'900'}}>{calcBachat(form)||'0'}</Text></View></View>
            );
            if(k==='advanceRashi' && type!=='members' && type!=='notice') return(
              <View key={k}>
                <Text style={{fontWeight:'bold',marginTop:10}}>एडवांस राशि - किस्त दर किस्त जोड़ें</Text>
                <View style={{flexDirection:'row',marginTop:6}}>
                  <TextInput style={[s.inp,{flex:1,marginRight:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="राशि ₹" keyboardType="numeric"/>
                  <TextInput style={[s.inp,{flex:1}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख"/>
                </View>
                <TouchableOpacity onPress={addAdvance} style={{backgroundColor:'#EF6C00',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'900'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
                {getAdvanceList(form).map((e:any,i:number)=>(
                  <View key={i} style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#FFF3E0',padding:8,borderRadius:6,marginTop:6}}>
                    <Text>{i+1}. ₹{e.amount} - {e.date}</Text>
                    <TouchableOpacity onPress={()=>{ const nl=getAdvanceList(form).filter((_:any,ix:number)=>ix!==i); const nf={...form,advanceList:nl}; nf.bachatRashi=calcBachat(nf); setForm(nf); }}>
                      <Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
                  </View>
                ))}
                <View style={[s.inp,{backgroundColor:'#E8F5E9',marginTop:8}]}><Text style={{fontWeight:'900'}}>कुल एडवांस: ₹{getAdvanceTotal(form,type)}</Text></View>
              </View>
            );
            return(
              <View key={k}><Text style={{fontWeight:'bold',marginTop:10}}>{HINDI[type][k]}</Text>
              <TextInput style={s.inp} value={form[k]||''} onChangeText={v=>{ const nf={...form,[k]:v}; if(k==='kulRashi'){ nf.bachatRashi=calcBachat(nf); } setForm(nf); }} placeholder={HINDI[type][k]} keyboardType={(k==='mobile'||k==='kulRashi')?'numeric':'default'}/></View>
            );
          })}

          <TouchableOpacity style={s.btn} onPress={handleSave}><Text style={{color:'#fff',fontWeight:'900'}}>{editingId?'💾 अपडेट करें':'➕ सुरक्षित करें'}</Text></TouchableOpacity>

          <Text style={{fontWeight:'900',marginTop:16}}>सूची ({filtered.length})</Text>
          {filtered.map((it:any)=>(
            <View key={it.id} style={s.card}>
              <Text style={{fontWeight:'900',fontSize:15}}>{it.name}</Text>
              <Text>{it.pata||''} {it.mobile?'| '+it.mobile:''}</Text>
              {(it.kulRashi||it.bachatRashi) && <Text style={{marginTop:4}}>टोटल: ₹{it.kulRashi||'0'} | एडवांस: ₹{getAdvanceTotal(it,type)} | <Text style={{fontWeight:'900',color:'#D32F2F'}}>बचत बाकी: ₹{it.bachatRashi||'0'}</Text></Text>}
              <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}>
                <TouchableOpacity onPress={()=>openEdit(it)} style={{backgroundColor:'#1976D2',padding:8,borderRadius:6,marginRight:6}}><Text style={{color:'#fff',fontWeight:'bold'}}>एडिट</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{ const nl=getList().filter((x:any)=>x.id!==it.id); setters[type](nl); const key=type==='anya'?'anyas':type==='notice'?'notices':type+'s'; saveAll(key,nl); }} style={{backgroundColor:'#D32F2F',padding:8,borderRadius:6,marginRight:6}}><Text style={{color:'#fff',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
                {it.mobile && (<>
                  <TouchableOpacity onPress={()=>Linking.openURL('tel:'+it.mobile)} style={{backgroundColor:'#388E3C',padding:8,borderRadius:6,marginRight:6}}><Text style={{color:'#fff',fontWeight:'bold'}}>📞 कॉल</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>Linking.openURL('https://wa.me/91'+it.mobile)} style={{backgroundColor:'#25D366',padding:8,borderRadius:6}}><Text style={{color:'#fff',fontWeight:'bold'}}>WhatsApp</Text></TouchableOpacity>
                </>)}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {tab==='expense' && <ExpenseTab expenses={expenses} setExpenses={(d:any)=>{setExpenses(d); saveAll('expenses',typeof d==='function'?d(expenses):d);}} s={s}/>}
      {tab==='due' && <DueTab kisans={kisans} operators={operators} helpers={helpers} mechanics={mechanics} anyas={anyas} s={s}/>}
      {tab==='setting' && <SettingTab notices={notices} members={members} kisans={kisans} agents={agents} operators={operators} helpers={helpers} dealers={dealers} parts={parts} mechanics={mechanics} anyas={anyas} s={s} setType={(t:any)=>{setType(t); setTab('home');}} setView={setView} setTab={setTab}/>}

      <View style={{flexDirection:'row',position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#ddd',paddingVertical:8}}>
        {[{k:'home',t:'होम'},{k:'expense',t:'खर्च'},{k:'due',t:'देय राशि'},{k:'setting',t:'सेटिंग'}].map(b=>(
          <TouchableOpacity key={b.k} onPress={()=>{setTab(b.k);}} style={{flex:1,alignItems:'center',padding:6}}>
            <Text style={{fontWeight:'900',color:tab===b.k?'#2E7D32':'#888'}}>{b.t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
