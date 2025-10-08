import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const avatars = [
  { id: 1, emoji: '🦁', name: 'León' },
  { id: 2, emoji: '🐼', name: 'Panda' },
  { id: 3, emoji: '🦄', name: 'Unicornio' },
  { id: 4, emoji: '🐶', name: 'Perrito' },
  { id: 5, emoji: '🐱', name: 'Gatito' },
  { id: 6, emoji: '🐰', name: 'Conejito' },
];

const colors = [
  { id: 1, color: '#FF6B6B', name: 'Rojo' },
  { id: 2, color: '#4ECDC4', name: 'Azul' },
  { id: 3, color: '#95E1D3', name: 'Verde' },
  { id: 4, color: '#FFD93D', name: 'Amarillo' },
  { id: 5, color: '#A06CD5', name: 'Morado' },
  { id: 6, color: '#FF8FAB', name: 'Rosa' },
];

const difficulties = [
  { id: 1, level: 'Principiante', icon: 'star-outline' },
  { id: 2, level: 'Intermedio', icon: 'star-half-outline' },
  { id: 3, level: 'Avanzado', icon: 'star' },
];

export default function ChildProfileSetupScreen() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

  const handleFinish = () => {
    // Aquí guardarías las preferencias
    router.push('/(tabs)'); // Navegar al dashboard principal
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Personaliza la experiencia</Text>
          <Text style={styles.headerSubtitle}>
            Elige lo que más le guste a tu hijo/a
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige un avatar</Text>
          <View style={styles.avatarGrid}>
            {avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                <Text style={styles.avatarName}>{avatar.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color favorito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color favorito</Text>
          <View style={styles.colorGrid}>
            {colors.map((colorItem) => (
              <TouchableOpacity
                key={colorItem.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: colorItem.color },
                  selectedColor === colorItem.id && styles.selectedColorOption,
                ]}
                onPress={() => setSelectedColor(colorItem.id)}
              >
                {selectedColor === colorItem.id && (
                  <Ionicons name="checkmark" size={24} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nivel de dificultad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nivel inicial</Text>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty.id}
              style={[
                styles.difficultyOption,
                selectedDifficulty === difficulty.id && styles.selectedDifficulty,
              ]}
              onPress={() => setSelectedDifficulty(difficulty.id)}
            >
              <Ionicons
                name={difficulty.icon as any}
                size={24}
                color={selectedDifficulty === difficulty.id ? '#4B0082' : '#666'}
              />
              <Text
                style={[
                  styles.difficultyText,
                  selectedDifficulty === difficulty.id && styles.selectedDifficultyText,
                ]}
              >
                {difficulty.level}
              </Text>
              {selectedDifficulty === difficulty.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4B0082" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.skipButtonText}>Saltar por ahora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.finishButton,
              (!selectedAvatar || !selectedColor || !selectedDifficulty) &&
                styles.disabledButton,
            ]}
            onPress={handleFinish}
            disabled={!selectedAvatar || !selectedColor || !selectedDifficulty}
          >
            <Text style={styles.finishButtonText}>Comenzar aventura</Text>
            <Ionicons name="rocket" size={20} color="#FFF" />
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 100,
    height: 100,
    backgroundColor: '#F5E6D3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#4B0082',
    backgroundColor: '#E8D5FF',
  },
  avatarEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#333',
  },
  difficultyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDifficulty: {
    borderColor: '#4B0082',
    backgroundColor: '#E8D5FF',
  },
  difficultyText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  selectedDifficultyText: {
    color: '#4B0082',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  finishButton: {
    backgroundColor: '#4B0082',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  finishButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});