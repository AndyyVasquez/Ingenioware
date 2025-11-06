import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Datos de ejemplo de canciones
const canciones = [
  {
    id: 1,
    titulo: 'La Canción de la Honestidad',
    valor: 'Honestidad',
    emoji: '🎵',
    color: '#4ECDC4',
    duracion: '3 min',
    completado: true,
    nuevo: false,
  },
  {
    id: 2,
    titulo: 'Juntos Somos Más',
    valor: 'Amistad',
    emoji: '🎶',
    color: '#95E1D3',
    duracion: '4 min',
    completado: false,
    nuevo: true,
  },
  {
    id: 3,
    titulo: 'Soy Valiente',
    valor: 'Valentía',
    emoji: '🎼',
    color: '#FFB84D',
    duracion: '3 min',
    completado: false,
    nuevo: true,
  },
  {
    id: 4,
    titulo: 'Compartir es Amar',
    valor: 'Generosidad',
    emoji: '🎤',
    color: '#FF8FAB',
    duracion: '3 min',
    completado: false,
    nuevo: false,
  },
  {
    id: 5,
    titulo: 'La Importancia del Respeto',
    valor: 'Respeto',
    emoji: '🎸',
    color: '#A06CD5',
    duracion: '4 min',
    completado: true,
    nuevo: false,
  },
  {
    id: 6,
    titulo: 'Hacer lo Correcto',
    valor: 'Responsabilidad',
    emoji: '🎺',
    color: '#FF6B6B',
    duracion: '3 min',
    completado: false,
    nuevo: false,
  },
];

const categorias = [
  'Todas',
  'Valentía',
  'Honestidad',
  'Amistad',
  'Generosidad',
  'Respeto',
  'Responsabilidad',
];

export default function CancionesScreen() {
  const router = useRouter();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [cancionReproduciendo, setCancionReproduciendo] = useState<number | null>(null);

  const cancionesFiltradas =
    categoriaSeleccionada === 'Todas'
      ? canciones
      : canciones.filter((cancion) => cancion.valor === categoriaSeleccionada);

  const handleCancionPress = (cancion: typeof canciones[0]) => {
    // Si ya está reproduciendo esta canción, pausarla
    if (cancionReproduciendo === cancion.id) {
      setCancionReproduciendo(null);
    } else {
      // Reproducir la nueva canción
      setCancionReproduciendo(cancion.id);
      // Aquí irá la lógica para reproducir el audio
      console.log('Reproduciendo:', cancion.titulo);
    }
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
        <Text style={styles.headerTitle}>Canciones Mágicas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>🎵</Text>
        <Text style={styles.infoText}>
          Aprende valores cantando y bailando
        </Text>
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

      {/* Lista de Canciones */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cancionesGrid}
      >
        {cancionesFiltradas.map((cancion) => (
          <TouchableOpacity
            key={cancion.id}
            style={[styles.cancionCard, { borderLeftColor: cancion.color }]}
            activeOpacity={0.8}
            onPress={() => handleCancionPress(cancion)}
          >
            {/* Lado izquierdo - Emoji e info */}
            <View style={styles.cancionLeft}>
              <View style={[styles.cancionEmojiContainer, { backgroundColor: cancion.color }]}>
                <Text style={styles.cancionEmoji}>{cancion.emoji}</Text>
              </View>

              <View style={styles.cancionInfo}>
                <View style={styles.cancionHeader}>
                  <Text style={styles.cancionTitulo}>{cancion.titulo}</Text>
                  {cancion.nuevo && (
                    <View style={styles.badgeNuevo}>
                      <Text style={styles.badgeText}>¡Nuevo!</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cancionMeta}>
                  <View style={styles.valorTag}>
                    <Ionicons name="heart" size={12} color="#666" />
                    <Text style={styles.valorText}>{cancion.valor}</Text>
                  </View>
                  <View style={styles.duracionTag}>
                    <Ionicons name="time-outline" size={12} color="#666" />
                    <Text style={styles.duracionText}>{cancion.duracion}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lado derecho - Botón de reproducir */}
            <TouchableOpacity 
              style={[
                styles.playButton,
                cancionReproduciendo === cancion.id && styles.playButtonActive
              ]}
              onPress={() => handleCancionPress(cancion)}
            >
              <Ionicons 
                name={cancionReproduciendo === cancion.id ? "pause" : "play"} 
                size={24} 
                color="#FFF" 
              />
            </TouchableOpacity>

            {/* Indicador de completado */}
            {cancion.completado && (
              <View style={styles.completadoBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Reproductor flotante (si hay una canción reproduciéndose) */}
      {cancionReproduciendo && (
        <View style={styles.reproductorFlotante}>
          <View style={styles.reproductorInfo}>
            <Ionicons name="musical-notes" size={24} color="#4B0082" />
            <Text style={styles.reproductorTexto}>
              {canciones.find(c => c.id === cancionReproduciendo)?.titulo}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.reproductorBoton}
            onPress={() => setCancionReproduciendo(null)}
          >
            <Ionicons name="close" size={24} color="#4B0082" />
          </TouchableOpacity>
        </View>
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
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  infoEmoji: {
    fontSize: 32,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
  cancionesGrid: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cancionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  cancionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  cancionEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cancionEmoji: {
    fontSize: 32,
  },
  cancionInfo: {
    flex: 1,
  },
  cancionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  cancionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  badgeNuevo: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cancionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  valorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  valorText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  duracionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  duracionText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4B0082',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 12,
  },
  playButtonActive: {
    backgroundColor: '#FFD93D',
  },
  completadoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  reproductorFlotante: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  reproductorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reproductorTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  reproductorBoton: {
    padding: 8,
  },
});