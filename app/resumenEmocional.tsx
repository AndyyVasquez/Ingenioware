import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface EntradaDiario {
  id: number;
  fecha: string;
  emocion: string;
  respuestas: string[];
  alertaNivel: number;
}

interface CalendarioEmocional {
  fecha: string;
  emocion: string;
  color: string;
}

export default function ResumenEmocionalScreen() {
  const router = useRouter();
  const [entradas, setEntradas] = useState<EntradaDiario[]>([]);
  const [calendarioMes, setCalendarioMes] = useState<CalendarioEmocional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const entradasStr = await AsyncStorage.getItem('entradasDiario');
      if (entradasStr) {
        const entradasData = JSON.parse(entradasStr);
        setEntradas(entradasData);
        generarCalendario(entradasData);
      }
    } catch (error) {
      console.error('Error cargando entradas:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarCalendario = (entradasData: EntradaDiario[]) => {
    const calendario: CalendarioEmocional[] = [];
    const hoy = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const entrada = entradasData.find(e => 
        new Date(e.fecha).toISOString().split('T')[0] === fechaStr
      );
      
      calendario.push({
        fecha: fechaStr,
        emocion: entrada?.emocion || 'sin-registro',
        color: entrada ? obtenerColorEmocion(entrada.emocion) : '#E0E0E0',
      });
    }
    
    setCalendarioMes(calendario);
  };

  const obtenerColorEmocion = (emocion: string): string => {
    const colores: { [key: string]: string } = {
      'feliz': '#4CAF50',
      'triste': '#607D8B',
      'enojado': '#F44336',
      'asustado': '#9C27B0',
      'cansado': '#795548',
      'preocupado': '#FF9800',
      'frustrado': '#E91E63',
      'orgulloso': '#FFD700',
      'avergonzado': '#FF7043',
      'ansioso': '#00BCD4',
      'confundido': '#9E9E9E',
      'emocionado': '#FF6F00',
    };
    return colores[emocion] || '#999';
  };

  const obtenerEmojiEmocion = (emocion: string): string => {
    const emojis: { [key: string]: string } = {
      'feliz': '😊',
      'triste': '😔',
      'enojado': '😤',
      'asustado': '😨',
      'cansado': '😴',
      'preocupado': '😟',
      'frustrado': '😣',
      'orgulloso': '🤗',
      'avergonzado': '😳',
      'ansioso': '😰',
      'confundido': '😕',
      'emocionado': '🤩',
    };
    return emojis[emocion] || '😐';
  };
  

  const obtenerEstadisticas = () => {
    if (entradas.length === 0) return null;

    const emocionesCantidad: { [key: string]: number } = {};
    entradas.forEach(entrada => {
      emocionesCantidad[entrada.emocion] = (emocionesCantidad[entrada.emocion] || 0) + 1;
    });

    const emocionMasFrecuente = Object.entries(emocionesCantidad)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      totalEntradas: entradas.length,
      emocionMasFrecuente: emocionMasFrecuente[0],
      cantidadMasFrecuente: emocionMasFrecuente[1],
      emocionesCantidad,
    };
  };

  const estadisticas = obtenerEstadisticas();

  if (loading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={estilos.contenedor}>
        <View style={estilos.loadingContainer}>
          <Text style={estilos.loadingText}>Cargando tu diario...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={estilos.contenedor}>
      {/* Header */}
      <View style={estilos.encabezado}>
        <TouchableOpacity
          style={estilos.botonVolver}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={estilos.titulo}>Mi Calendario Emocional</Text>
        <TouchableOpacity
          style={estilos.botonAgregar}
          onPress={() => router.push('./diario')} 
        >
          <Ionicons name="add-circle" size={28} color="#4B0082" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.contenidoScroll}
      >
        {/* Avatar de Berto */}
        <View style={estilos.contenedorBerto}>
          <View style={estilos.burbujaOsito}>
            <Text style={estilos.emojiOsito}>🐻</Text>
          </View>
          <Text style={estilos.mensajeBerto}>
            {entradas.length === 0
              ? '¡Comienza a escribir en tu diario!'
              : '¡Qué bonito ver cómo expresas tus emociones!'}
          </Text>
        </View>

        {/* Estadísticas */}
        {estadisticas && (
          <View style={estilos.tarjetaEstadisticas}>
            <Text style={estilos.tituloSeccion}>📊 Tus emociones este mes</Text>
            
            <View style={estilos.statsGrid}>
              <View style={estilos.statItem}>
                <Text style={estilos.statEmoji}>📝</Text>
                <Text style={estilos.statNumero}>{estadisticas.totalEntradas}</Text>
                <Text style={estilos.statLabel}>Entradas</Text>
              </View>
              
              <View style={estilos.statDivider} />
              
              <View style={estilos.statItem}>
                <Text style={estilos.statEmoji}>
                  {obtenerEmojiEmocion(estadisticas.emocionMasFrecuente)}
                </Text>
                <Text style={estilos.statNumero}>{estadisticas.cantidadMasFrecuente}</Text>
                <Text style={estilos.statLabel}>
                  {estadisticas.emocionMasFrecuente.charAt(0).toUpperCase() + 
                   estadisticas.emocionMasFrecuente.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Calendario Visual */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>🗓️ Últimos 30 días</Text>
          <View style={estilos.calendarioGrid}>
            {calendarioMes.map((dia, index) => (
              <View
                key={index}
                style={[
                  estilos.diaCalendario,
                  { backgroundColor: dia.color },
                ]}
              >
                <Text style={estilos.diaNumero}>
                  {new Date(dia.fecha).getDate()}
                </Text>
                {dia.emocion !== 'sin-registro' && (
                  <Text style={estilos.diaEmoji}>
                    {obtenerEmojiEmocion(dia.emocion)}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View style={estilos.leyendaCalendario}>
            <View style={estilos.leyendaItem}>
              <View style={[estilos.leyendaDot, { backgroundColor: '#E0E0E0' }]} />
              <Text style={estilos.leyendaTexto}>Sin registro</Text>
            </View>
          </View>
        </View>

        {/* ----- SECCIÓN ELIMINADA ----- */}
        {/* Ya no mostramos la lista de entradas recientes */}
        {/* Tampoco mostramos el botón de "Empezar ahora" aquí */}
        
        {entradas.length === 0 && (
           <View style={estilos.sinEntradas}>
             <Text style={estilos.sinEntradasEmoji}>📝</Text>
             <Text style={estilos.sinEntradasTexto}>
               ¡Escribe tu primera entrada para verla en tu calendario!
             </Text>
             <TouchableOpacity
               style={estilos.botonEmpezar}
               onPress={() => router.push('./diario')}  
             >
               <Text style={estilos.botonEmpezarTexto}>Empezar ahora</Text>
             </TouchableOpacity>
           </View>
        )}

        <View style={estilos.espaciadoInferior} />
      </ScrollView>

      {/* ----- MODAL ELIMINADO ----- */}
      {/* Ya no hay modal de detalle */}

    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4B0082',
    fontWeight: '600',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  botonAgregar: {
    padding: 8,
  },
  contenidoScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contenedorBerto: {
    alignItems: 'center',
    marginBottom: 30,
  },
  burbujaOsito: {
    width: 80,
    height: 80,
    backgroundColor: '#FFE4B5',
    borderRadius: 40,
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
    fontSize: 50,
  },
  mensajeBerto: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  tarjetaEstadisticas: {
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
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  statNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
  seccion: {
    marginBottom: 24,
  },
  calendarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    justifyContent: 'center', 
  },
  diaCalendario: {
    width: 45, 
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diaNumero: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  diaEmoji: {
    fontSize: 16,
  },
  leyendaCalendario: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leyendaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  leyendaTexto: {
    fontSize: 12,
    color: '#666',
  },
  sinEntradas: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sinEntradasEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  sinEntradasTexto: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  botonEmpezar: {
    backgroundColor: '#4B0082',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  botonEmpezarTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  espaciadoInferior: {
    height: 40,
  },
  
});