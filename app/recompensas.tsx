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

// Datos de ejemplo
const medallas = [
  {
    id: 1,
    nombre: 'Primera Aventura',
    descripcion: 'Completa tu primer cuento',
    emoji: '🎖️',
    color: '#FFD700',
    desbloqueada: true,
    fecha: '15 Oct 2024',
  },
  {
    id: 2,
    nombre: 'Lector Valiente',
    descripcion: 'Lee 5 cuentos',
    emoji: '📚',
    color: '#4ECDC4',
    desbloqueada: true,
    fecha: '16 Oct 2024',
  },
  {
    id: 3,
    nombre: 'Héroe Honesto',
    descripcion: 'Completa todos los cuentos de honestidad',
    emoji: '⭐',
    color: '#FF6B6B',
    desbloqueada: false,
    progreso: 2,
    total: 3,
  },
  {
    id: 4,
    nombre: 'Racha de Fuego',
    descripcion: 'Lee durante 7 días seguidos',
    emoji: '🔥',
    color: '#FF8C00',
    desbloqueada: false,
    progreso: 4,
    total: 7,
  },
  {
    id: 5,
    nombre: 'Maestro de Valores',
    descripcion: 'Completa 20 cuentos',
    emoji: '👑',
    color: '#A06CD5',
    desbloqueada: false,
    progreso: 8,
    total: 20,
  },
  {
    id: 6,
    nombre: 'Experto en Juegos',
    descripcion: 'Gana 10 juegos de valores',
    emoji: '🎮',
    color: '#95E1D3',
    desbloqueada: false,
    progreso: 3,
    total: 10,
  },
];

const valores = [
  { nombre: 'Valentía', emoji: '🦁', progreso: 80, color: '#FFB84D' },
  { nombre: 'Honestidad', emoji: '🦊', progreso: 60, color: '#4ECDC4' },
  { nombre: 'Amistad', emoji: '🐻', progreso: 100, color: '#95E1D3' },
  { nombre: 'Responsabilidad', emoji: '🐜', progreso: 40, color: '#FF6B6B' },
  { nombre: 'Generosidad', emoji: '🐰', progreso: 90, color: '#FF8FAB' },
];

export default function RecompensasScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'medallas' | 'valores'>('medallas');
  const [medallaSeleccionada, setMedallaSeleccionada] = useState<typeof medallas[0] | null>(null);

  const medallasDesbloqueadas = medallas.filter(m => m.desbloqueada).length;
  const totalMedallas = medallas.length;

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Logros</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Resumen de logros */}
      <View style={styles.resumenCard}>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenEmoji}>🏆</Text>
          <Text style={styles.resumenNumero}>{medallasDesbloqueadas}</Text>
          <Text style={styles.resumenLabel}>Medallas</Text>
        </View>
        <View style={styles.resumenDivider} />
        <View style={styles.resumenItem}>
          <Text style={styles.resumenEmoji}>⭐</Text>
          <Text style={styles.resumenNumero}>127</Text>
          <Text style={styles.resumenLabel}>Estrellas</Text>
        </View>
        <View style={styles.resumenDivider} />
        <View style={styles.resumenItem}>
          <Text style={styles.resumenEmoji}>🔥</Text>
          <Text style={styles.resumenNumero}>4</Text>
          <Text style={styles.resumenLabel}>Días racha</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'medallas' && styles.tabActive]}
          onPress={() => setTab('medallas')}
        >
          <Text style={[styles.tabText, tab === 'medallas' && styles.tabTextActive]}>
            Medallas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'valores' && styles.tabActive]}
          onPress={() => setTab('valores')}
        >
          <Text style={[styles.tabText, tab === 'valores' && styles.tabTextActive]}>
            Valores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tab === 'medallas' ? (
          <>
            <Text style={styles.seccionTitle}>
              {medallasDesbloqueadas} de {totalMedallas} medallas desbloqueadas
            </Text>
            <View style={styles.medallasGrid}>
              {medallas.map((medalla) => (
                <TouchableOpacity
                  key={medalla.id}
                  style={[
                    styles.medallaCard,
                    !medalla.desbloqueada && styles.medallaCardBloqueada,
                  ]}
                  onPress={() => setMedallaSeleccionada(medalla)}
                >
                  <View
                    style={[
                      styles.medallaIconContainer,
                      { backgroundColor: medalla.color },
                      !medalla.desbloqueada && styles.medallaIconBloqueada,
                    ]}
                  >
                    <Text style={styles.medallaEmoji}>{medalla.emoji}</Text>
                    {!medalla.desbloqueada && (
                      <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={24} color="#999" />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.medallaNombre,
                      !medalla.desbloqueada && styles.textoDeshabilitado,
                    ]}
                  >
                    {medalla.nombre}
                  </Text>
                  {!medalla.desbloqueada && medalla.progreso !== undefined && (
                    <View style={styles.progresoContainer}>
                      <View style={styles.progresoBarra}>
                        <View
                          style={[
                            styles.progresoFill,
                            {
                              width: `${(medalla.progreso / (medalla.total || 1)) * 100}%`,
                              backgroundColor: medalla.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progresoTexto}>
                        {medalla.progreso}/{medalla.total}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.seccionTitle}>Tu progreso por valor</Text>
            {valores.map((valor) => (
              <View key={valor.nombre} style={styles.valorCard}>
                <View style={styles.valorHeader}>
                  <View style={styles.valorInfo}>
                    <Text style={styles.valorEmoji}>{valor.emoji}</Text>
                    <Text style={styles.valorNombre}>{valor.nombre}</Text>
                  </View>
                  <Text style={styles.valorPorcentaje}>{valor.progreso}%</Text>
                </View>
                <View style={styles.valorBarraContainer}>
                  <View
                    style={[
                      styles.valorBarraFill,
                      { width: `${valor.progreso}%`, backgroundColor: valor.color },
                    ]}
                  />
                </View>
                {valor.progreso === 100 && (
                  <View style={styles.valorCompletado}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.valorCompletadoTexto}>¡Completado!</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de detalles de medalla */}
      <Modal
        visible={medallaSeleccionada !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMedallaSeleccionada(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMedallaSeleccionada(null)}
        >
          <View style={styles.modalContent}>
            {medallaSeleccionada && (
              <>
                <View
                  style={[
                    styles.modalMedallaIcon,
                    { backgroundColor: medallaSeleccionada.color },
                    !medallaSeleccionada.desbloqueada && styles.medallaIconBloqueada,
                  ]}
                >
                  <Text style={styles.modalMedallaEmoji}>
                    {medallaSeleccionada.emoji}
                  </Text>
                  {!medallaSeleccionada.desbloqueada && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={40} color="#999" />
                    </View>
                  )}
                </View>
                <Text style={styles.modalTitulo}>{medallaSeleccionada.nombre}</Text>
                <Text style={styles.modalDescripcion}>
                  {medallaSeleccionada.descripcion}
                </Text>
                {medallaSeleccionada.desbloqueada ? (
                  <View style={styles.modalFecha}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.modalFechaTexto}>
                      Desbloqueada el {medallaSeleccionada.fecha}
                    </Text>
                  </View>
                ) : (
                  <>
                    {medallaSeleccionada.progreso !== undefined && (
                      <View style={styles.modalProgreso}>
                        <Text style={styles.modalProgresoTexto}>
                          Progreso: {medallaSeleccionada.progreso} de{' '}
                          {medallaSeleccionada.total}
                        </Text>
                        <View style={styles.modalProgresoBarra}>
                          <View
                            style={[
                              styles.modalProgresoFill,
                              {
                                width: `${
                                  (medallaSeleccionada.progreso /
                                    (medallaSeleccionada.total || 1)) *
                                  100
                                }%`,
                                backgroundColor: medallaSeleccionada.color,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    )}
                  </>
                )}
                <TouchableOpacity
                  style={styles.modalCerrarButton}
                  onPress={() => setMedallaSeleccionada(null)}
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
  resumenCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
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
  resumenEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  resumenNumero: {
    fontSize: 24,
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
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#4B0082',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFF',
  },
  content: {
    paddingHorizontal: 20,
  },
  seccionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  medallasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  medallaCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medallaCardBloqueada: {
    opacity: 0.6,
  },
  medallaIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  medallaIconBloqueada: {
    backgroundColor: '#E0E0E0',
  },
  medallaEmoji: {
    fontSize: 40,
  },
  lockOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 40,
  },
  medallaNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  textoDeshabilitado: {
    color: '#999',
  },
  progresoContainer: {
    width: '100%',
    marginTop: 8,
  },
  progresoBarra: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progresoFill: {
    height: '100%',
    borderRadius: 3,
  },
  progresoTexto: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  valorCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  valorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  valorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valorEmoji: {
    fontSize: 32,
  },
  valorNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  valorPorcentaje: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  valorBarraContainer: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  valorBarraFill: {
    height: '100%',
    borderRadius: 5,
  },
  valorCompletado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  valorCompletadoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bottomSpacer: {
    height: 40,
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
    width: '85%',
    alignItems: 'center',
  },
  modalMedallaIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalMedallaEmoji: {
    fontSize: 60,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescripcion: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalFecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  modalFechaTexto: {
    fontSize: 14,
    color: '#666',
  },
  modalProgreso: {
    width: '100%',
    marginBottom: 20,
  },
  modalProgresoTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalProgresoBarra: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  modalProgresoFill: {
    height: '100%',
    borderRadius: 5,
  },
  modalCerrarButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  modalCerrarTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});