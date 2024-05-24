import User from "@models/user";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongooseConnect } from "@lib/mongoose";
import bcrypt from "bcrypt";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log({ credentials });
        const email = credentials?.email;
        const password = credentials?.password;
        await mongooseConnect();
        const user = await User.findOne({ email });
        const passwordOk = user && bcrypt.compareSync(password, user.password);
        if (passwordOk) {
          return user;
        }

        return null;
      },
    }),
  ],
};
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return Response.json(
      { message: "User Session Not Found" },
      { status: 404 }
    );
  }
  const userInfo = await User.findOne({ email: userEmail });
  if (!userInfo) {
    return Response.json({ message: "User Not Found" }, { status: 404 });
  }
  return userInfo.isAdmin;
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
