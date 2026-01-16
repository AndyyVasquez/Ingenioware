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

export default function TiendaPremiosScreen() {
  const router = useRouter();
  const [monedas, setMonedas] = useState(0);
  const [itemsTienda, setItemsTienda] = useState([]);
  const [misItemsIds, setMisItemsIds] = useState<number[]>([]); // Para saber qué ya compramos
  const [categoria, setCategoria] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [childId, setChildId] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // 1. Obtener ID del niño
      const childJson = await AsyncStorage.getItem('currentChild');
      if (!childJson) return;
      const child = JSON.parse(childJson);
      setChildId(child.id);
      
      // 2. Obtener saldo actualizado del niño (desde API para estar seguros)
      // Usamos el endpoint de login/perfil o uno específico si tuviéramos
      // Por ahora confiamos en el dato local o hacemos un fetch rápido de "mi perfil"
      // (Para simplificar, usaremos el dato guardado localmente, pero idealmente haríamos fetch)
      setMonedas(child.monedas || 0); 

      // 3. Cargar Tienda e Inventario en paralelo
      const [resTienda, resInv] = await Promise.all([
        fetch(`${API_URL}/tienda/items`),
        fetch(`${API_URL}/inventario/${child.id}`)
      ]);

      const dataTienda = await resTienda.json();
      const dataInv = await resInv.json();

      if (dataTienda.success) setItemsTienda(dataTienda.items);
      if (dataInv.success) {
        // Guardamos solo los IDs de lo que ya tenemos para deshabilitar el botón comprar
        const ids = dataInv.inventario.map((i: any) => i.item_id);
        setMisItemsIds(ids);
      }

    } catch (error) {
      console.error("Error cargando tienda:", error);
      Alert.alert("Error", "No se pudo conectar a la tienda");
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = async (item: any) => {
    if (monedas < item.precio) {
      Alert.alert('¡Ups!', 'No tienes suficientes monedas para esto. ¡Sigue jugando para ganar más!');
      return;
    }

    Alert.alert(
      'Confirmar Compra',
      `¿Quieres comprar "${item.nombre}" por ${item.precio} monedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: '¡Sí, lo quiero!', 
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/tienda/comprar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  nino_id: childId,
                  item_id: item.id,
                  precio: item.precio
                })
              });

              const data = await response.json();

              if (data.success) {
                Alert.alert('¡Felicidades!', '¡Nuevo artículo añadido a tu armario!');
                
                // Actualizar UI localmente
                setMonedas(data.nuevoSaldo);
                setMisItemsIds([...misItemsIds, item.id]);

                // Actualizar saldo en AsyncStorage para otras pantallas
                const childJson = await AsyncStorage.getItem('currentChild');
                if (childJson) {
                    const child = JSON.parse(childJson);
                    child.monedas = data.nuevoSaldo;
                    await AsyncStorage.setItem('currentChild', JSON.stringify(child));
                }
              } else {
                Alert.alert('Error', data.message);
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo procesar la compra');
            }
          }
        }
      ]
    );
  };

  const itemsFiltrados = categoria === 'Todos' 
    ? itemsTienda 
    : itemsTienda.filter((i: any) => i.tipo.toLowerCase() === categoria.toLowerCase());

  const categorias = ['Todos', 'Sombrero', 'Lentes', 'Ropa', 'Fondo'];

  return (
    <LinearGradient colors={['#FFF5E6', '#FFD180']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E65100" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tienda de Premios</Text>
        
        {/* Monedas */}
        <View style={styles.monedasContainer}>
          <Text style={styles.monedasEmoji}>🪙</Text>
          <Text style={styles.monedasText}>{monedas}</Text>
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.categoriasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20, gap: 10}}>
            {categorias.map(cat => (
                <TouchableOpacity 
                    key={cat} 
                    style={[styles.catChip, categoria === cat && styles.catChipActive]}
                    onPress={() => setCategoria(cat)}
                >
                    <Text style={[styles.catText, categoria === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {loading ? <ActivityIndicator size="large" color="#E65100" style={{marginTop: 50}} /> : (
        <ScrollView contentContainerStyle={styles.grid}>
          {itemsFiltrados.length > 0 ? itemsFiltrados.map((item: any) => {
            const yaComprado = misItemsIds.includes(item.id);
            return (
              <View key={item.id} style={[styles.card, yaComprado && styles.cardComprado]}>
                <Image 
                    source={{ uri: item.imagen_url || 'https://via.placeholder.com/100' }} 
                    style={[styles.itemImage, yaComprado && {opacity: 0.6}]} 
                />
                <Text style={styles.itemName}>{item.nombre}</Text>
                
                {yaComprado ? (
                    <View style={styles.ownedBadge}>
                        <Text style={styles.ownedText}>Comprado</Text>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.buyButton} 
                        onPress={() => handleComprar(item)}
                    >
                        <Text style={styles.price}>{item.precio}</Text>
                        <Text style={{fontSize:14}}>🪙</Text>
                    </TouchableOpacity>
                )}
              </View>
            );
          }) : (
            <Text style={{textAlign:'center', color:'#888', marginTop: 40}}>No hay artículos aquí.</Text>
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#E65100' },
  monedasContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 2, borderColor: '#FFB74D' },
  monedasEmoji: { fontSize: 18, marginRight: 5 },
  monedasText: { fontWeight: 'bold', fontSize: 16, color: '#E65100' },
  categoriasContainer: { height: 50, marginBottom: 10 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20, marginRight: 5 },
  catChipActive: { backgroundColor: '#E65100' },
  catText: { color: '#E65100', fontWeight: '600' },
  catTextActive: { color: '#FFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 10, alignItems: 'center', marginBottom: 15, shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  cardComprado: { backgroundColor: '#F5F5F5' },
  itemImage: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 10 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10, height: 40 },
  buyButton: { flexDirection: 'row', backgroundColor: '#FF9800', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 5 },
  price: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  ownedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8 },
  ownedText: { color: '#4CAF50', fontWeight: 'bold' }
});