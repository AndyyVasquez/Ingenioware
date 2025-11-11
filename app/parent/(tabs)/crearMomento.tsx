// app/(parent)/crearMomento.tsx

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
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

interface BuenMomento {
  id: string;
  fecha: string;
  mensaje: string;
  monedas: number;
  visto: boolean;
}

export default function CrearMomentoScreen() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('');
  const [monedas, setMonedas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnviar = async () => {
    if (!mensaje.trim()) {
      Alert.alert('Error', 'Escribe un mensaje bonito para tu hijo/a.');
      return;
    }

    const monedasNum = parseInt(monedas, 10) || 0;
    if (monedasNum < 0) {
      Alert.alert('Error', 'No puedes asignar monedas negativas.');
      return;
    }

    setIsLoading(true);

    const nuevoMomento: BuenMomento = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      mensaje: mensaje,
      monedas: monedasNum,
      visto: false, // El niño no lo ha visto
    };

    try {
      const momentosStr = await AsyncStorage.getItem('buenosMomentos');
      const momentos: BuenMomento[] = momentosStr ? JSON.parse(momentosStr) : [];
      
      momentos.push(nuevoMomento);

      await AsyncStorage.setItem('buenosMomentos', JSON.stringify(momentos));

      Alert.alert(
        '¡Mensaje Enviado!',
        'Tu hijo/a recibirá tu mensaje y sus monedas 🪙.',
        [{ text: 'OK', onPress: () => router.back() }]
      );

    } catch (error) {
      console.error('Error guardando momento:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Crear Buen Momento</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Mensaje de felicitación</Text>
            <TextInput
              style={styles.textInputLarge}
              placeholder="Ej: ¡Felicidades por guardar tus juguetes! 🧸"
              placeholderTextColor="#999"
              multiline
              numberOfLines={5}
              value={mensaje}
              onChangeText={setMensaje}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Recompensa (Opcional)</Text>
            <View style={styles.monedasInputContainer}>
              <TextInput
                style={styles.monedasInput}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={monedas}
                onChangeText={setMonedas}
              />
              <Text style={styles.monedasIcon}>🪙</Text>
            </View>

            <TouchableOpacity 
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={handleEnviar}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#FFF" />
                  <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
                </>
              )}
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
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInputLarge: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#333',
    minHeight: 150,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monedasInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monedasInput: {
    flex: 1,
    padding: 20,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  monedasIcon: {
    fontSize: 24,
    marginRight: 20,
  },
  sendButton: {
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
  sendButtonDisabled: {
    backgroundColor: '#9575CD',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});