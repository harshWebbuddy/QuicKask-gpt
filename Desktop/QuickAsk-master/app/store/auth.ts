import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { requestLogin } from "../requests";
import { requestRegister, requestSendEmailCode, requestResetPassword } from "../requests";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL ?? "https://xfjywamqdldfgjucqxll.supabase.co",
  process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmanl3YW1xZGxkZmdqdWNxeGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNjkzNjMsImV4cCI6MjA0Nzg0NTM2M30.7ngaROroLEPprdNBdObJQQhc-aeM6MZmE8HkOQt0_3k"
);

export interface AuthStore {
  session: any;
  email: string;
  login: (
    email: string,
    password: string
  ) => Promise<{ msg: string; res: boolean }>;
  loginWithGoogle: () => Promise<{ msg: string; res: boolean }>;
  logout: () => void;
  sendEmailCode: (email: string) => Promise<any>;
  sendEmailCodeForResetPassword: (email: string) => Promise<any>;
  register: (
    name: string,
    password: string,
    email: string
  ) => Promise<{ msg: string; res: boolean }>;
  resetPassword: (
    password: string,
    email: string,
    code: string
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { msg: "Login failed: " + error.message, res: false };
        }

        if (!data.user) return { msg: "User not found", res: false };
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
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
        });

        if (error) {
          return { msg: "Google login failed: " + error.message, res: false };
        }

        if (data.url) localStorage.setItem("userId", data.url);

        return { msg: "Successfully logged in with Google", res: true };
      },

      logout() {
        set(() => ({
          email: "",
          session: null,
        }));
        localStorage.removeItem("userId");
      },

      async sendEmailCodeForResetPassword(email) {
        const result = await requestSendEmailCode(email, true, {
          onError: (err) => {
            console.error(err);
          },
        });
        return result;
      },

      async sendEmailCode(email) {
        const result = await requestSendEmailCode(email, false, {
          onError: (err) => {
            console.error(err);
          },
        });
        return result;
      },

      async register(name, password, email): Promise<{ msg: string; res: boolean }> {
        const { data, error } = await supabase.auth.signUpWithPassword({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) {
          return { msg: "Registration failed: " + error.message, res: false };
        }

        if (data.user && !data.session)
          return { msg: "You need to verify your email", res: false };
        return { msg: "Successfully registered", res: true };
      },

      async resetPassword(password, email, code) {
        const result = await requestResetPassword(password, email, code, {
          onError: (err) => {
            console.error(err);
          },
        });

        if (result && result.code == 0 && result.data) {
          const data = result.data;
          const user = data.userEntity;
          set(() => ({
            name: user.name || "",
            username: user.username || "",
            email: user.email || "",
          }));
        }

        return result;
      },

      removeToken() {
        set(() => ({ session: null }));
      },
    }),
    {
      name: StoreKey.Auth,
      version: 1,
    }
  )
);
