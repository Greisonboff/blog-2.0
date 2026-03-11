import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { toast } from "sonner";

const CriarPost = () => {
  const { user } = useAuth();
  const { criarPost } = useBlog();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    navigate("/login");
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!titulo.trim()) e.titulo = "Título é obrigatório";
    if (conteudo.trim().length < 10)
      e.conteudo = "Conteúdo deve ter no mínimo 10 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    criarPost({
      title: titulo,
      content: conteudo,
    });
    toast.success("Post publicado com sucesso!");
    navigate("/");
  };

  return (
    <main className="blog-container max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Criar novo post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Título *
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Digite o título do post"
          />
          {errors.titulo && (
            <p className="mt-1 text-sm text-destructive">{errors.titulo}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Conteúdo *
          </label>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            rows={8}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Escreva o conteúdo do seu post (mín. 10 caracteres)"
          />
          {errors.conteudo && (
            <p className="mt-1 text-sm text-destructive">{errors.conteudo}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            URL da imagem (opcional)
          </label>
          <input
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Publicar
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
};

export default CriarPost;
