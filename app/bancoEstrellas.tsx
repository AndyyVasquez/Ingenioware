import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../src/config/api';

export default function BancoEstrellasScreen() {
  const router = useRouter();
  const [monedas, setMonedas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaldo = async () => {
        try {
            const childJson = await AsyncStorage.getItem('currentChild');
            if(!childJson) return;
            const child = JSON.parse(childJson);
            
            // Reutilizamos la API de progreso para obtener el saldo exacto
            const res = await fetch(`${API_URL}/progreso/${child.id}`);
            const data = await res.json();
            if(data.success) setMonedas(data.stats.monedas);
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };
    fetchSaldo();
  }, []);

  return (
    <LinearGradient colors={['#FFF8E1', '#FFECB3']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={30} color="#FF6F00" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.label}>Tu Saldo Actual</Text>
        {loading ? <ActivityIndicator color="#FF6F00" /> : (
            <View style={styles.balanceBox}>
                <Text style={{fontSize: 60}}>🪙</Text>
                <Text style={styles.amount}>{monedas}</Text>
            </View>
        )}
        <Text style={styles.hint}>¡Juega más para ganar!</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', top: 50, right: 20 },
  backBtn: { padding: 10 },
  content: { alignItems: 'center' },
  label: { fontSize: 24, color: '#FF6F00', fontWeight: 'bold', marginBottom: 20 },
  balanceBox: { flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#FFF', padding: 30, borderRadius: 30, elevation: 5 },
  amount: { fontSize: 60, fontWeight: '900', color: '#FF8F00' },
  hint: { marginTop: 30, color: '#8D6E63', fontSize: 16 }
});