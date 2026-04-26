import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

export default function DetailScreen({ route }) {
  const { dataPresensi } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{dataPresensi.course}</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Tanggal:</Text>
          <Text style={styles.value}>{dataPresensi.date}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[
            styles.value, 
            dataPresensi.status === 'Present' ? styles.present : 
            dataPresensi.status === 'Late' ? styles.late : styles.absent
          ]}>
            {dataPresensi.status}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Ruangan:</Text>
          {/* Ini yang bikin kosong tadi, sekarang udah diganti jadi 'ruangan' */}
          <Text style={styles.value}>{dataPresensi.ruangan}</Text> 
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Dosen Pengampu:</Text>
          {/* Ini juga diganti jadi 'dosenPengampu' */}
          <Text style={styles.value}>{dataPresensi.dosenPengampu}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  present: { color: '#28A745' },
  late: { color: '#FD7E14' },
  absent: { color: '#DC3545' }
});