import React, { createContext, useContext, useState } from "react";
import type { Post, Comentario } from "@/types/blog";
import { FormDataPost } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultResponse } from "@/types/auth.types";
import { toast } from "sonner";

interface BlogContextType {
  posts: Post[];
  criarPost: (dados: FormDataPost) => Promise<DefaultResponse>;
  editarPost: (
    formData: FormDataPost,
    postId: string,
    removeImage: boolean,
  ) => Promise<DefaultResponse>;
  excluirPost: (id: string) => Promise<DefaultResponse>;
  toggleLike: (postId: string, userId: string) => void;
  adicionarComentario: (postId: string, comment: string) => void;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be inside BlogProvider");
  return ctx;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState<Post[]>();

  const criarPost = async (formData: FormDataPost) => {
    try {
      const dataForm = new FormData();
      dataForm.append("title", formData.title);
      dataForm.append("content", formData.content);

      if (formData?.images) {
        Array.from(formData.images).forEach((file) => {
          dataForm.append("images", file as File); // nome "images" precisa bater com o backend
        });
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/post`, {
        method: "POST",
        credentials: "include",

        body: dataForm,
      });

      const data = await res.json();

      return data;
    } catch (error) {
      return { isValid: false, message: "Erro ao criar post" };
    }
  };

  const editarPost = async (
    formData: FormDataPost,
    postId: string,
    removeImage: boolean,
  ) => {
    try {
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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/post/${postId}`,
        {
          method: "PATCH",
          credentials: "include",
          body: data,
        },
      );

      const dataResponse = await res.json();

      if (dataResponse.isValid) {
        queryClient.invalidateQueries({ queryKey: ["posts my posts"] });
      }
      return dataResponse;
    } catch (error) {
      return { isValid: false, message: "Erro ao editar post" };
    }
  };

  const excluirPost = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const dataResponse = await res.json();
      if (dataResponse.isValid) {
        queryClient.invalidateQueries({ queryKey: ["posts my posts"] });
        toast.success("Post excluido com sucesso!");
      }

      return dataResponse;
    } catch (error) {
      toast.error("Erro ao excluir post");
      return { isValid: false, message: "Erro ao excluir post" };
    }
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
