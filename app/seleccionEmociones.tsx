import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Emocion {
  id: string;
  nombre: string;
  emoji: string;
  color: string;
  descripcion: string;
  sensacionFisica: string;
  nivel: 1 | 2 | 3;
}

const emociones: Emocion[] = [
  {
    id: 'feliz',
    nombre: 'Feliz',
    emoji: '😊',
    color: '#4CAF50',
    descripcion: 'Cuando algo te gusta mucho y quieres sonreír',
    sensacionFisica: 'Siento mariposas en la panza',
    nivel: 1,
  },
  {
    id: 'triste',
    nombre: 'Triste',
    emoji: '😔',
    color: '#607D8B',
    descripcion: 'Cuando algo te pone mal y quieres llorar',
    sensacionFisica: 'Siento el pecho pesado',
    nivel: 1,
  },
  {
    id: 'enojado',
    nombre: 'Enojado',
    emoji: '😤',
    color: '#F44336',
    descripcion: 'Cuando algo te molesta mucho',
    sensacionFisica: 'Siento calor en la cara',
    nivel: 1,
  },
  {
    id: 'asustado',
    nombre: 'Asustado',
    emoji: '😨',
    color: '#9C27B0',
    descripcion: 'Cuando algo te da miedo',
    sensacionFisica: 'Siento que mi corazón late rápido',
    nivel: 1,
  },
  {
    id: 'cansado',
    nombre: 'Cansado',
    emoji: '😴',
    color: '#795548',
    descripcion: 'Cuando tu cuerpo necesita descansar',
    sensacionFisica: 'Siento los ojos pesados',
    nivel: 1,
  },
  {
    id: 'preocupado',
    nombre: 'Preocupado',
    emoji: '😟',
    color: '#FF9800',
    descripcion: 'Cuando piensas que algo malo puede pasar',
    sensacionFisica: 'Siento un nudo en el estómago',
    nivel: 2,
  },
  {
    id: 'frustrado',
    nombre: 'Frustrado',
    emoji: '😣',
    color: '#E91E63',
    descripcion: 'Cuando algo no sale como querías',
    sensacionFisica: 'Siento que quiero gritar',
    nivel: 2,
  },
  {
    id: 'orgulloso',
    nombre: 'Orgulloso',
    emoji: '🤗',
    color: '#FFD700',
    descripcion: 'Cuando hiciste algo muy bien',
    sensacionFisica: 'Siento que crezco por dentro',
    nivel: 2,
  },
  {
    id: 'avergonzado',
    nombre: 'Avergonzado',
    emoji: '😳',
    color: '#FF7043',
    descripcion: 'Cuando algo te da pena',
    sensacionFisica: 'Siento la cara caliente',
    nivel: 2,
  },
  {
    id: 'ansioso',
    nombre: 'Ansioso',
    emoji: '😰',
    color: '#00BCD4',
    descripcion: 'Cuando te preocupas por muchas cosas a la vez',
    sensacionFisica: 'Siento que no puedo estar quieto',
    nivel: 3,
  },
  {
    id: 'confundido',
    nombre: 'Confundido',
    emoji: '😕',
    color: '#9E9E9E',
    descripcion: 'Cuando no entiendes algo',
    sensacionFisica: 'Siento la cabeza nublada',
    nivel: 3,
  },
  {
    id: 'emocionado',
    nombre: 'Emocionado',
    emoji: '🤩',
    color: '#FF6F00',
    descripcion: 'Cuando algo increíble va a pasar',
    sensacionFisica: 'Siento energía en todo el cuerpo',
    nivel: 3,
  },
];

export default function SeleccionEmocionesScreen() {
  const router = useRouter();
  const [emocionSeleccionada, setEmocionSeleccionada] = useState<Emocion | null>(null);
  const [nivelMostrar, setNivelMostrar] = useState<1 | 2 | 3>(1);

  const emocionesFiltradas = emociones.filter((e) => e.nivel <= nivelMostrar);

  const handleSeleccionarEmocion = async (emocion: Emocion) => {
    setEmocionSeleccionada(emocion);

    try {
      await AsyncStorage.setItem('emocionTemporal', JSON.stringify(emocion));
      
      setTimeout(() => {
        router.push('./diario');
      }, 500);
    } catch (error) {
      console.error('Error guardando emoción:', error);
    }
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <TouchableOpacity
          style={estilos.botonVolver}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={estilos.titulo}>¿Cómo te sientes?</Text>
        <View style={estilos.espacioVacio} />
      </View>

      <View style={estilos.tarjetaInstrucciones}>
        <Text style={estilos.emojiInstrucciones}>💭</Text>
        <Text style={estilos.textoInstrucciones}>
          Toca la carita que mejor describe cómo te sientes hoy
        </Text>
      </View>

      <View style={estilos.contenedorNiveles}>
        <TouchableOpacity
          style={[estilos.botonNivel, nivelMostrar >= 1 && estilos.botonNivelActivo]}
          onPress={() => setNivelMostrar(1)}
        >
          <Text style={[estilos.textoNivel, nivelMostrar >= 1 && estilos.textoNivelActivo]}>Básico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botonNivel, nivelMostrar >= 2 && estilos.botonNivelActivo]}
          onPress={() => setNivelMostrar(2)}
        >
          <Text style={[estilos.textoNivel, nivelMostrar >= 2 && estilos.textoNivelActivo]}>Más emociones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botonNivel, nivelMostrar >= 3 && estilos.botonNivelActivo]}
          onPress={() => setNivelMostrar(3)}
        >
          <Text style={[estilos.textoNivel, nivelMostrar >= 3 && estilos.textoNivelActivo]}>Todas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.contenidoScroll}
      >
        <View style={estilos.gridEmociones}>
          {emocionesFiltradas.map((emocion) => (
            <TouchableOpacity
              key={emocion.id}
              style={[
                estilos.tarjetaEmocion,
                { borderColor: emocion.color },
                emocionSeleccionada?.id === emocion.id &&
                  estilos.tarjetaEmocionSeleccionada,
              ]}
              onPress={() => handleSeleccionarEmocion(emocion)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  estilos.contenedorEmoji,
                  { backgroundColor: emocion.color + '20' },
                ]}
              >
                <Text style={estilos.emojiGrande}>{emocion.emoji}</Text>
              </View>

              <Text style={estilos.nombreEmocion}>{emocion.nombre}</Text>

              <Text style={estilos.descripcionEmocion} numberOfLines={2}>
                {emocion.descripcion}
              </Text>

              {emocionSeleccionada?.id === emocion.id && (
                <View
                  style={[
                    estilos.indicadorSeleccion,
                    { backgroundColor: emocion.color },
                  ]}
                >
                  <Ionicons name="checkmark" size={24} color="#FFF" />
                </View>
              )}

              <TouchableOpacity
                style={estilos.botonInfo}
                onPress={(e) => {
                  e.stopPropagation();
                }}
              >
                <Ionicons name="information-circle" size={20} color="#999" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={estilos.espaciadoInferior} />
      </ScrollView>

      <View style={estilos.contenedorAyuda}>
        <Ionicons name="help-circle" size={20} color="#4B0082" />
        <Text style={estilos.textoAyuda}>
          Si no encuentras la emoción exacta, elige la más parecida
        </Text>
      </View>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  botonVolver: {
    padding: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  espacioVacio: {
    width: 40,
  },
  tarjetaInstrucciones: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiInstrucciones: {
    fontSize: 32,
  },
  textoInstrucciones: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contenedorNiveles: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  botonNivel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonNivelActivo: {
    backgroundColor: '#4B0082',
  },
  textoNivel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  textoNivelActivo: {
    color: '#FFF',
  },
  contenidoScroll: {
    paddingHorizontal: 20,
  },
  gridEmociones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tarjetaEmocion: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    position: 'relative',
  },
  tarjetaEmocionSeleccionada: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.25,
  },
  contenedorEmoji: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emojiGrande: {
    fontSize: 48,
  },
  nombreEmocion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  descripcionEmocion: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  indicadorSeleccion: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  botonInfo: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 4,
  },
  espaciadoInferior: {
    height: 100,
  },
  contenedorAyuda: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  textoAyuda: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});