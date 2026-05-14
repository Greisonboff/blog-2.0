import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { formatDate } from "@/lib/formatDate";
import { Pencil, Trash2, Heart, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/loadin";
import { Pagination } from "@/components/Pagination";
import { DeleteModal } from "@/components/DeleteModal";

const MeusPosts = () => {
  const { user } = useAuth();
  const { editarPost, excluirPost } = useBlog();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editConteudo, setEditConteudo] = useState("");
  const [editImagem, setEditImagem] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  const page = (searchParams.get("page") as string) || "1";

  const { data, isFetching } = useQuery({
    queryKey: ["posts my posts", page],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_API_URL}/post/my-posts${
          page ? `?page=${page}` : ""
        }`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user }),
        },
      ).then((res) => res.json()),
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const startEdit = (post: (typeof data)[0]) => {
    setEditingId(post._id);
    setEditTitulo(post.title);
    setEditConteudo(post.content);
    setEditImagem(post.imagemUrl || "");
  };

  const saveEdit = async () => {
    if (!editTitulo.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (editConteudo.trim().length < 10) {
      toast.error("Conteúdo deve ter no mínimo 10 caracteres");
      return;
    }
    const res = await editarPost(
      { title: editTitulo, content: editConteudo },
      editingId!,
      false,
    );

    if (!res?.isValid) {
      toast.error(res?.message || "Erro ao editar post");
      return;
    }

    setEditingId(null);
    toast.success("Post atualizado!");
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const res = await excluirPost(deleteId);

      if (!res?.isValid) {
        return;
      }
      setDeleteId(null);
      toast.success("Post excluído!");
    }
  };

  return (
    <main className="blog-container max-w-2xl">
      {isFetching && <Loading />}
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Meus Posts
      </h1>
      <div className="mb-6 flex gap-4 text-sm text-muted-foreground">
        {/*  <span>
          {meusPosts.length} post{meusPosts.length !== 1 ? "s" : ""}
        </span>
         <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" /> {totalLikes} curtida
          {totalLikes !== 1 ? "s" : ""}
        </span> */}
      </div>

      {data?.posts?.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Você ainda não publicou nenhum post.
        </p>
      ) : (
        <div className="space-y-3">
          {data?.posts?.map((post) => (
            <div
              key={post._id}
              className="animate-fade-in rounded-lg border bg-card p-4"
            >
              {editingId === post._id ? (
                <div className="space-y-3">
                  <input
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <textarea
                    value={editConteudo}
                    onChange={(e) => setEditConteudo(e.target.value)}
                    rows={5}
                    className="w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    value={editImagem}
                    onChange={(e) => setEditImagem(e.target.value)}
                    placeholder="URL da imagem (opcional)"
                    className="w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-heading text-lg font-semibold text-card-foreground">
                      {post.title}
                    </h3>
                    <p>{post.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.createdAt)} · {post.likesData.likesTotal}{" "}
                      curtida
                      {post.likesData.likesTotal !== 1 ? "s" : ""} ·{" "}
                      {post.comments.length} comentário
                      {post.comments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(post)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(post._id)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Pagination
            currentPage={Number(page)}
            totalPages={data?.totalPages || 1}
          />
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <DeleteModal
          cancelDelete={() => setDeleteId(null)}
          confirmDelete={confirmDelete}
          title="Excluir post"
        />
      )}
    </main>
  );
};

export default MeusPosts;
