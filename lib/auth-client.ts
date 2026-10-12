import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "https://starlit-swan-a8138c.netlify.app",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;