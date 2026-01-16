import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // Importamos el reproductor
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../src/config/api';
const BASE_URL = API_URL.replace('/api', '');

export default function CancionesScreen() {
  const router = useRouter();
  const [canciones, setCanciones] = useState([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar lista desde BD
  useEffect(() => {
    fetch(`${API_URL}/canciones`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setCanciones(data.canciones);
        setLoading(false);
      })
      .catch(err => console.error(err));

    // Limpieza al salir de la pantalla
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // 2. Reproducir Canción
  const handlePlay = async (cancion: any) => {
    try {
      // Si ya está sonando la misma, pausamos/reaunudamos
      if (currentSongId === cancion.id && sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        return;
      }

      // Si es otra canción, detenemos la anterior
      if (sound) {
        await sound.unloadAsync();
      }

      // Construimos la URL completa (ej. http://192.168.1.XX:3000/uploads/musica.mp3)
      const uri = `${BASE_URL}/${cancion.archivo_url}`;
      console.log("Reproduciendo:", uri);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentSongId(cancion.id);
      setIsPlaying(true);

      // Detectar cuando termina
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

    } catch (error) {
      console.error("Error reproduciendo audio:", error);
      alert("No se pudo reproducir la canción");
    }
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
            if(sound) sound.unloadAsync(); // Parar música al salir
            router.back();
        }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Música Divertida 🎵</Text>
        <View style={{width: 40}} />
      </View>

      {loading ? <ActivityIndicator size="large" color="#4B0082" style={{marginTop:50}} /> : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {canciones.length > 0 ? canciones.map((cancion: any) => {
            const isActive = currentSongId === cancion.id;
            
            return (
              <TouchableOpacity 
                key={cancion.id} 
                style={[styles.card, isActive && styles.cardActive]} 
                onPress={() => handlePlay(cancion)}
              >
                <Image 
                  source={{ uri: cancion.portada_url || 'https://via.placeholder.com/100' }} 
                  style={styles.cover} 
                />
                
                <View style={styles.info}>
                  <Text style={styles.title}>{cancion.titulo}</Text>
                  <Text style={styles.artist}>{cancion.artista}</Text>
                </View>

                <View style={styles.playBtn}>
                  <Ionicons 
                    name={(isActive && isPlaying) ? "pause-circle" : "play-circle"} 
                    size={48} 
                    color={isActive ? "#4B0082" : "#ccc"} 
                  />
                </View>
              </TouchableOpacity>
            );
          }) : (
            <Text style={{textAlign:'center', color:'#666', marginTop:20}}>No hay canciones aún.</Text>
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#4B0082' },
  listContainer: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 10, marginBottom: 15, alignItems: 'center', shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4, elevation:2 },
  cardActive: { backgroundColor: '#FFF', borderColor: '#4B0082', borderWidth: 1 },
  cover: { width: 60, height: 60, borderRadius: 10, backgroundColor:'#eee' },
  info: { flex: 1, marginLeft: 15 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  artist: { fontSize: 14, color: '#666' },
  playBtn: { padding: 5 }
});