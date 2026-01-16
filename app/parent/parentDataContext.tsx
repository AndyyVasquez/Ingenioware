import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../../src/config/api';

interface ParentContextType {
  parentName: string;
  childData: any; 
  alertasNuevas: number;
  alertasCriticas: number;
  isLoading: boolean;
  refreshData: () => void; // Función para recargar datos manualmente
}

const ParentDataContext = createContext<ParentContextType>({
  parentName: '',
  childData: null,
  alertasNuevas: 0,
  alertasCriticas: 0,
  isLoading: true,
  refreshData: () => {},
});

export const useParentData = () => useContext(ParentDataContext);

export const ParentDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [parentName, setParentName] = useState('');
  const [childData, setChildData] = useState<any>(null);
  const [alertasNuevas, setAlertasNuevas] = useState(0);
  const [alertasCriticas, setAlertasCriticas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Cargar datos del Padre
      const sessionJson = await AsyncStorage.getItem('parentSession');
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        // Si tienes el nombre completo, tomamos el primer nombre
        const firstName = session.nombre_completo.split(' ')[0];
        setParentName(firstName);

        try {
            const resAlertas = await fetch(`${API_URL}/dashboard/${session.id_pad}`);
            const dataAlertas = await resAlertas.json();
            
            if (dataAlertas.success) {
                setAlertasCriticas(dataAlertas.alertsCount);
                          }
        } catch (e) {
            console.log("No se pudieron cargar alertas frescas (offline?)");
        }
        
      }

      // 2. Cargar datos del Hijo 
      const childrenJson = await AsyncStorage.getItem('childrenData');
      if (childrenJson) {
        const children = JSON.parse(childrenJson);
        if (children.length > 0) {
          // Seleccionamos al primer hijo por defecto para mostrar en el dashboard
          setChildData(children[0]);
        }
      }

    } catch (error) {
      console.error('Error cargando datos del contexto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ParentDataContext.Provider value={{
      parentName,
      childData,
      alertasNuevas,
      alertasCriticas,
      isLoading,
      refreshData: loadData
    }}>
      {children}
    </ParentDataContext.Provider>
  );
};