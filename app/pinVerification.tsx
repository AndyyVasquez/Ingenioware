import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PINVerificationScreen() {
  const router = useRouter();
  // Obtenemos los parámetros pasados desde la pantalla de selección
  const params = useLocalSearchParams();

  const [pin, setPin] = useState(['', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para el perfil actual
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileType, setProfileType] = useState<'parent' | 'child' | null>(null);
  const [profileName, setProfileName] = useState<string>('');
  
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const shakeAnimation = useRef(new Animated.Value(0)).current;

    const hasFocused = useRef(false);

  useEffect(() => {
    // Reemplazamos 'verificarAcceso' con esta lógica
    const { profileId, profileType, name } = params;

    if (!profileId || !profileType || !name) {
      Alert.alert(
        'Error de perfil',
        'No se seleccionó un perfil. Volviendo al inicio.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
      return;
    }

    // Guardamos los datos del perfil que está intentando entrar
    setProfileId(profileId as string);
    setProfileType(profileType as 'parent' | 'child');
    setProfileName(name as string);
    setLoading(false);
   if (!hasFocused.current) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
        hasFocused.current = true; // Subimos al guardia. Ya no se volverá a ejecutar.
      }, 100);
    }

  }, [params]);// Se ejecuta cada vez que los parámetros cambian

const handlePinChange = (value: string, index: number) => {
    // 1. Si el usuario pega un código completo (ej. del SMS)
    if (value.length > 1 && value.length === 4 && /^\d+$/.test(value)) {
      setPin(value.split(''));
      verifyPin(value); // Verificarlo de inmediato
      return;
    }

    // 2. Si el usuario teclea un solo número
    if (value && /^\d$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Mover foco al siguiente
      if (index < 3) {
        inputRefs[index + 1].current?.focus();
      }

      // Verificar si ya se llenó el último
      const finalPin = newPin.join('');
      if (finalPin.length === 4) {
        verifyPin(finalPin);
      }
    } 
    // 3. Si el usuario borra (el value es ''),
    // solo actualizamos el estado, pero NO movemos el foco.
    // De eso se encargará handleKeyPress.
    else if (value === '') {
      const newPin = [...pin];
      newPin[index] = '';
      setPin(newPin);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Si la tecla es "Backspace"
    // Y el input actual YA ESTÁ vacío (pin[index] === '')
    // Y no es el primer input (index > 0)
    if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
      // Mover foco al input anterior
      inputRefs[index].current?.focus();
    }
  };


  const verifyPin = async (enteredPin: string) => {
    try {
      let savedPinKey = '';
      let successRoute = '';

      // Decidimos qué PIN buscar y a dónde ir
      if (profileType === 'child') {
        savedPinKey = 'childPin';
        successRoute = '/dashboardN';
      } else if (profileType === 'parent') {
        // Asumimos que el PIN del padre se guarda como 'parentPin'
        // (Debes asegurar esto en tu flujo de registro de padre)
        savedPinKey = 'parentPin';
        successRoute = '/parent/(tabs)/';
      } else {
        throw new Error('Tipo de perfil no válido');
      }

      const savedPin = await AsyncStorage.getItem(savedPinKey);
      
      console.log(`Intentando accder como: ${profileName} (${profileType})`);
      console.log('PIN ingresado:', enteredPin);
      console.log(`PIN guardado (${savedPinKey}):`, savedPin);

      if (!savedPin) {
        Alert.alert('Error', `No se encontró un PIN configurado para ${profileName}.`);
        setPin(['', '', '', '']);
        inputRefs[0].current?.focus();
        return;
      }

      if (enteredPin === savedPin) {
        // ¡PIN correcto!
        console.log(`✅ PIN correcto para ${profileName}`);
        
        if (profileType === 'child') {
          // Creamos la sesión del niño (lógica que ya tenías)
          const childDataStr = await AsyncStorage.getItem('childData');
          if (childDataStr) {
            const childData = JSON.parse(childDataStr);
            const childSession = {
              id_nino: childData.id_nino,
              nombre_completo: childData.nombre_completo,
              avatar_emoji: childData.avatar_emoji,
              loginTime: new Date().toISOString(),
              authenticatedWithPin: true,
            };
            await AsyncStorage.setItem('childSession', JSON.stringify(childSession));
            console.log('Sesión del niño creada');
          }
        }
        // NOTA: No necesitamos crear la sesión del padre aquí,
        // porque el PIN es solo un *bloqueo*. La sesión ya debe existir
        // (según la lógica de 'login.tsx').

        // Navegar al dashboard correspondiente
        router.replace(successRoute as any);

      } else {
        // PIN incorrecto
        setAttempts(attempts + 1);
        shakeInputs();
        
        if (attempts + 1 >= 3) {
          Alert.alert(
            'Demasiados intentos',
            'Has superado el número de intentos permitidos.',
            [{ text: 'Volver', onPress: () => router.replace('/') }]
          );
        } else {
          Alert.alert(
            'PIN incorrecto', 
            `Te quedan ${3 - (attempts + 1)} intentos`
          );
          setPin(['', '', '', '']);
          inputRefs[0].current?.focus();
        }
      }
    } catch (error) {
      console.error('Error verificando PIN:', error);
      Alert.alert('Error', 'No se pudo verificar el PIN');
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleForgotPin = () => {
    if (profileType === 'parent') {
      // Si es el padre, lo mandamos a recuperar su contraseña/PIN
      Alert.alert(
        '¿Olvidaste tu PIN?',
        'Puedes restablecer tu PIN desde la configuración de tu cuenta o recuperando tu contraseña.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Recuperar', onPress: () => router.push('/forgotPass') }
        ]
      );
    } else {
      // Si es el niño, le pide ayuda
      Alert.alert(
        '¿Necesitas ayuda?',
        'Pide a un adulto que te ayude con tu PIN',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  // ¡No renderiza nada si el perfil no se cargó! (Ya lo maneja el useEffect)
  if (!profileType) {
    return null; 
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace('/')} // Volver al selector de perfiles
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🔒</Text>
          </View>
          {/* --- Título Dinámico --- */}
          <Text style={styles.title}>¡Hola, {profileName}!</Text>
          <Text style={styles.subtitle}>
            Ingresa tu PIN secreto para continuar
          </Text>
        </View>

        <Animated.View 
          style={[
            styles.pinContainer,
            { transform: [{ translateX: shakeAnimation }] }
          ]}
        >
          {pin.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={[
                styles.pinInput,
                digit && styles.pinInputFilled,
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handlePinChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              secureTextEntry
              textContentType="password" 
              autoComplete="password"
            />
          ))}
        </Animated.View>

        <View style={styles.attemptsContainer}>
          <Text style={styles.attemptsText}>
            Intentos: {attempts}/3
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.helpButton}
          onPress={handleForgotPin} // <-- Lógica dinámica
        >
          <Ionicons name="help-circle-outline" size={20} color="#4B0082" />
          <Text style={styles.helpButtonText}>¿Olvidaste tu PIN?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// ... (los estilos son los mismos)
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
    fontSize: 18,
    color: '#4B0082',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#F5E6D3',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  pinInput: {
    width: 60,
    height: 60,
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pinInputFilled: {
    borderColor: '#4B0082',
    backgroundColor: '#E8D5FF',
  },
  attemptsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  attemptsText: {
    fontSize: 14,
    color: '#666',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  helpButtonText: {
    color: '#4B0082',
    fontSize: 16,
    fontWeight: '500',
  },
});