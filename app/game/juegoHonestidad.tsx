import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';

export default function JuegoHonestidad({ onWin }: { onWin: () => void }) {
  // Creamos 5 manchas de suciedad
  const [manchas, setManchas] = useState([1, 2, 3, 4, 5]);

  const limpiarMancha = (id: number) => {
    const restantes = manchas.filter(m => m !== id);
    setManchas(restantes);

    if (restantes.length === 0) {
      setTimeout(() => onWin(), 1000); // Ganar al limpiar todo
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruccion}>
        {manchas.length > 0 ? "¡Limpia las manchas!" : "¡La verdad brilla!"}
      </Text>

      <View style={styles.lienzo}>
        {/* El objeto oculto (La Verdad) */}
        <View style={styles.objetoOculto}>
          <Text style={{ fontSize: 100 }}>💎</Text>
        </View>

        {/* Las manchas que tapan la verdad */}
        {manchas.map((id) => (
          <Animated.View 
            key={id} 
            exiting={FadeOut} // Animación al desaparecer
            style={[styles.mancha, styles[`mancha${id}` as keyof typeof styles]]}
          >
            <TouchableOpacity onPress={() => limpiarMancha(id)} style={styles.touchableMancha}>
              <Text style={{ fontSize: 40 }}>💩</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        {manchas.length === 0 && (
           <Animated.View entering={ZoomIn}>
              <Text style={{fontSize: 30, marginTop: 20}}>✨ ¡Limpio! ✨</Text>
           </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  instruccion: { fontSize: 24, fontWeight: 'bold', color: '#4ECDC4', marginBottom: 30 },
  lienzo: { width: 300, height: 300, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 20, elevation: 5 },
  objetoOculto: { position: 'absolute', zIndex: 1 },
  mancha: { position: 'absolute', zIndex: 10 },
  touchableMancha: { padding: 10 },
  // Posiciones aleatorias para las manchas
  mancha1: { top: 20, left: 20 },
  mancha2: { top: 40, right: 30 },
  mancha3: { bottom: 50, left: 50 },
  mancha4: { bottom: 20, right: 40 },
  mancha5: { top: '40%', left: '40%' },
});