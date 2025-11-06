// (app)/(parent)/(tabs)/progreso.tsx

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useParentData } from '../parentDataContext';

export default function ProgresoScreen() {
  const { isLoading } = useParentData();

  if (isLoading) {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progreso y Actividad</Text>
        </View>
        
        {/* Estadísticas de Uso (datos simulados) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas de Uso</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color="#4B0082" />
              <Text style={styles.statValue}>2h 30m</Text>
              <Text style={styles.statLabel}>Hoy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={24} color="#FFD700" />
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Logros</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>7 días</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
          </View>
        </View>

        {/* Progreso Semanal (datos simulados) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso Semanal</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Cuentos</Text>
              <Text style={styles.progressPercentage}>85%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '85%', backgroundColor: '#4ECDC4' }]} />
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Juegos</Text>
              <Text style={styles.progressPercentage}>92%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '92%', backgroundColor: '#95E1D3' }]} />
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Canciones</Text>
              <Text style={styles.progressPercentage}>78%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '78%', backgroundColor: '#FFD93D' }]} />
            </View>
          </View>
        </View>
        
        {/* Actividades Recientes (datos simulados) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividades Recientes</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="book" size={24} color="#4ECDC4" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Cuento: El león valiente</Text>
              <Text style={styles.activityTime}>Hace 2 horas • 15 min</Text>
            </View>
            <View style={styles.activityBadge}>
              <Text style={styles.activityBadgeText}>100%</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="game-controller" size={24} color="#95E1D3" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Juego: Amistad</Text>
              <Text style={styles.activityTime}>Ayer • 20 min</Text>
            </View>
            <View style={styles.activityBadge}>
              <Text style={styles.activityBadgeText}>95%</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="musical-notes" size={24} color="#FFD93D" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Canción: Ser honesto</Text>
              <Text style={styles.activityTime}>Hace 2 días • 18 min</Text>
            </View>
            <View style={styles.activityBadge}>
              <Text style={styles.activityBadgeText}>88%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  progressCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 16,
    color: '#4B0082',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activityBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bottomSpacer: {
    height: 40,
  },
});