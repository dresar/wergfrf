import { apiCall } from "./api";

type LoginCredentials = {
  email: string;
  password: string;
  captcha?: string;
  captchaHash?: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  [key: string]: unknown;
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return apiCall("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  register: async (data: RegisterPayload) => {
    return apiCall("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getMe: async () => {
    return apiCall("/auth/me/");
  },
  getCaptcha: async () => {
    return apiCall("/auth/captcha/");
  },
};
