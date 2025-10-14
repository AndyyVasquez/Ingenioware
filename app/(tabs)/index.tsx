import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedStar from './AnimatedStar';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [hasParentAccount, setHasParentAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const parentSession = await AsyncStorage.getItem('parentSession');
      const hasAccount = await AsyncStorage.getItem('hasParentAccount');
      
      console.log('Parent session:', parentSession);
      console.log('Has account:', hasAccount);
      
      setIsParentLoggedIn(parentSession !== null);
      setHasParentAccount(hasAccount !== null);
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParentClick = () => {
    if (isParentLoggedIn) {
      // Si ya hay sesión activa, ir directo al dashboard del padre
      router.push('/dashboardP');
    } else {
      // Si no hay sesión, mostrar opciones
      Alert.alert(
        'Acceso para Padres',
        '¿Qué deseas hacer?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Crear cuenta',
            onPress: () => router.push('/registro'),
          },
          {
            text: 'Iniciar sesión',
            onPress: () => router.push('/login'),
          },
        ]
      );
    }
  };

  const handleChildClick = () => {
    if (!hasParentAccount) {
      // Si no hay cuenta de padre creada
      Alert.alert(
        'Cuenta requerida',
        'Primero un adulto debe crear una cuenta para poder usar la app.',
        [
          {
            text: 'Crear cuenta',
            onPress: () => router.push('/registro'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } else {
      // Si hay cuenta de padre, verificar si hay sesión activa
      if (isParentLoggedIn) {
        // Si el padre está logueado, ir directo a verificación de PIN
        router.push('/pinVerification');
      } else {
        // Si no hay sesión del padre, pedir que inicie sesión primero
        Alert.alert(
          'Inicio de sesión requerido',
          'Para acceder al perfil del niño, primero necesitas iniciar sesión como padre.',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Iniciar sesión',
              onPress: () => router.push('/login'),
            },
          ]
        );
      }
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Logo y encabezado */}
      <View style={styles.header}>
         <AnimatedStar />
        <Text style={{fontSize: 28, fontWeight: '700', color: '#4B0082', marginBottom: 50}}> Ingenioware</Text>

        <Text style={styles.subtitle}>
          Donde el aprendizaje es una nueva aventura mágica
        </Text>
      </View>

      {/* Pregunta */}
      <View style={styles.QContainer}>
        <Text style={styles.question}>¿Quién está por explorar?</Text>
      </View>

      {/* Tarjetas de selección */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8}
          onPress={handleParentClick}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={48} color="#6B4423" />
          </View>
          <Text style={styles.cardLabel}>Padres</Text>
          {isParentLoggedIn && (
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8}
          onPress={handleChildClick}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="happy-outline" size={48} color="#6B4423" />
          </View>
          <Text style={styles.cardLabel}>Niña/o</Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de sesión activa */}
      {isParentLoggedIn && (
        <View style={styles.sessionIndicator}>
          <Ionicons name="information-circle" size={20} color="#4B0082" />
          <Text style={styles.sessionText}>Sesión de padre activa</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4B0082',
    fontWeight: '600',
  },
  logo: {
    width: 220, 
    height: 220,
    marginTop: -20,
    marginBottom: -40,
    resizeMode: 'contain',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -10,
  },
  QContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  question: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginHorizontal: -20,
  },
  card: {
    width: 150,
    height: 160,
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4A460',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  sessionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    alignSelf: 'center',
    gap: 8,
  },
  sessionText: {
    fontSize: 14,
    color: '#4B0082',
    fontWeight: '500',
  },
});