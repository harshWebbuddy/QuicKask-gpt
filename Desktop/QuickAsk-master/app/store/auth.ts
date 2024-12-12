import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { requestLogin } from "../requests";
import {
  requestRegister,
  requestSendEmailCode,
  requestResetPassword,
} from "../requests";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://jwbuwrzmdqukmribxeya.supabase.co",
  process.env.SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YnV3cnptZHF1a21yaWJ4ZXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUxMDk2MTIsImV4cCI6MjAxMDY4NTYxMn0.-dC6WBTENapwROw-C27qVDOBeK1UPpqTG5XhumqT70g",
);

export interface AuthStore {
  session: any;
  email: string;
  login: (
    email: string,
    password: string,
  ) => Promise<{ msg: string; res: boolean }>;
  loginWithGoogle: () => Promise<{ msg: string; res: boolean }>;
  logout: () => void;
  sendEmailCode: (email: string) => Promise<any>;
  sendEmailCodeForResetPassword: (email: string) => Promise<any>;
  register: (
    name: string,
    password: string,
    email: string,
  ) => Promise<{ msg: string; res: boolean }>;
  resetPassword: (
    password: string,
    email: string,
    code: string,
  ) => Promise<any>;
  removeToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      name: "",
      username: "",
      email: "",
      session: null,

      async login(email, password): Promise<{ msg: string; res: boolean }> {
        const { data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!data.user) return { msg: "Login failed", res: false };
        if (!data.user.email_confirmed_at)
          return { msg: "Email not verified", res: false };
        set(() => ({
          email: data.user.email,
          session: data.session,
        }));
        localStorage.setItem("userId", data.user.id);
        return { msg: "Successfully logged in", res: true };
      },
      async loginWithGoogle(): Promise<{ msg: string; res: boolean }> {
        const { data } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            scopes: "https://www.googleapis.com/auth/userinfo.profile",
          },
        });
        if (data.url) localStorage.setItem("userId", data.url);
        return { msg: "Successfully logged in", res: true };
      },
      logout() {
        set(() => ({
          email: "",
          session: null,
        })); //http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6Ill3dTBpVU1qazBXd3BmZjQiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjk1MTI0Njg4LCJpYXQiOjE2OTUxMjEwODgsImlzcyI6Imh0dHBzOi8vandidXdyem1kcXVrbXJpYnhleWEuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImU1NzBkNzlmLTc3NmEtNDc4YS1hNzFkLWM5NzY0NWQ1YzU0YyIsImVtYWlsIjoic2hhb3J1bjEwMTBAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCIsImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTGJ3UUR4V3R2cjAtRUpjM1ZsNXZndHhLMzFGZDZMQmMwV0xJUWV3S1g2PXM5Ni1jIiwiZW1haWwiOiJzaGFvcnVuMTAxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU2hhb3J1biBaaGFuZyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTaGFvcnVuIFpoYW5nIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xid1FEeFd0dnIwLUVKYzNWbDV2Z3R4SzMxRmQ2TEJjMFdMSVFld0tYNj1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTA3Nzg4ODgwODI4MTU1Mjc1OTU0Iiwic3ViIjoiMTA3Nzg4ODgwODI4MTU1Mjc1OTU0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE2OTUxMjEwODh9XSwic2Vzc2lvbl9pZCI6IjVmNGY5ZGVlLTJkYWYtNDMxYS1hYzRjLTYxMzQ2YzExYjQ2OSJ9.1lvtg4X2oLySVm_lilhAI4t-2h-3gNu73LtHnoCxcTU&expires_at=1695124688&expires_in=3600&provider_token=ya29.a0AfB_byDhnNBcm9hXacInBleovnhaETT9YuWTXJckbZjeyrcLPd6Kr3AfB0eoJSdBkuu34DlSsZGEKUIdIB6Z8kr54JAxncACYzZPa0cN3gESUyBxCIPpToGD8O6JYPk1D11kCEE0dmbVCUhTL9DXBYa1RCnchZhfBQaCgYKAWISARISFQGOcNnCwspSz9Hux--3MYiHteRldg0169&refresh_token=POisfE3InaxnzgKVmrl0_w&token_type=bearer
      },
      removeToken() {
        set(() => ({ session: null }));
      },
      async sendEmailCodeForResetPassword(email) {
        let result = await requestSendEmailCode(email, true, {
          onError: (err) => {
            console.error(err);
          },
        });
        return result;
      },
      async sendEmailCode(email) {
        let result = await requestSendEmailCode(email, false, {
          onError: (err) => {
            console.error(err);
          },
        });
        return result;
      },
      async register(
        name,
        email,
        password,
      ): Promise<{ msg: string; res: boolean }> {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });
        if (data.user && !data.session)
          return { msg: "You need to verify your email", res: false };
        else return { msg: "", res: true };
      },
      async resetPassword(password, email, code) {
        let result = await requestResetPassword(password, email, code, {
          onError: (err) => {
            console.error(err);
          },
        });
        //console.log("result", result);
        if (result && result.code == 0 && result.data) {
          const data = result.data;
          const user = data.userEntity;
          set(() => ({
            name: user.name || "",
            username: user.username || "",
            email: user.email || "",
            token: data.token || "",
          }));
        }
        return result;
      },
    }),
    {
      name: StoreKey.Auth,
      version: 1,
    },
  ),
);
