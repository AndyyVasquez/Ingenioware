import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [hasParentAccount, setHasParentAccount] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {

     try {
       const session = await AsyncStorage.getItem('parentSession');
       const hasAccount = await AsyncStorage.getItem('hasParentAccount');
       setIsParentLoggedIn(session !== null);
       setHasParentAccount(hasAccount !== null);
     } catch (error) {
       console.error('Error checking session:', error);
     }
    
    setIsParentLoggedIn(false);
    setHasParentAccount(false); // Cambia a true si ya existe una cuenta
  };

  const handleParentClick = () => {
    if (isParentLoggedIn) {
      // Si ya hay sesión activa, ir directo al dashboard
      router.push('/dashboardP');
    } else {
      // Si no hay sesión, ir a authChoice
      router.push('/authChoice');
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
            onPress: () => router.push('/authChoice'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } else {
      // Si hay cuenta, pedir PIN
      router.push('/pinVerification');
    }
  };

  return (
    <LinearGradient
      colors={['#B8D4E0', '#FAD4C0']}
      style={styles.container}
    >
      {/* Logo y encabezado */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo2.png')} style={styles.logo} />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
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
});