import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Logo y encabezado */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.wings}>
            <Text style={styles.wingText}>✨</Text>
          </View>
          <View style={styles.halo}>
            <View style={styles.haloRing} />
          </View>
          <View style={styles.earth}>
            <View style={styles.earthInner} />
          </View>
        </View>
        
        <Text style={styles.title}>Ingeniowave</Text>
        <Text style={styles.subtitle}>
          Donde el aprendizaje es una nueva aventura mágica
        </Text>
      </View>

      {/* Pregunta */}
      <View style={styles.questionContainer}>
        <Text style={styles.question}>¿Quién está por explorar?</Text>
      </View>

      {/* Tarjetas de selección */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={48} color="#6B4423" />
          </View>
          <Text style={styles.cardLabel}>Padres</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={48} color="#6B4423" />
          </View>
          <Text style={styles.cardLabel}>Niña/o</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8E6F5',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  wings: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  wingText: {
    fontSize: 60,
    opacity: 0.8,
  },
  halo: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
  },
  haloRing: {
    width: 50,
    height: 15,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    opacity: 0.7,
  },
  earth: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  earthInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5FA3D0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  question: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  card: {
    width: 160,
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
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});