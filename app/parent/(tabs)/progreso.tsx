import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { API_URL } from '../../../src/config/api';
import { useParentData } from '../parentDataContext';

export default function ProgresoScreen() {
  const { childData } = useParentData();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    monedas: 0,
    logros: 0,
    racha: 0
  });
  const [actividades, setActividades] = useState<any[]>([]);

  const fetchProgreso = async () => {
    if (!childData) return;

    try {
      const response = await fetch(`${API_URL}/progreso/${childData.id}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setActividades(data.recentActivity);
      }
    } catch (error) {
      console.error("Error cargando progreso:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProgreso();
  }, [childData]); 

  if (loading && !refreshing) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProgreso(); }} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progreso de {childData?.nombre || 'tu hijo'}</Text>
        </View>
        
        {/* Estadísticas Generales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.statsCard}>
            
            {/* Monedas (Dato Real) */}
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={24} color="#4B0082" />
              <Text style={styles.statValue}>{stats.monedas}</Text>
              <Text style={styles.statLabel}>Monedas</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            {/* Logros/Medallas (Dato Real) */}
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Text style={styles.statValue}>{stats.logros}</Text>
              <Text style={styles.statLabel}>Medallas</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            {/* Racha (Dato Simulado/Calculado) */}
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>{stats.racha} días</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nivel de Completado</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Juegos (Valores)</Text>
              {/* Calculamos % basado en 6 niveles totales */}
              <Text style={styles.progressPercentage}>{Math.round((stats.logros / 6) * 100)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(stats.logros / 6) * 100}%`, backgroundColor: '#95E1D3' }]} />
            </View>
            <Text style={{fontSize:12, color:'#666', marginTop:5}}>
                Has desbloqueado {stats.logros} de 6 valores en el mapa.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          
          {actividades.length > 0 ? actividades.map((act, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityIconContainer}>
                <Ionicons 
                    name={act.type === 'diario' ? "journal" : "game-controller"} 
                    size={24} 
                    color={act.type === 'diario' ? "#FF6B6B" : "#4ECDC4"} 
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activityTime}>
                    {new Date(act.date).toLocaleDateString()} - {new Date(act.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </View>
            </View>
          )) : (
            <Text style={{color:'#666', fontStyle:'italic'}}>Aún no hay actividad registrada.</Text>
          )}

        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4B0082' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: '#E0E0E0' },
  progressCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  progressPercentage: { fontSize: 16, color: '#4B0082', fontWeight: '600' },
  progressBar: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  activityCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  activityIconContainer: { width: 48, height: 48, backgroundColor: '#F5F5F5', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 4 },
  activityTime: { fontSize: 12, color: '#666' },
  bottomSpacer: { height: 40 },
});