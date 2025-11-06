import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
  nombre_icono: string;
  color: string;
  ruta?: string;
}

interface NinoData {
  id_nino: number;
  nombre_completo: string;
  avatar_emoji: string;
  apodo?: string;
}

export default function ChildDashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ninoData, setNinoData] = useState<NinoData | null>(null);
  const [entradasDiario, setEntradasDiario] = useState(0);
  const [categorias] = useState<Categoria[]>([
    {
      id_categoria: 1,
      nombre_categoria: 'Cuentos',
      descripcion: 'Historias mágicas',
      nombre_icono: 'book',
      color: '#4ECDC4',
      ruta: '/cuentos',
    },
    {
      id_categoria: 2,
      nombre_categoria: 'Juegos',
      descripcion: 'Aprende jugando',
      nombre_icono: 'game-controller',
      color: '#FF6B6B',
      ruta: '/juegos',
    },
    {
      id_categoria: 3,
      nombre_categoria: 'Canciones',
      descripcion: 'Ritmos del corazón',
      nombre_icono: 'musical-notes',
      color: '#FFD93D',
    },
    {
      id_categoria: 4,
      nombre_categoria: 'Mis logros',
      descripcion: 'Tus estrellas',
      nombre_icono: 'trophy',
      color: '#A06CD5',
      ruta: '/recompensas',
    },
    {
      id_categoria: 5,
      nombre_categoria: 'Buenos momentos',
      descripcion: 'Del corazón',
      nombre_icono: 'heart',
      color: '#FF8FAB',
      ruta: '/buenosMomentos',
    },
    {
      id_categoria: 6,
      nombre_categoria: 'Mi perfil',
      descripcion: 'Tu información',
      nombre_icono: 'person',
      color: '#95E1D3',
      ruta: '/perfilN',
    },
  ]);

  useEffect(() => {
    verificarSesion();
    cargarEntradasDiario();
  }, []);

  const verificarSesion = async () => {
    try {
      const childSession = await AsyncStorage.getItem('childSession');
      const childData = await AsyncStorage.getItem('childData');
      
      if (!childSession) {
        Alert.alert(
          'Sesión no encontrada',
          'Por favor ingresa tu PIN primero',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/pinVerification'),
            },
          ]
        );
        return;
      }

      const session = JSON.parse(childSession);
      const data = childData ? JSON.parse(childData) : {}; 
      const datos = {
        ...session,
        apodo: data.apodo || session.apodo, 
      };
      setNinoData(datos);
      
    } catch (error) {
      console.error('Error verificando sesión:', error);
      Alert.alert('Error', 'No se pudo verificar la sesión');
    } finally {
      setLoading(false);
    }
  };

  const cargarEntradasDiario = async () => {
    try {
      const entradasStr = await AsyncStorage.getItem('entradasDiario');
      if (entradasStr) {
        const entradas = JSON.parse(entradasStr);
        setEntradasDiario(entradas.length);
      }
    } catch (error) {
      console.error('Error cargando entradas:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('childSession');
              console.log('Sesión del niño cerrada');
              router.replace('/');
            } catch (error) {
              console.error('Error cerrando sesión:', error);
            }
          },
        },
      ]
    );
  };

  const handleCategoriaPress = (categoria: Categoria) => {
    if (categoria.ruta) {
      router.push(categoria.ruta as any);
    } else {
      Alert.alert(
        categoria.nombre_categoria,
        `Próximamente: ${categoria.descripcion}`,
        [{ text: 'OK' }]
      );
    }
  };

  const getIconName = (iconName: string): any => {
    const iconMap: { [key: string]: any } = {
      'book': 'book',
      'game-controller': 'game-controller',
      'musical-notes': 'musical-notes',
      'trophy': 'trophy',
      'heart': 'heart',
      'person': 'person',
    };
    return iconMap[iconName] || 'star';
  };

  if (loading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!ninoData) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>No se pudo cargar tu perfil</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => router.replace('/pinVerification')}
          >
            <Text style={styles.retryButtonText}>Volver a intentar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const nombreMostrar = ninoData.apodo || ninoData.nombre_completo.split(' ')[0];

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>¡Hola {nombreMostrar}!</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="exit-outline" size={28} color="#4B0082" />
          </TouchableOpacity>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>¿Qué aventura tendremos hoy?</Text>
        </View>

        <TouchableOpacity 
          style={styles.diarioCard}
          activeOpacity={0.8}
          onPress={() => router.push('./seleccionEmociones')}
        >
          <LinearGradient
            colors={['#FFE4B5', '#FFDAB9']}
            style={styles.diarioGradient}
          >
            <View style={styles.diarioIcono}>
              <Text style={styles.diarioEmoji}>🐻</Text>
            </View>
            <View style={styles.diarioInfo}>
              <Text style={styles.diarioTitulo}>Diario de Valo</Text>
              <Text style={styles.diarioSubtitulo}>
                {entradasDiario === 0 
                  ? '¡Cuéntame cómo te sientes hoy!'
                  : `${entradasDiario} ${entradasDiario === 1 ? 'entrada' : 'entradas'}`}
              </Text>
            </View>
            <View style={styles.diarioAccion}>
              <Ionicons name="create" size={24} color="#4B0082" />
              <Text style={styles.diarioAccionTexto}>Escribir</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {entradasDiario > 0 && (
          <TouchableOpacity
            style={styles.calendarioButton}
            onPress={() => router.push('./resumenEmocional')}
          >
            <Ionicons name="calendar" size={20} color="#4B0082" />
            <Text style={styles.calendarioButtonText}>Ver mi calendario emocional</Text>
            <Ionicons name="chevron-forward" size={20} color="#4B0082" />
          </TouchableOpacity>
        )}

        <View style={styles.categoriesGrid}>
          {categorias.map((categoria, index) => (
            <TouchableOpacity
              key={categoria.id_categoria}
              style={[
                styles.categoryCard,
                index % 2 === 0 ? styles.categoryCardLeft : styles.categoryCardRight,
              ]}
              activeOpacity={0.8}
              onPress={() => handleCategoriaPress(categoria)}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: categoria.color }]}>
                <Ionicons
                  name={getIconName(categoria.nombre_icono)}
                  size={40}
                  color="#FFF"
                />
              </View>
              <Text style={styles.categoryTitle}>{categoria.nombre_categoria}</Text>
              <Text style={styles.categoryDescription}>{categoria.descripcion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/bancoEstrellas')}
      >
        <Text style={styles.floatingButtonEmoji}>🪙</Text>
        <Text style={styles.floatingButtonText}>Banco</Text>
      </TouchableOpacity>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B0082',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#4B0082',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greetingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  logoutButton: {
    padding: 8,
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  diarioCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  diarioGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  diarioIcono: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  diarioEmoji: {
    fontSize: 36,
  },
  diarioInfo: {
    flex: 1,
  },
  diarioTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 4,
  },
  diarioSubtitulo: {
    fontSize: 14,
    color: '#6B4423',
  },
  diarioAccion: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  diarioAccionTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B0082',
    marginTop: 4,
  },
  calendarioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 2,
    borderColor: '#4B0082',
    borderStyle: 'dashed',
  },
  calendarioButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B0082',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 160,
  },
  categoryCardLeft: {
    marginRight: 'auto',
  },
  categoryCardRight: {
    marginLeft: 'auto',
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#FFA500',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonEmoji: {
    fontSize: 24,
  },
  floatingButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});