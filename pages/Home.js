import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const initialHistory = [
  { id: "1", course: "Mobile Programming", date: "13/4/2026", status: "Present" },
  { id: "2", course: "Database System", date: "14/4/2026", status: "Present" },
  { id: "3", course: "Machine Learning", date: "14/4/2026", status: "Absent" },
];

const Home = () => {
  const [historyData, setHistoryData] = useState(initialHistory);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState("Memuat jam...");

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

    const newAttendance = {
      id: Date.now().toString(),
      course: "Mobile Programming",
      date: new Date().toLocaleDateString('id-ID'),
      status: "Present"
    };

    setHistoryData([newAttendance, ...historyData]);
    setIsCheckedIn(true);
    Alert.alert("Sukses", `Berhasil Check In pada pukul ${currentTime}`);
  };

  const presentCount = historyData.filter(item => item.status === "Present").length;
  const absentCount = historyData.filter(item => item.status === "Absent").length;

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.course}>{item.course}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.statusContainer}>
        <MaterialIcons 
          name={item.status === "Present" ? "check-box" : "disabled-by-default"} 
          size={18} 
          color={item.status === "Present" ? "green" : "red"} 
          style={{ marginRight: 5 }}
        />
        <Text style={item.status === "Present" ? styles.present : styles.absent}>
          {item.status}
        </Text>
      </View>
    </View>
  );

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

        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Upcoming Class</Text>
          <Text>Database System</Text>
          <Text>10:30 - 12:30</Text>
          <Text>Lab 4</Text>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Attendance Summary</Text>
          <Text style={styles.summaryText}>Present: {presentCount}</Text>
          <Text style={styles.summaryText}>Absent: {absentCount}</Text>
        </View>

        <Text style={styles.subtitle}>Attendance History</Text>
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    fontVariant: ['tabular-nums'],
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#007AFF",
  },
  buttonDisabled: {
    backgroundColor: "#ABC4FF", 
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  course: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  present: {
    color: "green",
    fontWeight: "bold",
  },
  absent: {
    color: "red",
    fontWeight: "bold",
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  }
});

export default Home;