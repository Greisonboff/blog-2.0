export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  avatarUrl?: string;
}

export interface Comentario {
  id: string;
  postId: string;
  autorId: string;
  autorNome: string;
  texto: string;
  dataCriacao: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  autorId: string;
  autorNome: string;
  dataCriacao: string;
  imagemUrl?: string;
  likes: string[]; // array of user IDs who liked
  comentarios: Comentario[];
  images?: [string];
}
