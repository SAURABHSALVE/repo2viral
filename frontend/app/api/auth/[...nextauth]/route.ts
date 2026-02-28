import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "repo read:user user:email",
                },
            },
        }),
        // To add Google login later, uncomment and add GOOGLE_CLIENT_ID/SECRET to .env.local:
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // On initial sign in, persist the GitHub access token
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            // Make access token and user id available in session
            session.accessToken = token.accessToken as string;
            session.userId = token.sub;
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
