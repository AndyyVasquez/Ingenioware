import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    AvatarEquipado,
    ItemAccesorio,
    ItemTienda,
    tiendaItems
} from './data/tiendaData';


export default function MiArmarioScreen() {
  const router = useRouter();
  const [monedas, setMonedas] = useState(0);
  const [tab, setTab] = useState<'avatar' | 'tienda'>('avatar');
  const [modalTienda, setModalTienda] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<ItemAccesorio['tipo']>('sombrero');
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemTienda | null>(null);

  const [avatarBase, setAvatarBase] = useState('?');
  const [equipado, setEquipado] = useState<AvatarEquipado>({
    sombrero: null,
    lentes: null,
    ropa: null,
    fondo: null,
  });
  const [inventario, setInventario] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalInventario, setModalInventario] = useState(false);
  const [categoriaInventario, setCategoriaInventario] = useState<ItemAccesorio['tipo']>('sombrero');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await AsyncStorage.multiGet([
        'childData',
        'monedas',
        'miInventario',
        'avatarEquipado'
      ]);

      const childDataStr = data[0][1];
      const monedasStr = data[1][1];
      const inventarioStr = data[2][1];
      const equipadoStr = data[3][1];

      if (childDataStr) {
        const childData = JSON.parse(childDataStr);
        setAvatarBase(childData.avatar_emoji || '🦁');
      }

      setMonedas(monedasStr ? parseInt(monedasStr, 10) : 50);
      setInventario(inventarioStr ? JSON.parse(inventarioStr) : []);

      if (equipadoStr) {
        setEquipado(JSON.parse(equipadoStr));
      } else {
        setEquipado({ sombrero: null, lentes: null, ropa: null, fondo: null });
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComprar = async (item: ItemTienda) => {
    if (monedas < item.precio) {
      Alert.alert('No tienes suficientes monedas', `Te faltan ${item.precio - monedas}.`);
      return;
    }

    const yaComprado = inventario.includes(item.id);
    if (yaComprado) {
      Alert.alert('¡Ya lo tienes!', 'Este item ya está en tu armario.');
      setModalTienda(false);
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

            const nuevoInventario = [...inventario, item.id];
            setInventario(nuevoInventario);
            
            try {
              await AsyncStorage.setItem('monedas', nuevasMonedas.toString());
              await AsyncStorage.setItem('miInventario', JSON.stringify(nuevoInventario));
            } catch (error) {
              console.error('Error guardando:', error);
            }

            setModalTienda(false);
            setTab('avatar');
            Alert.alert('¡Genial! 🎉', `${item.nombre} está ahora en tu armario`);
          },
        },
      ]
    );
  };

  const handleEquipar = async (itemId: string | null, tipo: ItemAccesorio['tipo']) => {
    const nuevoEquipado = { ...equipado };

    if (itemId === null) {
      nuevoEquipado[tipo] = null;
    } else {
      if (equipado[tipo] === itemId) {
        nuevoEquipado[tipo] = null;
      } else {
        nuevoEquipado[tipo] = itemId;
      }
    }
    
    setEquipado(nuevoEquipado);
    setModalInventario(false);

    try {
      await AsyncStorage.setItem('avatarEquipado', JSON.stringify(nuevoEquipado));
    } catch (error) {
      console.error('Error guardando item equipado:', error);
    }
  };

  const getCategoriaIcono = (tipo: ItemAccesorio['tipo']) => {
    const iconos = {
      sombrero: '🎩',
      lentes: '🕶️',
      ropa: '👕',
      fondo: '🏞️',
    };
    return iconos[tipo];
  };

  const itemsConEstado: ItemTienda[] = tiendaItems.map(item => ({
    ...item,
    comprado: inventario.includes(item.id)
  }));

  const itemsPorCategoria: ItemTienda[] = itemsConEstado.filter((item) => item.tipo === categoriaSeleccionada);
  
  const itemsEnArmario: ItemAccesorio[] = inventario
    .map(id => tiendaItems.find(item => item.id === id))
    .filter(Boolean) as ItemAccesorio[];
  
  const itemsEnArmarioPorCategoria = itemsEnArmario.filter(item => item.tipo === categoriaInventario);

  const sombreroEquipado = tiendaItems.find(item => item.id === equipado.sombrero);
  const lentesEquipados = tiendaItems.find(item => item.id === equipado.lentes);
  const ropaEquipada = tiendaItems.find(item => item.id === equipado.ropa);
  const fondoEquipado = tiendaItems.find(item => item.id === equipado.fondo);

  if (isLoading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={styles.loadingText}>Cargando armario...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Avatar</Text>
        <View style={styles.monedasBadge}>
          <Text style={styles.monedasText}>{monedas} 🪙</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'avatar' && styles.tabActive]}
          onPress={() => setTab('avatar')}
        >
          <Ionicons name="person" size={20} color={tab === 'avatar' ? '#FFF' : '#666'} />
          <Text style={[styles.tabText, tab === 'avatar' && styles.tabTextActive]}>
            Mi Avatar
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

      {tab === 'avatar' ? (
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCanvas}>
            {fondoEquipado && (
              <Image 
                source={fondoEquipado.imagenUrl}
                style={styles.accesorioFondo}
                onError={(e) => console.log('ERROR AL CARGAR FONDO:', e.nativeEvent.error)}
              />
            )}
            <Text style={styles.avatarBaseEmoji}>{avatarBase}</Text>
            {ropaEquipada && (
              <Image 
                source={ropaEquipada.imagenUrl}
                style={styles.accesorioRopa}
                onError={(e) => console.log('ERROR AL CARGAR ROPA:', e.nativeEvent.error)}
              />
            )}
            {lentesEquipados && (
              <Image 
                source={lentesEquipados.imagenUrl}
                style={styles.accesorioLentes}
                onError={(e) => console.log('ERROR AL CARGAR LENTES:', e.nativeEvent.error)}
              />
            )}
            {sombreroEquipado && (
             <Image 
                source={sombreroEquipado.imagenUrl}
                style={styles.accesorioSombrero}
                onError={(e) => console.log('ERROR AL CARGAR SOMBRERO:', e.nativeEvent.error)}
              />
            )}
          </View>
          
          <View style={styles.avatarInfo}>
            <TouchableOpacity
              style={styles.avatarInfoButton}
              onPress={() => setModalInventario(true)}
            >
              <Ionicons name="albums" size={20} color="#4B0082" />
              <Text style={styles.avatarInfoButtonText}>Mi Armario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarInfoButton}
              onPress={() => setTab('tienda')}
            >
              <Ionicons name="add-circle" size={20} color="#4B0082" />
              <Text style={styles.avatarInfoButtonText}>Comprar más</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriasContainer}
            contentContainerStyle={styles.categoriasContent}
          >
            {(['sombrero', 'lentes', 'ropa', 'fondo'] as ItemAccesorio['tipo'][]).map(
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
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}s
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          <View style={styles.itemsGrid}>
            {itemsPorCategoria.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, item.comprado && styles.itemComprado]}
                onPress={() => {
                  if (item.comprado) {
                    Alert.alert('¡Ya lo tienes!', 'Puedes equiparlo desde "Mi Armario".');
                  } else {
                    setItemSeleccionado(item);
                    setModalTienda(true);
                  }
                }}
              >
                <Text style={styles.itemEmoji}>{item.emojiIcono}</Text>
                <Text style={styles.itemNombre}>{item.nombre}</Text>
                <View style={[styles.itemPrecio, item.comprado && styles.precioComprado]}>
                  <Text style={[styles.itemPrecioTexto, item.comprado && styles.precioCompradoTexto]}>
                    {item.comprado ? 'Comprado' : `${item.precio} 🪙`}
                  </Text>
                </View>
                {item.comprado && (
                  <View style={styles.compradoBadge}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      <Modal visible={modalTienda} animationType="slide" transparent={true} onRequestClose={() => setModalTienda(false)}>
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

               <Text style={styles.modalEmoji}>{itemSeleccionado.emojiIcono}</Text>
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

      <Modal visible={modalInventario} animationType="slide" transparent={true} onRequestClose={() => setModalInventario(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalInventario(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitulo}>Mi Armario</Text>
            <Text style={styles.modalDescripcion}>
              ¡Toca un item para equiparlo o quitarlo!
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriasContainer}
              contentContainerStyle={styles.categoriasContent}
            >
              {(['sombrero', 'lentes', 'ropa', 'fondo'] as ItemAccesorio['tipo'][]).map(
                (categoria) => (
                  <TouchableOpacity
                    key={categoria}
                    style={[
                      styles.categoriaChip,
                      categoriaInventario === categoria && styles.categoriaChipActive,
                    ]}
                    onPress={() => setCategoriaInventario(categoria)}
                  >
                    <Text style={styles.categoriaEmoji}>{getCategoriaIcono(categoria)}</Text>
                    <Text
                      style={[
                        styles.categoriaText,
                        categoriaInventario === categoria && styles.categoriaTextActive,
                      ]}
                    >
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}s
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <ScrollView style={styles.armarioScroll}>
              <View style={styles.itemsGrid}>
                <TouchableOpacity
                  style={styles.itemCard}
                  onPress={() => handleEquipar(null, categoriaInventario)}
                >
                  <Text style={styles.itemEmoji}>🚫</Text>
                  <Text style={styles.itemNombre}>Quitar</Text>
                </TouchableOpacity>

                {itemsEnArmarioPorCategoria.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      equipado[item.tipo] === item.id && styles.itemEquipado,
                    ]}
                    onPress={() => handleEquipar(item.id, item.tipo)}
                  >
                    <Text style={styles.itemEmoji}>{item.emojiIcono}</Text>
                    <Text style={styles.itemNombre}>{item.nombre}</Text>
                    {equipado[item.tipo] === item.id && (
                      <View style={styles.compradoBadge}>
                        <Ionicons name="checkmark-circle" size={24} color="#4B0082" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4B0082',
    marginTop: 10,
  },
  avatarContainer: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCanvas: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarBaseEmoji: {
    fontSize: 150,
  },
  accesorioFondo: {
    ...StyleSheet.absoluteFillObject,
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: 0,
  },
  accesorioRopa: {
    position: 'absolute',
    width: 200,
    height: 90,
    bottom: -10,
    resizeMode: 'contain',
    zIndex: 2,
  },
  accesorioLentes: {
    position: 'absolute',
    width: 100,
    height: 130,
    top: 90,
    resizeMode: 'contain',
    zIndex: 3,
  },
  accesorioSombrero: {
    position: 'absolute',
    width: 130,
    height: 120,
    top: 40,
    resizeMode: 'contain',
    zIndex: 4,
  },
  avatarInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarInfoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInfoButtonText: {
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
    paddingRight: 20,
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
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
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
    minHeight: 180,
  },
  itemComprado: {
    opacity: 0.6,
  },
  itemEquipado: {
    borderColor: '#4B0082',
    borderWidth: 3,
    backgroundColor: '#E8D5FF',
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
    position: 'absolute',
    bottom: 16,
  },
  itemPrecioTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  precioComprado: {
    backgroundColor: '#4CAF50',
  },
  precioCompradoTexto: {
    color: '#FFF',
  },
  compradoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
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
    padding: 8,
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
  armarioScroll: {
    width: '100%',
    maxHeight: 300,
    marginTop: 20,
  },
});