import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegistroPadres() {
    const router = useRouter();
  const [nomP, setnomP] = useState('');
  const [apP, setapP] = useState('');
  const [amP, setamP] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [nomN, setnomN] = useState('');
  const [apN, setapN] = useState('');
  const [amN, setamN] = useState('');
  const [edadN, setedadN] = useState('');
  const [fecnacN, setfecnacN] = useState('');
  const [sexoN, setsexoN] = useState('');

  const handlePinChange = (value:any, index : any) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
  };

  return (
    <LinearGradient colors={['#B8D4E0', '#FAD4C0']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Crear cuenta</Text>
          </View>

          {/* Datos del padre/madre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del padre/madre</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre(s)"
              placeholderTextColor="#999"
              value={nomP}
              onChangeText={setnomP}
            />

            <TextInput
                style={styles.input}
                placeholder="Apellido paterno"
                placeholderTextColor="#999"
                value={apP}
                onChangeText={setapP}
            />

            <TextInput
                style={styles.input}
                placeholder="Apellido materno"
                placeholderTextColor="#999"
                value={amP}
                onChangeText={setamP}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

          </View>

          {/* PIN de Seguridad */}
          <View style={styles.pinSection}>
            <Text style={styles.pinTitle}>PIN de Seguridad (4 dígitos)</Text>
            <View style={styles.pinContainer}>
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handlePinChange(value, index)}
                  secureTextEntry
                />
              ))}
            </View>
          </View>

          {/* Datos del niño */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del niño</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre(s)"
              placeholderTextColor="#999"
              value={nomN}
              onChangeText={setnomN}
            />

            <TextInput
                style={styles.input}
                placeholder="Apellido paterno"
                placeholderTextColor="#999"
                value={apN}
                onChangeText={setapN}
            />  

            <TextInput
                style={styles.input}
                placeholder="Apellido materno"
                placeholderTextColor="#999"
                value={amN}
                onChangeText={setamN}

            />

            <TextInput 
                style={styles.input}
                placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                placeholderTextColor="#999"
                keyboardType='number-pad'
                value={fecnacN}
                onChangeText={setfecnacN}
            />  

            <TextInput
              style={styles.input}
              placeholder="Edad"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={edadN}
              onChangeText={setedadN}
            />

            <TouchableOpacity style={styles.dropdown}>
              <Text
                style={[
                  styles.dropdownText,
                  !sexoN && styles.placeholderText,
                ]}
              >
                {sexoN || 'Sexo'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Botón de crear cuenta */}
          <TouchableOpacity style={styles.createButton} activeOpacity={0.8}
          onPress={() => router.push('/registroExitoso')}
          >
            <Text style={styles.createButtonText}>Crear cuenta</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
    backgroundColor: '#81B7D2',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  pinSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  pinInput: {
    width: 60,
    height: 60,
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  createButton: {
    backgroundColor: '#f4a261',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});