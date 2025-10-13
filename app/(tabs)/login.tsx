import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Aquí irá tu lógica de autenticación real con el backend
      // Por ahora simularemos un login exitoso
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Datos simulados del padre (esto vendrá de tu API)
      const datosSimulados = {
        id_pad: 1,
        nombre_completo: 'Juan Pérez García',
        correo_pad: email,
        token: 'fake-jwt-token-12345', // Este será un token real de tu backend
        tiene_ninos: true,
      };
      
      // Guardar sesión del padre
      await AsyncStorage.setItem('parentSession', JSON.stringify(datosSimulados));
      await AsyncStorage.setItem('hasParentAccount', 'true');
      
      // Importante: También guardar que tiene niños registrados
      await AsyncStorage.setItem('hasChildren', datosSimulados.tiene_ninos ? 'true' : 'false');
      
      console.log('Sesión guardada exitosamente');
      
      // Navegar al dashboard del padre
      router.replace('/dashboardP');
      
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Intenta de nuevo.');
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
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.subtitle}>
              Ingresa tus datos para continuar
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/forgotPass')}
            >
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Iniciando sesión...</Text>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.registerLink}
              onPress={() => router.push('/registro')}
            >
              <Text style={styles.registerLinkText}>
                ¿No tienes cuenta? <Text style={styles.registerLinkBold}>Regístrate aquí</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 40,
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
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4B0082',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4B0082',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#9575CD',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCC',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 16,
    color: '#333',
  },
  registerLinkBold: {
    color: '#4B0082',
    fontWeight: '600',
  },
});