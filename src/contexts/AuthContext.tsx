import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User } from "@/types/blog";
import { LoginApiResponse, UserData } from "@/types/auth.types";
import { FormDataCadastro } from "@/types/types";

interface AuthContextType {
  user: UserData | null;
  users: User[];
  login: (
    email: string,
    senha: string,
    lembrar: boolean,
  ) => Promise<LoginApiResponse | null>;
  cadastrar: (dados: FormDataCadastro) => Promise<LoginApiResponse | null>;
  logout: () => void;
  useAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

const USERS_KEY = "blog_users";
const SESSION_KEY = "blog_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const u = JSON.parse(saved) as User;
      // verify user still exists
      const allUsers: User[] = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]",
      );
      return allUsers.find((x) => x.id === u.id) || null;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = async (
    email: string,
    senha: string,
    lembrar: boolean,
  ): Promise<LoginApiResponse | null> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/person/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: senha,
      }),
    });
    console.log("Response status:", res);

    const data = await res.json();
    if (data.isValid) {
      setUser(data.user);
    }

    return data;
  };

  const cadastrar = async (formData: FormDataCadastro) => {
    const dataForm = new FormData();
    // Adiciona os campos normais
    dataForm.append("name", formData.name);
    dataForm.append("email", formData.email);
    dataForm.append("password", formData.password);
    dataForm.append("confirmPassword", formData.confirmPassword);

    // Adiciona a imagem (se existir)
    if (formData.img) {
      dataForm.append("img", formData.img);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/person/`, {
      method: "POST",
      credentials: "include",
      body: dataForm,
    });

    const data = await res.json();

    if (data.isValid) {
      setUser(data.user);
    }

    return data;
  };

  const logout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/person/logout`, {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      if (data.isValid) {
        setUser(null);
      }
    });
  };

  const useAuthStatus = () => {
    useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/person/isAuth`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.isLoggedIn) {
            setUser(data.user);
            console.log("user: ", data.user);
          } else {
            setUser(null);
          }
        })
        .catch(() => {
          setUser(null);
        });
    }, [setUser]);
  };

  return (
    <AuthContext.Provider
      value={{ user, users, login, cadastrar, logout, useAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
