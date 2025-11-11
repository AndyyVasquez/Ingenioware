import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BuenMomento {
  id: string;
  fecha: string;
  mensaje: string;
  monedas: number;
  visto: boolean;
}

export default function BuenosMomentosScreen() {
  const router = useRouter();
  const [momentos, setMomentos] = useState<BuenMomento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMomentos();
    }, [])
  );

  const loadMomentos = async () => {
    setIsLoading(true);
    try {
      const momentosStr = await AsyncStorage.getItem('buenosMomentos');
      const momentosCargados: BuenMomento[] = momentosStr ? JSON.parse(momentosStr) : [];

      let monedasGanadas = 0;
      let hayNuevos = false;

      // Marcar como vistos y sumar monedas
      const momentosActualizados = momentosCargados.map(momento => {
        if (!momento.visto) {
          monedasGanadas += momento.monedas;
          hayNuevos = true;
          return { ...momento, visto: true };
        }
        return momento;
      });

      // Si hubo mensajes nuevos, actualizar todo
      if (hayNuevos) {
        setMomentos(momentosActualizados.reverse()); // Mostrar nuevos primero

        // Actualizar monedas
        const monedasActualStr = await AsyncStorage.getItem('monedas');
        const monedasActuales = monedasActualStr ? parseInt(monedasActualStr, 10) : 0;
        const nuevasMonedas = monedasActuales + monedasGanadas;
        
        await AsyncStorage.setItem('monedas', nuevasMonedas.toString());
        await AsyncStorage.setItem('buenosMomentos', JSON.stringify(momentosActualizados));

        if (monedasGanadas > 0) {
          Alert.alert(
            '¡Sorpresa! 🎁',
            `¡Tus papás te enviaron un mensaje y ${monedasGanadas} monedas 🪙 por portarte bien!`
          );
        } else {
          Alert.alert('¡Mensaje Nuevo!', 'Tus papás te enviaron un mensaje bonito.');
        }
      } else {
         setMomentos(momentosCargados.reverse());
      }
      
    } catch (error) {
      console.error('Error cargando momentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buenos Momentos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {momentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💌</Text>
            <Text style={styles.emptyTitle}>Bandeja vacía</Text>
            <Text style={styles.emptyText}>
              Aquí aparecerán los mensajes bonitos que te manden tus papás.
            </Text>
          </View>
        ) : (
          momentos.map(momento => (
            <View key={momento.id} style={styles.card}>
              <Text style={styles.cardMensaje}>{momento.mensaje}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFecha}>{formatearFecha(momento.fecha)}</Text>
                {momento.monedas > 0 && (
                  <Text style={styles.cardMonedas}>+{momento.monedas} 🪙</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '30%',
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardMensaje: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFecha: {
    fontSize: 12,
    color: '#999',
  },
  cardMonedas: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
  },
});