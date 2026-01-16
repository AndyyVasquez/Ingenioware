import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function JuegoPaciencia({ onWin }: { onWin: () => void }) {
  const scale = useSharedValue(0.2); // La flor empieza pequeña
  const [texto, setTexto] = useState("Mantén presionado para regar 💧");

  const longPress = Gesture.LongPress()
    .minDuration(500) // Empezar a detectar rápido
    .onStart(() => {
        runOnJS(setTextO)("¡Sigue así! Está creciendo...");
        // Animamos el crecimiento a lo largo de 3 segundos
        scale.value = withTiming(1.5, { duration: 3000 }, (finished) => {
            if (finished) {
                runOnJS(handleWin)();
            }
        });
    })
    .onFinalize((e) => {
        // Si suelta antes de terminar, la flor se encoge un poco (penalización suave)
        if (scale.value < 1.5) {
             scale.value = withTiming(0.2, { duration: 500 });
             runOnJS(setTextO)("¡No sueltes! Intenta de nuevo 💧");
        }
    });

  function setTextO(t: string) { setTexto(t); }
  function handleWin() { 
      setTextO("¡Floreció! 🌻");
      onWin(); 
  }

  const flowerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.instruccion}>{texto}</Text>

      <View style={styles.jardin}>
        {/* La Flor que crece */}
        <Animated.View style={[styles.flor, flowerStyle]}>
            <Text style={{fontSize: 100}}>🌻</Text>
        </Animated.View>
        <Text style={{fontSize: 100, position:'absolute', bottom: -20, zIndex:-1}}>🕳️</Text>
      </View>

      {/* Botón Regadera */}
      <GestureDetector gesture={longPress}>
        <View style={styles.botonRegar}>
            <Text style={{fontSize: 50}}>🚿</Text>
            <Text style={{color:'#FFF', fontWeight:'bold'}}>MANTÉN</Text>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E0F7FA', paddingVertical: 50 },
  instruccion: { fontSize: 20, fontWeight: 'bold', color: '#0097A7', textAlign: 'center' },
  jardin: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flor: { marginBottom: 20 },
  botonRegar: { backgroundColor: '#00ACC1', width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', elevation: 5, borderWidth: 4, borderColor: '#FFF' },
});