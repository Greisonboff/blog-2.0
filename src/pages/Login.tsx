import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AvatarFile } from "@/components/AvatarFile";

const Login = () => {
  const { login, cadastrar, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "cadastro">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  // Cadastro state
  const [nome, setNome] = useState("");
  const [cadEmail, setCadEmail] = useState("");
  const [cadSenha, setCadSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginSenha) {
      toast.error("preencha todos os campos");
      return;
    }
    const res = await login(loginEmail, loginSenha, lembrar);
    if (res.success) {
      navigate("/");
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !cadEmail || !cadSenha) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    if (cadSenha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (cadSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    const res = await cadastrar({
      name: nome.trim(),
      email: cadEmail,
      password: cadSenha,
      confirmPassword: confirmarSenha,
      img: avatarFile || "",
    });

    if (res.success) {
      navigate("/");
    }
  };

  const tabClass = (t: string) =>
    `flex-1 py-2.5 text-center text-sm font-medium transition-colors ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`;

  const inputClass =
    "w-full rounded-md border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="blog-container flex justify-center min-h-[85vh]">
      <div className="w-full max-w-md animate-fade-in rounded-lg border bg-card p-6 shadow-[var(--shadow-card)] max-h-fit">
        <div className="mb-6 flex border-b">
          <button onClick={() => setTab("login")} className={tabClass("login")}>
            Login
          </button>
          <button
            onClick={() => setTab("cadastro")}
            className={tabClass("cadastro")}
          >
            Cadastro
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={inputClass}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                type="password"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                className={inputClass}
                placeholder="••••••"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="rounded border-border"
              />
              Lembrar de mim
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleCadastro} className="space-y-4">
            <AvatarFile avatarFile={avatarFile} setAvatarFile={setAvatarFile} />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Nome completo *
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
                Email *
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
                Senha * (mín. 6 caracteres)
              </label>
              <input
                type="password"
                value={cadSenha}
                onChange={(e) => setCadSenha(e.target.value)}
                className={inputClass}
                placeholder="••••••"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Confirmar senha *
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className={inputClass}
                placeholder="••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Criar conta
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Login;
