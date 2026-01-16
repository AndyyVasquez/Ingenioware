import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { API_URL } from '../../../src/config/api';

export default function CrearMomentoScreen() {
  const router = useRouter();
  const [mensaje, setMensaje] = useState('');
  const [monedas, setMonedas] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para manejar selección de hijo
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // 1. Cargar la lista de hijos al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const childrenJson = await AsyncStorage.getItem('childrenData');
        if (childrenJson) {
          const loadedChildren = JSON.parse(childrenJson);
          setChildren(loadedChildren);
          // Si hay hijos, seleccionamos el primero por defecto
          if (loadedChildren.length > 0) {
            setSelectedChildId(loadedChildren[0].id);
          }
        }
      } catch (error) {
        console.error("Error cargando hijos", error);
      }
    };
    loadData();
  }, []);

  const handleEnviar = async () => {
    // Validaciones
    if (!selectedChildId) {
      Alert.alert('Error', 'No se ha seleccionado un niño destinatario.');
      return;
    }
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

    try {
      // Obtener ID del padre de la sesión
      const parentSession = await AsyncStorage.getItem('parentSession');
      if (!parentSession) throw new Error("No hay sesión de padre");
      const parentData = JSON.parse(parentSession);

      console.log(`Enviando mensaje a ${API_URL}/mensajes`);

      // 2. PETICIÓN AL BACKEND
      const response = await fetch(`${API_URL}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          padre_id: parentData.id_pad,
          nino_id: selectedChildId,
          mensaje: mensaje,
          monedas_regalo: monedasNum
        })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          '¡Mensaje Enviado! 💌',
          'Tu hijo/a recibirá tu mensaje y sus monedas.',
          [{ text: 'Genial', onPress: () => router.back() }]
        );
      } else {
        throw new Error(data.message);
      }

    } catch (error: any) {
      console.error('Error enviando mensaje:', error);
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor.');
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
            
            {/* SELECTOR DE HIJO (Si hay más de uno) */}
            <Text style={styles.label}>¿Para quién es el mensaje?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 20}}>
              {children.map((child) => (
                <TouchableOpacity 
                  key={child.id}
                  style={[
                    styles.childSelector, 
                    selectedChildId === child.id && styles.childSelectorActive
                  ]}
                  onPress={() => setSelectedChildId(child.id)}
                >
                  <Text style={{fontSize: 20, marginRight: 5}}>{child.avatar_emoji}</Text>
                  <Text style={[
                    styles.childSelectorText, 
                    selectedChildId === child.id && styles.childSelectorTextActive
                  ]}>
                    {child.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  // Estilos nuevos para el selector de hijos
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  childSelectorActive: {
    backgroundColor: '#FFF',
    borderColor: '#4B0082',
  },
  childSelectorText: {
    color: '#555',
    fontWeight: '600'
  },
  childSelectorTextActive: {
    color: '#4B0082',
    fontWeight: 'bold'
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
    marginBottom: 40
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