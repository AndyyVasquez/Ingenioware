import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JuegoEmpatia({ onWin }: { onWin: () => void }) {
  const [estado, setEstado] = useState<'triste' | 'feliz'>('triste');

  const handleOpcion = (esCorrecta: boolean) => {
    if (esCorrecta) {
      setEstado('feliz');
      setTimeout(() => onWin(), 1500);
    } else {
      // Aquí podrías poner un sonido de "uhoh"
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruccion}>
        {estado === 'triste' ? "¡Valo se pegó! ¿Qué necesita?" : "¡Gracias por cuidarme!"}
      </Text>

      {/* Personaje */}
      <View style={styles.personaje}>
        <Text style={{ fontSize: 120 }}>{estado === 'triste' ? '😢' : '🥰'}</Text>
      </View>

      {/* Opciones */}
      {estado === 'triste' && (
        <View style={styles.opcionesContainer}>
          <TouchableOpacity style={styles.boton} onPress={() => handleOpcion(false)}>
            <Text style={styles.emoji}>🕷️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.botonCorrecto} onPress={() => handleOpcion(true)}>
            <Text style={styles.emoji}>🩹</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.boton} onPress={() => handleOpcion(false)}>
            <Text style={styles.emoji}>🍋</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEBEE' },
  instruccion: { fontSize: 22, fontWeight: 'bold', color: '#E91E63', marginBottom: 40, textAlign:'center' },
  personaje: { marginBottom: 60 },
  opcionesContainer: { flexDirection: 'row', gap: 20 },
  boton: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, elevation: 3 },
  botonCorrecto: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, elevation: 3, borderWidth: 2, borderColor: '#E91E63' },
  emoji: { fontSize: 50 },
});