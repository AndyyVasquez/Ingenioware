import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Opcion {
  texto: string;
  siguienteId: number;
}

interface Escena {
  id: number;
  texto: string;
  opciones?: Opcion[];
  desbloquea?: boolean; // <--- NUEVO
}

interface Escenario {
  titulo: string;
  color: string;
  icono: string;
  escenas: Escena[];
}

// --- Base de datos de Escenarios (Actualizada) ---
// --- Base de datos de Escenarios (¡Actualizada con todos los niveles!) ---
const escenariosDB: { [key: string]: Escenario } = {
  // --- Nivel 1: Honestidad ---
  honestidad: {
    titulo: 'La Cueva de la Honestidad',
    color: '#4ECDC4',
    icono: 'shield-checkmark',
    escenas: [
      {
        id: 0,
        texto: '¡Valo y tú están jugando en el parque y encuentran una billetera en el suelo! ¿Qué hacen?',
        opciones: [
          { texto: 'La abrimos para ver qué hay', siguienteId: 1 },
          { texto: 'La dejamos donde está', siguienteId: 2 },
          { texto: 'Buscamos a un adulto', siguienteId: 3 },
        ],
      },
      {
        id: 1,
        texto: 'Dentro hay dinero. Valo dice que podrían comprar muchos dulces. ¿La guardan?',
        opciones: [
          { texto: '¡Sí, dulces!', siguienteId: 4 },
          { texto: 'No, es de alguien más', siguienteId: 3 },
        ],
      },
      {
        id: 2,
        texto: 'Deciden ignorarla. Más tarde, ven a una señora llorando porque perdió su billetera.',
        opciones: [
          { texto: 'Qué triste. Fin.', siguienteId: 5 },
        ],
      },
      {
        id: 3,
        texto: '¡Buena idea! Le dan la billetera a un guardia del parque. ¡Él encuentra a la dueña y les da las gracias!',
        opciones: [
          { texto: '¡Genial! Fin.', siguienteId: 6 },
        ],
      },
      {
        id: 4,
        texto: 'Compran los dulces, pero luego Valo se siente mal. Su pancita le duele de culpa.',
        opciones: [
          { texto: 'Oh, no. Fin.', siguienteId: 5 },
        ],
      },
      { id: 5, texto: 'Fin de la aventura (Resultado Neutral/Negativo)' },
      { 
        id: 6, 
        texto: 'Fin de la aventura (¡Resultado Positivo!)',
        desbloquea: true // Desbloquea Empatía
      },
    ],
  },

  // --- Nivel 2: Empatía ---
  empatia: {
    titulo: 'El Puente de la Empatía',
    color: '#FF6B6B',
    icono: 'heart',
    escenas: [
      {
        id: 0,
        texto: 'Estás en el recreo y ves a tu amigo Leo sentado solo en una banca. Se ve triste. ¿Qué haces?',
        opciones: [
          { texto: 'Seguir jugando. Es su problema.', siguienteId: 1 },
          { texto: 'Ir a preguntarle qué le pasa.', siguienteId: 2 },
        ],
      },
      {
        id: 1,
        texto: 'Sigues jugando. El recreo termina y Leo sigue solo. Fin.',
        opciones: [
          { texto: 'Volver al mapa', siguienteId: 5 },
        ],
      },
      {
        id: 2,
        texto: 'Te acercas. "Extraño a mi abuelita", te dice. ¿Qué haces?',
        opciones: [
          { texto: 'Le das un abrazo y lo invitas a jugar.', siguienteId: 3 },
          { texto: 'Le dices "qué aburrido" y te vas.', siguienteId: 1 },
        ],
      },
      {
        id: 3,
        texto: 'Tu abrazo lo hace sentir mejor. Juegan juntos y se divierten. ¡Ayudar a un amigo se siente muy bien!',
        opciones: [
          { texto: '¡Genial! Fin.', siguienteId: 6 },
        ],
      },
      { id: 5, texto: 'Fin de la aventura.' },
      { 
        id: 6, 
        texto: '¡Felicidades! Entendiste cómo se sentía tu amigo.',
        desbloquea: true // Desbloquea Generosidad
      },
    ],
  },

  // --- Nivel 3: Generosidad ---
  generosidad: {
    titulo: 'El Árbol de la Generosidad',
    color: '#FFD93D',
    icono: 'gift',
    escenas: [
      {
        id: 0,
        texto: '¡Valo te da dos galletas! Son tus favoritas. Justo llega tu amiga Ana y te ve. ¿Qué haces?',
        opciones: [
          { texto: 'Comerte las dos rápido.', siguienteId: 1 },
          { texto: 'Darle una galleta a Ana.', siguienteId: 2 },
        ],
      },
      {
        id: 1,
        texto: 'Te comes todo. Ana se pone triste y se va. Valo te mira raro. Tu panza está muy llena. Fin.',
        opciones: [
          { texto: 'Volver al mapa', siguienteId: 5 },
        ],
      },
      {
        id: 2,
        texto: '¡Decides compartir! Le das una galleta a Ana. "¡Gracias!", dice feliz. Comen juntos y saben más ricas.',
        opciones: [
          { texto: '¡Qué bien! Fin.', siguienteId: 6 },
        ],
      },
      { id: 5, texto: 'Fin de la aventura.' },
      { 
        id: 6, 
        texto: '¡Qué bien se siente compartir!',
        desbloquea: true // Desbloquea Responsabilidad
      },
    ],
  },

  // --- Nivel 4: Responsabilidad ---
  responsabilidad: {
    titulo: 'La Montaña de la Responsabilidad',
    color: '#A06CD5',
    icono: 'rocket',
    escenas: [
      {
        id: 0,
        texto: 'Estás pintando con Valo. ¡Es muy divertido! Pero mancharon toda la mesa. Mamá dice: "¡Hora de guardar!". ¿Qué haces?',
        opciones: [
          { texto: 'Salir corriendo a jugar.', siguienteId: 1 },
          { texto: 'Ayudar a Valo a limpiar.', siguienteId: 2 },
        ],
      },
      {
        id: 1,
        texto: 'Dejas todo tirado. Mamá tiene que limpiar y se siente triste. Valo también está triste. Fin.',
        opciones: [
          { texto: 'Volver al mapa', siguienteId: 5 },
        ],
      },
      {
        id: 2,
        texto: '¡Decides ayudar! Guardan las pinturas y limpian la mesa. ¡Quedó reluciente! Mamá te felicita.',
        opciones: [
          { texto: '¡Lo logramos! Fin.', siguienteId: 6 },
        ],
      },
      { id: 5, texto: 'Fin de la aventura.' },
      { 
        id: 6, 
        texto: '¡Cuidar tus cosas es de grandes! ¡Completaste la Isla de Valores!',
        desbloquea: true // Ya es el último, pero mantenemos el patrón
      },
    ],
  },
};
// ---------------------------------
// ---------------------------------

export default function JuegoInteractivoScreen() {
  const router = useRouter();
  const { valor } = useLocalSearchParams(); 
  
  const [escenario, setEscenario] = useState<Escenario | null>(null);
  const [escenaActual, setEscenaActual] = useState<Escena | null>(null);

  useEffect(() => {
    const scn = escenariosDB[valor as string];
    if (scn) {
      setEscenario(scn);
      setEscenaActual(scn.escenas[0]);
    } else {
      Alert.alert('Error', 'Juego no encontrado', [{ text: 'OK', onPress: () => router.back() }]);
    }
  }, [valor]);

  // --- NUEVA FUNCIÓN ---
  const guardarProgreso = async () => {
    if (!valor) return;
    try {
      const progresoStr = await AsyncStorage.getItem('progresoJuegos');
      let progreso: string[] = progresoStr ? JSON.parse(progresoStr) : [];
      
      const valorId = valor as string;
      if (!progreso.includes(valorId)) {
        progreso.push(valorId);
        await AsyncStorage.setItem('progresoJuegos', JSON.stringify(progreso));
        console.log('¡Progreso guardado!', progreso);
      }
    } catch (error) {
      console.error('Error guardando el progreso:', error);
    }
  };

  const handleOpcionPress = async (opcion: Opcion) => { // <-- Se vuelve async
    if (!escenario) return;

    if (!opcion.siguienteId && opcion.siguienteId !== 0) {
      router.back(); 
      return;
    }

    const siguienteEscena = escenario.escenas.find(
      (e: Escena) => e.id === opcion.siguienteId
    );
    
    if (siguienteEscena) {
      setEscenaActual(siguienteEscena);

      // --- LÓGICA DE DESBLOQUEO ---
      if (siguienteEscena.desbloquea) {
        await guardarProgreso(); // Guardamos el progreso
      }
      // ---------------------------

    } else {
      const escenaFinal = escenario.escenas.find(e => e.id === opcion.siguienteId);
      if (escenaFinal) {
        setEscenaActual(escenaFinal);
        if (escenaFinal.desbloquea) { // Checamos también aquí
          await guardarProgreso();
        }
      } else {
        router.back();
      }
    }
  };

  if (!escenaActual || !escenario) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.loadingContenedor}>
        <ActivityIndicator size="large" color="#4B0082" />
      </LinearGradient>
    );
  }

  const esEscenaFinal = !escenaActual.opciones || escenaActual.opciones.length === 0;

  return (
    // ... (El JSX de return no cambia en nada)
    <LinearGradient colors={['#B8D4E0', escenario.color + '60']} style={styles.contenedor}>
      
      <View style={styles.encabezado}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titulo}>{escenario.titulo}</Text>
      </View>

      <View style={styles.contenido}>
        <View style={styles.avatarContenedor}>
          <Text style={styles.avatarEmoji}>🐻</Text>
          <Text style={styles.avatarNombre}>Valo</Text>
        </View>

        <View style={styles.burbujaDialogo}>
          <Text style={styles.textoDialogo}>{escenaActual.texto}</Text>
        </View>
      </View>

      <View style={styles.opcionesContenedor}>
        {esEscenaFinal ? (
          <TouchableOpacity
            style={[styles.botonOpcion, { backgroundColor: escenario.color }]}
            onPress={() => router.back()}
          >
            <Text style={styles.textoOpcion}>Volver al mapa</Text>
          </TouchableOpacity>
        ) : (
          escenaActual.opciones!.map((opcion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.botonOpcion, { backgroundColor: '#FFF' }]}
              onPress={() => handleOpcionPress(opcion)}
            >
              <Text style={[styles.textoOpcion, { color: '#4B0082' }]}>
                {opcion.texto}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </LinearGradient>
  );
}

// --- ESTILOS (Sin cambios) ---
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'space-between',
  },
  loadingContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  encabezado: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  botonVolver: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContenedor: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarEmoji: {
    fontSize: 100,
  },
  avatarNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B0082',
    marginTop: -10,
  },
  burbujaDialogo: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textoDialogo: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    textAlign: 'center',
  },
  opcionesContenedor: {
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    gap: 12,
  },
  botonOpcion: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoOpcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});