import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { getGoogleClientId, getGoogleClientSecret } from './env';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Google OAuth for regular users
    Google({
      clientId: getGoogleClientId(),
      clientSecret: getGoogleClientSecret(),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    // Credentials for admin login with OTP
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otpCode: { label: 'OTP Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otpCode) {
          return null;
        }

        const email = credentials.email as string;
        const otpCode = credentials.otpCode as string;

        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (!admin || !admin.otpCode || !admin.otpExpiresAt) {
          return null;
        }

        // Check if OTP expired
        if (new Date() > admin.otpExpiresAt) {
          return null;
        }

        // Verify OTP
        const otpMatch = await bcrypt.compare(otpCode, admin.otpCode);

        if (!otpMatch) {
          return null;
        }

        // Clear OTP after successful login
        await prisma.admin.update({
          where: { email },
          data: { otpCode: null, otpExpiresAt: null },
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isAdmin: true,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, create or update user in database
      if (account?.provider === 'google' && profile?.email) {
        try {
          const googleProfile = profile as typeof profile & { picture?: string };
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existingUser) {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || null,
                image: googleProfile.picture || null,
                emailVerified: new Date(),
              },
            });
            user.id = newUser.id;
          } else {
            // Update existing user
            await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name || existingUser.name,
                image: googleProfile.picture || existingUser.image,
              },
            });
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error('Error saving user to database:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        // Check if this is an admin login (credentials provider)
        if (user.isAdmin) {
          token.role = user.role;
          token.isAdmin = true;
        } else {
          // Regular user via Google OAuth
          token.isAdmin = false;
        }
      }
      // Store Google profile data
      if (account?.provider === 'google' && profile) {
        token.picture = (profile as typeof profile & { picture?: string }).picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
        session.user.isAdmin = token.isAdmin as boolean | undefined;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/en/login',
    error: '/en/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
