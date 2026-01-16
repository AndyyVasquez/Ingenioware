import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_URL } from '../src/config/api';

const { width } = Dimensions.get('window');

export default function JuegosMapScreen() {
  const router = useRouter();
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarMapa = async () => {
    try {
      const childJson = await AsyncStorage.getItem('currentChild');
      if (!childJson) return;
      const child = JSON.parse(childJson);

      console.log("Cargando mapa para niño:", child.id); // Debug

      const response = await fetch(`${API_URL}/juegos/mapa/${child.id}`);
      const data = await response.json();

      if (data.success) {
        console.log("Niveles cargados:", data.mapa.length); // Debug
        setNiveles(data.mapa);
      }
    } catch (error) {
      console.error("Error cargando mapa:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarMapa();
  }, []);

  const handleLevelPress = (nivel: any) => {
    if (nivel.bloqueado) {
      Alert.alert("🔒 Nivel Bloqueado", "¡Completa el nivel anterior para avanzar!");
      return;
    }
    
    router.push({
      pathname: '/juegoInteractivo',
      params: { 
        valorId: nivel.id, 
        titulo: nivel.titulo,
        color: nivel.color 
      }
    });
  };

  return (
    // Usamos Gradiente para simular CIELO (Azul) y TIERRA (Verde) al fondo
    <LinearGradient colors={['#87CEEB', '#87CEEB', '#90EE90']} style={styles.container}>
      
      {/* Nubes Decorativas (Fijas) */}
      <View style={{position: 'absolute', top: 100, left: 20}}><Ionicons name="cloud" size={60} color="rgba(255,255,255,0.8)" /></View>
      <View style={{position: 'absolute', top: 150, right: -20}}><Ionicons name="cloud" size={80} color="rgba(255,255,255,0.6)" /></View>
      <View style={{position: 'absolute', top: 300, left: -10}}><Ionicons name="cloud" size={50} color="rgba(255,255,255,0.7)" /></View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mundo de Valores 🌎</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 100 }} />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.mapContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={cargarMapa} tintColor="#FFF"/>}
        >
          {/* Castillo Inicio */}
          <View style={styles.landmarkContainer}>
              <Text style={{fontSize: 50}}>🏰</Text>
              <View style={styles.landmarkLabel}>
                <Text style={styles.landmarkText}>INICIO</Text>
              </View>
          </View>

          {/* Camino Conector Inicial */}
          {niveles.length > 0 && <View style={styles.pathVertical} />}

          {/* Lista de Niveles */}
          {niveles.length === 0 ? (
             <Text style={{textAlign: 'center', color: '#FFF', fontSize: 18, marginTop: 20}}>
                No hay niveles disponibles. {"\n"} 
             </Text>
          ) : (
             niveles.map((nivel: any, index) => {
                // Zig-Zag Logic
                const isLeft = index % 2 === 0;
                const showPath = index < niveles.length - 1;

                return (
                  <View key={nivel.id} style={{alignItems: 'center', width: '100%'}}>
                    
                    {/* Contenedor del Nivel con Desplazamiento */}
                    <View style={[
                        styles.levelWrapper, 
                        { 
                          alignSelf: isLeft ? 'flex-start' : 'flex-end',
                          marginLeft: isLeft ? width * 0.15 : 0,
                          marginRight: isLeft ? 0 : width * 0.15
                        } 
                    ]}>
                      
                      <TouchableOpacity
                        style={[
                          styles.levelNode,
                          nivel.bloqueado ? styles.levelLocked : styles.levelUnlocked,
                          !nivel.bloqueado && !nivel.completado && styles.levelCurrent
                        ]}
                        onPress={() => handleLevelPress(nivel)}
                        activeOpacity={0.8}
                      >
                        {nivel.completado ? (
                          <Text style={{fontSize: 30}}>⭐</Text>
                        ) : nivel.bloqueado ? (
                          <Ionicons name="lock-closed" size={24} color="rgba(0,0,0,0.3)" />
                        ) : (
                          <Text style={styles.levelNumber}>{index + 1}</Text>
                        )}
                      </TouchableOpacity>

                      <Text style={styles.levelName}>{nivel.titulo}</Text>
                    </View>

                    {/* Líneas del Camino (Dots) */}
                    {showPath && (
                       <View style={[
                           styles.pathConnector,
                           { transform: [{ rotate: isLeft ? '45deg' : '-45deg' }] }
                       ]}>
                          <View style={styles.dot} />
                          <View style={styles.dot} />
                          <View style={styles.dot} />
                       </View>
                    )}
                  </View>
                );
             })
          )}

          {/* Camino Final */}
          {niveles.length > 0 && <View style={styles.pathVertical} />}

          {/* Meta Final */}
          <View style={styles.landmarkContainer}>
              <Text style={{fontSize: 50}}>🚩</Text>
              <View style={styles.landmarkLabel}>
                <Text style={styles.landmarkText}>META</Text>
              </View>
          </View>

        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 50, 
    paddingHorizontal: 20,
    zIndex: 10
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 8,
    borderRadius: 12
  },
  titleContainer: {
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F57F17',
    marginLeft: 20,
    elevation: 5,
    transform: [{ rotate: '-2deg' }]
  },
  title: {
    color: '#E65100',
    fontWeight: '900',
    fontSize: 20,
    textTransform: 'uppercase'
  },
  mapContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingBottom: 100
  },
  landmarkContainer: {
    alignItems: 'center',
    marginBottom: 10
  },
  landmarkLabel: {
    backgroundColor: '#3E2723',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: -5,
    borderWidth: 2,
    borderColor: '#8D6E63'
  },
  landmarkText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  levelWrapper: {
    alignItems: 'center',
    marginVertical: 10,
    width: 100,
  },
  levelNode: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#FFD54F' // Default
  },
  levelLocked: {
    backgroundColor: '#B0BEC5',
    borderColor: '#78909C'
  },
  levelUnlocked: {
    backgroundColor: '#FFCA28',
    borderColor: '#FFF59D'
  },
  levelCurrent: {
    backgroundColor: '#F06292', // Rosa vibrante para el actual
    transform: [{ scale: 1.15 }],
    borderColor: '#F8BBD0'
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2
  },
  levelName: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    overflow: 'hidden'
  },
  pathVertical: {
    height: 30,
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 3,
    marginVertical: 5
  },
  pathConnector: {
    height: 50,
    width: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});