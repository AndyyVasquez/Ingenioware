import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../src/config/api';

export default function MisLogrosScreen() {
  const router = useRouter();
  const [trofeos, setTrofeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalGanados, setTotalGanados] = useState(0);

  useEffect(() => {
    cargarLogros();
  }, []);

  const cargarLogros = async () => {
    try {
      const childJson = await AsyncStorage.getItem('currentChild');
      if (!childJson) return;
      const child = JSON.parse(childJson);

      const response = await fetch(`${API_URL}/logros/${child.id}`);
      const data = await response.json();

      if (data.success) {
        setTrofeos(data.trofeos);
        // Contamos cuántos tiene 'ganado: true'
        const ganados = data.trofeos.filter((t: any) => t.ganado).length;
        setTotalGanados(ganados);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para asignar icono según el nombre del valor
  const getIconoValor = (nombre: string) => {
    switch (nombre?.toLowerCase()) {
        case 'valentía': return '🦁';
        case 'honestidad': return '🦊';
        case 'empatía': return '🐻';
        case 'responsabilidad': return '🐜';
        case 'generosidad': return '🐰';
        case 'paciencia': return '🐢';
        default: return '🏆';
    }
  };

  return (
    <LinearGradient colors={['#FFF9C4', '#FFF176']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F57F17" />
        </TouchableOpacity>
        <Text style={styles.title}>Sala de Trofeos 🏆</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FBC02D" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Resumen */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              Has ganado <Text style={styles.summaryNumber}>{totalGanados}</Text> de {trofeos.length} medallas
            </Text>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(totalGanados / trofeos.length) * 100}%` }]} />
            </View>
          </View>

          {/* Grid de Trofeos */}
          <View style={styles.grid}>
            {trofeos.map((trofeo: any) => (
              <View 
                key={trofeo.id} 
                style={[styles.card, !trofeo.ganado && styles.cardLocked]}
              >
                <View style={[
                    styles.iconCircle, 
                    { backgroundColor: trofeo.ganado ? trofeo.color || '#FFD700' : '#E0E0E0' }
                ]}>
                    {trofeo.ganado ? (
                        <Text style={styles.emoji}>{getIconoValor(trofeo.titulo)}</Text>
                    ) : (
                        <Ionicons name="lock-closed" size={30} color="#9E9E9E" />
                    )}
                </View>

                <Text style={styles.trofeoTitle}>{trofeo.titulo}</Text>
                
                {trofeo.ganado ? (
                    <Text style={styles.fecha}>
                        {new Date(trofeo.fecha).toLocaleDateString()}
                    </Text>
                ) : (
                    <Text style={styles.lockedText}>Por desbloquear</Text>
                )}
              </View>
            ))}
          </View>

        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#F57F17' },
  content: { padding: 20 },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 25, alignItems: 'center', elevation: 3 },
  summaryText: { fontSize: 18, color: '#555', marginBottom: 10 },
  summaryNumber: { fontWeight: 'bold', color: '#FBC02D', fontSize: 20 },
  progressBarBg: { width: '100%', height: 10, backgroundColor: '#EEE', borderRadius: 5 },
  progressBarFill: { height: '100%', backgroundColor: '#FBC02D', borderRadius: 5 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 15, alignItems: 'center', marginBottom: 15, elevation: 2 },
  cardLocked: { opacity: 0.7, backgroundColor: '#F5F5F5' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 3, borderColor: '#FFF', elevation: 5 },
  emoji: { fontSize: 35 },
  trofeoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
  fecha: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  lockedText: { fontSize: 12, color: '#999', fontStyle: 'italic' }
});