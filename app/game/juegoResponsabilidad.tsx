import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Zona de la Caja (Meta)
const CAJA_X = width / 2 - 50; // Centrado
const CAJA_Y = 400;
const RADIO_EXITO = 80; // Qué tan cerca debe estar para ganar

export default function JuegoResponsabilidad({ onWin }: { onWin: () => void }) {
  const [ganado, setGanado] = useState(false);

  // Posición del Juguete (Animada)
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  // Función que se ejecuta cuando soltamos el juguete
  const checkTarget = () => {
    // Calculamos si el juguete está cerca de la caja
    // (Ajuste simple: Distancia desde el punto inicial (0,0) hasta la caja)
    // Nota: En un juego real, ajustarías coordenadas relativas. 
    // Aquí asumimos que la caja está abajo y el juguete empieza arriba.
    
    const distanciaX = Math.abs(translationX.value - 0); // El juguete empieza en 0 (centro horizontal)
    const distanciaY = Math.abs(translationY.value - 250); // Distancia vertical aproximada a la caja

    // Lógica simplificada: Si bajó más de 200 pixeles, entra en la caja
    if (translationY.value > 200) {
      setGanado(true);
      if(onWin) onWin();
    } else {
      // Si no le atinó, regresa al inicio (rebote)
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    }
  };

  // Configuración del Gesto (Pan = Arrastrar)
  const pan = Gesture.Pan()
    .onStart(() => {
      contextX.value = translationX.value;
      contextY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = event.translationX + contextX.value;
      translationY.value = event.translationY + contextY.value;
    })
    .onEnd(() => {
      runOnJS(checkTarget)();
    });

  // Estilo animado para el juguete
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: withSpring(ganado ? 0 : 1) } // Si gana, el juguete desaparece (entra a la caja)
      ],
      opacity: withSpring(ganado ? 0 : 1)
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.instruccion}>¡Arrastra el oso a la caja!</Text>

      {/* El Juguete (Movible) */}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.juguete, animatedStyle]}>
          <Text style={{fontSize: 60}}>🧸</Text>
        </Animated.View>
      </GestureDetector>

      {/* La Caja (Fija) */}
      <View style={styles.cajaContainer}>
        <Text style={{fontSize: 80}}>{ganado ? '✨📦✨' : '📦'}</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50
  },
  instruccion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 50
  },
  juguete: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Para que esté encima de todo
  },
  cajaContainer: {
    position: 'absolute',
    bottom: 100, // Posición fija abajo
    justifyContent: 'center',
    alignItems: 'center',
  }
});