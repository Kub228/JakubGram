import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma"; // Uistite sa, že máte správnu cestu k svojmu Prisma súboru

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Pripojenie k databáze cez Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "", // Overenie, že ID a secret sú správne nastavené v .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", // Overenie, že ID a secret sú správne nastavené v .env
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!, // Zabezpečte, že hodnoty sú v .env a nie sú prázdne
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!, // Zabezpečte, že hodnoty sú v .env a nie sú prázdne
    }),

    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID || "", // Zabezpečte, že hodnoty sú v .env a nie sú prázdne
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "", // Zabezpečte, že hodnoty sú v .env a nie sú prázdne
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET, // Prísne tajomstvo pre zabezpečenie relácie
  debug: true, // Povolenie ladenia pre lepšiu viditeľnosť problémov
  pages: {
    signIn: '/auth/prihlasenie', // Vlastná stránka pre prihlásenie
    signOut: '/auth/odhlasenie', // Vlastná stránka pre odhlásenie
  },

  callbacks: {
    // Callback pre JWT token
    async jwt({ token, account, profile }) {
      // Ak máme account a profil, pridáme údaje do tokenu
      if (account && profile) {
        token.accessToken = account.access_token; // Uložíme accessToken
        token.name = profile.name; // Uložíme meno používateľa
      }
      return token;
    },
    
    // Callback pre session
    async session({ session, token }) {
      if (token) {
        // Typujeme session.user ako objekt, ktorý môže mať vlastnosť 'name'
        session.user = {
          ...session.user, // Zachováme existujúce vlastnosti session.user
          name: token.name || null, // Priradíme meno, ak je k dispozícii
        }; // Priradíme meno, ak je k dispozícii
      }
      return session;
    },

    // Callback pre presmerovanie
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Po prihlásení presmerujeme na domovskú stránku
      return baseUrl || url; // V prípade, že baseUrl nie je nastavené, použije URL
    },
  },
};
