import { apiClient } from "@core/network/apiClient";

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
};

export async function signup(payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const res = await apiClient.post("/auth/signup", payload);
  return res.data;
}

export const confirmSignup = async(payload: { email: string, confirmationCode: string }) => {
  const res = await apiClient.post("/auth/confirmSignup", payload)
  return res.data;
}

export async function login(payload: { email: string; password: string }) {
  const res = await apiClient.post<LoginResponse>("/auth/login", payload);
  return res.data;
}
