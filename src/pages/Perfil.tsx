import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

const Perfil = () => {
  const { user, editarPerfil } = useAuth();
  console.log("Dados do usuário:", user);

  const [nome, setNome] = useState(user?.name || "");
  const [cadEmail, setCadEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.img.url || "");

  const inputClass =
    "w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault();

    console.log("Dados do usuário:", {
      name: nome,
      email: cadEmail,
      img: avatarUrl,
    });

    const res = editarPerfil({
      name: nome,
      email: cadEmail,
      img: avatarUrl,
    });
    res.then((res) => {
      if (res.isValid) {
        toast.success("Perfil atualizado com sucesso!");
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

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            URL do avatar (opcional)
          </label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className={inputClass}
            placeholder="https://exemplo.com/avatar.jpg"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Criar conta
        </button>
      </form>
    </main>
  );
};

export default Perfil;
