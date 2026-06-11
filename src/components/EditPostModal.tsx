import { useState } from "react";
import FormPost from "./FormPost";
import Modal from "./Modal";
import { Post } from "@/types/blog";
import { toast } from "sonner";
import { useBlog } from "@/contexts/BlogContext";

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

function EditPostModal({ post, onClose }: EditPostModalProps) {
  if (!post) return null;

  const { editarPost } = useBlog();

  console.log(post);

  const [titulo, setTitulo] = useState(post.title);
  const [conteudo, setConteudo] = useState(post.content);
  const [imagemUrl, setImagemUrl] = useState<File | string | null>(
    post.images[0] || null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!titulo.trim()) e.titulo = "Título é obrigatório";
    if (conteudo.trim().length < 10)
      e.conteudo = "Conteúdo deve ter no mínimo 10 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEdit = async () => {
    if (!validate()) return;

    const res = await editarPost(
      {
        title: titulo,
        content: conteudo,
        images: Array.isArray(imagemUrl)
          ? (imagemUrl as unknown as FileList)
          : ([imagemUrl] as unknown as FileList),
      },
      post._id,
      !imagemUrl,
    );

    toast.error(res?.message || "Erro ao editar post");
    if (res?.success) {
      onClose();
    }
  };

  return (
    <Modal
      title="Editar post"
      handleClose={onClose}
      className="!max-w-full !h-full !m-0 md:!max-w-[70%] md:!h-auto md:max-h-[80vh] overflow-y-auto"
    >
      <FormPost
        titulo={titulo}
        setTitulo={setTitulo}
        conteudo={conteudo}
        setConteudo={setConteudo}
        imagemUrl={imagemUrl}
        setImagemUrl={setImagemUrl}
        handleSubmit={saveEdit}
        errors={errors}
        handleCancel={onClose}
        submitText="Salvar alterações"
      />
    </Modal>
  );
}

export default EditPostModal;
