import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Tema, temasDB } from '../data/temasConversacion';
// Interfaces (puedes moverlas a un archivo de 'types' luego)
interface ChildData {
  id_nino: number;
  nombre_completo: string;
  nom_nino: string;
  edad_nino: number;
  avatar_emoji: string;
}

interface AlertaEmocional {
  id: number;
  nivel: number;
  vista: boolean;
  atendida: boolean;
}

// Definición del contexto
interface ParentContextType {
  childData: ChildData | null;
  parentName: string;
  alertasNuevas: number;
  alertasCriticas: number;
  temaDelDia: Tema | null;
  isLoading: boolean;
  recargarDatos: () => void;
}

// Creación del contexto
const ParentContext = createContext<ParentContextType | undefined>(undefined);

// El "Proveedor" (el que hace el trabajo)
export function ParentDataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [childData, setChildData] = useState<ChildData | null>(null);
  const [parentName, setParentName] = useState('');
  const [alertasNuevas, setAlertasNuevas] = useState(0);
  const [alertasCriticas, setAlertasCriticas] = useState(0);
  const [temaDelDia, setTemaDelDia] = useState<Tema | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setIsLoading(true);
    try {
      await loadData();
      await cargarAlertas();
      await cargarTemaDelDia(); 
    } catch (error) {
      console.error('Error cargando datos del padre:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    const parentSession = await AsyncStorage.getItem('parentSession');
    if (parentSession) {
      const parentData = JSON.parse(parentSession);
      setParentName(parentData.nom_pad || 'Papá/Mamá');
    }

    const savedChildData = await AsyncStorage.getItem('childData');
    if (savedChildData) {
      const child = JSON.parse(savedChildData);
      setChildData(child);
    }
  };

  const cargarAlertas = async () => {
    const alertasStr = await AsyncStorage.getItem('alertasEmocionales');
    if (alertasStr) {
      const alertas: AlertaEmocional[] = JSON.parse(alertasStr);
      const nuevas = alertas.filter(a => !a.vista).length;
      const criticas = alertas.filter(a => a.nivel === 2 && !a.atendida).length;
      setAlertasNuevas(nuevas);
      setAlertasCriticas(criticas);
    } else {
      setAlertasNuevas(0);
      setAlertasCriticas(0);
    }
  };

  const cargarTemaDelDia = async () => {
    try {
      const progresoStr = await AsyncStorage.getItem('progresoJuegos');
      if (!progresoStr) {
        setTemaDelDia(null); // No ha jugado nada
        return;
      }
      
      const juegosCompletados: string[] = JSON.parse(progresoStr);
      if (juegosCompletados.length === 0) {
        setTemaDelDia(null);
        return;
      }

      // Tomamos el ÚLTIMO valor que completó
      const ultimoValorCompletado = juegosCompletados[juegosCompletados.length - 1];
      
      // Lo buscamos en nuestra base de datos de temas
      const tema = temasDB[ultimoValorCompletado];
      if (tema) {
        setTemaDelDia(tema);
      } else {
        setTemaDelDia(null);
      }
    } catch (error) {
      console.error('Error cargando tema del día:', error);
      setTemaDelDia(null);
    }
  };



  const value = {
    childData,
    parentName,
    alertasNuevas,
    alertasCriticas,
    temaDelDia,
    isLoading,
    recargarDatos: cargarTodo,
  };

  return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>;
}

// El "Hook" (el que facilita usar los datos)
export function useParentData() {
  const context = useContext(ParentContext);
  if (context === undefined) {
    throw new Error('useParentData debe ser usado dentro de un ParentDataProvider');
  }
  return context;
}