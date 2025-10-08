import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChildDashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Cerrar sesión del niño y volver al inicio
    router.replace('/');
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>🦁</Text>
            </View>
            <View>
              <Text style={styles.greeting}>¡Hola, Campeón!</Text>
              <Text style={styles.subtitle}>¿Listo para aprender?</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.logoutIcon}
            onPress={handleLogout}
          >
            <Ionicons name="exit-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Progreso del día */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Tu progreso de hoy</Text>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% completado</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Estrellas</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="trophy" size={20} color="#FF6B6B" />
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Logros</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="time" size={20} color="#4ECDC4" />
                <Text style={styles.statNumber}>45m</Text>
                <Text style={styles.statLabel}>Tiempo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actividades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige tu aventura</Text>
          
          <View style={styles.activitiesGrid}>
            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#FFE5E5' }]}>
              <View style={styles.activityIconBg}>
                <Ionicons name="calculator" size={40} color="#FF6B6B" />
              </View>
              <Text style={styles.activityName}>Matemáticas</Text>
              <Text style={styles.activityDescription}>Aprende jugando</Text>
              <View style={styles.activityBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.badgeText}>Nuevo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#E5F5FF' }]}>
              <View style={styles.activityIconBg}>
                <Ionicons name="book" size={40} color="#4ECDC4" />
              </View>
              <Text style={styles.activityName}>Lectura</Text>
              <Text style={styles.activityDescription}>Cuentos mágicos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#FFF5E5' }]}>
              <View style={styles.activityIconBg}>
                <Ionicons name="flask" size={40} color="#FFD93D" />
              </View>
              <Text style={styles.activityName}>Ciencias</Text>
              <Text style={styles.activityDescription}>Experimenta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.activityCard, { backgroundColor: '#F0E5FF' }]}>
              <View style={styles.activityIconBg}>
                <Ionicons name="brush" size={40} color="#A06CD5" />
              </View>
              <Text style={styles.activityName}>Arte</Text>
              <Text style={styles.activityDescription}>Crea y dibuja</Text>
              <View style={styles.activityBadge}>
                <Ionicons name="lock-closed" size={12} color="#666" />
                <Text style={styles.badgeText}>Pronto</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continuar aprendiendo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continúa donde lo dejaste</Text>
            <Ionicons name="arrow-forward" size={20} color="#4B0082" />
          </View>

          <TouchableOpacity style={styles.continueCard}>
            <View style={styles.continueIconContainer}>
              <Ionicons name="calculator" size={32} color="#FF6B6B" />
            </View>
            <View style={styles.continueInfo}>
              <Text style={styles.continueTitle}>Suma de fracciones</Text>
              <Text style={styles.continueSubtitle}>Nivel 3 • 70% completado</Text>
              <View style={styles.continueProgress}>
                <View style={[styles.continueProgressFill, { width: '70%' }]} />
              </View>
            </View>
            <Ionicons name="play-circle" size={48} color="#4B0082" />
          </TouchableOpacity>
        </View>

        {/* Logros recientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus últimos logros</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsScroll}
          >
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="trophy" size={32} color="#FFD700" />
              </View>
              <Text style={styles.achievementName}>Maestro</Text>
              <Text style={styles.achievementDesc}>100% en suma</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="flame" size={32} color="#FF6B6B" />
              </View>
              <Text style={styles.achievementName}>Racha</Text>
              <Text style={styles.achievementDesc}>7 días seguidos</Text>
            </View>

            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="star" size={32} color="#4ECDC4" />
              </View>
              <Text style={styles.achievementName}>Estrella</Text>
              <Text style={styles.achievementDesc}>50 estrellas</Text>
            </View>

            <View style={[styles.achievementCard, styles.achievementLocked]}>
              <View style={styles.achievementIcon}>
                <Ionicons name="lock-closed" size={32} color="#CCC" />
              </View>
              <Text style={styles.achievementName}>Bloqueado</Text>
              <Text style={styles.achievementDesc}>Próximamente</Text>
            </View>
          </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
alignItems: 'center',
paddingTop: 60,
paddingHorizontal: 20,
marginBottom: 24,
},
profileSection: {
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
greeting: {
fontSize: 24,
fontWeight: 'bold',
color: '#4B0082',
},
subtitle: {
fontSize: 14,
color: '#333',
marginTop: 2,
},
logoutIcon: {
padding: 8,
},
progressSection: {
paddingHorizontal: 20,
marginBottom: 24,
},
progressCard: {
backgroundColor: '#FFF',
borderRadius: 20,
padding: 20,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.1,
shadowRadius: 8,
elevation: 5,
},
progressHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 16,
},
progressTitle: {
fontSize: 18,
fontWeight: '600',
color: '#333',
},
progressBarContainer: {
marginBottom: 20,
},
progressBarBg: {
height: 12,
backgroundColor: '#F0F0F0',
borderRadius: 6,
overflow: 'hidden',
marginBottom: 8,
},
progressBarFill: {
height: '100%',
backgroundColor: '#4B0082',
borderRadius: 6,
},
progressText: {
fontSize: 14,
color: '#666',
textAlign: 'center',
},
statsRow: {
flexDirection: 'row',
justifyContent: 'space-around',
paddingTop: 16,
borderTopWidth: 1,
borderTopColor: '#F0F0F0',
},
statBox: {
alignItems: 'center',
},
statNumber: {
fontSize: 20,
fontWeight: 'bold',
color: '#333',
marginTop: 4,
},
statLabel: {
fontSize: 12,
color: '#666',
marginTop: 2,
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
marginBottom: 16,
},
activitiesGrid: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 12,
},
activityCard: {
width: '48%',
borderRadius: 20,
padding: 20,
alignItems: 'center',
position: 'relative',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,
},
activityIconBg: {
width: 80,
height: 80,
backgroundColor: '#FFF',
borderRadius: 40,
alignItems: 'center',
justifyContent: 'center',
marginBottom: 12,
},
activityName: {
fontSize: 16,
fontWeight: '600',
color: '#333',
marginBottom: 4,
},
activityDescription: {
fontSize: 12,
color: '#666',
},
activityBadge: {
position: 'absolute',
top: 10,
right: 10,
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#FFF',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: 12,
gap: 4,
},
badgeText: {
fontSize: 10,
fontWeight: '600',
color: '#333',
},
continueCard: {
backgroundColor: '#FFF',
borderRadius: 16,
padding: 16,
flexDirection: 'row',
alignItems: 'center',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,
},
continueIconContainer: {
width: 60,
height: 60,
backgroundColor: '#FFE5E5',
borderRadius: 30,
alignItems: 'center',
justifyContent: 'center',
marginRight: 12,
},
continueInfo: {
flex: 1,
},
continueTitle: {
fontSize: 16,
fontWeight: '600',
color: '#333',
marginBottom: 4,
},
continueSubtitle: {
fontSize: 12,
color: '#666',
marginBottom: 8,
},
continueProgress: {
height: 6,
backgroundColor: '#F0F0F0',
borderRadius: 3,
overflow: 'hidden',
},
continueProgressFill: {
height: '100%',
backgroundColor: '#4B0082',
borderRadius: 3,
},
achievementsScroll: {
gap: 12,
paddingRight: 20,
},
achievementCard: {
width: 120,
backgroundColor: '#FFF',
borderRadius: 16,
padding: 16,
alignItems: 'center',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,
},
achievementLocked: {
opacity: 0.5,
},
achievementIcon: {
width: 60,
height: 60,
backgroundColor: '#F5F5F5',
borderRadius: 30,
alignItems: 'center',
justifyContent: 'center',
marginBottom: 8,
},
achievementName: {
fontSize: 14,
fontWeight: '600',
color: '#333',
marginBottom: 4,
},
achievementDesc: {
fontSize: 11,
color: '#666',
textAlign: 'center',
},
bottomSpacer: {
height: 40,
},
});