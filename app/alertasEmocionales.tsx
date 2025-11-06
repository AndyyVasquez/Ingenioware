import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AlertaEmocional {
  id: number;
  fecha: string;
  emocion: string;
  nivel: number; // 0 = Sin alerta, 1 = Moderada, 2 = Crítica
  vista: boolean;
  atendida: boolean;
  respuestas?: string[];
  notas?: string;
}

export default function AlertasEmocionalesScreen() {
  const router = useRouter();
  const [alertas, setAlertas] = useState<AlertaEmocional[]>([]);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaEmocional | null>(null);
  const [modalNotas, setModalNotas] = useState(false);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'atendidas'>('todas');

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const alertasStr = await AsyncStorage.getItem('alertasEmocionales');
      if (alertasStr) {
        const alertasData = JSON.parse(alertasStr);
        setAlertas(alertasData);
        
        // Marcar como vistas todas las alertas no vistas
        const alertasActualizadas = alertasData.map((alerta: AlertaEmocional) => ({
          ...alerta,
          vista: true,
        }));
        await AsyncStorage.setItem('alertasEmocionales', JSON.stringify(alertasActualizadas));
      }
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoAtendida = async (alertaId: number) => {
    try {
      const alertasActualizadas = alertas.map(alerta =>
        alerta.id === alertaId ? { ...alerta, atendida: true } : alerta
      );
      setAlertas(alertasActualizadas);
      await AsyncStorage.setItem('alertasEmocionales', JSON.stringify(alertasActualizadas));
      
      Alert.alert(
        '✅ Marcada como atendida',
        'Has indicado que ya atendiste esta alerta emocional'
      );
    } catch (error) {
      console.error('Error marcando alerta:', error);
    }
  };

  const guardarNotas = async () => {
    if (!alertaSeleccionada) return;

    try {
      const alertasActualizadas = alertas.map(alerta =>
        alerta.id === alertaSeleccionada.id
          ? { ...alerta, notas: notas.trim(), atendida: true }
          : alerta
      );
      setAlertas(alertasActualizadas);
      await AsyncStorage.setItem('alertasEmocionales', JSON.stringify(alertasActualizadas));
      
      setModalNotas(false);
      setNotas('');
      setAlertaSeleccionada(null);
      
      Alert.alert('✅ Notas guardadas', 'Tus notas han sido guardadas exitosamente');
    } catch (error) {
      console.error('Error guardando notas:', error);
    }
  };

  const obtenerColorNivel = (nivel: number): string => {
    if (nivel === 2) return '#FF6B6B'; // Crítica
    if (nivel === 1) return '#FFB84D'; // Moderada
    return '#95E1D3'; // Normal
  };

  const obtenerTextoNivel = (nivel: number): string => {
    if (nivel === 2) return 'Crítica';
    if (nivel === 1) return 'Moderada';
    return 'Normal';
  };

  const obtenerIconoNivel = (nivel: number): any => {
    if (nivel === 2) return 'alert-circle';
    if (nivel === 1) return 'warning';
    return 'information-circle';
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

  const formatearFecha = (fechaStr: string): string => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    if (diffHoras < 1) return 'Hace unos minutos';
    if (diffHoras < 24) return `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
    if (diffDias < 7) return `Hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;
    
    return fecha.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const alertasFiltradas = alertas.filter(alerta => {
    if (filtro === 'pendientes') return !alerta.atendida;
    if (filtro === 'atendidas') return alerta.atendida;
    return true;
  });

  const alertasPendientes = alertas.filter(a => !a.atendida).length;
  const alertasCriticas = alertas.filter(a => a.nivel === 2 && !a.atendida).length;

  if (loading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={estilos.contenedor}>
        <View style={estilos.loadingContainer}>
          <Text style={estilos.loadingText}>Cargando alertas...</Text>
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
        <Text style={estilos.titulo}>Alertas Emocionales</Text>
        <View style={estilos.placeholder} />
      </View>

      {/* Resumen */}
      <View style={estilos.tarjetaResumen}>
        <View style={estilos.resumenItem}>
          <View style={[estilos.resumenIcono, { backgroundColor: '#FFB84D' }]}>
            <Ionicons name="notifications" size={28} color="#FFF" />
          </View>
          <Text style={estilos.resumenNumero}>{alertasPendientes}</Text>
          <Text style={estilos.resumenLabel}>Pendientes</Text>
        </View>

        <View style={estilos.resumenDivider} />

        <View style={estilos.resumenItem}>
          <View style={[estilos.resumenIcono, { backgroundColor: '#FF6B6B' }]}>
            <Ionicons name="alert-circle" size={28} color="#FFF" />
          </View>
          <Text style={estilos.resumenNumero}>{alertasCriticas}</Text>
          <Text style={estilos.resumenLabel}>Críticas</Text>
        </View>
      </View>

      {/* Información importante */}
      {alertasCriticas > 0 && (
        <View style={estilos.infoImportante}>
          <Ionicons name="information-circle" size={24} color="#FF6B6B" />
          <Text style={estilos.infoTexto}>
            Tienes alertas críticas que requieren atención inmediata
          </Text>
        </View>
      )}

      {/* Filtros */}
      <View style={estilos.contenedorFiltros}>
        <TouchableOpacity
          style={[estilos.filtro, filtro === 'todas' && estilos.filtroActivo]}
          onPress={() => setFiltro('todas')}
        >
          <Text style={[estilos.filtroTexto, filtro === 'todas' && estilos.filtroTextoActivo]}>
            Todas ({alertas.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.filtro, filtro === 'pendientes' && estilos.filtroActivo]}
          onPress={() => setFiltro('pendientes')}
        >
          <Text style={[estilos.filtroTexto, filtro === 'pendientes' && estilos.filtroTextoActivo]}>
            Pendientes ({alertasPendientes})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.filtro, filtro === 'atendidas' && estilos.filtroActivo]}
          onPress={() => setFiltro('atendidas')}
        >
          <Text style={[estilos.filtroTexto, filtro === 'atendidas' && estilos.filtroTextoActivo]}>
            Atendidas ({alertas.length - alertasPendientes})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de alertas */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.contenidoScroll}
      >
        {alertasFiltradas.length === 0 ? (
          <View style={estilos.sinAlertas}>
            <Text style={estilos.sinAlertasEmoji}>✅</Text>
            <Text style={estilos.sinAlertasTexto}>
              {filtro === 'pendientes'
                ? '¡Todo en orden! No hay alertas pendientes'
                : filtro === 'atendidas'
                ? 'No hay alertas atendidas aún'
                : '¡Genial! No hay ninguna alerta'}
            </Text>
          </View>
        ) : (
          alertasFiltradas.map((alerta) => (
            <TouchableOpacity
              key={alerta.id}
              style={[
                estilos.tarjetaAlerta,
                alerta.atendida && estilos.tarjetaAlertaAtendida,
              ]}
              onPress={() => setAlertaSeleccionada(alerta)}
            >
              <View
                style={[
                  estilos.alertaNivelIndicador,
                  { backgroundColor: obtenerColorNivel(alerta.nivel) },
                ]}
              />

              <View style={estilos.alertaIconoContainer}>
                <Text style={estilos.alertaEmoji}>
                  {obtenerEmojiEmocion(alerta.emocion)}
                </Text>
                <View
                  style={[
                    estilos.nivelBadge,
                    { backgroundColor: obtenerColorNivel(alerta.nivel) },
                  ]}
                >
                  <Ionicons
                    name={obtenerIconoNivel(alerta.nivel)}
                    size={14}
                    color="#FFF"
                  />
                </View>
              </View>

              <View style={estilos.alertaInfo}>
                <View style={estilos.alertaHeader}>
                  <Text style={estilos.alertaEmocion}>
                    Emoción: {alerta.emocion}
                  </Text>
                  {!alerta.vista && (
                    <View style={estilos.nuevoBadge}>
                      <Text style={estilos.nuevoBadgeTexto}>Nuevo</Text>
                    </View>
                  )}
                </View>
                <Text style={estilos.alertaNivel}>
                  Nivel: {obtenerTextoNivel(alerta.nivel)}
                </Text>
                <Text style={estilos.alertaFecha}>
                  {formatearFecha(alerta.fecha)}
                </Text>
                {alerta.atendida && (
                  <View style={estilos.atendidaBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={estilos.atendidaTexto}>Atendida</Text>
                  </View>
                )}
              </View>

              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))
        )}

        <View style={estilos.espaciadoInferior} />
      </ScrollView>

      {/* Modal de detalle */}
      <Modal
        visible={alertaSeleccionada !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAlertaSeleccionada(null)}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContent}>
            {alertaSeleccionada && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={estilos.modalCerrar}
                  onPress={() => setAlertaSeleccionada(null)}
                >
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>

                <View
                  style={[
                    estilos.modalIcono,
                    { backgroundColor: obtenerColorNivel(alertaSeleccionada.nivel) },
                  ]}
                >
                  <Text style={estilos.modalEmoji}>
                    {obtenerEmojiEmocion(alertaSeleccionada.emocion)}
                  </Text>
                </View>

                <View style={estilos.modalNivelBadge}>
                  <Ionicons
                    name={obtenerIconoNivel(alertaSeleccionada.nivel)}
                    size={20}
                    color={obtenerColorNivel(alertaSeleccionada.nivel)}
                  />
                  <Text
                    style={[
                      estilos.modalNivelTexto,
                      { color: obtenerColorNivel(alertaSeleccionada.nivel) },
                    ]}
                  >
                    Alerta {obtenerTextoNivel(alertaSeleccionada.nivel)}
                  </Text>
                </View>

                <Text style={estilos.modalEmocion}>
                  Se sintió {alertaSeleccionada.emocion}
                </Text>
                <Text style={estilos.modalFecha}>
                  {formatearFecha(alertaSeleccionada.fecha)}
                </Text>

                {/* Respuestas del diario */}
                {alertaSeleccionada.respuestas && alertaSeleccionada.respuestas.length > 0 && (
                  <View style={estilos.modalSeccion}>
                    <Text style={estilos.modalSeccionTitulo}>
                      💬 Lo que compartió tu hijo/a:
                    </Text>
                    {alertaSeleccionada.respuestas.map((respuesta, index) => (
                      respuesta && (
                        <View key={index} style={estilos.respuestaContainer}>
                          <Text style={estilos.respuestaTexto}>{respuesta}</Text>
                        </View>
                      )
                    ))}
                  </View>
                )}

                {/* Recomendaciones */}
                <View style={estilos.modalSeccion}>
                  <Text style={estilos.modalSeccionTitulo}>
                    💡 Recomendaciones:
                  </Text>
                  {alertaSeleccionada.nivel === 2 ? (
                    <>
                      <Text style={estilos.recomendacionTexto}>
                        • Habla con tu hijo/a lo antes posible
                      </Text>
                      <Text style={estilos.recomendacionTexto}>
                        • Crea un espacio seguro para que se exprese
                      </Text>
                      <Text style={estilos.recomendacionTexto}>
                        • Considera consultar con un profesional
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={estilos.recomendacionTexto}>
                        • Pregúntale cómo estuvo su día
                      </Text>
                      <Text style={estilos.recomendacionTexto}>
                        • Dale espacio para expresar sus emociones
                      </Text>
                      <Text style={estilos.recomendacionTexto}>
                        • Refuerza que estás disponible para escucharle
                      </Text>
                    </>
                  )}
                </View>

                {/* Notas del padre */}
                {alertaSeleccionada.notas && (
                  <View style={estilos.modalSeccion}>
                    <Text style={estilos.modalSeccionTitulo}>📝 Tus notas:</Text>
                    <Text style={estilos.notasTexto}>{alertaSeleccionada.notas}</Text>
                  </View>
                )}

                {/* Botones de acción */}
                <View style={estilos.modalBotones}>
                  {!alertaSeleccionada.atendida && (
                    <>
                      <TouchableOpacity
                        style={estilos.botonAgregarNotas}
                        onPress={() => {
                          setNotas(alertaSeleccionada.notas || '');
                          setModalNotas(true);
                        }}
                      >
                        <Ionicons name="create-outline" size={20} color="#4B0082" />
                        <Text style={estilos.botonAgregarNotasTexto}>
                          {alertaSeleccionada.notas ? 'Editar notas' : 'Agregar notas'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={estilos.botonMarcarAtendida}
                        onPress={() => {
                          marcarComoAtendida(alertaSeleccionada.id);
                          setAlertaSeleccionada(null);
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        <Text style={estilos.botonMarcarAtendidaTexto}>
                          Marcar como atendida
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de notas */}
      <Modal
        visible={modalNotas}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalNotas(false)}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalNotasContent}>
            <Text style={estilos.modalNotasTitulo}>Agregar notas</Text>
            <Text style={estilos.modalNotasSubtitulo}>
              Escribe tus observaciones o acciones tomadas
            </Text>

            <TextInput
              style={estilos.inputNotas}
              placeholder="Ej: Hablé con mi hijo sobre lo sucedido..."
              placeholderTextColor="#999"
              value={notas}
              onChangeText={setNotas}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={estilos.modalNotasBotones}>
              <TouchableOpacity
                style={estilos.botonCancelar}
                onPress={() => {
                  setModalNotas(false);
                  setNotas('');
                }}
              >
                <Text style={estilos.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={estilos.botonGuardar}
                onPress={guardarNotas}
              >
                <Text style={estilos.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  placeholder: {
    width: 40,
  },
  tarjetaResumen: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resumenItem: {
    flex: 1,
    alignItems: 'center',
  },
  resumenIcono: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resumenNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 4,
  },
  resumenLabel: {
    fontSize: 12,
    color: '#666',
  },
  resumenDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  infoImportante: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    gap: 12,
  },
  infoTexto: {
    flex: 1,
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
    lineHeight: 20,
  },
  contenedorFiltros: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  filtro: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filtroActivo: {
    backgroundColor: '#4B0082',
  },
  filtroTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filtroTextoActivo: {
    color: '#FFF',
  },
  contenidoScroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sinAlertas: {
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
  sinAlertasEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  sinAlertasTexto: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  tarjetaAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  tarjetaAlertaAtendida: {
    opacity: 0.7,
  },
  alertaNivelIndicador: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  alertaIconoContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginRight: 12,
    position: 'relative',
  },
  alertaEmoji: {
    fontSize: 40,
  },
  nivelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  alertaInfo: {
    flex: 1,
  },
  alertaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  alertaEmocion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nuevoBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nuevoBadgeTexto: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  alertaNivel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  alertaFecha: {
    fontSize: 12,
    color: '#999',
  },
  atendidaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  atendidaTexto: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  espaciadoInferior: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxHeight: '85%',
  },
  modalCerrar: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalIcono: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalEmoji: {
    fontSize: 50,
  },
  modalNivelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalNivelTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalEmocion: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalFecha: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSeccion: {
    marginBottom: 24,
  },
  modalSeccionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  respuestaContainer: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  respuestaTexto: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  recomendacionTexto: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  notasTexto: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  modalBotones: {
    gap: 12,
    marginTop: 8,
  },
  botonAgregarNotas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8D5FF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  botonAgregarNotasTexto: {
    color: '#4B0082',
    fontSize: 16,
    fontWeight: '600',
  },
  botonMarcarAtendida: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  botonMarcarAtendidaTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalNotasContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    width: '100%',
  },
  modalNotasTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  modalNotasSubtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputNotas: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  modalNotasBotones: {
    flexDirection: 'row',
    gap: 12,
  },
  botonCancelar: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  botonCancelarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  botonGuardar: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#4B0082',
    borderRadius: 12,
  },
  botonGuardarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});