import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../src/config/api';

// Definimos la interfaz del cuento
interface Cuento {
  id: number;
  titulo: string;
  sinopsis: string;
  valor_id: number;
  nombre_valor: string; // Viene del JOIN en backend
  color_hex: string;    // Viene del JOIN en backend
  portada_url: string;
  contenido_url: string;
  // Campos calculados o por defecto
  emoji: string;
  duracion: string;
  nuevo: boolean;
  completado: boolean;
  color: string;
  valor: string;
}

const categorias = [
  'Todos',
  'Valentía',
  'Honestidad',
  'Empatía',
  'Responsabilidad',
  'Generosidad',
];

export default function CuentosScreen() {
  const router = useRouter();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [cuentos, setCuentos] = useState<Cuento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCuentos();
  }, []);

  const fetchCuentos = async () => {
    try {
      const response = await fetch(`${API_URL}/cuentos`);
      const data = await response.json();
      
      if (data.success) {
        // Transformamos los datos del backend al formato que usa la UI
        const cuentosFormateados = data.cuentos.map((c: any) => ({
          ...c,
          // Mapeamos el color que viene de BD o usamos uno por defecto
          color: c.color_hex || '#FFB84D', 
          // Mapeamos el nombre del valor
          valor: c.nombre_valor,
          // Asignamos emoji según el valor (puedes mejorarlo guardando emoji en BD)
          emoji: getEmojiForValor(c.nombre_valor),
          duracion: '5 min', // Valor por defecto
          nuevo: Math.random() < 0.3,
          completado: false 
        }));
        setCuentos(cuentosFormateados);
      }
    } catch (error) {
      console.error("Error cargando cuentos:", error);
      Alert.alert("Error", "No se pudieron cargar los cuentos");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmojiForValor = (valor: string) => {
    switch(valor?.toLowerCase()) {
      case 'valentía': return '🦁';
      case 'honestidad': return '🦊';
      case 'empatía': return '🐻';
      case 'responsabilidad': return '🐜';
      case 'generosidad': return '🐰';
      default: return '📖';
    }
  };

  const cuentosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? cuentos
      : cuentos.filter((cuento) => cuento.valor === categoriaSeleccionada);

  const handleCuentoPress = (cuento: Cuento) => {
    router.push({
      pathname: '/lectorCuento',
      params: { cuentoData: JSON.stringify(cuento) }
    });
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuentos Mágicos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categorias.map((categoria) => (
          <TouchableOpacity
            key={categoria}
            style={[
              styles.categoryChip,
              categoriaSeleccionada === categoria && styles.categoryChipActive,
            ]}
            onPress={() => setCategoriaSeleccionada(categoria)}
          >
            <Text
              style={[
                styles.categoryText,
                categoriaSeleccionada === categoria &&
                  styles.categoryTextActive,
              ]}
            >
              {categoria}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid de Cuentos */}
      {isLoading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="#4B0082" />
            <Text>Cargando biblioteca...</Text>
        </View>
      ) : (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cuentosGrid}
        >
            {cuentosFiltrados.length > 0 ? cuentosFiltrados.map((cuento) => (
            <TouchableOpacity
                key={cuento.id}
                style={[styles.cuentoCard, { backgroundColor: cuento.color }]}
                activeOpacity={0.8}
                onPress={() => handleCuentoPress(cuento)}
            >
                {/* Badges */}
                <View style={styles.badgesContainer}>
                {cuento.nuevo && (
                    <View style={styles.badgeNuevo}>
                    <Text style={styles.badgeText}>¡Nuevo!</Text>
                    </View>
                )}
                {cuento.completado && (
                    <View style={styles.badgeCompletado}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    </View>
                )}
                </View>

                {/* Emoji del cuento */}
                <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{cuento.emoji}</Text>
                </View>

                {/* Info del cuento */}
                <View style={styles.cuentoInfo}>
                <Text style={styles.cuentoTitulo}>{cuento.titulo}</Text>
                <View style={styles.cuentoMeta}>
                    <View style={styles.valorTag}>
                    <Ionicons name="heart" size={14} color="#FFF" />
                    <Text style={styles.valorText}>{cuento.valor}</Text>
                    </View>
                    <View style={styles.duracionTag}>
                    <Ionicons name="time-outline" size={14} color="#FFF" />
                    <Text style={styles.duracionText}>{cuento.duracion}</Text>
                    </View>
                </View>
                </View>

                {/* Botón de play */}
                <View style={styles.playButton}>
                <Ionicons name="play" size={24} color="#FFF" />
                </View>
            </TouchableOpacity>
            )) : (
                <Text style={{textAlign:'center', marginTop: 50, color:'#666'}}>
                    No hay cuentos en esta categoría.
                </Text>
            )}

            <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
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
  categoriesContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 40,
  },
  categoryChipActive: {
    backgroundColor: '#4B0082',
    borderColor: '#4B0082',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  cuentosGrid: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cuentoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    minHeight: 180,
  },
  badgesContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 8,
  },
  badgeNuevo: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeCompletado: {
    backgroundColor: '#FFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 50,
  },
  cuentoInfo: {
    flex: 1,
  },
  cuentoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  cuentoMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  valorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  valorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  duracionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  duracionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(75, 0, 130, 0.9)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSpacer: {
    height: 40,
  },
});