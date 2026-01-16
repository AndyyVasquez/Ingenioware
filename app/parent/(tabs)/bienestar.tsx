import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../../../src/config/api';
import { useParentData } from '../parentDataContext';

export default function BienestarScreen() {
  const { childData, alertasNuevas, alertasCriticas } = useParentData(); 
  
  // Estados locales para datos detallados
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historialAlertas, setHistorialAlertas] = useState<any[]>([]);
  const [tema, setTema] = useState<any>(null);

  const fetchBienestar = async () => {
    if (!childData) return;

    try {
      const response = await fetch(`${API_URL}/bienestar/${childData.id}`);
      const data = await response.json();

      if (data.success) {
        setHistorialAlertas(data.historialAlertas);
        setTema(data.temaDelDia);
      }
    } catch (error) {
      console.error("Error cargando bienestar:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBienestar();
  }, [childData]);

  const handleVerSugerencia = () => {
    if (!tema) return;
    Alert.alert(tema.titulo, tema.pregunta, [{ text: '¡Lo intentaré!' }]);
  };

  if (loading && !refreshing) {
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
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBienestar(); }} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bienestar Emocional</Text>
          <Text style={styles.subtitle}>Reporte de {childData?.nombre}</Text>
        </View>

        {/* Sección del Diario de Valo (Resumen) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado Actual</Text>
          <View style={styles.bienestarCard}>
            <View style={styles.bienestarItem}>
              <View style={styles.bienestarIcono}>
                <Text style={styles.bienestarEmoji}>🐻</Text>
              </View>
              <View style={styles.bienestarInfo}>
                <Text style={styles.bienestarTitulo}>Diario de Valo</Text>
                <Text style={styles.bienestarTexto}>
                  Monitoreo de emociones en tiempo real.
                </Text>
              </View>
            </View>

            {/* Alertas del Contexto (Resumen rápido) */}
            {(alertasNuevas > 0 || alertasCriticas > 0) ? (
              <View style={styles.bienestarAlertaContainer}>
                {alertasCriticas > 0 && (
                  <View style={[styles.bienestarAlerta, styles.alertaCritica]}>
                    <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                    <Text style={[styles.bienestarAlertaTexto, styles.textoCritico]}>
                      {alertasCriticas} Alertas Críticas (Negativas)
                    </Text>
                  </View>
                )}
                {alertasNuevas > 0 && (
                  <View style={[styles.bienestarAlerta, styles.alertaNueva]}>
                    <Ionicons name="notifications" size={20} color="#FFB84D" />
                    <Text style={[styles.bienestarAlertaTexto, styles.textoNuevo]}>
                      {alertasNuevas} Emociones Nuevas
                    </Text>
                  </View>
                )}
              </View>
            ) : (
                <View style={{marginTop: 15, padding: 10, backgroundColor: '#E8F5E9', borderRadius: 8}}>
                    <Text style={{color: '#2E7D32', fontWeight: '600', textAlign:'center'}}>
                        Todo tranquilo. No hay emociones negativas recientes.
                    </Text>
                </View>
            )}
          </View>
        </View>
        
        {/* Temas de Conversación (Dinámico) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tema de Conversación</Text>
          
          <View style={styles.temaCard}>
            <View style={styles.temaIcono}>
                <Ionicons name={tema?.icono || 'chatbubbles'} size={32} color="#4B0082" />
            </View>
            <View style={styles.temaInfo}>
                <Text style={styles.temaTitulo}>{tema?.titulo || 'Cargando...'}</Text>
                <Text style={styles.temaTexto}>
                    {tema?.descripcion || 'Valo está analizando el progreso...'}
                </Text>
                <TouchableOpacity 
                    style={styles.temaBoton}
                    onPress={handleVerSugerencia}
                >
                    <Text style={styles.temaBotonTexto}>Ver sugerencia</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Historial Detallado de Alertas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Emociones</Text>
          
          {historialAlertas.length > 0 ? (
              historialAlertas.map((alerta: any) => (
                <View key={alerta.id} style={styles.alertaHistorialCard}>
                    <View style={{backgroundColor: '#FFEEBEE', padding: 8, borderRadius: 20}}>
                        <Text style={{fontSize: 20}}>
                            {alerta.emocion === 'triste' ? '😢' : 
                             alerta.emocion === 'enojado' ? '😠' : 
                             alerta.emocion === 'miedo' ? '😨' : '😐'}
                        </Text>
                    </View>
                    <View style={styles.alertaHistorialInfo}>
                        <Text style={styles.alertaHistorialTitulo}>Se sintió {alerta.emocion}</Text>
                        {alerta.texto ? (
                            <Text style={{color:'#555', fontStyle:'italic', marginTop:2}}>{alerta.texto}</Text>
                        ) : null}
                        <Text style={styles.alertaHistorialFecha}>
                            {new Date(alerta.fecha).toLocaleDateString()} a las {new Date(alerta.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Text>
                    </View>
                </View>
              ))
          ) : (
              <Text style={{textAlign:'center', color:'#666', fontStyle:'italic', marginTop: 10}}>
                  El historial está limpio.
              </Text>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4B0082' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  
  bienestarCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  bienestarItem: { flexDirection: 'row', alignItems: 'center' },
  bienestarIcono: { width: 50, height: 50, backgroundColor: '#FFE4B5', borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  bienestarEmoji: { fontSize: 28 },
  bienestarInfo: { flex: 1 },
  bienestarTitulo: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  bienestarTexto: { fontSize: 14, color: '#666' },
  
  bienestarAlertaContainer: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 16, gap: 8 },
  bienestarAlerta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 8 },
  alertaCritica: { backgroundColor: '#FFF0F0' },
  alertaNueva: { backgroundColor: '#FFF8E0' },
  bienestarAlertaTexto: { fontSize: 14, fontWeight: '600' },
  textoCritico: { color: '#FF6B6B' },
  textoNuevo: { color: '#FFB84D' },

  temaCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  temaIcono: { width: 60, height: 60, backgroundColor: '#E8D5FF', borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  temaInfo: { flex: 1 },
  temaTitulo: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  temaTexto: { fontSize: 14, color: '#666', marginBottom: 12 },
  temaBoton: { backgroundColor: '#4B0082', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' },
  temaBotonTexto: { color: '#FFF', fontWeight: '600', fontSize: 12 },

  alertaHistorialCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12, elevation: 1 },
  alertaHistorialInfo: { flex: 1 },
  alertaHistorialTitulo: { fontSize: 16, fontWeight: '500', color: '#333' },
  alertaHistorialFecha: { fontSize: 12, color: '#999', marginTop: 4 },
  
  bottomSpacer: { height: 40 },
});