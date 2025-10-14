import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
  const [pin, setPin] = useState(['', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    verificarAcceso();
  }, []);

  const verificarAcceso = async () => {
    try {
      // Verificar que exista cuenta de padre
      const hasParentAccount = await AsyncStorage.getItem('hasParentAccount');
      
      // Verificar que haya sesión activa de padre
      const parentSession = await AsyncStorage.getItem('parentSession');
      
      // Verificar que existan datos del niño
      const childData = await AsyncStorage.getItem('childData');
      
      console.log('Has parent account:', hasParentAccount);
      console.log('Parent session:', parentSession ? 'Activa' : 'No activa');
      console.log('Child data:', childData ? 'Existe' : 'No existe');
      
      if (!hasParentAccount || !parentSession) {
        Alert.alert(
          'Acceso no disponible',
          'Necesitas iniciar sesión como padre primero.',
          [
            {
              text: 'Iniciar sesión',
              onPress: () => router.replace('/login'),
            },
            {
              text: 'Volver',
              onPress: () => router.back(),
              style: 'cancel',
            },
          ]
        );
        return;
      }

      if (!childData) {
        Alert.alert(
          'Sin perfil de niño',
          'Aún no se ha registrado un perfil de niño.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }

      setCanAccess(true);
      // Enfocar el primer input
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
      
    } catch (error) {
      console.error('Error verificando acceso:', error);
      Alert.alert('Error', 'No se pudo verificar el acceso');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (value: string, index: number) => {
    // Solo permitir números
    if (value && !/^\d+$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus al siguiente input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Verificar PIN cuando esté completo
    if (newPin.every(digit => digit !== '') && index === 3) {
      verifyPin(newPin.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Retroceder al input anterior si se presiona backspace
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      // Obtener el PIN guardado
      const savedPin = await AsyncStorage.getItem('childPin');
      
      console.log('PIN ingresado:', enteredPin);
      console.log('PIN guardado:', savedPin);

      if (!savedPin) {
        Alert.alert('Error', 'No se encontró el PIN configurado');
        return;
      }

      if (enteredPin === savedPin) {
        // PIN correcto - Crear sesión del niño
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
          
          console.log('✅ PIN correcto - Sesión del niño creada');
          
          // Navegar al dashboard del niño
          router.replace('/dashboardN');
        } else {
          Alert.alert('Error', 'No se encontraron datos del niño');
        }
      } else {
        // PIN incorrecto
        setAttempts(attempts + 1);
        shakeInputs();
        
        if (attempts + 1 >= 3) {
          Alert.alert(
            'Demasiados intentos',
            'Has superado el número de intentos permitidos.',
            [
              {
                text: 'Volver',
                onPress: () => router.back(),
              },
            ]
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

  if (loading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Verificando acceso...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🔒</Text>
          </View>
          <Text style={styles.title}>¡Hola!</Text>
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
              selectTextOnFocus
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
          onPress={() => {
            Alert.alert(
              '¿Necesitas ayuda?',
              'Pide a un adulto que te ayude con tu PIN',
              [{ text: 'OK' }]
            );
          }}
        >
          <Ionicons name="help-circle-outline" size={20} color="#4B0082" />
          <Text style={styles.helpButtonText}>¿Olvidaste tu PIN?</Text>
        </TouchableOpacity>

        <View style={styles.numberPad}>
          <View style={styles.numberPadRow}>
            {[1, 2, 3].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => {
                  const emptyIndex = pin.findIndex(d => d === '');
                  if (emptyIndex !== -1) {
                    handlePinChange(num.toString(), emptyIndex);
                  }
                }}
              >
                <Text style={styles.numberButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberPadRow}>
            {[4, 5, 6].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => {
                  const emptyIndex = pin.findIndex(d => d === '');
                  if (emptyIndex !== -1) {
                    handlePinChange(num.toString(), emptyIndex);
                  }
                }}
              >
                <Text style={styles.numberButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberPadRow}>
            {[7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => {
                  const emptyIndex = pin.findIndex(d => d === '');
                  if (emptyIndex !== -1) {
                    handlePinChange(num.toString(), emptyIndex);
                  }
                }}
              >
                <Text style={styles.numberButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberPadRow}>
            <View style={styles.numberButton} />
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => {
                const emptyIndex = pin.findIndex(d => d === '');
                if (emptyIndex !== -1) {
                  handlePinChange('0', emptyIndex);
                }
              }}
            >
              <Text style={styles.numberButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => {
                const lastFilledIndex = pin.map((d, i) => d ? i : -1).filter(i => i !== -1).pop();
                if (lastFilledIndex !== undefined) {
                  const newPin = [...pin];
                  newPin[lastFilledIndex] = '';
                  setPin(newPin);
                  inputRefs[lastFilledIndex].current?.focus();
                }
              }}
            >
              <Ionicons name="backspace-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    color: '#333',
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
  numberPad: {
    marginTop: 20,
  },
  numberPadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  numberButton: {
    width: 70,
    height: 70,
    backgroundColor: '#F5E6D3',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
});