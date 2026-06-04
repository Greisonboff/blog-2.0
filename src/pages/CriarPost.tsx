import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { toast } from "sonner";
import FormPost from "@/components/FormPost";

const CriarPost = () => {
  const { user } = useAuth();
  const { criarPost } = useBlog();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemUrl, setImagemUrl] = useState<File | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    if (!validate()) return;

    const res = await criarPost({
      title: titulo,
      content: conteudo,
      images: Array.isArray(imagemUrl)
        ? (imagemUrl as unknown as FileList)
        : ([imagemUrl] as unknown as FileList),
    });

    if (!res?.isValid) {
      toast.error(res?.message || "Erro ao criar post");
      return;
    }

    toast.success("Post publicado com sucesso!");
    navigate("/");
  };

  return (
    <main className="blog-container max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Criar novo post
      </h1>

      <FormPost
        titulo={titulo}
        setTitulo={setTitulo}
        conteudo={conteudo}
        setConteudo={setConteudo}
        imagemUrl={imagemUrl}
        setImagemUrl={setImagemUrl}
        handleSubmit={handleSubmit}
        errors={errors}
        handleCancel={() => navigate("/")}
      />
    </main>
  );
};

export default CriarPost;
