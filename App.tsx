import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>MH</Text>
          </View>
          <Text style={styles.title}>महानदी हार्वेस्टर संघ</Text>
          <Text style={styles.subtitle}>Mahanadi Harvester Union</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>संघ के बारे में</Text>
          <Text style={styles.cardDesc}>महानदी क्षेत्र के हार्वेस्टर मालिकों का आधिकारिक संघ।</Text>
        </View>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={()=>Linking.openURL('tel:+919999999999')}>
            <Text style={styles.gridIcon}>📞</Text><Text style={styles.gridText}>संपर्क</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Text style={styles.gridIcon}>🚜</Text><Text style={styles.gridText}>हार्वेस्टर</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f5f7f0'},
  scroll:{padding:20},
  header:{alignItems:'center',marginTop:20,marginBottom:20},
  logoBox:{width:90,height:90,borderRadius:45,backgroundColor:'#2e7d32',justifyContent:'center',alignItems:'center',marginBottom:12},
  logoText:{color:'#fff',fontSize:36,fontWeight:'bold'},
  title:{fontSize:26,fontWeight:'bold',color:'#1b5e20',textAlign:'center'},
  subtitle:{fontSize:16,color:'#555',marginTop:2},
  card:{backgroundColor:'#fff',borderRadius:16,padding:16,marginTop:16,elevation:2},
  cardTitle:{fontSize:18,fontWeight:'bold',color:'#1b5e20',marginBottom:8},
  cardDesc:{fontSize:14,color:'#444',lineHeight:20},
  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:16},
  gridItem:{width:'48%',backgroundColor:'#fff',borderRadius:16,padding:18,alignItems:'center',marginBottom:12,elevation:2},
  gridIcon:{fontSize:28,marginBottom:6},
  gridText:{fontSize:14,fontWeight:'600',color:'#333'},
  footer:{textAlign:'center',marginTop:30,color:'#888',fontSize:12}
});
