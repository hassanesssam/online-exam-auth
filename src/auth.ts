import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import { JSON_HEADER } from "./lib/constants/api.constants";
import { cookies } from "next/headers";

export const options :NextAuthOptions = {
    pages:{
        signIn : '/auth/login'
    },

    providers: [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
          }),
          TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,

          }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: {},
              password: {},
            },
            async authorize(credentials){
                    const response = await fetch(`${process.env.API}/auth/signin`, {
                        method: "POST",
                        body: JSON.stringify({
                            email : credentials?.email,
                            password : credentials?.password
                        }),
                        headers: {
                          ...JSON_HEADER,
                        },
                      });

                    const payload: APIResponse<LoginResponse> = await response.json();
                    if(typeof payload === "object" && !('code' in payload)){
                        (await cookies()).set("Online_Exam_token", payload.token, {
                            httpOnly: true,
                          });
                        return {
                            id : payload.user._id,
                            token: payload.token,
                            ...payload.user,
                          };
                } 
                throw new Error(payload.message);

                }
        })
    ],


    callbacks: {
        jwt: ({ token, user ,}) => {
            if (user) {
              token.token = user.token;
              token._id = user._id;
              token.firstName = user.firstName;
              token.lastName = user.lastName;
              token.email = user.email;
              token.phone = user.phone;
              token.role = user.role;
              token.isVerified = user.isVerified;
              token.createdAt = user.createdAt;
            }
      
            return token;
          },
          session: ({ session, token }) => {
            session._id = token._id;
            session.firstName = token.firstName;
            session.lastName = token.lastName;
            session.email = token.email;
            session.phone = token.phone;
            session.role = token.role;
            session.isVerified = token.isVerified;
            session.createdAt = token.createdAt;
      
            return session;
          },
      },
      }


      