import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Componente auxiliar para una galleta arrastrable
const Galleta = ({ onDrop, index }: { onDrop: (index: number) => void, index: number }) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const visible = useSharedValue(1); // 1 = visible, 0 = comida

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY;
    })
    .onEnd((e) => {
      // Lógica simple: Si se arrastró hacia arriba (donde están los amigos)
      if (e.translationY < -150) { 
        visible.value = withSpring(0);
        runOnJS(onDrop)(index);
      } else {
        x.value = withSpring(0);
        y.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: visible.value }],
    opacity: visible.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.galleta, style]}>
        <Text style={{ fontSize: 50 }}>🍪</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function JuegoGenerosidad({ onWin }: { onWin: () => void }) {
  const [comidas, setComidas] = useState(0);

  const handleDrop = () => {
    const nuevasComidas = comidas + 1;
    setComidas(nuevasComidas);
    if (nuevasComidas >= 2) {
      setTimeout(() => onWin(), 1000);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.instruccion}>¡Dale una galleta a cada amigo!</Text>

      {/* Amigos (Zona de destino arriba) */}
      <View style={styles.zonaAmigos}>
        <View style={styles.amigo}>
           <Text style={{ fontSize: 60 }}>{comidas > 0 ? '😋' : '😮'}</Text>
        </View>
        <View style={styles.amigo}>
           <Text style={{ fontSize: 60 }}>{comidas > 1 ? '😋' : '😮'}</Text>
        </View>
      </View>

      {/* Galletas (Zona de inicio abajo) */}
      <View style={styles.zonaGalletas}>
        {comidas < 2 && (
            <>
             <Galleta index={1} onDrop={handleDrop} />
             <Galleta index={2} onDrop={handleDrop} />
            </>
        )}
        {comidas >= 2 && <Text style={{fontSize: 30}}>¡Qué generoso!</Text>}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#FFF3E0', paddingTop: 60 },
  instruccion: { fontSize: 22, fontWeight: 'bold', color: '#FF9800', marginBottom: 30 },
  zonaAmigos: { flexDirection: 'row', gap: 50, marginBottom: 100 },
  amigo: { alignItems: 'center' },
  zonaGalletas: { flexDirection: 'row', gap: 30 },
  galleta: { zIndex: 10 },
});