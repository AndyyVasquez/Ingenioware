import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Avatares disponibles
const avatares = [
  { id: 1, emoji: '🦁', nombre: 'León' },
  { id: 2, emoji: '🐼', nombre: 'Panda' },
  { id: 3, emoji: '🦄', nombre: 'Unicornio' },
  { id: 4, emoji: '🐶', nombre: 'Perrito' },
  { id: 5, emoji: '🐱', nombre: 'Gatito' },
  { id: 6, emoji: '🐰', nombre: 'Conejito' },
  { id: 7, emoji: '🦊', nombre: 'Zorrito' },
  { id: 8, emoji: '🐻', nombre: 'Osito' },
  { id: 9, emoji: '🐯', nombre: 'Tigre' },
  { id: 10, emoji: '🦉', nombre: 'Búho' },
  { id: 11, emoji: '🐸', nombre: 'Ranita' },
  { id: 12, emoji: '🦋', nombre: 'Mariposa' },
];

// Colores favoritos
const colores = [
  { id: 1, color: '#FF6B6B', nombre: 'Rojo' },
  { id: 2, color: '#4ECDC4', nombre: 'Turquesa' },
  { id: 3, color: '#95E1D3', nombre: 'Verde' },
  { id: 4, color: '#FFD93D', nombre: 'Amarillo' },
  { id: 5, color: '#A06CD5', nombre: 'Morado' },
  { id: 6, color: '#FF8FAB', nombre: 'Rosa' },
  { id: 7, color: '#FFA07A', nombre: 'Naranja' },
  { id: 8, color: '#87CEEB', nombre: 'Azul cielo' },
];

interface NinoData {
  id_nino: number;
  nombre_completo: string;
  avatar_emoji: string;
  apodo?: string;
  color_favorito?: string;
  edad_nino?: number;
}

export default function PerfilNinoScreen() {
  const router = useRouter();
  const [ninoData, setNinoData] = useState<NinoData | null>(null);
  const [apodo, setApodo] = useState('');
  const [avatarSeleccionado, setAvatarSeleccionado] = useState('🦁');
  const [colorSeleccionado, setColorSeleccionado] = useState('#4ECDC4');
  
  // Modales
  const [modalAvatar, setModalAvatar] = useState(false);
  const [modalColor, setModalColor] = useState(false);
  const [modalApodo, setModalApodo] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const childSession = await AsyncStorage.getItem('childSession');
      const childData = await AsyncStorage.getItem('childData');

      if (childSession && childData) {
        const session = JSON.parse(childSession);
        const data = JSON.parse(childData);
        
        const datosCompletos = {
          ...data,
          avatar_emoji: session.avatar_emoji || data.avatar_emoji || '🦁',
          apodo: data.apodo || '',
          color_favorito: data.color_favorito || '#4ECDC4',
        };

        setNinoData(datosCompletos);
        setAvatarSeleccionado(datosCompletos.avatar_emoji);
        setApodo(datosCompletos.apodo || '');
        setColorSeleccionado(datosCompletos.color_favorito);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const guardarAvatar = async (emoji: string) => {
    try {
      // Actualizar datos del niño
      const childData = await AsyncStorage.getItem('childData');
      if (childData) {
        const data = JSON.parse(childData);
        data.avatar_emoji = emoji;
        await AsyncStorage.setItem('childData', JSON.stringify(data));
      }

      // Actualizar sesión
      const childSession = await AsyncStorage.getItem('childSession');
      if (childSession) {
        const session = JSON.parse(childSession);
        session.avatar_emoji = emoji;
        await AsyncStorage.setItem('childSession', JSON.stringify(session));
      }

      setAvatarSeleccionado(emoji);
      setModalAvatar(false);
      
      Alert.alert('¡Genial!', 'Tu avatar ha sido actualizado');
    } catch (error) {
      console.error('Error guardando avatar:', error);
      Alert.alert('Error', 'No se pudo guardar el avatar');
    }
  };

  const guardarApodo = async () => {
    if (!apodo.trim()) {
      Alert.alert('Oops', 'Por favor escribe un apodo');
      return;
    }

    try {
      const childData = await AsyncStorage.getItem('childData');
      if (childData) {
        const data = JSON.parse(childData);
        data.apodo = apodo.trim();
        await AsyncStorage.setItem('childData', JSON.stringify(data));
      }

      setModalApodo(false);
      Alert.alert('¡Perfecto!', `Ahora te llamaremos ${apodo}`);
    } catch (error) {
      console.error('Error guardando apodo:', error);
      Alert.alert('Error', 'No se pudo guardar el apodo');
    }
  };

  const guardarColor = async (color: string) => {
    try {
      const childData = await AsyncStorage.getItem('childData');
      if (childData) {
        const data = JSON.parse(childData);
        data.color_favorito = color;
        await AsyncStorage.setItem('childData', JSON.stringify(data));
      }

      setColorSeleccionado(color);
      setModalColor(false);
      Alert.alert('¡Súper!', 'Tu color favorito ha sido guardado');
    } catch (error) {
      console.error('Error guardando color:', error);
      Alert.alert('Error', 'No se pudo guardar el color');
    }
  };

  const nombreMostrar = ninoData?.apodo || ninoData?.nombre_completo.split(' ')[0] || 'Amigo';

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Tarjeta principal del perfil */}
        <View style={[styles.profileCard, { borderColor: colorSeleccionado }]}>
          {/* Avatar grande */}
          <TouchableOpacity 
            style={[styles.avatarContainer, { backgroundColor: colorSeleccionado }]}
            onPress={() => setModalAvatar(true)}
          >
            <Text style={styles.avatarEmoji}>{avatarSeleccionado}</Text>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Nombre y apodo */}
          <Text style={styles.nombre}>¡Hola {nombreMostrar}!</Text>
          <Text style={styles.nombreCompleto}>{ninoData?.nombre_completo}</Text>
        </View>

        {/* Opciones de personalización */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personaliza tu perfil</Text>

          {/* Cambiar apodo */}
          <TouchableOpacity
            style={styles.opcionCard}
            onPress={() => setModalApodo(true)}
          >
            <View style={styles.opcionIconContainer}>
              <Ionicons name="happy-outline" size={28} color="#4B0082" />
            </View>
            <View style={styles.opcionInfo}>
              <Text style={styles.opcionTitulo}>Mi apodo</Text>
              <Text style={styles.opcionSubtitulo}>
                {apodo || 'Elige cómo quieres que te llamen'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          {/* Cambiar color favorito */}
          <TouchableOpacity
            style={styles.opcionCard}
            onPress={() => setModalColor(true)}
          >
            <View style={[styles.opcionIconContainer, { backgroundColor: colorSeleccionado }]}>
              <Ionicons name="color-palette" size={28} color="#FFF" />
            </View>
            <View style={styles.opcionInfo}>
              <Text style={styles.opcionTitulo}>Color favorito</Text>
              <Text style={styles.opcionSubtitulo}>Personaliza tus colores</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Información adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de ti</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoEmoji}>🎂</Text>
              <View>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>{ninoData?.edad_nino || 8} años</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <Text style={styles.infoEmoji}>⭐</Text>
              <View>
                <Text style={styles.infoLabel}>Estrellas ganadas</Text>
                <Text style={styles.infoValue}>127</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de Avatar */}
      <Modal visible={modalAvatar} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Elige tu avatar</Text>
              <TouchableOpacity onPress={() => setModalAvatar(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.avatarGrid}>
                {avatares.map((avatar) => (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[
                      styles.avatarOption,
                      avatarSeleccionado === avatar.emoji && styles.avatarOptionSelected,
                    ]}
                    onPress={() => guardarAvatar(avatar.emoji)}
                  >
                    <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                    <Text style={styles.avatarOptionNombre}>{avatar.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Apodo */}
      <Modal visible={modalApodo} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Mi apodo</Text>
              <TouchableOpacity onPress={() => setModalApodo(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescripcion}>
              ¿Cómo te gustaría que te llamemos?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Escribe tu apodo aquí"
              placeholderTextColor="#999"
              value={apodo}
              onChangeText={setApodo}
              maxLength={20}
              autoFocus
            />

            <TouchableOpacity style={styles.guardarButton} onPress={guardarApodo}>
              <Text style={styles.guardarButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Color */}
      <Modal visible={modalColor} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Color favorito</Text>
              <TouchableOpacity onPress={() => setModalColor(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescripcion}>
              Elige tu color favorito
            </Text>

            <View style={styles.colorGrid}>
              {colores.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.color },
                    colorSeleccionado === color.color && styles.colorOptionSelected,
                  ]}
                  onPress={() => guardarColor(color.color)}
                >
                  {colorSeleccionado === color.color && (
                    <Ionicons name="checkmark" size={32} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 4,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarEmoji: {
    fontSize: 70,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4B0082',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  nombre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 4,
  },
  nombreCompleto: {
    fontSize: 16,
    color: '#666',
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
  opcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  opcionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8D5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  opcionInfo: {
    flex: 1,
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  opcionSubtitulo: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoEmoji: {
    fontSize: 40,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
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
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  modalDescripcion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  avatarOption: {
    width: 90,
    height: 90,
    backgroundColor: '#F5E6D3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#4B0082',
    backgroundColor: '#E8D5FF',
  },
  avatarOptionEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  avatarOptionNombre: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  guardarButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  guardarButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  colorOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
});