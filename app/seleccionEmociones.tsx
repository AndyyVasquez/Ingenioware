import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../src/config/api';

const emociones = [
  { id: 'feliz', etiqueta: 'Feliz', emoji: '😊', color: '#FFD93D' },
  { id: 'triste', etiqueta: 'Triste', emoji: '😢', color: '#4D96FF' },
  { id: 'enojado', etiqueta: 'Enojado', emoji: '😠', color: '#FF6B6B' },
  { id: 'miedo', etiqueta: 'Con Miedo', emoji: '😨', color: '#A06CD5' },
  { id: 'calmado', etiqueta: 'Calmado', emoji: '😌', color: '#6BCB77' },
  { id: 'aburrido', etiqueta: 'Aburrido', emoji: '😐', color: '#9E9E9E' },
];

export default function SeleccionEmocionesScreen() {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleGuardar = async () => {
    if (!seleccion) {
      Alert.alert('¡Espera!', 'Primero elige una carita que diga cómo te sientes.');
      return;
    }

    setEnviando(true);

    try {
      // 1. Obtener ID del niño actual
      const currentChildJson = await AsyncStorage.getItem('currentChild');
      if (!currentChildJson) {
        Alert.alert("Error", "No se encontró sesión del niño");
        return;
      }
      const childData = JSON.parse(currentChildJson);

      // 2. Enviar al servidor
      const response = await fetch(`${API_URL}/diario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nino_id: childData.id,
          emocion: seleccion,
          texto: texto
        })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          '¡Guardado!', 
          `Valo te ha regalado ${data.monedasGanadas || 5} monedas por expresarte. 🌟`,
          [{ text: 'Genial', onPress: () => router.back() }]
        );
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No pudimos guardar tu emoción. Revisa tu conexión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <LinearGradient colors={['#E0F7FA', '#F0F4C3']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {emociones.map((emocion) => (
            <TouchableOpacity
              key={emocion.id}
              style={[
                styles.card,
                seleccion === emocion.id && { backgroundColor: emocion.color, transform: [{scale: 1.05}] },
                seleccion && seleccion !== emocion.id && { opacity: 0.5 }
              ]}
              onPress={() => setSeleccion(emocion.id)}
            >
              <Text style={styles.emoji}>{emocion.emoji}</Text>
              <Text style={[styles.label, seleccion === emocion.id && {color: '#FFF', fontWeight:'bold'}]}>
                {emocion.etiqueta}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {seleccion && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>¿Quieres contarnos por qué? (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Hoy me pasó algo..."
              multiline
              numberOfLines={4}
              value={texto}
              onChangeText={setTexto}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !seleccion && styles.buttonDisabled]}
          disabled={!seleccion || enviando}
          onPress={handleGuardar}
        >
          {enviando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Guardar en mi Diario</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  closeButton: { padding: 5 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4B0082', textAlign: 'center' },
  content: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: 15, marginBottom: 30 },
  card: { width: '45%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  emoji: { fontSize: 50, marginBottom: 10 },
  label: { fontSize: 16, color: '#555' },
  inputContainer: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 15, padding: 15 },
  inputLabel: { fontSize: 16, color: '#4B0082', marginBottom: 10, fontWeight: '600' },
  input: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, height: 100, textAlignVertical: 'top' },
  footer: { padding: 20, paddingBottom: 40 },
  button: { backgroundColor: '#4B0082', padding: 18, borderRadius: 15, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#CCC' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});