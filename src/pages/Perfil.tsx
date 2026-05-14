import { useAuth } from "@/contexts/AuthContext";
import { defaultAvatar } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Perfil = () => {
  const { user, editarPerfil } = useAuth();

  const navigate = useNavigate();
  const [nome, setNome] = useState(user?.name || "");
  const [cadEmail, setCadEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.img?.url || defaultAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const isDefaultAvatar = avatarUrl === defaultAvatar;

  const inputClass =
    "w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault();

    const res = editarPerfil({
      name: nome,
      email: cadEmail,
      img: avatarFile
        ? avatarFile
        : avatarUrl === defaultAvatar
          ? "delete"
          : avatarUrl, // Envia o arquivo se selecionado, caso contrário, envia a URL
    });
    res.then((res) => {
      if (res.isValid) {
        toast.success("Perfil atualizado com sucesso!");
        navigate("/");
      } else {
        toast.error(res.message || "Erro ao atualizar perfil");
      }
    });
  }

  return (
    <main className="blog-container max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Perfil do Usuário
      </h1>

      <form onSubmit={handleCadastro} className="space-y-4">
        <div className="flex flex-col items-center">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile!) : avatarUrl}
            alt="Avatar do usuário"
            className="mb-2 h-32 w-32 rounded-full object-cover"
          />

          <input
            id="avatar"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
          <div className="flex gap-3 mt-2">
            <label
              htmlFor="avatar"
              className="mb-1 block cursor-pointer text-sm font-medium rounded-md bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {avatarFile || !isDefaultAvatar
                ? "Alterar avatar"
                : "Adicionar avatar"}
            </label>
            {avatarFile || !isDefaultAvatar ? (
              <button
                type="button"
                className="mb-1 block cursor-pointer text-sm font-medium rounded-md bg-primary px-3 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={() => {
                  setAvatarUrl(defaultAvatar);
                  setAvatarFile(null);
                }}
              >
                Remover avatar
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Nome completo
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            value={cadEmail}
            onChange={(e) => setCadEmail(e.target.value)}
            className={inputClass}
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Salvar alterações
        </button>
      </form>
    </main>
  );
};

export default Perfil;
