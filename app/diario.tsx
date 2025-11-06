import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

interface Pregunta {
  id: number;
  texto: string;
  tipo: 'inicio' | 'seguimiento' | 'cierre';
  placeholder: string;
}

const preguntasBase: Pregunta[] = [
  {
    id: 1,
    texto: '¡Hola! Soy Valo, tu amigo osito. ¿Cómo te sientes hoy?',
    tipo: 'inicio',
    placeholder: 'Cuéntame cómo te sientes...',
  },
  {
    id: 2,
    texto: '¿Pasó algo especial hoy que te hizo sentir así?',
    tipo: 'seguimiento',
    placeholder: 'Cuéntame qué pasó...',
  },
  {
    id: 3,
    texto: '¿Hay algo más que quieras contarme?',
    tipo: 'seguimiento',
    placeholder: 'Escribe aquí si quieres...',
  },
];

export default function DiarioScreen() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [respuestaActual, setRespuestaActual] = useState('');
  const [grabando, setGrabando] = useState(false);
  const [emocionSeleccionada, setEmocionSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    const cargarEmocion = async () => {
      try {
        const emocionStr = await AsyncStorage.getItem('emocionTemporal');
        if (emocionStr) {
          const emocionData = JSON.parse(emocionStr);
          setEmocionSeleccionada(emocionData.id);
        }
      } catch (error) {
        console.error('Error cargando emoción temporal:', error);
      }
    };
    cargarEmocion();
  }, []);

  const pregunta = preguntasBase[preguntaActual];
  const esUltimaPregunta = preguntaActual === preguntasBase.length - 1;

  let textoPreguntaDinamica = pregunta.texto;
  if (preguntaActual === 0 && emocionSeleccionada) {
    textoPreguntaDinamica = `¡Hola! Veo que te sientes ${emocionSeleccionada}. ¿Quieres contarme por qué?`;
  }

  const handleSiguiente = () => {
    const nuevasRespuestas = [...respuestas, respuestaActual];
    setRespuestas(nuevasRespuestas);

    if (esUltimaPregunta) {
      guardarEntrada(nuevasRespuestas);
    } else {
      setPreguntaActual(preguntaActual + 1);
      setRespuestaActual('');
    }
  };

  const handleSaltar = () => {
    if (esUltimaPregunta) {
      guardarEntrada(respuestas);
    } else {
      const nuevasRespuestas = [...respuestas, ''];
      setRespuestas(nuevasRespuestas);
      setPreguntaActual(preguntaActual + 1);
      setRespuestaActual('');
    }
  };

  const guardarEntrada = async (respuestasFinales: string[]) => {
    try {
      const entrada = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        emocion: emocionSeleccionada || 'neutral',
        respuestas: respuestasFinales,
        alertaNivel: analizarEntrada(respuestasFinales),
      };

      const entradasPrevias = await AsyncStorage.getItem('entradasDiario');
      const entradas = entradasPrevias ? JSON.parse(entradasPrevias) : [];
      entradas.unshift(entrada);
      
      await AsyncStorage.setItem('entradasDiario', JSON.stringify(entradas));
      await AsyncStorage.removeItem('emocionTemporal');

      if (entrada.alertaNivel > 0) {
        await notificarPadre(entrada);
      }

      Alert.alert(
        '¡Gracias por compartir! 💚',
        'Me encanta que confíes en mí. Eres muy valiente por expresar cómo te sientes.',
        [
          {
            text: 'Ver mi calendario',
            onPress: () => router.replace('/resumenEmocional'),
          },
          {
            text: 'Volver al inicio',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error guardando entrada:', error);
      Alert.alert('Error', 'No se pudo guardar tu entrada. Intenta de nuevo.');
    }
  };

  const analizarEntrada = (respuestasFinales: string[]): number => {
    const textoCompleto = respuestasFinales.join(' ').toLowerCase();

    const keywordsCriticas = [
      'nadie me quiere',
      'me pegan',
      'me duele mucho',
      'tengo miedo',
      'me hacen daño',
      'estoy solo',
      'me lastiman',
    ];

    const keywordsModeradas = [
      'triste',
      'enojado',
      'mal',
      'no quiero',
      'me molestan',
      'lloré',
      'pelea',
      'gritaron',
    ];

    if (keywordsCriticas.some((keyword) => textoCompleto.includes(keyword))) {
      return 2;
    }

    if (keywordsModeradas.some((keyword) => textoCompleto.includes(keyword))) {
      return 1;
    }

    return 0;
  };

  const notificarPadre = async (entrada: any) => {
    try {
      const alertasStr = await AsyncStorage.getItem('alertasEmocionales');
      const alertas = alertasStr ? JSON.parse(alertasStr) : [];

      alertas.unshift({
        id: entrada.id,
        fecha: entrada.fecha,
        emocion: entrada.emocion,
        nivel: entrada.alertaNivel,
        vista: false,
        atendida: false,
      });

      await AsyncStorage.setItem('alertasEmocionales', JSON.stringify(alertas));
    } catch (error) {
      console.error('Error notificando al padre:', error);
    }
  };

  const handleGrabarAudio = () => {
    setGrabando(!grabando);
    Alert.alert(
      'Función de Audio',
      'La grabación de audio se implementará próximamente',
      [{ text: 'OK' }]
    );
  };

  const handleCerrar = async () => {
    try {
      await AsyncStorage.removeItem('emocionTemporal');
    } catch (error) {
      console.error('Error limpiando emoción temporal:', error);
    }
    router.back();
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={estilos.contenedor}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={estilos.vistaEvitarTeclado}
      >
        <View style={estilos.encabezado}>
          <TouchableOpacity
            style={estilos.botonCerrar}
            onPress={handleCerrar}
          >
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <View style={estilos.indicadorProgreso}>
            <View
              style={[
                estilos.barraProgreso,
                {
                  width: `${((preguntaActual + 1) / preguntasBase.length) * 100}%`,
                },
              ]}
            />
          </View>
          <View style={estilos.espacioVacio} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.contenidoScroll}
        >
          <View style={estilos.contenedorBerto}>
            <View style={estilos.burbujaOsito}>
              <Text style={estilos.emojiOsito}>🐻</Text>
            </View>
            <Text style={estilos.nombreOsito}>Valo</Text>
          </View>

          <View style={estilos.tarjetaPregunta}>
            <Text style={estilos.textoPregunta}>{textoPreguntaDinamica}</Text>
          </View>

          <View style={estilos.contenedorRespuesta}>
            <TextInput
              style={estilos.inputRespuesta}
              placeholder={pregunta.placeholder}
              placeholderTextColor="#999"
              value={respuestaActual}
              onChangeText={setRespuestaActual}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={estilos.opcionesEntrada}>
              <TouchableOpacity
                style={[
                  estilos.botonOpcion,
                  grabando && estilos.botonOpcionActivo,
                ]}
                onPress={handleGrabarAudio}
              >
                <Ionicons
                  name={grabando ? 'stop-circle' : 'mic'}
                  size={24}
                  color={grabando ? '#FF6B6B' : '#4B0082'}
                />
                <Text style={estilos.textoOpcion}>
                  {grabando ? 'Detener' : 'Grabar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.botonOpcion}
                onPress={() =>
                  Alert.alert(
                    'Dibujar',
                    'La función de dibujo se implementará próximamente',
                    [{ text: 'OK' }]
                  )
                }
              >
                <Ionicons name="brush" size={24} color="#4B0082" />
                <Text style={estilos.textoOpcion}>Dibujar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={estilos.mensajeMotivacional}>
            <Ionicons name="heart" size={20} color="#FF6B6B" />
            <Text style={estilos.textoMotivacional}>
              No hay respuestas correctas o incorrectas. Puedes contarme lo que
              sientes.
            </Text>
          </View>
        </ScrollView>

        <View style={estilos.contenedorBotones}>
          <TouchableOpacity
            style={estilos.botonSaltar}
            onPress={handleSaltar}
          >
            <Text style={estilos.textoSaltar}>Saltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botonSiguiente,
              (!respuestaActual && preguntaActual > 0) &&
                estilos.botonSiguienteDeshabilitado,
            ]}
            onPress={handleSiguiente}
            disabled={!respuestaActual && preguntaActual > 0}
          >
            <Text style={estilos.textoSiguiente}>
              {esUltimaPregunta ? '¡Terminar!' : 'Siguiente'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  vistaEvitarTeclado: {
    flex: 1,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  botonCerrar: {
    padding: 8,
  },
  indicadorProgreso: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraProgreso: {
    height: '100%',
    backgroundColor: '#4B0082',
    borderRadius: 4,
  },
  espacioVacio: {
    width: 40,
  },
  contenidoScroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contenedorBerto: {
    alignItems: 'center',
    marginBottom: 30,
  },
  burbujaOsito: {
    width: 100,
    height: 100,
    backgroundColor: '#FFE4B5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emojiOsito: {
    fontSize: 60,
  },
  nombreOsito: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B0082',
  },
  tarjetaPregunta: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textoPregunta: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  botonSeleccionarEmocion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8D5FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4B0082',
    borderStyle: 'dashed',
  },
  textoBotonEmocion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#4B0082',
    marginLeft: 12,
  },
  contenedorRespuesta: {
    marginBottom: 24,
  },
  inputRespuesta: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#333',
    minHeight: 150,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  opcionesEntrada: {
    flexDirection: 'row',
    gap: 12,
  },
  botonOpcion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botonOpcionActivo: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  textoOpcion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B0082',
  },
  mensajeMotivacional: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  textoMotivacional: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contenedorBotones: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(184, 212, 224, 0.95)',
    gap: 12,
  },
  botonSaltar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoSaltar: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  botonSiguiente: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#4B0082',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  botonSiguienteDeshabilitado: {
    backgroundColor: '#CCC',
  },
  textoSiguiente: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});