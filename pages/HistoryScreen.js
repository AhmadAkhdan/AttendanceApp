import React, { useState, useCallback, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

export default function HistoryScreen({ navigation }) {
  const { userData } = useContext(AuthContext);

  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  // FUNGSI GET API DENGAN PAGINATION
  const fetchAttendanceData = async (targetPage = 0) => {
    if (isLoading || (isLastPage && targetPage !== 0)) return;
    if (!userData?.nim_mhs) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Memanggil API Spring Boot
      const response = await fetch(`${API_BASE_URL}/history/${encodeURIComponent(userData.nim_mhs)}?page=${targetPage}&size=10`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || `Server mengembalikan status ${response.status}`);
      }

      // Spring Boot Pageable menyimpan array di dalam properti 'content'
      const newItems = Array.isArray(json.content) ? json.content : Array.isArray(json) ? json : [];

      if (targetPage === 0) {
        setHistoryData(newItems); // Refresh halaman awal
      } else {
        setHistoryData(prev => [...prev, ...newItems]); // Append (Load More)
      }

      setPage(targetPage);
      setIsLastPage(typeof json.last === 'boolean' ? json.last : newItems.length < 10); // 'last' adalah boolean dari Spring Boot

    } catch (error) {
      console.error("Gagal tarik data:", error);
      setErrorMessage(error.message || "Gagal mengambil data dari PresensiApi.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Otomatis refresh saat Tab History dibuka
  useFocusEffect(
    useCallback(() => {
      fetchAttendanceData(0);
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAttendanceData(0);
  };

  const handleLoadMore = () => {
    if (!isLastPage && !isLoading) {
      fetchAttendanceData(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Detail", { dataPresensi: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.course}>{item.course}</Text>
        <Text style={styles.date}>{item.date} | {item.jamPresensi}</Text>
      </View>
      <Text style={item.status === "Present" ? styles.present : item.status === "Late" ? styles.late : styles.absent}>
        {item.status}
      </Text>
      <MaterialIcons name="chevron-right" size={24} color="#999" style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loaderText}>Menarik data dari server...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyText}>
              {errorMessage || "Tidak ada riwayat absensi."}
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  item: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10, elevation: 1 },
  course: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 14, color: '#666', marginTop: 4 },
  present: { color: '#28A745', fontWeight: 'bold' },
  absent: { color: '#DC3545', fontWeight: 'bold' },
  late: { color: '#FD7E14', fontWeight: 'bold' },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
  loaderText: { marginTop: 10, color: '#666' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 }
});
