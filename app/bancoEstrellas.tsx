import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HistorialItem {
  id: number;
  tipo: 'ganado' | 'convertido' | 'gastado';
  cantidad: number;
  descripcion: string;
  fecha: string;
  icono: string;
}

export default function BancoEstrellasScreen() {
  const router = useRouter();
  const [estrellas, setEstrellas] = useState(127); // Total ganadas
  const [monedas, setMonedas] = useState(12); // Monedas disponibles
  const [cantidadConvertir, setCantidadConvertir] = useState(10);
  
  // Animación
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const historial: HistorialItem[] = [
    {
      id: 1,
      tipo: 'ganado',
      cantidad: 15,
      descripcion: 'Completaste el cuento "El León Valiente"',
      fecha: 'Hace 2 horas',
      icono: 'book',
    },
    {
      id: 2,
      tipo: 'convertido',
      cantidad: 10,
      descripcion: 'Convertiste 10 estrellas en 1 moneda',
      fecha: 'Ayer',
      icono: 'swap-horizontal',
    },
    {
      id: 3,
      tipo: 'gastado',
      cantidad: 5,
      descripcion: 'Compraste un Conejito para tu jardín',
      fecha: 'Hace 2 días',
      icono: 'cart',
    },
    {
      id: 4,
      tipo: 'ganado',
      cantidad: 20,
      descripcion: 'Ganaste 3 juegos de valores',
      fecha: 'Hace 3 días',
      icono: 'game-controller',
    },
  ];

  const puedeConvertir = estrellas >= cantidadConvertir;
  const monedasResultantes = Math.floor(cantidadConvertir / 10);

  const handleConvertir = async () => {
    if (!puedeConvertir) {
      Alert.alert('Oops', 'No tienes suficientes estrellas');
      return;
    }

    // Animación
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const nuevasEstrellas = estrellas - cantidadConvertir;
    const nuevasMonedas = monedas + monedasResultantes;

    setEstrellas(nuevasEstrellas);
    setMonedas(nuevasMonedas);

    // Guardar en AsyncStorage
    try {
      await AsyncStorage.setItem('estrellas', nuevasEstrellas.toString());
      await AsyncStorage.setItem('monedas', nuevasMonedas.toString());
    } catch (error) {
      console.error('Error guardando:', error);
    }

    Alert.alert(
      '¡Genial! 🎉',
      `Ahora tienes ${nuevasMonedas} monedas de oro`,
      [{ text: 'OK' }]
    );
  };

  const ajustarCantidad = (incremento: number) => {
    const nueva = cantidadConvertir + incremento;
    if (nueva >= 10 && nueva <= estrellas) {
      setCantidadConvertir(nueva);
    }
  };

  const getColorTipo = (tipo: HistorialItem['tipo']) => {
    const colores = {
      ganado: '#4CAF50',
      convertido: '#FFD93D',
      gastado: '#FF6B6B',
    };
    return colores[tipo];
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Banco de Estrellas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Balance Cards */}
        <View style={styles.balanceContainer}>
          {/* Estrellas */}
          <View style={[styles.balanceCard, { backgroundColor: '#FFD93D' }]}>
            <Text style={styles.balanceEmoji}>⭐</Text>
            <Text style={styles.balanceLabel}>Estrellas</Text>
            <Text style={styles.balanceAmount}>{estrellas}</Text>
          </View>

          {/* Monedas */}
          <Animated.View
            style={[
              styles.balanceCard,
              { backgroundColor: '#FFA500', transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.balanceEmoji}>🪙</Text>
            <Text style={styles.balanceLabel}>Monedas</Text>
            <Text style={styles.balanceAmount}>{monedas}</Text>
          </Animated.View>
        </View>

        {/* Info de conversión */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 ¿Sabías que...?</Text>
          <Text style={styles.infoText}>
            Cada 10 estrellas ⭐ = 1 moneda de oro 🪙
          </Text>
          <Text style={styles.infoSubtext}>
            Usa las monedas para comprar cosas en tu Jardín Mágico o solicitar premios reales
          </Text>
        </View>

        {/* Conversor */}
        <View style={styles.conversorCard}>
          <Text style={styles.conversorTitle}>Convertir Estrellas</Text>

          <View style={styles.conversorControls}>
            <TouchableOpacity
              style={styles.conversorButton}
              onPress={() => ajustarCantidad(-10)}
              disabled={cantidadConvertir <= 10}
            >
              <Ionicons name="remove" size={24} color="#4B0082" />
            </TouchableOpacity>

            <View style={styles.conversorDisplay}>
              <Text style={styles.conversorEstrellas}>{cantidadConvertir} ⭐</Text>
              <Ionicons name="arrow-forward" size={20} color="#999" />
              <Text style={styles.conversorMonedas}>{monedasResultantes} 🪙</Text>
            </View>

            <TouchableOpacity
              style={styles.conversorButton}
              onPress={() => ajustarCantidad(10)}
              disabled={cantidadConvertir + 10 > estrellas}
            >
              <Ionicons name="add" size={24} color="#4B0082" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.convertirButton, !puedeConvertir && styles.convertirButtonDisabled]}
            onPress={handleConvertir}
            disabled={!puedeConvertir}
          >
            <Ionicons name="swap-horizontal" size={20} color="#FFF" />
            <Text style={styles.convertirButtonText}>Convertir Ahora</Text>
          </TouchableOpacity>
        </View>

        {/* Accesos rápidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué quieres hacer?</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/miArmario')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#95E1D3' }]}>
                <Text style={styles.quickActionEmoji}>👖</Text>
              </View>
              <Text style={styles.quickActionText}>Mi armario</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/tiendaPremios')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF8FAB' }]}>
                <Text style={styles.quickActionEmoji}>🎁</Text>
              </View>
              <Text style={styles.quickActionText}>Premios</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Historial */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 Historial</Text>

          {historial.map((item) => (
            <View key={item.id} style={styles.historialItem}>
              <View style={[styles.historialIcon, { backgroundColor: getColorTipo(item.tipo) }]}>
                <Ionicons name={item.icono as any} size={20} color="#FFF" />
              </View>

              <View style={styles.historialInfo}>
                <Text style={styles.historialDescripcion}>{item.descripcion}</Text>
                <Text style={styles.historialFecha}>{item.fecha}</Text>
              </View>

              <Text style={[styles.historialCantidad, { color: getColorTipo(item.tipo) }]}>
                {item.tipo === 'ganado' ? '+' : '-'}
                {item.cantidad}
                {item.tipo === 'convertido' ? ' ⭐' : item.tipo === 'gastado' ? ' 🪙' : ' ⭐'}
              </Text>
            </View>
          ))}
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
  content: {
    paddingHorizontal: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  infoSubtext: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  conversorCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  conversorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
    textAlign: 'center',
  },
  conversorControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  conversorButton: {
    width: 50,
    height: 50,
    backgroundColor: '#E8D5FF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  conversorEstrellas: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  conversorMonedas: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  convertirButton: {
    backgroundColor: '#4B0082',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  convertirButtonDisabled: {
    backgroundColor: '#CCC',
  },
  convertirButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
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
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionEmoji: {
    fontSize: 40,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  historialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historialInfo: {
    flex: 1,
  },
  historialDescripcion: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  historialFecha: {
    fontSize: 12,
    color: '#999',
  },
  historialCantidad: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});