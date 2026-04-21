import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const initialHistory = [
  { id: "1", course: "Mobile Programming", date: "13/4/2026", status: "Present", room: "Lab 3", lecturer: "Bpk. Andi" },
  { id: "2", course: "Database System", date: "14/4/2026", status: "Present", room: "Lab 4", lecturer: "Ibu Rina" },
  { id: "3", course: "Machine Learning", date: "14/4/2026", status: "Absent", room: "Lab 1", lecturer: "Bpk. Budi" },
];

export default function HistoryScreen({ navigation }) {
  const [historyData] = useState(initialHistory);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Detail", { dataPresensi: item })}
    >
      <View style={{ flex: 1 }}>
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
        <MaterialIcons name="chevron-right" size={24} color="#999" style={{ marginLeft: 10 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: { padding: 20 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  course: { fontSize: 16, fontWeight: "bold", color: "#333" },
  date: { fontSize: 12, color: "gray", marginTop: 4 },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  present: { color: "green", fontWeight: "bold" },
  absent: { color: "red", fontWeight: "bold" }
});