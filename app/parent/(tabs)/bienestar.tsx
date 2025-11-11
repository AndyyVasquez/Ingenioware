import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useParentData } from '../parentDataContext';

export default function BienestarScreen() {
    const { alertasNuevas, alertasCriticas, isLoading, temaDelDia } = useParentData();

  const handleVerSugerencia = () => {
    if (!temaDelDia) return;
    
    // Mostramos la pregunta en un Alert (o podrías hacer un Modal)
    Alert.alert(
      temaDelDia.titulo,
      temaDelDia.pregunta,
      [{ text: '¡Entendido!' }]
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienestar Emocional</Text>
        </View>

        {/* Sección del Diario de Valo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diario de Valo</Text>
          <View style={styles.bienestarCard}>
            <View style={styles.bienestarItem}>
              <View style={styles.bienestarIcono}>
                <Text style={styles.bienestarEmoji}>🐻</Text>
              </View>
              <View style={styles.bienestarInfo}>
                <Text style={styles.bienestarTitulo}>Diario de Valo</Text>
                <Text style={styles.bienestarTexto}>
                  Tu hijo/a puede expresar sus emociones con Valo.
                </Text>
              </View>
            </View>

            {(alertasNuevas > 0 || alertasCriticas > 0) && (
              <View style={styles.bienestarAlertaContainer}>
                {alertasCriticas > 0 && (
                  <View style={[styles.bienestarAlerta, styles.alertaCritica]}>
                    <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                    <Text style={[styles.bienestarAlertaTexto, styles.textoCritico]}>
                      {alertasCriticas} {alertasCriticas === 1 ? 'alerta crítica' : 'alertas críticas'}
                    </Text>
                  </View>
                )}
                {alertasNuevas > 0 && (
                  <View style={[styles.bienestarAlerta, styles.alertaNueva]}>
                    <Ionicons name="notifications" size={20} color="#FFB84D" />
                    <Text style={[styles.bienestarAlertaTexto, styles.textoNuevo]}>
                      {alertasNuevas} {alertasNuevas === 1 ? 'alerta nueva' : 'alertas nuevas'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        
<View style={styles.section}>
          <Text style={styles.sectionTitle}>Temas de Conversación</Text>
          
          {temaDelDia ? (
            // Si SÍ hay un tema...
            <View style={styles.temaCard}>
              <View style={styles.temaIcono}>
                <Ionicons name={temaDelDia.icono} size={32} color="#4B0082" />
              </View>
              <View style={styles.temaInfo}>
                <Text style={styles.temaTitulo}>{temaDelDia.titulo}</Text>
                <Text style={styles.temaTexto}>
                  {temaDelDia.descripcion}
                </Text>
                <TouchableOpacity 
                  style={styles.temaBoton}
                  onPress={handleVerSugerencia} // <-- Conectado
                >
                  <Text style={styles.temaBotonTexto}>Ver sugerencia</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Si NO hay un tema (el niño no ha jugado)...
            <View style={styles.temaVacioCard}>
              <Ionicons name="chatbubbles-outline" size={32} color="#666" />
              <Text style={styles.temaVacioTexto}>
                Cuando tu hijo/a complete un juego de valores, aquí aparecerán sugerencias para hablar.
              </Text>
            </View>
          )}
        </View>

        {/* ... (El historial de alertas se queda igual) ... */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Alertas</Text>
          <View style={styles.alertaHistorialCard}>
             <Ionicons name="alert-circle-outline" size={24} color="#FF6B6B" />
             <View style={styles.alertaHistorialInfo}>
                <Text style={styles.alertaHistorialTitulo}>Alerta Crítica (Atendida)</Text>
                <Text style={styles.alertaHistorialFecha}>Hace 3 días</Text>
             </View>
             <Ionicons name="chevron-forward" size={24} color="#999" />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  bienestarCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bienestarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bienestarIcono: {
    width: 50,
    height: 50,
    backgroundColor: '#FFE4B5',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bienestarEmoji: {
    fontSize: 28,
  },
  bienestarInfo: {
    flex: 1,
  },
  bienestarTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bienestarTexto: {
    fontSize: 14,
    color: '#666',
  },
  bienestarAlertaContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
    gap: 8,
  },
  bienestarAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  alertaCritica: {
    backgroundColor: '#FFF0F0',
  },
  alertaNueva: {
    backgroundColor: '#FFF8E0',
  },
  bienestarAlertaTexto: {
    fontSize: 14,
    fontWeight: '600',
  },
  textoCritico: {
    color: '#FF6B6B',
  },
  textoNuevo: {
    color: '#FFB84D',
  },
  temaCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temaIcono: {
    width: 60,
    height: 60,
    backgroundColor: '#E8D5FF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temaInfo: {
    flex: 1,
  },
  temaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  temaTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  temaBoton: {
    backgroundColor: '#4B0082',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  temaBotonTexto: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  temaVacioCard: { // <-- NUEVO
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  temaVacioTexto: { // <-- NUEVO
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  alertaHistorialCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  alertaHistorialInfo: {
    flex: 1,
  },
  alertaHistorialTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  alertaHistorialFecha: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bottomSpacer: {
    height: 40,
  },
});