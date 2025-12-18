import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/app/model/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any) {
        if (!credentials) throw new Error("Missing credentials");
        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error("No user found");
        if (!user.isverified)
          throw new Error("Please verify your account");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("Incorrect password");

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          isverified: user.isverified,
          isAcceptingMessages: user.isAcceptingMessages,
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isverified = user.isverified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isverified = token.isverified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/signin" },
};
