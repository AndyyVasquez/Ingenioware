import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AnimatedStar from './AnimatedStar';

interface Profile {
  id: string;
  type: 'parent' | 'child';
  name: string;
  avatar: string;
}

export default function ProfileSelectorScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [hasParentAccount, setHasParentAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
   useFocusEffect(
    useCallback(() => {
      console.log('Pantalla de perfiles enfocada, cargando datos...');
      loadProfiles();
    }, [])
  );


  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const loadedProfiles: Profile[] = [];
      const [parentSessionStr, childDataStr, hasAccount] = await Promise.all([
        AsyncStorage.getItem('parentSession'),
        AsyncStorage.getItem('childData'),
        AsyncStorage.getItem('hasParentAccount')
      ]);

      console.log('--- Cargando Perfiles ---');
      console.log('hasParentAccount:', hasAccount);
      console.log('parentSession:', parentSessionStr ? 'SI' : 'NO');
      console.log('childData:', childDataStr ? 'SI' : 'NO');
      
      const isParentAccountActive = hasAccount === 'true';
      setHasParentAccount(hasAccount === 'true');

      // 1. Cargar perfil del Padre
      if (parentSessionStr) {
        const parentData = JSON.parse(parentSessionStr);
        loadedProfiles.push({
          id: `parent_${parentData.id_pad || 1}`, // Usamos un ID único
          type: 'parent',
          name: parentData.nom_pad || 'Padres',
          avatar: 'person', // Usaremos un icono para el padre
        });
      }

      // 2. Cargar perfil del Niño
      // (Esta lógica se puede expandir para cargar MÚLTIPLES niños)
      if (isParentAccountActive && childDataStr) {
        const childData = JSON.parse(childDataStr);
        loadedProfiles.push({
          id: `child_${childData.id_nino || 1}`, // ID único
          type: 'child',
          name: childData.apodo || childData.nombre_completo?.split(' ')[0] || 'Niño/a',
          avatar: childData.avatar_emoji || '🦁', // Usamos el emoji
        });
      }
      
      setProfiles(loadedProfiles);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = (profile: Profile) => {

    router.push(
      `/pinVerification?profileId=${profile.id}&profileType=${profile.type}&name=${profile.name}`
    );
  };

  const handleAddProfile = () => {
    // Si ya hay una cuenta de padre, es para añadir un niño
    // Si no, es para crear la cuenta de padre
    if (hasParentAccount) {
      // Idealmente, esto iría a una pantalla de "Añadir Niño"
      // Por ahora lo mandamos a la configuración de perfil
      router.push('/configPerfilN'); 
    } else {
      router.push('/registro');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión (Prueba)',
      '¿Limpiar la sesión del padre para forzar el login?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, limpiar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('parentSession');
            await AsyncStorage.removeItem('parentPin');
            await AsyncStorage.removeItem('hasParentAccount');
            await AsyncStorage.removeItem('hasChildren');
            console.log('¡Sesión limpiada! Reinicia la app o recarga.');
          },
        },
      ]
    );
  };
  if (isLoading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </LinearGradient>
    );
  }

const handleNukeStorage = () => {
    Alert.alert(
      '¡Limpieza Total Definitiva!',
      '¿Borrar absolutamente TODOS los datos de la app (padres, niños, pines, todo)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Borrar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              // Borra todas las claves.
              await AsyncStorage.clear();
              
              console.log('¡Almacenamiento 100% limpio!');
              
              // Volvemos a cargar los perfiles (ahora estará vacío)
              // y reseteamos los estados.
              setProfiles([]); 
              setHasParentAccount(false);
              // setIsParentLoggedIn(false); 
              loadProfiles();
              Alert.alert('¡Listo!', 'Base de datos limpia. Ya puedes registrarte.');

            } catch (error) {
              console.error('Error limpiando storage:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      {/* Logo y encabezado */}
      <View style={styles.header}>
       <TouchableOpacity onPress={handleNukeStorage}>
         <AnimatedStar />
         </TouchableOpacity>
        <Text style={{fontSize: 28, fontWeight: '700', color: '#4B0082', marginBottom: 50}}> Ingenioware</Text>
        <Text style={styles.subtitle}>
          Donde el aprendizaje es una nueva aventura mágica
        </Text>
      </View>

      {/* Pregunta */}
      <View style={styles.QContainer}>
        <Text style={styles.question}>¿Quién eres?</Text>
      </View>

      {/* Tarjetas de selección */}
      <View style={styles.cardsContainer}>
        {profiles.map((profile) => (
          <TouchableOpacity 
            key={profile.id}
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => handleProfileClick(profile)}
          >
            <View style={[
              styles.iconCircle, 
              profile.type === 'parent' && styles.parentIconCircle
            ]}>
              {profile.type === 'child' ? (
                <Text style={styles.avatarEmoji}>{profile.avatar}</Text>
              ) : (
                <Ionicons name={profile.avatar as any} size={48} color="#6B4423" />
              )}
            </View>
            <Text style={styles.cardLabel}>{profile.name}</Text>
            {/* Todos los perfiles muestran un candado */}
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={16} color="rgba(0,0,0,0.4)" />
            </View>
          </TouchableOpacity>
        ))}
        {hasParentAccount && (
      <TouchableOpacity 
        style={[styles.card, styles.addCard]} 
        activeOpacity={0.8}
        onPress={handleAddProfile} // Esta función ya apunta a configPerfilN o registro
      >
        <View style={[styles.iconCircle, styles.addIconCircle]}>
          <Ionicons name="add" size={48} color="#4B0082" />
        </View>
        <Text style={styles.cardLabel}>Añadir Niño/a</Text>
      </TouchableOpacity>
    )}

    {/* Si NO hay cuenta de padre, mostramos "Crear Cuenta" Y "Login" */}
    {!hasParentAccount && (
      <>
        <TouchableOpacity 
          style={[styles.card, styles.addCard]} 
          activeOpacity={0.8}
          onPress={() => router.push('/registro')} // Ruta directa a registro
        >
          <View style={[styles.iconCircle, styles.addIconCircle]}>
            <Ionicons name="person-add-outline" size={48} color="#4B0082" />
          </View>
          <Text style={styles.cardLabel}>Crear Cuenta</Text>
        </TouchableOpacity>

        {/* ¡EL BOTÓN QUE FALTABA! */}
        <TouchableOpacity 
          style={[styles.card, styles.loginCard]} // Usamos un estilo nuevo
          activeOpacity={0.8}
          onPress={() => router.push('/login')} // Ruta a tu login.tsx
        >
          <View style={[styles.iconCircle, styles.loginIconCircle]}>
            <Ionicons name="log-in-outline" size={48} color="#4B0082" />
          </View>
          <Text style={styles.cardLabel}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </>
    )}

       
      </View>

      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    justifyContent: 'center', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4B0082',
    fontWeight: '600',
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -10,
  },
  QContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  question: {
    fontSize: 22, 
    color: '#333',
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    flexWrap: 'wrap', // Para que bajen si no caben
    paddingHorizontal: 10,
    
  },
  card: {
    width: '47%',
    height: 160,
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    marginBottom: 20, // Espacio por si hay wrapping
  },
  loginCard: {
    backgroundColor: '#F5E6D3',
    borderStyle: 'solid', 
    borderWidth: 2,
    borderColor: '#4B0082',
    elevation: 0,
    shadowOpacity: 0,
  },
  loginIconCircle: {
    backgroundColor: '#f1c893ff',
  },
  addCard: {
    backgroundColor: '#F5E6D3',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#4B0082',
    elevation: 0,
    shadowOpacity: 0,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4A460',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  parentIconCircle: {
    backgroundColor: '#C0D9E5', 
  },
  addIconCircle: {
    backgroundColor: 'transparent',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lockBadge: { 
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 2,
  },
});