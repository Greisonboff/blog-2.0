import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Post, Comentario } from "@/types/blog";
import { FormDataPost } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

const SEED_POSTS: Post[] = [
  {
    id: "seed-1",
    titulo: "Bem-vindo ao nosso Blog!",
    conteudo:
      'Este é o nosso novo espaço para compartilhar ideias, histórias e conhecimento. Aqui você pode criar sua conta, publicar posts, curtir e comentar nas publicações de outros autores. Explore, participe e faça parte dessa comunidade! Para começar, clique em "Criar Post" no menu superior.',
    autorId: "system",
    autorNome: "Equipe Blog",
    dataCriacao: new Date(Date.now() - 86400000 * 2).toISOString(),
    likes: [],
    comentarios: [
      {
        id: "c1",
        postId: "seed-1",
        autorId: "system",
        autorNome: "Equipe Blog",
        texto: "Esperamos que gostem do blog! 🎉",
        dataCriacao: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
  {
    id: "seed-2",
    titulo: "Dicas para escrever bons posts",
    conteudo:
      "Escrever um bom post é uma arte. Comece com um título chamativo que desperte curiosidade. Use parágrafos curtos e objetivos. Adicione imagens para ilustrar suas ideias. Revise o texto antes de publicar e não tenha medo de compartilhar sua perspectiva única. Lembre-se: a prática leva à perfeição!",
    autorId: "system",
    autorNome: "Equipe Blog",
    dataCriacao: new Date(Date.now() - 86400000).toISOString(),
    imagemUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop",
    likes: [],
    comentarios: [],
  },
  {
    id: "seed-3",
    titulo: "O poder da comunidade online",
    conteudo:
      "Comunidades online têm o poder de conectar pessoas de todo o mundo. Através de blogs, fóruns e redes sociais, podemos trocar experiências, aprender uns com os outros e construir relacionamentos significativos. Participe ativamente, seja respeitoso e contribua com conteúdo de qualidade.",
    autorId: "system",
    autorNome: "Equipe Blog",
    dataCriacao: new Date().toISOString(),
    likes: [],
    comentarios: [],
  },
];

interface BlogContextType {
  posts: Post[];
  criarPost: (dados: FormDataPost) => void;
  editarPost: (
    formData: FormDataPost,
    postId: string,
    removeImage: boolean,
  ) => void;
  excluirPost: (id: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  adicionarComentario: (postId: string, comment: string) => void;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be inside BlogProvider");
  return ctx;
};

const POSTS_KEY = "blog_posts";
const INIT_KEY = "blog_initialized";

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(POSTS_KEY);
    if (saved) return JSON.parse(saved);
    if (!localStorage.getItem(INIT_KEY)) {
      localStorage.setItem(INIT_KEY, "true");
      return SEED_POSTS;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  const criarPost = (formData: FormDataPost) => {
    const dataForm = new FormData();
    dataForm.append("title", formData.title);
    dataForm.append("content", formData.content);

    if (formData?.images) {
      Array.from(formData.images).forEach((file) => {
        dataForm.append("images", file as File); // nome "images" precisa bater com o backend
      });
    }

    return fetch(`${import.meta.env.VITE_API_URL}/post`, {
      method: "POST",
      credentials: "include",

      body: dataForm,
    }).then((res) => res.json());
  };

  const editarPost = async (
    formData: FormDataPost,
    postId: string,
    removeImage: boolean,
  ) => {
    if (!postId) throw new Error("Post não encontrado");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("removeImage", "" + removeImage);

    if (formData?.images) {
      Array.from(formData.images).forEach((file) => {
        data.append("images", file as File); // nome "images" precisa bater com o backend
      });
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${postId}`, {
      method: "PATCH",
      credentials: "include",
      body: data,
    });

    const dataResponse = await res.json();
    if (dataResponse.isValid) {
      queryClient.invalidateQueries({ queryKey: ["posts my posts"] });
    }
    return dataResponse;
  };

  const excluirPost = async (id: string) => {
    console.log("excluindo post", id);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const dataResponse = await res.json();
    if (dataResponse.isValid) {
      queryClient.invalidateQueries({ queryKey: ["posts my posts"] });
    }

    return dataResponse;
  };

  const toggleLike = async (likeType: "like" | "unlike", postId: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/post/like`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
        likeType,
      }),
    });

    const dataResponse = await res.json();
    if (dataResponse.isValid) {
      queryClient.invalidateQueries({ queryKey: ["postsreq"] });
    }

    return dataResponse;
  };

  const adicionarComentario = async (postId: string, comment: string) => {
    const data = {
      id: postId,
      comment: comment,
    };

    return await fetch(`${import.meta.env.VITE_API_URL}/post/comment`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        // if (res.status === 401) {
        //   toggleOpenLogin();
        //   return;
        // }
        console.log("response", res);
        return res.json();
      })
      .then((data) => {
        if (data.isValid) {
          queryClient.invalidateQueries({ queryKey: ["postsreq"] });
        }
        return data;
      });
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        criarPost,
        editarPost,
        excluirPost,
        toggleLike,
        adicionarComentario,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
