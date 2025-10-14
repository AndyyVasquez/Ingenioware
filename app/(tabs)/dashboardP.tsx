import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChildData {
  id_nino: number;
  nombre_completo: string;
  nom_nino: string;
  edad_nino: number;
  avatar_emoji: string;
}

export default function ParentDashboardScreen() {
  const router = useRouter();
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar datos del padre
      const parentSession = await AsyncStorage.getItem('parentSession');
      if (parentSession) {
        const parentData = JSON.parse(parentSession);
        setParentName(parentData.nom_pad || 'Papá/Mamá');
      }

      // Cargar datos del niño
      const savedChildData = await AsyncStorage.getItem('childData');
      if (savedChildData) {
        const child = JSON.parse(savedChildData);
        setChildData(child);
        console.log('Datos del niño cargados:', child);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleAccessChildProfile = () => {
    Alert.alert(
      'Acceder al perfil del niño',
      '¿Cómo deseas continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Con mi sesión',
          onPress: () => {
            // Crear una sesión temporal del niño basada en los datos guardados
            if (childData) {
              const tempChildSession = {
                id_nino: childData.id_nino,
                nombre_completo: childData.nombre_completo,
                avatar_emoji: childData.avatar_emoji,
                loginTime: new Date().toISOString(),
                parentAccess: true, // Indicador de que entró con sesión de padre
              };
              
              AsyncStorage.setItem('childSession', JSON.stringify(tempChildSession))
                .then(() => {
                  console.log('Sesión temporal del niño creada');
                  router.push('/dashboardN');
                })
                .catch(error => {
                  console.error('Error creando sesión temporal:', error);
                  Alert.alert('Error', 'No se pudo acceder al perfil del niño');
                });
            } else {
              Alert.alert('Error', 'No se encontraron datos del niño');
            }
          },
        },
        {
          text: 'Con PIN del niño',
          onPress: () => router.push('/pinVerification'),
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('parentSession');
              console.log('Sesión del padre cerrada');
              router.replace('/');
            } catch (error) {
              console.error('Error cerrando sesión:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, {parentName}!</Text>
            <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => {
              Alert.alert('Configuración', 'Próximamente disponible');
            }}
          >
            <Ionicons name="settings-outline" size={28} color="#4B0082" />
          </TouchableOpacity>
        </View>

        {/* Perfil del Niño */}
        <View style={styles.childCard}>
          <View style={styles.childHeader}>
            <View style={styles.childInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>
                  {childData?.avatar_emoji || '🦁'}
                </Text>
              </View>
              <View>
                <Text style={styles.childName}>
                  {childData?.nombre_completo || 'Nombre del Niño'}
                </Text>
                <Text style={styles.childAge}>
                  {childData?.edad_nino ? `${childData.edad_nino} años` : '8 años'}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => Alert.alert('Editar', 'Próximamente disponible')}
            >
              <Ionicons name="pencil" size={20} color="#4B0082" />
            </TouchableOpacity>
          </View>

          {/* Botón de acceso al perfil del niño */}
          <TouchableOpacity 
            style={styles.accessChildButton}
            onPress={handleAccessChildProfile}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={20} color="#FFF" />
            <Text style={styles.accessChildButtonText}>Ver perfil del niño</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.statsContainer}>
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

        {/* Progreso Semanal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progreso Semanal</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver más</Text>
            </TouchableOpacity>
          </View>
          
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

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Actividades', 'Próximamente disponible')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="book-outline" size={32} color="#4B0082" />
              </View>
              <Text style={styles.actionText}>Actividades</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Reportes', 'Próximamente disponible')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="stats-chart-outline" size={32} color="#4B0082" />
              </View>
              <Text style={styles.actionText}>Reportes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Calendario', 'Próximamente disponible')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="calendar-outline" size={32} color="#4B0082" />
              </View>
              <Text style={styles.actionText}>Calendario</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Comunidad', 'Próximamente disponible')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="people-outline" size={32} color="#4B0082" />
              </View>
              <Text style={styles.actionText}>Comunidad</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actividades Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividades Recientes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

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

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  childCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F4A460',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  accessChildButton: {
    backgroundColor: '#4B0082',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  accessChildButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4B0082',
    fontWeight: '500',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#E8D5FF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  bottomSpacer: {
    height: 40,
  },
});