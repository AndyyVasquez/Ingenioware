import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegistroPadres() {
  const router = useRouter();
  
  // Estados del padre
  const [nomP, setnomP] = useState('');
  const [apP, setapP] = useState('');
  const [amP, setamP] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estado del PIN
  const [pinNino, setPinNino] = useState(['', '', '', '']);
  const [pinPadre, setPinPadre] = useState(['', '', '', '']);
  
  // Referencias para los inputs del PIN
  const pinNinoRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const pinPadreRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  
  // Estados del niño
  const [nomN, setnomN] = useState('');
  const [apN, setapN] = useState('');
  const [amN, setamN] = useState('');
  const [edadN, setedadN] = useState('');
  const [fecnacN, setfecnacN] = useState('');
  const [sexoN, setsexoN] = useState('');
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // --- FUNCIONES PARA EL PIN DEL NIÑO ---
  const handlePinNinoChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newPin = [...pinNino];
    newPin[index] = value;
    setPinNino(newPin);

    if (value && index < 3) {
      pinNinoRefs[index + 1].current?.focus();
    }
  };

  const handlePinNinoKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pinNino[index] && index > 0) {
      pinNinoRefs[index - 1].current?.focus();
    }
  };

  // --- NUEVAS FUNCIONES PARA EL PIN DEL PADRE ---
  const handlePinPadreChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newPin = [...pinPadre];
    newPin[index] = value;
    setPinPadre(newPin);

    if (value && index < 3) {
      pinPadreRefs[index + 1].current?.focus();
    }
  };

  const handlePinPadreKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pinPadre[index] && index > 0) {
      pinPadreRefs[index - 1].current?.focus();
    }
  };

  // (La función 'handlePinKeyPress' genérica fue eliminada)

  const validarFormulario = () => {
    // Validar campos del padre
    if (!nomP.trim() || !apP.trim() || !amP.trim()) {
      Alert.alert('Error', 'Por favor completa todos los datos del padre/madre');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    // Validar contraseña
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    // Validar PIN del Padre
    const pinPadreCompleto = pinPadre.every(digit => digit !== '');
    if (!pinPadreCompleto) {
      Alert.alert('Error', 'Por favor completa el PIN de Padre de 4 dígitos');
      return false;
    }

    // Validar PIN del Niño
    const pinNinoCompleto = pinNino.every(digit => digit !== '');
    if (!pinNinoCompleto) {
      Alert.alert('Error', 'Por favor completa el PIN del Niño de 4 dígitos');
      return false;
    }

    // Validar campos del niño
    if (!nomN.trim() || !apN.trim() || !amN.trim()) {
      Alert.alert('Error', 'Por favor completa todos los datos del niño');
      return false;
    }

    if (!edadN.trim()) {
      Alert.alert('Error', 'Por favor ingresa la edad del niño');
      return false;
    }

    const edad = parseInt(edadN);
    if (isNaN(edad) || edad < 3 || edad > 12) {
      Alert.alert('Error', 'La edad debe estar entre 3 y 12 años');
      return false;
    }

    if (!fecnacN.trim()) {
      Alert.alert('Error', 'Por favor ingresa la fecha de nacimiento del niño');
      return false;
    }

    if (!sexoN) {
      Alert.alert('Error', 'Por favor selecciona el sexo del niño');
      return false;
    }

    return true;
  };

  const handleRegistro = async () => {
    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);

    // --- LÓGICA DE REGISTRO CORREGIDA ---

    // 1. Definir todos los datos PRIMERO
    const pinNinoString = pinNino.join('');
    const pinPadreString = pinPadre.join('');

    const datosNuevoPadre = {
      id_pad: 1, // Este ID vendría de tu backend
      nombre_completo: `${nomP} ${apP} ${amP}`,
      nom_pad: nomP,
      ap_pad: apP,
      am_pad: amP,
      correo_pad: email,
      token: 'fake-jwt-token-12345', 
      tiene_ninos: true,
    };

    const datosNuevoNino = {
      id_nino: 1, 
      nombre_completo: `${nomN} ${apN} ${amN}`,
      nom_nino: nomN,
      ap_nino: apN,
      am_nino: amN,
      edad_nino: parseInt(edadN),
      fec_nac_nino: fecnacN,
      sexo_nino: sexoN,
      avatar_emoji: '🦁', 
    };

    // 2. Ejecutar el guardado en AsyncStorage
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Guardar PINes
      await AsyncStorage.setItem('childPin', pinNinoString);
      await AsyncStorage.setItem('parentPin', pinPadreString);

      // Guardar sesión del padre
      await AsyncStorage.setItem('parentSession', JSON.stringify(datosNuevoPadre));
      await AsyncStorage.setItem('hasParentAccount', 'true');
      await AsyncStorage.setItem('hasChildren', 'true');

      // Guardar datos del niño
      await AsyncStorage.setItem('childData', JSON.stringify(datosNuevoNino));

      console.log('✅ Registro exitoso');
      console.log('PIN Niño guardado:', pinNinoString);
      console.log('PIN Padre guardado:', pinPadreString);
      console.log('Datos padre:', datosNuevoPadre);
      console.log('Datos niño:', datosNuevoNino);

      // 3. Navegar
      router.push('/registroExitoso');

    } catch (error) {
      console.error('❌ Error en registro:', error);
      Alert.alert(
        'Error',
        'No se pudo completar el registro. Por favor intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Crear cuenta</Text>
          </View>

          {/* Datos del padre/madre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del padre/madre</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre(s)"
              placeholderTextColor="#999"
              value={nomP}
              onChangeText={setnomP}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellido paterno"
              placeholderTextColor="#999"
              value={apP}
              onChangeText={setapP}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellido materno"
              placeholderTextColor="#999"
              value={amP}
              onChangeText={setamP}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* --- JSX CORREGIDO --- */}

          {/* PIN de Seguridad (Padre) */}
          <View style={styles.pinSection}>
            <Text style={styles.pinTitle}>PIN de Acceso (Padre)</Text>
            <Text style={styles.pinSubtitle}>
              Usarás este PIN para acceder a tu perfil de padre
            </Text>
            <View style={styles.pinContainer}>
              {pinPadre.map((digit, index) => (
                <TextInput
                  key={`padre-${index}`}
                  ref={pinPadreRefs[index]}
                  style={[
                    styles.pinInput,
                    digit && styles.pinInputFilled,
                  ]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handlePinPadreChange(value, index)}
                  onKeyPress={(e) => handlePinPadreKeyPress(e, index)}
                  secureTextEntry
                />
              ))}
            </View>
          </View>

          {/* PIN de Seguridad (Niño) */}
          <View style={styles.pinSection}>
            <Text style={styles.pinTitle}>PIN del Niño (4 dígitos)</Text>
            <Text style={styles.pinSubtitle}>
              El niño usará este PIN para acceder a su perfil
            </Text>
            <View style={styles.pinContainer}>
              {pinNino.map((digit, index) => (
                <TextInput
                  key={`nino-${index}`}
                  ref={pinNinoRefs[index]}
                  style={[
                    styles.pinInput,
                    digit && styles.pinInputFilled,
                  ]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handlePinNinoChange(value, index)}
                  onKeyPress={(e) => handlePinNinoKeyPress(e, index)}
                  secureTextEntry
                />
              ))}
            </View>
          </View>

          {/* Datos del niño */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del niño</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre(s)"
              placeholderTextColor="#999"
              value={nomN}
              onChangeText={setnomN}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellido paterno"
              placeholderTextColor="#999"
              value={apN}
              onChangeText={setapN}
            />

            <TextInput
              style={styles.input}
              placeholder="Apellido materno"
              placeholderTextColor="#999"
              value={amN}
              onChangeText={setamN}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha de nacimiento (DD/MM/AAAA)"
              placeholderTextColor="#999"
              value={fecnacN}
              onChangeText={setfecnacN}
            />

            <TextInput
              style={styles.input}
              placeholder="Edad"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={edadN}
              onChangeText={setedadN}
            />

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                Alert.alert(
                  'Seleccionar Sexo',
                  '',
                  [
                    { text: 'Masculino', onPress: () => setsexoN('Masculino') },
                    { text: 'Femenino', onPress: () => setsexoN('Femenino') },
                    { text: 'Cancelar', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !sexoN && styles.placeholderText,
                ]}
              >
                {sexoN || 'Sexo'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Botón de crear cuenta */}
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleRegistro}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// ... (los estilos son los mismos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
    backgroundColor: '#81B7D2',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  pinSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pinTitle: {
    fontSize: 16,
  	fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pinSubtitle: {
  	fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
  dropdown: {
    backgroundColor: '#F5E6D3',
   borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  createButton: {
    backgroundColor: '#f4a261',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  	marginTop: 10,
  },
  createButtonDisabled: {
    backgroundColor: '#d4a373',
  	opacity: 0.7,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});