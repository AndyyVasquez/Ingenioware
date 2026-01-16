import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const preguntasGenericas = [
  {
    id: 1,
    pregunta: '¿Te gustó la historia?',
    opciones: [
      { id: 'a', texto: '¡Me encantó!', correcto: true },
      { id: 'b', texto: 'Más o menos', correcto: true },
      { id: 'c', texto: 'No mucho', correcto: true },
    ],
  },
  {
    id: 2,
    pregunta: '¿Qué valor aprendimos hoy?',
    opciones: [
      { id: 'a', texto: 'A ser egoístas', correcto: false },
      { id: 'b', texto: 'Algo positivo', correcto: true },
      { id: 'c', texto: 'Nada', correcto: false },
    ],
  },
];

export default function LectorCuentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Recibimos los datos del cuento seleccionado
  const [cuentoData, setCuentoData] = useState<any>(null);
  
  const [paginaActual, setPaginaActual] = useState(0);
  const [leyendo, setLeyendo] = useState(false);
  const [mostrarPreguntas, setMostrarPreguntas] = useState(false);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    if (params.cuentoData) {
      const rawCuento = JSON.parse(params.cuentoData as string);
      
      // Procesar el texto plano para convertirlo en páginas
      const textoCompleto = rawCuento.sinopsis || "Había una vez..."; 

      const oraciones = textoCompleto.split('. ');
      const paginasGeneradas = [];
      let i = 0;
      while (i < oraciones.length) {
        // Agrupamos 2 oraciones por página
        let textoPagina = oraciones[i] + ". ";
        if (oraciones[i+1]) textoPagina += oraciones[i+1] + ".";
        
        paginasGeneradas.push({
            numero: paginasGeneradas.length + 1,
            imagen: rawCuento.emoji || '📖',
            texto: textoPagina
        });
        i += 2;
      }

      // Si el texto era muy corto, aseguramos al menos una página
      if (paginasGeneradas.length === 0) {
          paginasGeneradas.push({ numero: 1, imagen: '📖', texto: textoCompleto });
      }

      setCuentoData({
        ...rawCuento,
        paginas: paginasGeneradas,
        preguntas: preguntasGenericas // Usamos preguntas genéricas por ahora
      });
    }
  }, [params.cuentoData]);

  if (!cuentoData) return null; // O un loading spinner

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
    setLeyendo(!leyendo);
    // Aquí iría el TTS (Text To Speech) real
  };

  const handleRespuesta = (esCorrecta: boolean) => {
    if (esCorrecta) setRespuestasCorrectas(respuestasCorrectas + 1);

    if (preguntaActual < cuentoData.preguntas.length - 1) {
      setTimeout(() => setPreguntaActual(preguntaActual + 1), 500);
    } else {
      setTimeout(() => setMostrarResultado(true), 500);
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
    Alert.alert(
      '¡Felicidades!',
      `Has completado el cuento y ganado ${estrellas} estrellas`,
      [{ text: 'Volver a cuentos', onPress: () => router.back() }]
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
              { width: `${((paginaActual + 1) / cuentoData.paginas.length) * 100}%` },
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
        <View style={[styles.cuentoCard, { backgroundColor: cuentoData.color }]}>
          <View style={styles.paginaNumero}>
            <Text style={styles.paginaNumeroText}>
              {paginaActual + 1} / {cuentoData.paginas.length}
            </Text>
          </View>

          <View style={styles.ilustracionContainer}>
            <Text style={styles.ilustracion}>{paginaActualData?.imagen}</Text>
          </View>

          <View style={styles.textoContainer}>
            <Text style={styles.texto}>{paginaActualData?.texto}</Text>
          </View>
        </View>

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
            <Text style={[styles.navButtonText, esPrimeraPagina && styles.navButtonTextDisabled]}>
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
                  {cuentoData.preguntas[preguntaActual].opciones.map((opcion:any) => (
                    <TouchableOpacity
                      key={opcion.id}
                      style={styles.opcionButton}
                      onPress={() => handleRespuesta(opcion.correcto)}
                    >
                      <Text style={styles.opcionTexto}>{opcion.texto}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.resultadoEmoji}>
                  {calcularEstrellas() === 3 ? '🌟🌟🌟' : '🌟'}
                </Text>
                <Text style={styles.resultadoTitle}>¡Excelente trabajo!</Text>
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
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  closeButton: { padding: 8 },
  progressBarContainer: { flex: 1, height: 8, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#4B0082', borderRadius: 4 },
  audioButton: { width: 40, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  cuentoCard: { borderRadius: 24, padding: 24, minHeight: 500, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5, position: 'relative' },
  paginaNumero: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  paginaNumeroText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  ilustracionContainer: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  ilustracion: { fontSize: 120 },
  textoContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 16, padding: 20 },
  texto: { fontSize: 18, lineHeight: 28, color: '#333', textAlign: 'center', fontWeight: '500' },
  navegacion: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, gap: 8, flex: 1 },
  navButtonDisabled: { opacity: 0.5 },
  navButtonText: { fontSize: 16, fontWeight: '600', color: '#4B0082' },
  navButtonTextDisabled: { color: '#CCC' },
  navButtonNext: { backgroundColor: '#4B0082', justifyContent: 'center' },
  navButtonTextNext: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 30, width: width - 40, maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#4B0082', textAlign: 'center', marginBottom: 24 },
  preguntaTexto: { fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 24, lineHeight: 26, fontWeight: '600' },
  opcionesContainer: { gap: 12, marginBottom: 20 },
  opcionButton: { backgroundColor: '#F5E6D3', padding: 18, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  opcionTexto: { fontSize: 16, color: '#333', textAlign: 'center', fontWeight: '500' },
  resultadoEmoji: { fontSize: 80, textAlign: 'center', marginBottom: 20 },
  resultadoTitle: { fontSize: 28, fontWeight: 'bold', color: '#4B0082', textAlign: 'center', marginBottom: 16 },
  finalizarButton: { backgroundColor: '#4B0082', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  finalizarButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});