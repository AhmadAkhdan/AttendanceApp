import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { CameraView, useCameraPermissions } from 'expo-camera';

const Home = ({ navigation }) => {
  const { userData } = useContext(AuthContext);

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('Memuat jam...');
  const [note, setNote] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const noteInputRef = useRef(null);
  // State untuk Kamera Scanner
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const attendanceStats = useMemo(() => {
    return { totalPresent: 12, totalAbsent: 2 };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Akses Ditolak", "Aplikasi membutuhkan izin kamera untuk memindai QR.");
        return;
      }
    }
    setIsScanning(true);
    setIsCameraOpen(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!isScanning) return;
    
    setIsScanning(false);

    try {
      const qrData = JSON.parse(data);
      
      Alert.alert(
        "QR Code Terdeteksi",
        `Mata Kuliah: ${qrData.kodeMk}\nPertemuan: ${qrData.pertemuanke}\nRuangan: ${qrData.ruangan}\n\nLanjutkan Presensi (Check-In)?`,
        [
          {
            text: "Batal",
            style: "cancel",
            onPress: () => setIsScanning(true)
          },
          {
            text: "Ya, Check In",
            onPress: () => {
              setIsCameraOpen(false);
              handleCheckIn(qrData);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("QR Tidak Valid", "Pastikan Anda memindai QR Code Presensi Dosen.");
      setIsScanning(true);
    }
  };

  const handleCheckIn = async (qrData) => {
    if (isCheckedIn) return Alert.alert("Perhatian", "Anda sudah Check In.");
    
    setIsPosting(true);
    const now = new Date();

    const payload = {
      kodeMk: qrData.kodeMk, 
      course: "Mobile Programming",
      status: "Present",
      nimMhs: userData.nim_mhs, 
      pertemuanke: qrData.pertemuanke,
      date: now.toISOString().split('T')[0],
      jamPresensi: now.toLocaleTimeString('id-ID', { hour12: false }),
      ruangan: qrData.ruangan,
      catatan: note
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setIsCheckedIn(true);
        Alert.alert("Berhasil!", "Presensi masuk ke Database Java Spring.", [
          { text: "Lihat Riwayat", onPress: () => navigation.navigate('HistoryTab') }
        ]);
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan di server.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Pastikan IP Laptop benar dan Spring Boot berjalan.");
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        {/* Student Card */}
        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>{userData.nama}</Text>
            <Text>NIM: {userData.nim_mhs}</Text>
            <Text>Kelas: TRPL 2B</Text>
          </View>
        </View>

        {/* Today's Class */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming (TRPL205)</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab Komputer</Text>

          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef}
              style={styles.inputCatatan}
              placeholder="Tulis catatan opsional..."
              value={note}
              onChangeText={setNote}
            />
          )}

          {isPosting ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 15 }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
              onPress={isCheckedIn ? null : openCamera}
              disabled={isCheckedIn}
            >
              <Text style={styles.buttonText}>
                {isCheckedIn ? "SUDAH CHECKED IN" : "SCAN QR DOSEN"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Card */}
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

      {/* Modal Scanner QR Code yang melayang di atas aplikasi */}
      <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          >
            <View style={styles.overlay}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                <View style={styles.borderCornerTopLeft} />
                <View style={styles.borderCornerTopRight} />
                <View style={styles.borderCornerBottomLeft} />
                <View style={styles.borderCornerBottomRight} />
              </View>
              <View style={styles.unfocusedContainer}>
                <Text style={styles.scanText}>Arahkan Kamera ke QR Code Dosen</Text>
                
                {/* Tombol darurat untuk menutup scanner/batal */}
                <TouchableOpacity 
                  style={{ marginTop: 20, padding: 10, backgroundColor: 'red', borderRadius: 8 }}
                  onPress={() => setIsCameraOpen(false)}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Tutup Kamera</Text>
                </TouchableOpacity>

              </View>
            </View>
          </CameraView>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  clockText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, elevation: 2 },
  icon: { width: 50, height: 50, backgroundColor: '#EEE', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  classCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  inputCatatan: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, marginTop: 15, marginBottom: 15 },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonActive: { backgroundColor: '#007AFF' },
  buttonDisabled: { backgroundColor: '#A0C4FF' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', padding: 15, borderRadius: 10, elevation: 2 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#28A745' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  unfocusedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  focusedContainer: { width: 250, height: 250, alignSelf: 'center', backgroundColor: 'transparent', position: 'relative' },
  scanText: { color: 'white', fontSize: 16, marginTop: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 5 },
  borderCornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 5, borderLeftWidth: 5, borderColor: '#007bff' },
  borderCornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 5, borderRightWidth: 5, borderColor: '#007bff' },
  borderCornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: '#007bff' },
  borderCornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 5, borderRightWidth: 5, borderColor: '#007bff' }
});

export default Home;