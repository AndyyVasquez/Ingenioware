import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JuegoValentia({ onWin }: { onWin: () => void }) {
  const [luzEncendida, setLuzEncendida] = useState(false);

  const handleTouch = () => {
    setLuzEncendida(true);
    // Esperamos 1 segundo para que el niño vea el resultado y luego ganamos
    setTimeout(() => {
      onWin();
    }, 1500);
  };

  return (
    <TouchableOpacity 
        style={[styles.container, { backgroundColor: luzEncendida ? '#FFFDE7' : '#1a1a2e' }]} 
        activeOpacity={1} 
        onPress={handleTouch}
    >
      <Text style={[styles.instruccion, { color: luzEncendida ? '#333' : '#FFF' }]}>
        {luzEncendida ? "¡Solo era un perchero!" : "¡Qué miedo! Toca para encender la luz 🔦"}
      </Text>

      <View style={styles.scene}>
        <Text style={{fontSize: 120}}>
            {luzEncendida ? '🧥' : '👻'} 
        </Text>
      </View>
      
      {!luzEncendida && (
          <Text style={{color: '#AAA', marginTop: 20}}>(Toca la pantalla)</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  instruccion: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  scene: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});