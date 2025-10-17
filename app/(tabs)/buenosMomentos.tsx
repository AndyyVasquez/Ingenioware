import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Tipos de recompensas
interface Recompensa {
  id: number;
  tipo: 'estrella' | 'corazon' | 'regalo' | 'corona';
  titulo: string;
  mensaje: string;
  de: string;
  fecha: string;
  emoji: string;
  color: string;
  leida: boolean;
}

// Mensajes especiales de los padres
interface MensajeEspecial {
  id: number;
  titulo: string;
  mensaje: string;
  emoji: string;
  fecha: string;
  tipo: 'felicitacion' | 'amor' | 'orgullo';
}

// Datos de ejemplo
const recompensasData: Recompensa[] = [
  {
    id: 1,
    tipo: 'estrella',
    titulo: '¡Muy bien!',
    mensaje: '¡Felicidades por terminar 5 cuentos esta semana! Estoy muy orgulloso de ti. Sigue así, campeón.',
    de: 'Papá',
    fecha: 'Hace 2 horas',
    emoji: '⭐',
    color: '#FFD93D',
    leida: false,
  },
  {
    id: 2,
    tipo: 'corazon',
    titulo: 'Te amo mucho',
    mensaje: 'Eres un niño muy especial y te queremos mucho. Gracias por ser tan bueno y cariñoso.',
    de: 'Mamá',
    fecha: 'Ayer',
    emoji: '❤️',
    color: '#FF6B6B',
    leida: true,
  },
  {
    id: 3,
    tipo: 'regalo',
    titulo: '¡Sorpresa!',
    mensaje: 'Has ganado 30 minutos extra de juego este fin de semana por portarte tan bien.',
    de: 'Papá y Mamá',
    fecha: 'Hace 3 días',
    emoji: '🎁',
    color: '#A06CD5',
    leida: true,
  },
  {
    id: 4,
    tipo: 'corona',
    titulo: '¡Eres el mejor!',
    mensaje: 'Me encanta cómo ayudaste a tu hermanita hoy. Eres un gran ejemplo.',
    de: 'Mamá',
    fecha: 'Hace 5 días',
    emoji: '👑',
    color: '#FFB84D',
    leida: true,
  },
];

const mensajesEspeciales: MensajeEspecial[] = [
  {
    id: 1,
    titulo: 'Eres increíble',
    mensaje: 'Cada día me sorprendes más con tu inteligencia y bondad.',
    emoji: '🌟',
    fecha: 'Hoy',
    tipo: 'orgullo',
  },
  {
    id: 2,
    titulo: 'Te queremos',
    mensaje: 'Eres la luz de nuestra familia. Gracias por existir.',
    emoji: '💖',
    fecha: 'Hace 2 días',
    tipo: 'amor',
  },
];

export default function BuenosMomentosScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'recompensas' | 'mensajes'>('recompensas');
  const [recompensaSeleccionada, setRecompensaSeleccionada] = useState<Recompensa | null>(null);

  const recompensasNuevas = recompensasData.filter((r) => !r.leida).length;

  const getIconoRecompensa = (tipo: Recompensa['tipo']) => {
    const iconos = {
      estrella: 'star',
      corazon: 'heart',
      regalo: 'gift',
      corona: 'trophy',
    };
    return iconos[tipo] || 'star';
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buenos Momentos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Card de resumen */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryEmoji}>💝</Text>
        <Text style={styles.summaryTitle}>
          ¡Tienes {recompensasNuevas} {recompensasNuevas === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}!
        </Text>
        <Text style={styles.summarySubtitle}>Tus papás están muy orgullosos de ti</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'recompensas' && styles.tabActive]}
          onPress={() => setTab('recompensas')}
        >
          <Ionicons
            name="gift"
            size={20}
            color={tab === 'recompensas' ? '#FFF' : '#666'}
          />
          <Text style={[styles.tabText, tab === 'recompensas' && styles.tabTextActive]}>
            Recompensas
          </Text>
          {recompensasNuevas > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{recompensasNuevas}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === 'mensajes' && styles.tabActive]}
          onPress={() => setTab('mensajes')}
        >
          <Ionicons
            name="heart"
            size={20}
            color={tab === 'mensajes' ? '#FFF' : '#666'}
          />
          <Text style={[styles.tabText, tab === 'mensajes' && styles.tabTextActive]}>
            Mensajes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tab === 'recompensas' ? (
          <>
            {/* Recompensas nuevas */}
            {recompensasNuevas > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎉 Nuevas</Text>
                {recompensasData
                  .filter((r) => !r.leida)
                  .map((recompensa) => (
                    <TouchableOpacity
                      key={recompensa.id}
                      style={[
                        styles.recompensaCard,
                        { borderLeftColor: recompensa.color },
                      ]}
                      onPress={() => setRecompensaSeleccionada(recompensa)}
                    >
                      <View
                        style={[
                          styles.recompensaIconContainer,
                          { backgroundColor: recompensa.color },
                        ]}
                      >
                        <Text style={styles.recompensaEmoji}>{recompensa.emoji}</Text>
                      </View>

                      <View style={styles.recompensaInfo}>
                        <View style={styles.recompensaHeader}>
                          <Text style={styles.recompensaTitulo}>
                            {recompensa.titulo}
                          </Text>
                          {!recompensa.leida && (
                            <View style={styles.nuevoBadge}>
                              <Text style={styles.nuevoBadgeText}>Nuevo</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.recompensaMensaje} numberOfLines={2}>
                          {recompensa.mensaje}
                        </Text>
                        <Text style={styles.recompensaDe}>De: {recompensa.de}</Text>
                      </View>

                      <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>
                  ))}
              </View>
            )}

            {/* Historial de recompensas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📜 Historial</Text>
              {recompensasData
                .filter((r) => r.leida)
                .map((recompensa) => (
                  <TouchableOpacity
                    key={recompensa.id}
                    style={[
                      styles.recompensaCard,
                      styles.recompensaCardLeida,
                      { borderLeftColor: recompensa.color },
                    ]}
                    onPress={() => setRecompensaSeleccionada(recompensa)}
                  >
                    <View
                      style={[
                        styles.recompensaIconContainer,
                        { backgroundColor: recompensa.color },
                      ]}
                    >
                      <Text style={styles.recompensaEmoji}>{recompensa.emoji}</Text>
                    </View>

                    <View style={styles.recompensaInfo}>
                      <Text style={styles.recompensaTitulo}>
                        {recompensa.titulo}
                      </Text>
                      <Text style={styles.recompensaFecha}>{recompensa.fecha}</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={24} color="#CCC" />
                  </TouchableOpacity>
                ))}
            </View>
          </>
        ) : (
          <>
            {/* Mensajes especiales */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💌 Mensajes de amor</Text>
              {mensajesEspeciales.map((mensaje) => (
                <View key={mensaje.id} style={styles.mensajeCard}>
                  <Text style={styles.mensajeEmoji}>{mensaje.emoji}</Text>
                  <Text style={styles.mensajeTitulo}>{mensaje.titulo}</Text>
                  <Text style={styles.mensajeTexto}>{mensaje.mensaje}</Text>
                  <Text style={styles.mensajeFecha}>{mensaje.fecha}</Text>
                </View>
              ))}
            </View>

            {/* Frases motivacionales */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ Frases especiales</Text>
              <View style={styles.fraseCard}>
                <Text style={styles.fraseTitulo}>
                  Eres capaz de lograr todo lo que te propongas
                </Text>
                <Text style={styles.fraseAutor}>- Con amor, tus papás</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de detalle de recompensa */}
      <Modal
        visible={recompensaSeleccionada !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setRecompensaSeleccionada(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRecompensaSeleccionada(null)}
        >
          <View style={styles.modalContent}>
            {recompensaSeleccionada && (
              <>
                <View
                  style={[
                    styles.modalIconContainer,
                    { backgroundColor: recompensaSeleccionada.color },
                  ]}
                >
                  <Text style={styles.modalEmoji}>
                    {recompensaSeleccionada.emoji}
                  </Text>
                </View>

                <Text style={styles.modalTitulo}>
                  {recompensaSeleccionada.titulo}
                </Text>

                <View style={styles.modalDe}>
                  <Ionicons name="person" size={16} color="#666" />
                  <Text style={styles.modalDeTexto}>
                    De: {recompensaSeleccionada.de}
                  </Text>
                </View>

                <View style={styles.modalMensajeContainer}>
                  <Text style={styles.modalMensaje}>
                    {recompensaSeleccionada.mensaje}
                  </Text>
                </View>

                <View style={styles.modalFecha}>
                  <Ionicons name="time-outline" size={16} color="#999" />
                  <Text style={styles.modalFechaTexto}>
                    {recompensaSeleccionada.fecha}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCerrarButton}
                  onPress={() => setRecompensaSeleccionada(null)}
                >
                  <Text style={styles.modalCerrarTexto}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  placeholder: {
    width: 40,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 6,
    textAlign: 'center',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#4B0082',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFF',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  recompensaCard: {
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
    borderLeftWidth: 6,
  },
  recompensaCardLeida: {
    opacity: 0.7,
  },
  recompensaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recompensaEmoji: {
    fontSize: 32,
  },
  recompensaInfo: {
    flex: 1,
  },
  recompensaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  recompensaTitulo: {
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
  nuevoBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  recompensaMensaje: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  recompensaDe: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  recompensaFecha: {
    fontSize: 13,
    color: '#999',
  },
  mensajeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  mensajeEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  mensajeTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 12,
    textAlign: 'center',
  },
  mensajeTexto: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  mensajeFecha: {
    fontSize: 12,
    color: '#999',
  },
  fraseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD93D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fraseTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  fraseAutor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacer: {
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
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalEmoji: {
    fontSize: 50,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  modalDeTexto: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modalMensajeContainer: {
    backgroundColor: '#F5E6D3',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  modalMensaje: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalFecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  modalFechaTexto: {
    fontSize: 13,
    color: '#999',
  },
  modalCerrarButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
  },
  modalCerrarTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});