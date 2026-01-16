import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../src/config/api';

export default function MiArmarioScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [childId, setChildId] = useState<number | null>(null);

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    try {
      const childJson = await AsyncStorage.getItem('currentChild');
      if (!childJson) return;
      const child = JSON.parse(childJson);
      setChildId(child.id);

      const response = await fetch(`${API_URL}/inventario/${child.id}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.inventario);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipar = async (item: any) => {
    try {
        const response = await fetch(`${API_URL}/inventario/equipar`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nino_id: childId,
                item_id: item.es_equipado ? null : item.item_id, // Si ya lo tiene, se lo quita (null)
                tipo: item.tipo
            })
        });
        const data = await response.json();
        
        if(data.success) {
            fetchInventario(); // Recargar para ver el cambio visual
            Alert.alert("¡Listo!", item.es_equipado ? "Te quitaste el artículo." : "¡Te queda genial!");
        }
    } catch (e) { Alert.alert("Error", "No se pudo equipar"); }
  };

  return (
    <LinearGradient colors={['#E1F5FE', '#B3E5FC']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0288D1" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Armario 🧢</Text>
        <View style={{width: 40}} />
      </View>

      {loading ? <ActivityIndicator size="large" color="#0288D1" style={{marginTop: 50}}/> : (
        <ScrollView contentContainerStyle={styles.grid}>
            {items.length > 0 ? items.map((item: any) => (
                <TouchableOpacity 
                    key={item.id} 
                    style={[styles.card, item.es_equipado && styles.cardEquipado]}
                    onPress={() => handleEquipar(item)}
                >
                    {item.es_equipado && (
                        <View style={styles.badge}><Text style={styles.badgeText}>PUESTO</Text></View>
                    )}
                    <Image source={{uri: item.imagen_url}} style={styles.img} />
                    <Text style={styles.name}>{item.nombre}</Text>
                </TouchableOpacity>
            )) : (
                <View style={styles.emptyState}>
                    <Ionicons name="shirt-outline" size={60} color="#ccc"/>
                    <Text style={{color:'#666', marginTop:10}}>Aún no has comprado ropa.</Text>
                    <TouchableOpacity onPress={() => router.push('/tiendaPremios')} style={styles.btnIrTienda}>
                        <Text style={{color:'#FFF', fontWeight:'bold'}}>Ir a la Tienda</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#0277BD' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 15, alignItems: 'center', marginBottom: 15, elevation: 3, borderWidth: 2, borderColor: 'transparent' },
  cardEquipado: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  img: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 10 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  badge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#4CAF50', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  emptyState: { width: '100%', alignItems: 'center', marginTop: 50 },
  btnIrTienda: { marginTop: 20, backgroundColor: '#FF9800', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }
});