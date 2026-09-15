import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface BaseToken {
  iss: string;
  exp: number;
}

interface AccessTokenClaims extends BaseToken {
  username: string;
  createdAt: string;
}

interface RefreshTokenClaims extends BaseToken {
  sessionId: string;
}

interface AuthState {
  accessToken?: {
    data: AccessTokenClaims;
    value: string;
  };
  refreshToken?: {
    data: RefreshTokenClaims;
    value: string;
  };
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  getToken: () => string;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: undefined,
      refreshToken: undefined,
      setAccessToken: (token: string) => {
        console.log("token");
        const claims = jwtDecode(token) as AccessTokenClaims | undefined;
        console.log("claims");
        if (!claims) return;
        if (claims.exp < Date.now() / 1000) return;

        console.log("not expired");
        set({
          accessToken: {
            data: claims,
            value: token,
          },
        });
      },
      setRefreshToken: (token: string) => {
        const claims = jwtDecode(token) as RefreshTokenClaims | undefined;
        if (!claims) return;
        if (claims.exp < Date.now() / 1000) return;

        set({
          refreshToken: {
            data: claims,
            value: token,
          },
        });
      },
      getToken: () => {
        const state = get();
        const token = state.accessToken?.value;
        if (!token) throw new Error("Authentication failure");

        const expiration = state.accessToken?.data.exp;
        if (expiration && expiration < Date.now() / 1000) throw new Error("Token expired");

        // Maybe with more time add refresh token FE functionality?

        return token;
      },
      logout: () => set({ accessToken: undefined, refreshToken: undefined }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
