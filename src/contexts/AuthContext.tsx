import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { LoginApiResponse, UserData } from "@/types/auth.types";
import { FormDataCadastro, FormDataEditarPerfil } from "@/types/types";
import { toast } from "sonner";

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (
    email: string,
    senha: string,
    lembrar?: boolean,
  ) => Promise<LoginApiResponse>;
  cadastrar: (dados: FormDataCadastro) => Promise<LoginApiResponse>;
  editarPerfil: (dados: FormDataEditarPerfil) => Promise<LoginApiResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/person/isAuth`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao verificar autenticação");

      const data = await res.json();
      setUser(data.isLoggedIn ? data.user : null);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (
    email: string,
    senha: string,
  ): Promise<LoginApiResponse> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/person/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.isValid) {
        setUser(data.user);
        toast.success("Login realizado com sucesso!");
      }

      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      const message =
        error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(message);
      return { isValid: false, message };
    }
  };

  const cadastrar = async (
    formData: FormDataCadastro,
  ): Promise<LoginApiResponse> => {
    try {
      const dataForm = new FormData();
      dataForm.append("name", formData.name);
      dataForm.append("email", formData.email);
      dataForm.append("password", formData.password);
      dataForm.append("confirmPassword", formData.confirmPassword);

      if (formData.img) {
        dataForm.append("img", formData.img);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/person/`, {
        method: "POST",
        credentials: "include",
        body: dataForm,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.isValid) {
        setUser(data.user);
        toast.success("Cadastro realizado com sucesso!");
      }

      return data;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      const message =
        error instanceof Error ? error.message : "Erro ao cadastrar";
      toast.error(message);
      return { isValid: false, message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/person/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao fazer logout");

      const data = await res.json();

      if (data.isValid) {
        setUser(null);
        toast.success("Logout realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const editarPerfil = async (
    dados: FormDataEditarPerfil,
  ): Promise<LoginApiResponse> => {
    try {
      const dataForm = new FormData();
      dataForm.append("name", dados.name);
      dataForm.append("email", dados.email);

      if (dados.img) {
        dataForm.append("img", dados.img);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/person/`, {
        method: "PATCH",
        credentials: "include",
        body: dataForm,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.isValid) {
        toast.success("Perfil atualizado com sucesso!");

        checkAuthStatus();
      }

      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao editar perfil";
      toast.error(message);
      return { isValid: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, cadastrar, editarPerfil, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
