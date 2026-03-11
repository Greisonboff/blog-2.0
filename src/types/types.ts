// types/blog.types.ts

// Interface para o usuário (versão completa)
export interface User {
  _id: string;
  name: string;
  email?: string; // opcional porque aparece em alguns lugares
  img: string | null;
  avatarColar: string;
  password?: string; // opcional por segurança, evite expor
  __v?: number; // versão do documento no MongoDB
}

// Interface para o usuário resumido (usado nos posts)
export interface UserSummary {
  _id?: string; // opcional porque no post principal pode não ter
  name: string;
  img: string | null;
  avatarColar: string;
  email?: string;
}

// Interface para comentário
export interface Comment {
  _id: string;
  comment: string;
  commentedAt: string; // ISO date string
  user: User; // comentário tem usuário completo
  isMyComment: boolean;
}

// Interface para dados de like
export interface LikesData {
  hasLiked: boolean;
  likesTotal: number;
}

// 🎯 **INTERFACE PRINCIPAL - POST COMPLETO**
export interface Post {
  _id: string;
  title: string;
  content: string;
  images: string | null; // pode ser string (URL) ou null
  user: UserSummary; // usuário resumido no post
  comments: Comment[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  isMyPost: boolean;
  likesData: LikesData;
}

// Interface para resposta da API (lista de posts)
export interface PostsResponse {
  posts: Post[];
  totalPages?: number;
  currentPage?: number;
  totalPosts?: number;
}

// Interface para resposta da API (post único)
export interface PostResponse {
  post: Post;
}

export interface FormDataCadastro {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  img: File | string;
}

export interface FormDataPost {
  title: string;
  content: string;
  images?: null | FileList;
}
