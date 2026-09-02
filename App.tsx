import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // 2.5 सेकंड बाद Splash हटेगा और Login दिखेगा
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // 1. SPLASH SCREEN
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require('./assets/splash.png')} style={styles.splashLogo} />
        <Text style={styles.splashTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text>
        <Text style={styles.splashSub}>जिला कांकेर, छत्तीसगढ़</Text>
      </View>
    );
  }

  // 3. HOME PAGE (Login के बाद)
  if (isLoggedIn) {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.homeTitle}>स्वागत है!</Text>
        <Text>आप सफलतापूर्वक लॉगिन हो गए हैं।</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.loginText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. LOGIN SCREEN (बीच वाला)
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/login_logo.png')} style={styles.mainLogo} />
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>महानदी हार्वेस्टर संघ में आपका स्वागत है</Text>
        <Text style={styles.welcomeDesc}>किसानों और हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच। पारदर्शी बुकिंग, उचित दर, समय पर सेवा।</Text>
      </View>

      <View style={styles.form}>
        <TextInput placeholder="पासवर्ड डालें" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TouchableOpacity style={styles.loginBtn} onPress={() => setIsLoggedIn(true)}>
          <Text style={styles.loginText}>लॉगिन</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactText}>📍 जिला कार्यालय - लखनपुरी, चारामा, कांकेर</Text>
        <Text style={styles.contactText}>📞 7000520873 | 🟢 9479025929</Text>
        <Text style={styles.contactText}>✉️ MahanadiHarvestar2026@gmail.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  splashLogo: { width: 250, height: 250, resizeMode: 'contain' },
  splashTitle: { fontSize: 18, fontWeight: 'bold', color: '#103d0f', marginTop: 20, textAlign: 'center' },
  splashSub: { fontSize: 14, color: '#666', marginTop: 5 },
  container: { flex: 1, backgroundColor: '#f5f7f5' },
  header: { backgroundColor: '#103d0f', alignItems: 'center', paddingVertical: 25 },
  mainLogo: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff' },
  welcomeCard: { backgroundColor: '#fff', margin: 15, borderRadius: 15, padding: 15, elevation: 2 },
  welcomeTitle: { fontWeight: 'bold', fontSize: 14, color: '#103d0f', textAlign: 'center' },
  welcomeDesc: { fontSize: 12, color: '#555', marginTop: 6, textAlign: 'center', lineHeight: 18 },
  form: { padding: 20 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 15 },
  loginBtn: { backgroundColor: '#0f4d1c', borderRadius: 10, padding: 15, alignItems: 'center' },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  contactCard: { backgroundColor: '#fff', margin: 15, borderRadius: 10, padding: 15 },
  contactText: { fontSize: 12, color: '#333', marginBottom: 6, lineHeight: 18 },
  homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  homeTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }
});
