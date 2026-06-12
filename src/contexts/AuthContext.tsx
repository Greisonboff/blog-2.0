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

      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
      }

      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "erro ao fazer login";
      toast.error("erro ao fazer login");
      return { success: false, message };
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

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      return data;
    } catch (error) {
      const message = "erro ao cadastrar";
      toast.error(message);
      return { success: false, message };
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

      if (data.success) {
        setUser(null);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("erro ao fazer logout");
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

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);

        checkAuthStatus();
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "erro ao editar perfil";
      return { success: false, message };
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
