import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from 'react-native';

type MenuItem = {
  id: string;
  title: string;
  color: string;
  icon: string;
};

const MENU_DATA: MenuItem[] = [
  { id: '1', title: 'सदस्य', color: '#6ABF69', icon: '👥' },
  { id: '2', title: 'किसान', color: '#F5A623', icon: '🌾' },
  { id: '3', title: 'एजेंट', color: '#5AC8FA', icon: '🤝' },
  { id: '4', title: 'ऑपरेटर', color: '#9B7ED8', icon: '🧑‍🌾' },
  { id: '5', title: 'हेल्पर', color: '#E94E6B', icon: '🙋' },
  { id: '6', title: 'डीलर', color: '#A07C6D', icon: '🏢' },
  { id: '7', title: 'पार्ट्स विक्रेता', color: '#4DB6AC', icon: '⚙️' },
];

export default function App() {
  const handlePress = (item: MenuItem) => {
    alert(`${item.title} पेज जल्द खुलेगा!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>MH</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>महानदी हार्वेस्टर</Text>
              <Text style={styles.headerSubtitle}>मालिक कल्याण संघ</Text>
              <Text style={styles.headerDistrict}>जिला कांकेर छत्तीसगढ़</Text>
            </View>
          </View>
          
          <View style={styles.registrationPill}>
            <Text style={styles.registrationText}>पंजीयन क्रमांक:</Text>
          </View>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          {MENU_DATA.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuButton, { backgroundColor: item.color }]}
              onPress={() => handlePress(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 10,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 2,
  },
  headerDistrict: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  registrationPill: {
    backgroundColor: '#5D6D5E',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 15,
    alignSelf: 'flex-start',
    minWidth: 180,
  },
  registrationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 22,
    width: 35,
  },
  menuTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  arrow: {
    fontSize: 26,
    color: 'white',
    fontWeight: '300',
  },
});
