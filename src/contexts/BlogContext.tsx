import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Post, Comentario } from '@/types/blog';

const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    titulo: 'Bem-vindo ao nosso Blog!',
    conteudo: 'Este é o nosso novo espaço para compartilhar ideias, histórias e conhecimento. Aqui você pode criar sua conta, publicar posts, curtir e comentar nas publicações de outros autores. Explore, participe e faça parte dessa comunidade! Para começar, clique em "Criar Post" no menu superior.',
    autorId: 'system',
    autorNome: 'Equipe Blog',
    dataCriacao: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: [],
    comentarios: [
      {
        id: 'c1',
        postId: 'seed-1',
        autorId: 'system',
        autorNome: 'Equipe Blog',
        texto: 'Esperamos que gostem do blog! 🎉',
        dataCriacao: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'seed-2',
    titulo: 'Dicas para escrever bons posts',
    conteudo: 'Escrever um bom post é uma arte. Comece com um título chamativo que desperte curiosidade. Use parágrafos curtos e objetivos. Adicione imagens para ilustrar suas ideias. Revise o texto antes de publicar e não tenha medo de compartilhar sua perspectiva única. Lembre-se: a prática leva à perfeição!',
    autorId: 'system',
    autorNome: 'Equipe Blog',
    dataCriacao: new Date(Date.now() - 86400000).toISOString(),
    imagemUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
    likes: [],
    comentarios: [],
  },
  {
    id: 'seed-3',
    titulo: 'O poder da comunidade online',
    conteudo: 'Comunidades online têm o poder de conectar pessoas de todo o mundo. Através de blogs, fóruns e redes sociais, podemos trocar experiências, aprender uns com os outros e construir relacionamentos significativos. Participe ativamente, seja respeitoso e contribua com conteúdo de qualidade.',
    autorId: 'system',
    autorNome: 'Equipe Blog',
    dataCriacao: new Date().toISOString(),
    likes: [],
    comentarios: [],
  },
];

interface BlogContextType {
  posts: Post[];
  criarPost: (post: Omit<Post, 'id' | 'dataCriacao' | 'likes' | 'comentarios'>) => void;
  editarPost: (id: string, dados: { titulo: string; conteudo: string; imagemUrl?: string }) => void;
  excluirPost: (id: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  adicionarComentario: (postId: string, comentario: Omit<Comentario, 'id' | 'dataCriacao'>) => void;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlog must be inside BlogProvider');
  return ctx;
};

const POSTS_KEY = 'blog_posts';
const INIT_KEY = 'blog_initialized';

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(POSTS_KEY);
    if (saved) return JSON.parse(saved);
    if (!localStorage.getItem(INIT_KEY)) {
      localStorage.setItem(INIT_KEY, 'true');
      return SEED_POSTS;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  const criarPost = useCallback((post: Omit<Post, 'id' | 'dataCriacao' | 'likes' | 'comentarios'>) => {
    const novo: Post = {
      ...post,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString(),
      likes: [],
      comentarios: [],
    };
    setPosts(prev => [novo, ...prev]);
  }, []);

  const editarPost = useCallback((id: string, dados: { titulo: string; conteudo: string; imagemUrl?: string }) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p));
  }, []);

  const excluirPost = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleLike = useCallback((postId: string, userId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(userId);
      return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
    }));
  }, []);

  const adicionarComentario = useCallback((postId: string, comentario: Omit<Comentario, 'id' | 'dataCriacao'>) => {
    const novo: Comentario = {
      ...comentario,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString(),
    };
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comentarios: [novo, ...p.comentarios] } : p
    ));
  }, []);

  return (
    <BlogContext.Provider value={{ posts, criarPost, editarPost, excluirPost, toggleLike, adicionarComentario }}>
      {children}
    </BlogContext.Provider>
  );
};
