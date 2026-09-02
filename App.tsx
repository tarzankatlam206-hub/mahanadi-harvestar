import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Linking } from 'react-native';

export default function App() {
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* ===== TOP HEADER ===== */}
      <View style={styles.header}>
        <Image source={require('./assets/login_logo.png')} style={styles.mainLogo} />
        <Text style={styles.headerTitle}>महानदी हार्वेस्टर संघ</Text>
        <Text style={styles.headerSubtitle}>जिला कांकेर, छत्तीसगढ़ • एकता • सहयोग • विकास</Text>
        <View style={styles.regBadge}>
          <View style={styles.dot} />
          <Text style={styles.regText}>पंजीयन क्र. 122202678489</Text>
        </View>
      </View>

      {/* ===== WELCOME CARD ===== */}
      <View style={styles.welcomeCard}>
        <Image source={require('./assets/login_logo.png')} style={styles.smallLogo} />
        <View style={{flex: 1}}>
          <Text style={styles.welcomeTitle}>महानदी हार्वेस्टर संघ में आपका स्वागत है</Text>
          <Text style={styles.welcomeDesc}>किसानों और हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच। पारदर्शी बुकिंग, उचित दर, समय पर सेवा।</Text>
        </View>
      </View>

      <View style={styles.govtBadge}>
        <Text style={styles.govtText}>🏅 शासकीय मान्यता प्राप्त सहकारी संस्था</Text>
        <View style={styles.activeBtn}><Text style={styles.activeText}>सक्रिय</Text></View>
      </View>

      {/* ===== LOGIN FORM ===== */}
      <View style={styles.form}>
        <Text style={styles.label}>पासवर्ड</Text>
        <TextInput
          placeholder="पासवर्ड डालें"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>लॉगिन</Text>
        </TouchableOpacity>
      </View>

      {/* ===== CONTACT CARD - नया वाला ===== */}
      <View style={styles.contactCard}>
        <View style={styles.contactRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.contactText}>जिला कार्यालय - ग्राम लखनपुरी, तहसील - चारामा, जिला कांकेर</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.icon}>📞</Text>
          <Text style={styles.contactText}>मोबाईल: 7000520873</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.icon}>🟢</Text>
          <Text style={styles.contactText}>WhatsApp: 9479025929</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.icon}>✉️</Text>
          <Text selectable style={styles.contactText}>Email: MahanadiHarvestar2026@gmail.com</Text>
        </View>
      </View>

      <Text style={styles.footer}>© महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f5' },
  header: { backgroundColor: '#103d0f', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  mainLogo: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#fff', backgroundColor: '#fff' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  headerSubtitle: { color: '#d0e8d0', fontSize: 13, marginTop: 5, textAlign: 'center' },
  regBadge: { flexDirection: 'row', backgroundColor: '#1e4f1e', borderWidth: 1, borderColor: '#4a7a4a', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 6, marginTop: 15, alignItems: 'center' },
  dot: { width: 10, height: 10, backgroundColor: '#c5a100', borderRadius: 5, marginRight: 8 },
  regText: { color: '#fff', fontSize: 12 },
  welcomeCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, borderRadius: 15, padding: 15, elevation: 2 },
  smallLogo: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  welcomeTitle: { fontWeight: 'bold', fontSize: 14, color: '#103d0f' },
  welcomeDesc: { fontSize: 12, color: '#555', marginTop: 4, lineHeight: 18 },
  govtBadge: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 10, padding: 12, alignItems: 'center' },
  govtText: { fontSize: 12, color: '#333', fontWeight: '500' },
  activeBtn: { backgroundColor: '#0f4d1c', borderRadius: 15, paddingHorizontal: 12, paddingVertical: 4 },
  activeText: { color: '#fff', fontSize: 11 },
  form: { padding: 20 },
  label: { fontSize: 13, color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 15 },
  loginBtn: { backgroundColor: '#2d6a4f', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 5 },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  contactCard: { backgroundColor: '#fff', margin: 15, marginTop: 5, borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#e0e0e0' },
  contactRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  icon: { fontSize: 16, width: 25 },
  contactText: { flex: 1, fontSize: 13, color: '#333', lineHeight: 20 },
  footer: { textAlign: 'center', fontSize: 11, color: '#888', marginVertical: 20 }
});
