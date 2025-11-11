// app/data/temasConversacion.ts

export interface Tema {
  id: string;
  titulo: string;
  icono: any; // Opcional, puedes usarlo luego
  descripcion: string;
  pregunta: string;
}

export const temasDB: { [key: string]: Tema } = {
  honestidad: {
    id: 'honestidad',
    titulo: '¡Hablen sobre la Honestidad!',
    icono: 'shield-checkmark',
    descripcion: 'Valo y tu hijo/a exploraron la importancia de decir la verdad.',
    pregunta: 'Oye, ¿qué harías si vieras a alguien dejar caer un billete en la tienda?',
  },
  empatia: {
    id: 'empatia',
    titulo: '¡Conecten con la Empatía!',
    icono: 'heart',
    descripcion: 'Estuvieron aprendiendo sobre cómo se sienten los demás.',
    pregunta: '¿Recuerdas alguna vez que viste a un amigo triste? ¿Cómo crees que se sentía?',
  },
  generosidad: {
    id: 'generosidad',
    titulo: '¡Practiquen la Generosidad!',
    icono: 'gift',
    descripcion: 'Vieron lo bien que se siente compartir.',
    pregunta: 'Si tuvieras un solo dulce y tu mejor amigo no tuviera, ¿qué harías?',
  },
  responsabilidad: {
    id: 'responsabilidad',
    titulo: '¡Hablemos de Responsabilidad!',
    icono: 'rocket',
    descripcion: 'Aprendieron sobre la importancia de cumplir con las tareas.',
    pregunta: '¿Cuál es una tarea de la casa en la que te gustaría ayudarme?',
  },
};