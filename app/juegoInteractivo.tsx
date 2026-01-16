import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../src/config/api';

import JuegoEmpatia from './game/juegoEmpatia';
import JuegoGenerosidad from './game/juegoGenerosidad';
import JuegoHonestidad from './game/juegoHonestidad';
import JuegoPaciencia from './game/juegoPaciencia';
import JuegoResponsabilidad from './game/juegoResponsabilidad';
import JuegoValentia from './game/juegoValentia';

export default function JuegoInteractivoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGameWin = async () => {
    await guardarProgreso();
  };

  const guardarProgreso = async () => {
    try {
      const childJson = await AsyncStorage.getItem('currentChild');
      if (!childJson) return;
      const child = JSON.parse(childJson);

      const response = await fetch(`${API_URL}/juegos/completar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nino_id: child.id,
          valor_id: params.valorId
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el progreso");
    }
  };

  // Selector de Juego según el Título del Nivel
  const renderGame = () => {
    const titulo = typeof params.titulo === 'string' ? params.titulo.toLowerCase() : '';

    if (titulo.includes('responsabilidad')) {
      return <JuegoResponsabilidad onWin={handleGameWin} />;
    }
    if (titulo.includes('valentía') || titulo.includes('valentia')) {
      return <JuegoValentia onWin={handleGameWin} />;
    }
    if (titulo.includes('honestidad')) return <JuegoHonestidad onWin={handleGameWin} />;
    if (titulo.includes('empatía') || titulo.includes('empatia')) return <JuegoEmpatia onWin={handleGameWin} />;
    if (titulo.includes('generosidad')) return <JuegoGenerosidad onWin={handleGameWin} />;
    if (titulo.includes('paciencia')) return <JuegoPaciencia onWin={handleGameWin} />;
    
    // Juego por defecto (Quiz simple) si no hemos programado el específico aún
    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <Text style={{fontSize: 20, textAlign: 'center'}}>
            Juego para {params.titulo} próximamente.
        </Text>
        <TouchableOpacity onPress={handleGameWin} style={styles.btnSimular}>
            <Text style={{color: '#FFF'}}>Simular Victoria</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}> 
      {/* Usamos View normal porque los juegos pueden tener sus propios fondos */}
      
      {/* Header flotante para salir */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={40} color="#333" />
      </TouchableOpacity>

      {/* Renderizamos el juego específico */}
      {renderGame()}

      {/* Modal de Victoria */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 80}}>⭐</Text>
            <Text style={styles.modalTitle}>¡Increíble!</Text>
            <Text style={styles.modalText}>¡Lo lograste!</Text>
            <TouchableOpacity 
              style={styles.continueBtn}
              onPress={() => {
                setShowSuccess(false);
                router.back();
              }}
            >
              <Text style={styles.continueText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 100 },
  btnSimular: { marginTop: 20, backgroundColor: '#4B0082', padding: 15, borderRadius: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '80%', padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 5, borderColor: '#FFD700' },
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFD700', marginTop: 10 },
  modalText: { fontSize: 18, marginVertical: 10, color: '#333' },
  continueBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 10 },
  continueText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});