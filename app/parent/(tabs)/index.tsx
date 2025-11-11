// (app)/(parent)/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useParentData } from '../parentDataContext'; // Ajusta la ruta

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { 
    parentName, 
    childData, 
    alertasNuevas, 
    alertasCriticas, 
    isLoading 
  } = useParentData();

  const handleAccessChildProfile = () => {
    Alert.alert(
      'Acceder al perfil del niño',
      '¿Cómo deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Con mi sesión',
          onPress: () => {
            if (childData) {
              const tempChildSession = {
                id_nino: childData.id_nino,
                nombre_completo: childData.nombre_completo,
                avatar_emoji: childData.avatar_emoji,
                loginTime: new Date().toISOString(),
                parentAccess: true,
              };
              AsyncStorage.setItem('childSession', JSON.stringify(tempChildSession))
                .then(() => {
                  router.push('/dashboardN'); // Asumiendo que esta es la ruta
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
          onPress: () => router.push('/pinVerification'), // Asumiendo ruta
        },
      ]
    );
  };
  
const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión? Esto cerrará todas las sesiones.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {

              await AsyncStorage.removeItem('parentSession');
              await AsyncStorage.removeItem('childSession');
              await AsyncStorage.removeItem('hasParentAccount'); 
              await AsyncStorage.removeItem('hasChildren');


              console.log('Sesiones de padre e hijo cerradas.');
              router.replace('/'); 
            } catch (error) {
              console.error('Error cerrando sesión:', error);
            }
          },
        },
      ]
    );
  };
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, {parentName}!</Text>
            <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleLogout} // Cambiado a Logout
          >
            <Ionicons name="log-out-outline" size={28} color="#4B0082" />
          </TouchableOpacity>
        </View>

        {/* Alertas Emocionales (Solo si existen) */}
        {(alertasNuevas > 0 || alertasCriticas > 0) ? (
          <TouchableOpacity
            style={styles.alertaCard}
            onPress={() => router.push('./bienestar')} // Llevamos a la pestaña de Bienestar
            activeOpacity={0.8}
          >
            <View style={[
              styles.alertaIcono,
              { backgroundColor: alertasCriticas > 0 ? '#FF6B6B' : '#FFB84D' }
            ]}>
              <Ionicons 
                name={alertasCriticas > 0 ? 'alert-circle' : 'notifications'} 
                size={32} 
                color="#FFF" 
              />
            </View>
            <View style={styles.alertaInfo}>
              <Text style={styles.alertaTitulo}>
                {alertasCriticas > 0 
                  ? '⚠️ Alertas emocionales importantes'
                  : '📢 Nuevas alertas emocionales'}
              </Text>
              <Text style={styles.alertaDescripcion}>
                {alertasCriticas > 0
                  ? `${alertasCriticas} ${alertasCriticas === 1 ? 'alerta crítica' : 'alertas críticas'} requieren tu atención`
                  : `Tienes ${alertasNuevas} ${alertasNuevas === 1 ? 'alerta nueva' : 'alertas nuevas'}`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4B0082" />
          </TouchableOpacity>
        ) : (
          <View style={styles.todoEnCalmaCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#4CAF50" />
            <View style={styles.alertaInfo}>
              <Text style={styles.alertaTitulo}>Todo en calma</Text>
              <Text style={styles.alertaDescripcion}>Valo no ha reportado nada inusual.</Text>
            </View>
          </View>
        )}

        {/* Perfil del Niño (Simplificado) */}
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
          </View>

          {/* <TouchableOpacity 
            style={styles.accessChildButton}
            onPress={handleAccessChildProfile}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={20} color="#FFF" />
            <Text style={styles.accessChildButtonText}>Ver perfil del niño</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity> */}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('./crearMomento')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="sparkles-outline" size={32} color="#4B0082" />
              </View>
              <Text style={styles.actionText}>Enviar mensaje</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('./progreso')}
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

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

// Estilos (Modifiqué y añadí algunos)
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
  alertaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 6,
    borderLeftColor: '#FF6B6B', // Color dinámico en el componente
  },
  todoEnCalmaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF0',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50',
  },
  alertaIcono: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertaInfo: {
    flex: 1,
  },
  alertaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertaDescripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  accessChildButton: {
    backgroundColor: '#4B0082',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
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
  bottomSpacer: {
    height: 40,
  },
});