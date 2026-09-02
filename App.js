import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function App() {
  return React.createElement(View, {style: styles.c},
    React.createElement(Text, {style: styles.t}, 'महानदी हार्वेस्टर'),
    React.createElement(Text, {style: styles.r}, 'पंजीयन क्रमांक: 122202678489')
  );
}
const styles = StyleSheet.create({
  c:{flex:1, backgroundColor:'#1a5c1a', justifyContent:'center', alignItems:'center'},
  t:{color:'#fff', fontSize:18, fontWeight:'bold'},
  r:{color:'#fff', marginTop:10, backgroundColor:'#3d5a4c', padding:8, borderRadius:10}
});
