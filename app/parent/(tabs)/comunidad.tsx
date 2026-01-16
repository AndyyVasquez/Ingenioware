import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { API_URL } from '../../../src/config/api';

export default function ComunidadScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({ titulo: '', contenido: '' });

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/comunidad`);
      const data = await response.json();
      if (data.success) setPosts(data.posts);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePublicar = async () => {
    if(!newPost.titulo || !newPost.contenido) return Alert.alert("Error", "Completa los campos");
    
    try {
        const parentSession = await AsyncStorage.getItem('parentSession');
        const parent = JSON.parse(parentSession || '{}');

        const res = await fetch(`${API_URL}/comunidad`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                padre_id: parent.id_pad,
                autor_nombre: parent.nombre_completo || 'Anónimo',
                titulo: newPost.titulo,
                contenido: newPost.contenido
            })
        });
        
        if(res.ok) {
            setModalVisible(false);
            setNewPost({titulo:'', contenido:''});
            fetchPosts();
            Alert.alert("Éxito", "Publicado en la comunidad");
        }
    } catch (e) { Alert.alert("Error", "No se pudo publicar"); }
  };

  return (
    <LinearGradient colors={['#F3E5F5', '#E1BEE7']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#7B1FA2" />
        </TouchableOpacity>
        <Text style={styles.title}>Comunidad de Padres 💜</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" color="#7B1FA2" style={{marginTop:50}}/> : (
        <ScrollView contentContainerStyle={styles.list}>
            {posts.map((post: any) => (
                <View key={post.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.avatar}><Text>👤</Text></View>
                        <View>
                            <Text style={styles.author}>{post.autor_nombre}</Text>
                            <Text style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</Text>
                        </View>
                    </View>
                    <Text style={styles.postTitle}>{post.titulo}</Text>
                    <Text style={styles.postBody}>{post.contenido}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Ionicons name="heart-outline" size={20} color="#666" />
                            <Text style={styles.actionText}>{post.likes} Likes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nueva Publicación</Text>
                <TextInput 
                    placeholder="Título" 
                    style={styles.input} 
                    value={newPost.titulo} 
                    onChangeText={t=>setNewPost({...newPost, titulo:t})}
                />
                <TextInput 
                    placeholder="Comparte tu experiencia..." 
                    style={[styles.input, {height:100}]} 
                    multiline 
                    value={newPost.contenido} 
                    onChangeText={t=>setNewPost({...newPost, contenido:t})}
                />
                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={()=>setModalVisible(false)} style={styles.btnCancel}>
                        <Text style={{color:'#666'}}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePublicar} style={styles.btnPublish}>
                        <Text style={{color:'#FFF', fontWeight:'bold'}}>Publicar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 20 },
  addButton: { padding: 8, backgroundColor: '#7B1FA2', borderRadius: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#7B1FA2' },
  list: { padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  avatar: { width: 40, height: 40, backgroundColor: '#E1BEE7', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  author: { fontWeight: 'bold', color: '#333' },
  date: { fontSize: 12, color: '#999' },
  postTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A148C', marginBottom: 5 },
  postBody: { fontSize: 14, color: '#555', lineHeight: 20 },
  actions: { marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { color: '#666', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 10 },
  btnCancel: { padding: 10 },
  btnPublish: { backgroundColor: '#7B1FA2', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }
});