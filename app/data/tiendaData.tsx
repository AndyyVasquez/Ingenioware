import { ImageSourcePropType } from 'react-native';

// --- INTERFACES GLOBALES ---
export interface ItemAccesorio {
  id: string;
  tipo: 'sombrero' | 'lentes' | 'ropa' | 'fondo';
  emojiIcono: string;
  imagenUrl: ImageSourcePropType;
  nombre: string;
  precio: number;
  descripcion: string;
}

export interface ItemInventario {
  id: string;
}

export interface AvatarEquipado {
  sombrero: string | null;
  lentes: string | null;
  ropa: string | null;
  fondo: string | null;
}

export interface ItemTienda extends ItemAccesorio {
  comprado: boolean;
}

// --- BASE DE DATOS GLOBAL DE ITEMS ---
export const tiendaItems: ItemAccesorio[] = [
  { id: 's1', tipo: 'sombrero', emojiIcono: '🎩', imagenUrl: require('../../assets/images/sombrero-removebg-preview.png'), nombre: 'Sombrero de Copa', precio: 5, descripcion: '¡Muy elegante!' },
  { id: 's2', tipo: 'sombrero', emojiIcono: '🧢', imagenUrl: require('../../assets/images/gorra-removebg-preview.png'), nombre: 'Gorra', precio: 3, descripcion: 'Estilo casual' },
  { id: 's3', tipo: 'sombrero', emojiIcono: '👑', imagenUrl: require('../../assets/images/corona3-removebg-preview.png'), nombre: 'Corona', precio: 20, descripcion: 'Para un rey o reina' },
{ id: 's4', tipo: 'sombrero', emojiIcono: '🎀', imagenUrl: require('../../assets/images/mono-removebg-preview.png'), nombre: 'Moño', precio: 5, descripcion: 'Formalidad al 100' },

  { id: 'l1', tipo: 'lentes', emojiIcono: '🕶️', imagenUrl: require('../../assets/images/lentesSol-removebg-preview.png'), nombre: 'Lentes de Sol', precio: 4, descripcion: '¡Protege tus ojos con estilo!' },
  { id: 'l2', tipo: 'lentes', emojiIcono: '👓', imagenUrl: require('../../assets/images/lentesVer-removebg-preview.png'), nombre: 'Lentes de Lectura', precio: 2, descripcion: 'Para ver mejor' },

  { id: 'r1', tipo: 'ropa', emojiIcono: '👔', imagenUrl: require('../../assets/images/corbata-removebg-preview.png'), nombre: 'Corbata', precio: 5, descripcion: 'Muy formal' },
  { id: 'r2', tipo: 'ropa', emojiIcono: '🧣', imagenUrl: require('../../assets/images/bufanda-removebg-preview.png'), nombre: 'Bufanda', precio: 3, descripcion: 'Para el frío' },
  
  { id: 'f1', tipo: 'fondo', emojiIcono: '🏞️', imagenUrl: require('../../assets/images/fondoNaturaleza.png'), nombre: 'Parque', precio: 10, descripcion: 'Un día soleado' },
  { id: 'f2', tipo: 'fondo', emojiIcono: '🌃', imagenUrl: require('../../assets/images/fondoEspacio.png'), nombre: 'Espacio', precio: 15, descripcion: '¡Al infinito!' },
];