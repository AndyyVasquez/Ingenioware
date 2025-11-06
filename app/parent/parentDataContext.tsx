// (app)/(parent)/ParentDataContext.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setIsLoading(true);
    try {
      await loadData();
      await cargarAlertas();
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

  const value = {
    childData,
    parentName,
    alertasNuevas,
    alertasCriticas,
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