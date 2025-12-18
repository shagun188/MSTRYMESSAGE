// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="next-auth" />

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    email: string;
    isverified: boolean;
    isAcceptingMessages: boolean;
    image?: string | null; // REQUIRED
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      isverified: boolean;
      isAcceptingMessages: boolean;
      image?: string | null; // REQUIRED
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    isverified: boolean;
    isAcceptingMessages: boolean;
    image?: string | null; // REQUIRED
  }
}
