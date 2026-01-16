import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
import { API_URL } from '../src/config/api';

export default function BuenosMomentosScreen() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMensajes = async () => {
    try {
      // 1. Obtener sesión del niño
      const childJson = await AsyncStorage.getItem('currentChild');
      console.log("Datos del niño en memoria:", childJson); // DEBUG

      if (!childJson) {
        console.error("No se encontró sesión de niño en AsyncStorage");
        return;
      }
      
      const child = JSON.parse(childJson);
      
      // Asegurarnos de tener un ID válido
      const childId = child.id || child.id_nino; 
      if (!childId) {
        console.error("El objeto niño no tiene propiedad 'id'", child);
        return;
      }

      console.log(`Buscando mensajes para ID: ${childId} en ${API_URL}/mensajes/${childId}`);

      // 2. Petición al servidor
      const response = await fetch(`${API_URL}/mensajes/${childId}`);
      const data = await response.json();
      
      console.log("Respuesta del servidor:", data); // DEBUG

      if (data.success) {
        setMensajes(data.mensajes);
      } else {
        console.error("Error en respuesta:", data.message);
      }
    } catch (error) {
      console.error("Error al hacer fetch:", error);
      Alert.alert("Error", "No se pudo conectar para leer los mensajes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  const handleMarcarLeido = async (id: number, visto: boolean) => {
    if (visto) return;
    
    // Actualizar UI inmediatamente (Optimistic UI)
    const nuevosMensajes: any = mensajes.map((m: any) => 
        m.id === id ? { ...m, visto_por_nino: 1 } : m
    );
    setMensajes(nuevosMensajes);

    // Avisar al servidor
    try {
        await fetch(`${API_URL}/mensajes/${id}/leido`, { method: 'PUT' });
    } catch (e) {
        console.error("Error marcando leído", e);
    }
  };

  return (
    <LinearGradient colors={['#FFF0F5', '#E6E6FA']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4B0082" />
        </TouchableOpacity>
        <Text style={styles.title}>Buenos Momentos 💌</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView 
            contentContainerStyle={styles.list}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMensajes(); }} />
            }
        >
          {mensajes.length > 0 ? mensajes.map((msg: any) => (
            <TouchableOpacity 
                key={msg.id} 
                style={[styles.card, !msg.visto_por_nino && styles.cardNuevo]}
                onPress={() => handleMarcarLeido(msg.id, msg.visto_por_nino)}
                activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={{fontSize:24}}>👨‍👩‍👧‍👦</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={styles.remitente}>De: Papá y Mamá</Text>
                    <Text style={styles.fecha}>
                        {new Date(msg.fecha_envio).toLocaleDateString()}
                    </Text>
                </View>
                {!msg.visto_por_nino && (
                    <View style={styles.badgeNuevo}>
                        <Text style={styles.badgeText}>NUEVO</Text>
                    </View>
                )}
              </View>

              <Text style={styles.mensaje}>{msg.mensaje}</Text>

              {msg.monedas_regalo > 0 && (
                <View style={styles.giftContainer}>
                    <Text style={styles.giftText}>¡Te enviaron un regalo!</Text>
                    <View style={styles.coinTag}>
                        <Text>🪙 +{msg.monedas_regalo}</Text>
                    </View>
                </View>
              )}
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyState}>
                <Ionicons name="mail-open-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Aún no tienes mensajes.</Text>
                <Text style={styles.emptySubText}>Dile a tus papis que te escriban.</Text>
                {/* Botón Debug solo para desarrollo */}
                <TouchableOpacity onPress={fetchMensajes} style={{marginTop: 20}}>
                    <Text style={{color:'#999'}}>Toca para recargar</Text>
                </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4B0082' },
  list: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:5, elevation:2 },
  cardNuevo: { borderLeftWidth: 5, borderLeftColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  avatarContainer: { width: 45, height: 45, backgroundColor: '#E0F7FA', borderRadius: 25, justifyContent:'center', alignItems:'center' },
  remitente: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  fecha: { fontSize: 12, color: '#999' },
  badgeNuevo: { backgroundColor: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  mensaje: { fontSize: 16, color: '#444', lineHeight: 24, fontStyle: 'italic' },
  giftContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  giftText: { color: '#4CAF50', fontWeight: 'bold' },
  coinTag: { backgroundColor: '#FFF9C4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: '#FBC02D' },
  emptyState: { alignItems: 'center', marginTop: 60, opacity: 0.7 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 20 },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 5 }
});