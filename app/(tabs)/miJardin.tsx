import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Tipos de items
interface ItemJardin {
  id: string;
  tipo: 'planta' | 'animal' | 'decoracion' | 'edificio';
  emoji: string;
  nombre: string;
  precio: number;
  descripcion: string;
  comprado: boolean;
}

// Mi jardín actual
interface MiItem {
  id: string;
  itemId: string;
  emoji: string;
  posicion: { x: number; y: number };
}

export default function MiJardinScreen() {
  const router = useRouter();
  const [monedas, setMonedas] = useState(12);
  const [tab, setTab] = useState<'jardin' | 'tienda'>('jardin');
  const [modalTienda, setModalTienda] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ItemJardin['tipo']>('planta');
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemJardin | null>(null);

  // Items disponibles en la tienda
  const tiendaItems: ItemJardin[] = [
    // Plantas
    { id: '1', tipo: 'planta', emoji: '🌻', nombre: 'Girasol', precio: 2, descripcion: 'Brillante y alegre', comprado: false },
    { id: '2', tipo: 'planta', emoji: '🌹', nombre: 'Rosa', precio: 3, descripcion: 'Elegante y bonita', comprado: false },
    { id: '3', tipo: 'planta', emoji: '🌷', nombre: 'Tulipán', precio: 3, descripcion: 'Colorido y fresco', comprado: false },
    { id: '4', tipo: 'planta', emoji: '🌳', nombre: 'Árbol', precio: 5, descripcion: 'Grande y fuerte', comprado: false },
    
    // Animales
    { id: '5', tipo: 'animal', emoji: '🐰', nombre: 'Conejito', precio: 5, descripcion: 'Saltarín y tierno', comprado: true },
    { id: '6', tipo: 'animal', emoji: '🐶', nombre: 'Perrito', precio: 6, descripcion: 'Leal y juguetón', comprado: false },
    { id: '7', tipo: 'animal', emoji: '🦋', nombre: 'Mariposa', precio: 4, descripcion: 'Vuela libremente', comprado: false },
    { id: '8', tipo: 'animal', emoji: '🐦', nombre: 'Pajarito', precio: 4, descripcion: 'Canta bonito', comprado: false },
    { id: '9', tipo: 'animal', emoji: '🐱', nombre: 'Gatito', precio: 6, descripcion: 'Suave y mimoso', comprado: false },
    
    // Decoraciones
    { id: '10', tipo: 'decoracion', emoji: '⛲', nombre: 'Fuente', precio: 8, descripcion: 'Agua cristalina', comprado: false },
    { id: '11', tipo: 'decoracion', emoji: '🪨', nombre: 'Rocas', precio: 3, descripcion: 'Naturales', comprado: false },
    { id: '12', tipo: 'decoracion', emoji: '🌈', nombre: 'Arcoíris', precio: 10, descripcion: 'Mágico y colorido', comprado: false },
    { id: '13', tipo: 'decoracion', emoji: '🎪', nombre: 'Carpa', precio: 7, descripcion: 'Para fiestas', comprado: false },
    
    // Edificios
    { id: '14', tipo: 'edificio', emoji: '🏠', nombre: 'Casita', precio: 15, descripcion: 'Tu hogar perfecto', comprado: false },
    { id: '15', tipo: 'edificio', emoji: '🏰', nombre: 'Castillo', precio: 20, descripcion: 'Majestuoso', comprado: false },
    { id: '16', tipo: 'edificio', emoji: '🎠', nombre: 'Carrusel', precio: 12, descripcion: 'Gira y gira', comprado: false },
  ];

  // Mi jardín actual
  const [miJardin, setMiJardin] = useState<MiItem[]>([
    { id: '1', itemId: '5', emoji: '🐰', posicion: { x: 50, y: 150 } },
    { id: '2', itemId: '1', emoji: '🌻', posicion: { x: 150, y: 100 } },
    { id: '3', itemId: '4', emoji: '🌳', posicion: { x: 250, y: 120 } },
  ]);

  const itemsPorCategoria = tiendaItems.filter((item) => item.tipo === categoriaSeleccionada);

  const handleComprar = async (item: ItemJardin) => {
    if (monedas < item.precio) {
      Alert.alert(
        'No tienes suficientes monedas',
        `Necesitas ${item.precio} monedas. Te faltan ${item.precio - monedas}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `¿Comprar ${item.nombre}?`,
      `Cuesta ${item.precio} monedas 🪙`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: async () => {
            const nuevasMonedas = monedas - item.precio;
            setMonedas(nuevasMonedas);

            // Agregar al jardín en posición aleatoria
            const nuevoItem: MiItem = {
              id: Date.now().toString(),
              itemId: item.id,
              emoji: item.emoji,
              posicion: {
                x: Math.random() * 250 + 20,
                y: Math.random() * 200 + 50,
              },
            };

            setMiJardin([...miJardin, nuevoItem]);

            // Guardar
            try {
              await AsyncStorage.setItem('monedas', nuevasMonedas.toString());
              await AsyncStorage.setItem('miJardin', JSON.stringify([...miJardin, nuevoItem]));
            } catch (error) {
              console.error('Error guardando:', error);
            }

            setModalTienda(false);
            setTab('jardin');

            Alert.alert('¡Genial! 🎉', `${item.nombre} está ahora en tu jardín`);
          },
        },
      ]
    );
  };

  const getCategoriaIcono = (tipo: ItemJardin['tipo']) => {
    const iconos = {
      planta: '🌱',
      animal: '🐾',
      decoracion: '✨',
      edificio: '🏗️',
    };
    return iconos[tipo];
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Jardín Mágico</Text>
        <View style={styles.monedasBadge}>
          <Text style={styles.monedasText}>{monedas} 🪙</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'jardin' && styles.tabActive]}
          onPress={() => setTab('jardin')}
        >
          <Ionicons name="leaf" size={20} color={tab === 'jardin' ? '#FFF' : '#666'} />
          <Text style={[styles.tabText, tab === 'jardin' && styles.tabTextActive]}>
            Mi Jardín
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === 'tienda' && styles.tabActive]}
          onPress={() => setTab('tienda')}
        >
          <Ionicons name="storefront" size={20} color={tab === 'tienda' ? '#FFF' : '#666'} />
          <Text style={[styles.tabText, tab === 'tienda' && styles.tabTextActive]}>Tienda</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      {tab === 'jardin' ? (
        <View style={styles.jardinContainer}>
          <View style={styles.jardinCanvas}>
            {miJardin.length === 0 ? (
              <View style={styles.jardinVacio}>
                <Text style={styles.jardinVacioEmoji}>🌱</Text>
                <Text style={styles.jardinVacioTexto}>Tu jardín está vacío</Text>
                <Text style={styles.jardinVacioSubtexto}>¡Compra cosas en la tienda!</Text>
              </View>
            ) : (
              miJardin.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.jardinItem,
                    {
                      left: item.posicion.x,
                      top: item.posicion.y,
                    },
                  ]}
                >
                  <Text style={styles.jardinItemEmoji}>{item.emoji}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.jardinInfo}>
            <Text style={styles.jardinInfoTitulo}>🌟 Tu Jardín</Text>
            <Text style={styles.jardinInfoTexto}>Tienes {miJardin.length} elementos</Text>
            <TouchableOpacity
              style={styles.jardinInfoButton}
              onPress={() => setTab('tienda')}
            >
              <Ionicons name="add-circle" size={20} color="#4B0082" />
              <Text style={styles.jardinInfoButtonText}>Agregar más</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Categorías */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriasContainer}
            contentContainerStyle={styles.categoriasContent}
          >
            {(['planta', 'animal', 'decoracion', 'edificio'] as ItemJardin['tipo'][]).map(
              (categoria) => (
                <TouchableOpacity
                  key={categoria}
                  style={[
                    styles.categoriaChip,
                    categoriaSeleccionada === categoria && styles.categoriaChipActive,
                  ]}
                  onPress={() => setCategoriaSeleccionada(categoria)}
                >
                  <Text style={styles.categoriaEmoji}>{getCategoriaIcono(categoria)}</Text>
                  <Text
                    style={[
                      styles.categoriaText,
                      categoriaSeleccionada === categoria && styles.categoriaTextActive,
                    ]}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    {categoria === 'decoracion' && 'es'}
                    {categoria !== 'decoracion' && 's'}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          {/* Grid de items */}
          <View style={styles.itemsGrid}>
            {itemsPorCategoria.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => {
                  setItemSeleccionado(item);
                  setModalTienda(true);
                }}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemNombre}>{item.nombre}</Text>
                <View style={styles.itemPrecio}>
                  <Text style={styles.itemPrecioTexto}>{item.precio} 🪙</Text>
                </View>
                {item.comprado && (
                  <View style={styles.compradoBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Modal de compra */}
      <Modal visible={modalTienda} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {itemSeleccionado && (
              <>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setModalTienda(false)}
                >
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>

                <Text style={styles.modalEmoji}>{itemSeleccionado.emoji}</Text>
                <Text style={styles.modalTitulo}>{itemSeleccionado.nombre}</Text>
                <Text style={styles.modalDescripcion}>{itemSeleccionado.descripcion}</Text>

                <View style={styles.modalPrecio}>
                  <Text style={styles.modalPrecioLabel}>Precio:</Text>
                  <Text style={styles.modalPrecioValor}>
                    {itemSeleccionado.precio} 🪙
                  </Text>
                </View>

                <View style={styles.modalBalance}>
                  <Text style={styles.modalBalanceLabel}>Tus monedas:</Text>
                  <Text style={styles.modalBalanceValor}>{monedas} 🪙</Text>
                </View>

                {monedas >= itemSeleccionado.precio ? (
                  <TouchableOpacity
                    style={styles.comprarButton}
                    onPress={() => handleComprar(itemSeleccionado)}
                  >
                    <Ionicons name="cart" size={20} color="#FFF" />
                    <Text style={styles.comprarButtonText}>Comprar</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.noMonedasContainer}>
                    <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
                    <Text style={styles.noMonedasTexto}>
                      Te faltan {itemSeleccionado.precio - monedas} monedas
                    </Text>
                    <TouchableOpacity
                      style={styles.ganarMasButton}
                      onPress={() => {
                        setModalTienda(false);
                        router.push('/bancoEstrellas');
                      }}
                    >
                      <Text style={styles.ganarMasButtonText}>
                        Ganar más monedas
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
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
  monedasBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  monedasText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
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
  jardinContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  jardinCanvas: {
    flex: 1,
    backgroundColor: 'rgba(149, 225, 211, 0.3)',
    borderRadius: 20,
    position: 'relative',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#95E1D3',
  },
  jardinVacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jardinVacioEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  jardinVacioTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 8,
  },
  jardinVacioSubtexto: {
    fontSize: 14,
    color: '#666',
  },
  jardinItem: {
    position: 'absolute',
  },
  jardinItemEmoji: {
    fontSize: 40,
  },
  jardinInfo: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jardinInfoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  jardinInfoTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  jardinInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8D5FF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  jardinInfoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B0082',
  },
  content: {
    paddingHorizontal: 20,
  },
  categoriasContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoriasContent: {
    gap: 10,
  },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  categoriaChipActive: {
    backgroundColor: '#4B0082',
    borderColor: '#4B0082',
  },
  categoriaEmoji: {
    fontSize: 20,
  },
  categoriaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoriaTextActive: {
    color: '#FFF',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
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
    position: 'relative',
  },
  itemEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  itemNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  itemPrecio: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemPrecioTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  compradoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 30,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  modalDescripcion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalPrecio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  modalPrecioLabel: {
    fontSize: 16,
    color: '#666',
  },
  modalPrecioValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  modalBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  modalBalanceLabel: {
    fontSize: 14,
    color: '#999',
  },
  modalBalanceValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  comprarButton: {
    backgroundColor: '#4B0082',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  comprarButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  noMonedasContainer: {
    alignItems: 'center',
    width: '100%',
  },
  noMonedasTexto: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  ganarMasButton: {
    backgroundColor: '#FFD93D',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  ganarMasButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});