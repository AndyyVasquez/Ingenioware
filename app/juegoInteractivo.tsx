import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../src/config/api";

// Importación de los juegos
import JuegoEmpatia from "./game/juegoEmpatia";
import JuegoGenerosidad from "./game/juegoGenerosidad";
import JuegoHonestidad from "./game/juegoHonestidad";
import JuegoPaciencia from "./game/juegoPaciencia";
import JuegoResponsabilidad from "./game/juegoResponsabilidad";
import JuegoValentia from "./game/juegoValentia";

export default function JuegoInteractivoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [tituloLimpio, setTituloLimpio] = useState("");

  // Debug: Ver qué llega realmente
  useEffect(() => {
    console.log("Titulo Original recibido:", params.titulo);
    console.log("ID recibido:", params.valorId);

    // Intentamos limpiar el título apenas carga
    if (params.titulo) {
      setTituloLimpio(limpiarTexto(params.titulo));
    }
  }, [params.titulo]);

  const handleGameWin = async () => {
    await guardarProgreso();
  };

  const guardarProgreso = async () => {
    try {
      const childJson = await AsyncStorage.getItem("currentChild");
      if (!childJson) return;
      const child = JSON.parse(childJson);

      const response = await fetch(`${API_URL}/juegos/completar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nino_id: child.id,
          valor_id: params.valorId, // Usamos ID siempre que sea posible
        }),
      });

      const data = await response.json();
      // Asumimos éxito si el servidor responde
      setShowSuccess(true);
    } catch (error) {
      console.log(
        "Error guardando progreso (offline o server down), continuando...",
      );
      setShowSuccess(true);
    }
  };

  // --- FUNCIÓN DE LIMPIEZA AGRESIVA ---
  const limpiarTexto = (texto: any) => {
    if (!texto) return "";

    // 1. Intenta arreglar la codificación visual (Mojibake común)
    // Esto intenta convertir caracteres UTF-8 interpretados como Latin1 de vuelta a bien
    let textoReparado = texto;
    try {
      textoReparado = decodeURIComponent(escape(texto));
    } catch (e) {
      // Si falla, nos quedamos con el original
    }

    // 2. Normalizar para búsqueda (minúsculas y sin acentos)
    return textoReparado
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Quita tildes
  };

  // --- LÓGICA DE SELECCIÓN DE JUEGO ---
  const renderGame = () => {
    // Si no hay título, mostramos cargando o error
    if (!params.titulo) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
          <Text style={styles.errorText}>Cargando juego...</Text>
        </View>
      );
    }

    // Usamos el título ya procesado o el raw si hace falta
    // TRUCO: Buscamos solo la RAÍZ de la palabra.
    // Evitamos buscar donde va el acento.
    // Ej: "valent" funciona para "valentía", "valentia", "valentÃa"

    const busqueda =
      tituloLimpio ||
      (typeof params.titulo === "string" ? params.titulo.toLowerCase() : "");

    // Prioridad 1: Usar ID si lo conoces (Es lo más seguro)
    const id = String(params.valorId);
    // Si sabes tus IDs en la base de datos, descomenta esto:
    // if (id === "1") return <JuegoHonestidad onWin={handleGameWin} />;

    // Prioridad 2: Búsqueda por texto "seguro"
    if (busqueda.includes("responsabi"))
      return <JuegoResponsabilidad onWin={handleGameWin} />;
    if (busqueda.includes("valent") || busqueda.includes("valen"))
      return <JuegoValentia onWin={handleGameWin} />;
    if (busqueda.includes("honest"))
      return <JuegoHonestidad onWin={handleGameWin} />;
    if (busqueda.includes("empati") || busqueda.includes("empat"))
      return <JuegoEmpatia onWin={handleGameWin} />;
    if (busqueda.includes("generosi") || busqueda.includes("genero"))
      return <JuegoGenerosidad onWin={handleGameWin} />;
    if (busqueda.includes("pacienci") || busqueda.includes("pacien"))
      return <JuegoPaciencia onWin={handleGameWin} />;

    // Fallback
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Juego no encontrado</Text>
        <Text style={{ fontSize: 12, color: "#999" }}>
          Recibido: {params.titulo} {"\n"}
          Procesado: {busqueda}
        </Text>
        <TouchableOpacity onPress={handleGameWin} style={styles.btnSimular}>
          <Text style={{ color: "#FFF" }}>Simular Victoria (Debug)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close-circle" size={40} color="#333" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>{renderGame()}</View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 80 }}>⭐</Text>
            <Text style={styles.modalTitle}>¡Increíble!</Text>
            <Text style={styles.modalText}>¡Lo lograste!</Text>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => {
                setShowSuccess(false);
                router.back(); // Regresa al mapa
              }}
            >
              <Text style={styles.continueText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: { position: "absolute", top: 40, right: 20, zIndex: 100 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
    marginBottom: 20,
  },
  btnSimular: {
    backgroundColor: "#4B0082",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "80%",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#FFD700",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 10,
  },
  modalText: { fontSize: 18, marginVertical: 10, color: "#333" },
  continueBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  continueText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
