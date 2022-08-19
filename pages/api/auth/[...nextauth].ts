import NextAuth from 'next-auth/next';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: '2.0', // opt-in to Twitter OAuth 2.0
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id.toString();
        token.test = profile?.name;
      }
      return token;
    },
    async session({ session, token, user }) {
      // clone
      let userData = token.id;
      session.twitterId = userData;
      session.test = { token };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
