import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const { email, password } = credentials;
                // Call api to login
                try {
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_AUTH}/Login`, {
                        email,
                        password,
                    });
                    // Check data is valid
                    const data = response.data;
                    if (response.status === 200) {
                        return data.data;
                    } else {
                        throw new Error(data.error);
                    }
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
    jwt: {
        async encode({ secret, token }) {
            return jwt.sign(token, secret);
        },
        async decode({ secret, token }) {
            return jwt.verify(token, secret);
        },
    },
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
});
