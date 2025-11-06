import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Datos del cuento (esto vendrá de tu backend)
const cuentoData = {
  id: 1,
  titulo: 'El León Valiente',
  valor: 'Valentía',
  emoji: '🦁',
  color: '#FFB84D',
  paginas: [
    {
      numero: 1,
      imagen: '🌳',
      texto: 'Había una vez un pequeño león llamado Leo que vivía en la gran sabana. Todos los días, Leo veía a los demás animales hacer cosas increíbles, pero él sentía mucho miedo.',
    },
    {
      numero: 2,
      imagen: '😰',
      texto: 'Leo tenía miedo de la oscuridad, miedo de los truenos, y sobre todo, miedo de no ser lo suficientemente valiente como los demás leones.',
    },
    {
      numero: 3,
      imagen: '🐰',
      texto: 'Un día, escuchó un grito de ayuda. Era un conejito atrapado cerca del río. Leo sintió miedo, pero sabía que tenía que ayudar.',
    },
    {
      numero: 4,
      imagen: '💪',
      texto: 'Aunque sus patas temblaban, Leo corrió hacia el río. Con mucho cuidado, ayudó al conejito a salir. ¡Lo había logrado!',
    },
    {
      numero: 5,
      imagen: '🌟',
      texto: 'Leo aprendió que ser valiente no significa no tener miedo, sino hacer lo correcto aunque tengas miedo. ¡Todos pueden ser valientes!',
    },
  ],
  preguntas: [
    {
      id: 1,
      pregunta: '¿Qué le daba miedo a Leo?',
      opciones: [
        { id: 'a', texto: 'La oscuridad y los truenos', correcto: true },
        { id: 'b', texto: 'Los otros animales', correcto: false },
        { id: 'c', texto: 'El agua', correcto: false },
      ],
    },
    {
      id: 2,
      pregunta: '¿Qué hizo Leo cuando escuchó el grito de ayuda?',
      opciones: [
        { id: 'a', texto: 'Se escondió', correcto: false },
        { id: 'b', texto: 'Corrió a ayudar aunque tenía miedo', correcto: true },
        { id: 'c', texto: 'Llamó a otros leones', correcto: false },
      ],
    },
  ],
};

export default function LectorCuentoScreen() {
  const router = useRouter();
  const [paginaActual, setPaginaActual] = useState(0);
  const [leyendo, setLeyendo] = useState(false);
  const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const paginaActualData = cuentoData.paginas[paginaActual];
  const esUltimaPagina = paginaActual === cuentoData.paginas.length - 1;
  const esPrimeraPagina = paginaActual === 0;

  const handleSiguiente = () => {
    if (esUltimaPagina) {
      setMostrarPreguntas(true);
    } else {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handleAnterior = () => {
    if (!esPrimeraPagina) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleLeerAudio = () => {
    setLeyendo(true);
    // Aquí irá la lógica de text-to-speech
    Alert.alert('Audio', 'Reproduciendo narración...');
    setTimeout(() => setLeyendo(false), 2000);
  };

  const handleRespuesta = (esCorrecta: boolean) => {
    if (esCorrecta) {
      setRespuestasCorrectas(respuestasCorrectas + 1);
    }

    if (preguntaActual < cuentoData.preguntas.length - 1) {
      setTimeout(() => {
        setPreguntaActual(preguntaActual + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setMostrarResultado(true);
      }, 500);
    }
  };

  const calcularEstrellas = () => {
    const porcentaje = (respuestasCorrectas / cuentoData.preguntas.length) * 100;
    if (porcentaje === 100) return 3;
    if (porcentaje >= 50) return 2;
    return 1;
  };

  const handleFinalizarCuento = () => {
    const estrellas = calcularEstrellas();
    // Aquí guardarías el progreso
    Alert.alert(
      '¡Felicidades!',
      `Has completado el cuento y ganado ${estrellas} estrellas`,
      [
        {
          text: 'Volver a cuentos',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((paginaActual + 1) / cuentoData.paginas.length) * 100}%`,
              },
            ]}
          />
        </View>
        <TouchableOpacity style={styles.audioButton} onPress={handleLeerAudio}>
          <Ionicons
            name={leyendo ? 'pause' : 'volume-high'}
            size={24}
            color="#4B0082"
          />
        </TouchableOpacity>
      </View>

      {/* Contenido del Cuento */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Tarjeta del cuento */}
        <View style={[styles.cuentoCard, { backgroundColor: cuentoData.color }]}>
          {/* Número de página */}
          <View style={styles.paginaNumero}>
            <Text style={styles.paginaNumeroText}>
              {paginaActual + 1} / {cuentoData.paginas.length}
            </Text>
          </View>

          {/* Ilustración (emoji grande) */}
          <View style={styles.ilustracionContainer}>
            <Text style={styles.ilustracion}>{paginaActualData.imagen}</Text>
          </View>

          {/* Texto del cuento */}
          <View style={styles.textoContainer}>
            <Text style={styles.texto}>{paginaActualData.texto}</Text>
          </View>
        </View>

        {/* Botones de navegación */}
        <View style={styles.navegacion}>
          <TouchableOpacity
            style={[styles.navButton, esPrimeraPagina && styles.navButtonDisabled]}
            onPress={handleAnterior}
            disabled={esPrimeraPagina}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={esPrimeraPagina ? '#CCC' : '#4B0082'}
            />
            <Text
              style={[
                styles.navButtonText,
                esPrimeraPagina && styles.navButtonTextDisabled,
              ]}
            >
              Anterior
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonNext]}
            onPress={handleSiguiente}
          >
            <Text style={styles.navButtonTextNext}>
              {esUltimaPagina ? '¡Terminar!' : 'Siguiente'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Preguntas */}
      <Modal visible={mostrarPreguntas} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!mostrarResultado ? (
              <>
                <Text style={styles.modalTitle}>¡Responde las preguntas!</Text>
                <Text style={styles.preguntaTexto}>
                  {cuentoData.preguntas[preguntaActual].pregunta}
                </Text>

                <View style={styles.opcionesContainer}>
                  {cuentoData.preguntas[preguntaActual].opciones.map((opcion) => (
                    <TouchableOpacity
                      key={opcion.id}
                      style={styles.opcionButton}
                      onPress={() => handleRespuesta(opcion.correcto)}
                    >
                      <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.preguntaNumero}>
                  Pregunta {preguntaActual + 1} de {cuentoData.preguntas.length}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.resultadoEmoji}>
                  {calcularEstrellas() === 3 ? '🌟🌟🌟' : calcularEstrellas() === 2 ? '🌟🌟' : '🌟'}
                </Text>
                <Text style={styles.resultadoTitle}>¡Excelente trabajo!</Text>
                <Text style={styles.resultadoTexto}>
                  Respondiste correctamente {respuestasCorrectas} de{' '}
                  {cuentoData.preguntas.length} preguntas
                </Text>
                <Text style={styles.resultadoMensaje}>
                  {calcularEstrellas() === 3
                    ? '¡Eres increíble! Aprendiste una gran lección.'
                    : calcularEstrellas() === 2
                    ? '¡Muy bien! Seguiste la historia con atención.'
                    : '¡Buen intento! Puedes volver a leer el cuento.'}
                </Text>

                <TouchableOpacity
                  style={styles.finalizarButton}
                  onPress={handleFinalizarCuento}
                >
                  <Text style={styles.finalizarButtonText}>Continuar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  closeButton: {
    padding: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4B0082',
    borderRadius: 4,
  },
  audioButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cuentoCard: {
    borderRadius: 24,
    padding: 24,
    minHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  paginaNumero: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paginaNumeroText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ilustracionContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  ilustracion: {
    fontSize: 120,
  },
  textoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
  },
  texto: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  navegacion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B0082',
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  navButtonNext: {
    backgroundColor: '#4B0082',
    justifyContent: 'center',
  },
  navButtonTextNext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    width: width - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 24,
  },
  preguntaTexto: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
    fontWeight: '600',
  },
  opcionesContainer: {
    gap: 12,
    marginBottom: 20,
  },
  opcionButton: {
    backgroundColor: '#F5E6D3',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opcionTexto: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  preguntaNumero: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultadoEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultadoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultadoTexto: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultadoMensaje: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  finalizarButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finalizarButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});