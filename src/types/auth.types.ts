// types/auth.types.ts

// Interface para a imagem do usuário
export interface UserImage {
  url: string;
  public_id: string;
}

// Interface para o usuário (dentro da resposta)
export interface UserData {
  name: string;
  email: string;
  img: UserImage | null; // Pode ser null se não tiver imagem
  avatarColar: string;
}

// 🎯 **INTERFACE PRINCIPAL - Resposta de Login**
export interface LoginResponse {
  isValid: boolean;
  message: string;
  user: UserData;
}

// Interface para erro de login
export interface LoginErrorResponse {
  isValid: false;
  message: string;
  user?: never; // Não deve ter user em caso de erro
}

// Interface unificada (pode ser sucesso ou erro)
export type LoginApiResponse = LoginResponse | LoginErrorResponse;

export type DefaultResponse = { isValid: boolean; message: string };
