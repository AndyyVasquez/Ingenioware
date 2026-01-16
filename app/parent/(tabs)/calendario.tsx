import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../../../src/config/api';

export default function CalendarioScreen() {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventos = async () => {
    try {
      const parentSession = await AsyncStorage.getItem('parentSession');
      if (!parentSession) return;
      const parent = JSON.parse(parentSession);

      const response = await fetch(`${API_URL}/calendario/${parent.id_pad}`);
      const data = await response.json();

      if (data.success) {
        setEventos(data.eventos);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1565C0" />
        </TouchableOpacity>
        <Text style={styles.title}>Agenda Familiar 📅</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1565C0" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEventos(); }} />}
        >
          {eventos.length > 0 ? eventos.map((ev: any) => (
            <View key={ev.id} style={styles.eventCard}>
              <View style={styles.dateBox}>
                <Text style={styles.dateDay}>{new Date(ev.fecha_inicio).getDate()}</Text>
                <Text style={styles.dateMonth}>
                    {new Date(ev.fecha_inicio).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{ev.titulo}</Text>
                <Text style={styles.eventTime}>
                    <Ionicons name="time-outline" size={14} /> {formatTime(ev.fecha_inicio)}
                </Text>
                {ev.descripcion ? <Text style={styles.eventDesc}>{ev.descripcion}</Text> : null}
              </View>
            </View>
          )) : (
            <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={60} color="#90CAF9" />
                <Text style={styles.emptyText}>No hay eventos programados.</Text>
                <Text style={styles.emptySub}>Añade actividades desde el portal web.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1565C0' },
  content: { padding: 20 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  dateBox: { backgroundColor: '#E3F2FD', borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center', minWidth: 60, marginRight: 15 },
  dateDay: { fontSize: 20, fontWeight: 'bold', color: '#1565C0' },
  dateMonth: { fontSize: 12, fontWeight: '600', color: '#1E88E5' },
  eventInfo: { flex: 1, justifyContent: 'center' },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  eventTime: { fontSize: 13, color: '#666', marginBottom: 4 },
  eventDesc: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, color: '#555', marginTop: 10, fontWeight: '600' },
  emptySub: { fontSize: 14, color: '#888', marginTop: 5 }
});