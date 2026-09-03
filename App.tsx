import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Linking, Platform, StatusBar, Alert } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [mobile, setMobile] = useState('');

  const members = [
    { id: 1, name: 'रमेश साहू', village: 'आरंग', harvesters: 2, phone: '98271XXXXX' },
    { id: 2, name: 'संतोष वर्मा', village: 'महासमुंद', harvesters: 1, phone: '98271XXXXX' },
    { id: 3, name: 'दिनेश यादव', village: 'रायपुर', harvesters: 3, phone: '98271XXXXX' },
  ];

  const rates = [
    { work: 'धान कटाई + थ्रेसिंग', rate: '₹ 2200 / घंटा' },
    { work: 'गेहूं कटाई', rate: '₹ 2000 / घंटा' },
    { work: 'पुआल बंडल', rate: '₹ 300 / घंटा अतिरिक्त' },
  ];

  const handleRegister = () => {
    if (!name || !village || !mobile) {
      Alert.alert('जानकारी अधूरी है', 'कृपया नाम, गांव और मोबाइल भरें');
      return;
    }
    Alert.alert('सफल!', `${name} जी, आपका पंजीकरण सफल रहा।`);
    setName(''); setVillage(''); setMobile('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌾 महानदी हार्वेस्टर</Text>
        <Text style={styles.headerSubtitle}>मालिक कल्याण संघ - छत्तीसगढ़</Text>
        <Text style={styles.headerVersion}>App v2.0 | रायपुर, छत्तीसगढ़</Text>
      </View>

      <View style={styles.tabBar}>
        {[{ id: 'home', label: 'होम' },{ id: 'members', label: 'सदस्य' },{ id: 'booking', label: 'बुकिंग' },{ id: 'rates', label: 'दर' }].map(tab => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.activeTab]} onPress={() => setActiveTab(tab.id)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'home' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🙏 जय जोहार किसान साथियों!</Text>
              <Text style={styles.cardText}>महानदी हार्वेस्टर मालिक कल्याण संघ में आपका स्वागत है। यह ऐप रायपुर, महासमुंद, धमतरी, आरंग क्षेत्र के सभी हार्वेस्टर मालिकों के लिए बनाया गया है।</Text>
            </View>
            <View style={styles.cardHighlight}>
              <Text style={styles.highlightTitle}>📞 हेल्पलाइन - अध्यक्ष: 98271-12345</Text>
              <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL('tel:9827112345')}>
                <Text style={styles.callBtnText}>कॉल करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'members' && (
          <View>
            <Text style={styles.sectionTitle}>हमारे सदस्य</Text>
            {members.map(m => (
              <View key={m.id} style={styles.memberCard}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberVillage}>📍 {m.village} | 🚜 {m.harvesters} हार्वेस्टर</Text>
              </View>
            ))}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>नया सदस्य पंजीकरण</Text>
              <TextInput style={styles.input} placeholder="आपका नाम" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="गांव / शहर" value={village} onChangeText={setVillage} />
              <TextInput style={styles.input} placeholder="मोबाइल नंबर" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                <Text style={styles.primaryBtnText}>पंजीकरण करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'booking' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚜 हार्वेस्टर बुकिंग</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Linking.openURL('https://wa.me/919827112345?text=नमस्ते, मुझे हार्वेस्टर बुक करना है')}>
              <Text style={styles.primaryBtnText}>WhatsApp पर बुक करें</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'rates' && (
          <View>
            {rates.map((r, i) => (
              <View key={i} style={styles.rateCard}>
                <Text style={styles.rateWork}>{r.work}</Text>
                <Text style={styles.ratePrice}>{r.rate}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f0' },
  header: { backgroundColor: '#2e7d32', padding: 20, paddingTop: 40, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: '#c8e6c9', fontSize: 16, marginTop: 2, fontWeight: '600' },
  headerVersion: { color: '#a5d6a7', fontSize: 12, marginTop: 6 },
  tabBar: { flexDirection: 'row', backgroundColor: 'white', elevation: 2 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#2e7d32' },
  tabText: { fontSize: 15, color: '#666' },
  activeTabText: { color: '#2e7d32', fontWeight: 'bold' },
  content: { flex: 1, padding: 12 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHighlight: { backgroundColor: '#fff8e1', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ffe082' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#444', lineHeight: 21 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 8, color: '#2e7d32' },
  memberCard: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#66bb6a' },
  memberName: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20' },
  memberVillage: { fontSize: 13, color: '#555', marginTop: 3 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 10 },
  primaryBtn: { backgroundColor: '#2e7d32', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 14 },
  primaryBtnText: { color: 'white', fontWeight: 'bold' },
  highlightTitle: { fontSize: 16, fontWeight: 'bold', color: '#f57f17' },
  callBtn: { backgroundColor: '#ff8f00', borderRadius: 6, padding: 10, alignItems: 'center', marginTop: 10 },
  callBtnText: { color: 'white', fontWeight: 'bold' },
  rateCard: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  rateWork: { fontSize: 14, fontWeight: '600', flex: 1 },
  ratePrice: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
});
