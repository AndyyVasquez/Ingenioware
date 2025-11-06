// app/juegos.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Importar AsyncStorage
import { useIsFocused } from '@react-navigation/native'; // <--- Importar useIsFocused
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'; // <--- Importar useState y useEffect
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Esta es la plantilla o "blueprint" de tus niveles
const nivelesBase = [
  {
    id: 'honestidad',
    titulo: 'La Cueva de la Honestidad',
    icono: 'shield-checkmark',
    color: '#4ECDC4',
  },
  {
    id: 'empatia',
    titulo: 'El Puente de la Empatía',
    icono: 'heart',
    color: '#FF6B6B',
  },
  {
    id: 'generosidad',
    titulo: 'El Árbol de la Generosidad',
    icono: 'gift',
    color: '#FFD93D',
  },
  {
    id: 'responsabilidad',
    titulo: 'La Montaña de la Responsabilidad',
    icono: 'rocket',
    color: '#A06CD5',
  },
];

// Esta interface ayuda a TypeScript
type NivelDinamico = typeof nivelesBase[0] & {
  desbloqueado: boolean;
};

export default function JuegosScreen() {
  const router = useRouter();
  const [nivelesDinamicos, setNivelesDinamicos] = useState<NivelDinamico[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // useIsFocused nos dice si la pantalla está visible
  const isFocused = useIsFocused();

  // Usamos useEffect para cargar el progreso
  useEffect(() => {
    // Solo cargamos si la pantalla está visible
    if (isFocused) {
      cargarProgreso();
    }
  }, [isFocused]); // Se ejecuta cada vez que volvemos a esta pantalla

  const cargarProgreso = async () => {
    setCargando(true);
    try {
      const progresoStr = await AsyncStorage.getItem('progresoJuegos');
      const juegosCompletados: string[] = progresoStr ? JSON.parse(progresoStr) : [];
      
      const nuevosNiveles = nivelesBase.map((nivel, index) => {
        let desbloqueado = false;
        
        if (index === 0) {
          // El primer nivel SIEMPRE está desbloqueado
          desbloqueado = true;
        } else {
          // Checa si el ID del nivel ANTERIOR está en la lista de completados
          const nivelAnterior = nivelesBase[index - 1];
          if (juegosCompletados.includes(nivelAnterior.id)) {
            desbloqueado = true;
          }
        }
        
        return {
          ...nivel,
          desbloqueado: desbloqueado,
        };
      });
      
      setNivelesDinamicos(nuevosNiveles);
    } catch (error) {
      console.error('Error cargando progreso:', error);
    } finally {
      setCargando(false);
    }
  };

  const handlePressNivel = (nivel: NivelDinamico) => {
    if (!nivel.desbloqueado) {
      Alert.alert('¡Bloqueado!', '¡Aún no llegas aquí! Completa el nivel anterior.');
      return;
    }
    router.push(`/juegoInteractivo?valor=${nivel.id}`);
  };

  if (cargando) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.loadingContenedor}>
        <ActivityIndicator size="large" color="#4B0082" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Isla de Valores</Text>
        <View style={styles.espacioVacio} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContenedor}>
        <Text style={styles.subtitulo}>
          ¡Sigue el camino y aprende con Valo!
        </Text>

        {nivelesDinamicos.map((nivel, index) => (
          <React.Fragment key={nivel.id}>
            {index > 0 && (
              <View style={styles.caminoConector} />
            )}

            <TouchableOpacity
              style={[
                styles.tarjetaNivel,
                !nivel.desbloqueado && styles.tarjetaBloqueada,
              ]}
              onPress={() => handlePressNivel(nivel)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconoNivel,
                  { backgroundColor: nivel.desbloqueado ? nivel.color : '#9E9E9E' },
                ]}
              >
                <Ionicons
                  name={nivel.desbloqueado ? (nivel.icono as any) : 'lock-closed'}
                  size={32}
                  color="#FFF"
                />
              </View>
              <View style={styles.infoNivel}>
                <Text style={styles.tituloNivel}>{nivel.titulo}</Text>
                <Text style={styles.descripcionNivel}>
                  {nivel.desbloqueado
                    ? '¡Jugar ahora!'
                    : 'Bloqueado'}
                </Text>
              </View>
              {nivel.desbloqueado && (
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color="#4B0082"
                />
              )}
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  loadingContenedor: { // <--- NUEVO
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scrollContenedor: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  caminoConector: {
    width: 4,
    height: 30,
    backgroundColor: 'rgba(75, 0, 130, 0.3)',
    borderStyle: 'dashed',
    borderColor: '#4B0082',
  },
  tarjetaNivel: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tarjetaBloqueada: {
    backgroundColor: '#F5F5F5', // Un gris más suave
    opacity: 0.8,
  },
  iconoNivel: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoNivel: {
    flex: 1,
  },
  tituloNivel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  descripcionNivel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});