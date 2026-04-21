import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Home = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState("Memuat jam...");
  const [note, setNote] = useState("");
  const noteInputRef = useRef(null);

  const attendanceStats = useMemo(() => {
    return { totalPresent: 12, totalAbsent: 2 };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeString = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    if (isCheckedIn) {
      Alert.alert("Perhatian", "Anda sudah melakukan Check In untuk kelas ini.");
      return;
    }

    if (note.trim() === '') {
      Alert.alert("Peringatan", "Catatan kehadiran wajib diisi!");
      if (noteInputRef.current) noteInputRef.current.focus();
      return;
    }

    setIsCheckedIn(true);
    Alert.alert("Sukses", `Berhasil Check In pada pukul ${currentTime}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>Ahmad Akhdan D</Text> 
            <Text>NIM: 0920240006</Text>
            <Text>Class: RPL-2B</Text>
          </View>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab 3</Text>
          
          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef}
              style={styles.inputCatatan}
              placeholder="Tulis catatan (cth: Hadir lab)"
              value={note}
              onChangeText={setNote}
            />
          )}

          <TouchableOpacity 
            style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
            onPress={handleCheckIn}
            disabled={isCheckedIn}
          >
            <Text style={styles.buttonText}>
              {isCheckedIn ? "CHECKED IN" : "CHECK IN"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.totalPresent}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: 'red' }]}>{attendanceStats.totalAbsent}</Text>
            <Text style={styles.statLabel}>Total Absent</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  clockText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', fontVariant: ['tabular-nums'] },
  card: { flexDirection: "row", backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 20 },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#eee", alignItems: "center", justifyContent: "center", marginRight: 15 },
  name: { fontSize: 18, fontWeight: "bold" },
  classCard: { backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  button: { marginTop: 10, padding: 10, borderRadius: 8, alignItems: "center" },
  buttonActive: { backgroundColor: "#007AFF" },
  buttonDisabled: { backgroundColor: "#ABC4FF" },
  buttonText: { color: "white", fontWeight: "bold" },
  inputCatatan: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 15, backgroundColor: '#fafafa' },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  statLabel: { fontSize: 14, color: 'gray' }
});

export default Home;