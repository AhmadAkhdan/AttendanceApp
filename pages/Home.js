import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const history = [
  { id: "1", course: "Mobile Programming", date: "2026-03-01", status: "Present" },
  { id: "2", course: "Database System", date: "2026-03-02", status: "Present" },
  { id: "3", course: "Operating System", date: "2026-03-03", status: "Absent" },
  { id: "4", course: "Computer Network", date: "2026-03-04", status: "Present" },
  { id: "5", course: "Web Programming", date: "2026-03-05", status: "Present" },
  { id: "6", course: "Software Engineering", date: "2026-03-06", status: "Absent" },
  { id: "7", course: "Mobile Programming", date: "2026-03-08", status: "Present" },
  { id: "8", course: "Database System", date: "2026-03-09", status: "Present" },
  { id: "9", course: "Operating System", date: "2026-03-10", status: "Present" },
  { id: "10", course: "Computer Network", date: "2026-03-11", status: "Absent" },
  { id: "11", course: "Web Programming", date: "2026-03-12", status: "Present" },
  { id: "12", course: "Software Engineering", date: "2026-03-13", status: "Present" },
  { id: "13", course: "Mobile Programming", date: "2026-03-15", status: "Present" },
  { id: "14", course: "Database System", date: "2026-03-16", status: "Absent" },
  { id: "15", course: "Operating System", date: "2026-03-17", status: "Present" },
  { id: "16", course: "Computer Network", date: "2026-03-18", status: "Present" },
  { id: "17", course: "Web Programming", date: "2026-03-19", status: "Present" },
  { id: "18", course: "Software Engineering", date: "2026-03-20", status: "Absent" },
  { id: "19", course: "Mobile Programming", date: "2026-03-22", status: "Present" },
  { id: "20", course: "Database System", date: "2026-03-23", status: "Present" },
  { id: "21", course: "Operating System", date: "2026-03-24", status: "Present" },
  { id: "22", course: "Computer Network", date: "2026-03-25", status: "Present" },
  { id: "23", course: "Web Programming", date: "2026-03-26", status: "Absent" },
  { id: "24", course: "Software Engineering", date: "2026-03-27", status: "Present" },
];

const Home = () => {
  const presentCount = history.filter(item => item.status === "Present").length;
  const absentCount = history.filter(item => item.status === "Absent").length;

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
        
        <Text style={styles.title}>Attendance App</Text>

        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>Ahmad Akhdan D</Text> 
            <Text>NIM: 123456789</Text>
            <Text>Class: RP2B</Text>
          </View>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab 3</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>CHECK IN</Text>
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
          data={history}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
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