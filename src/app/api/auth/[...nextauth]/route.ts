import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";


import axios from "axios";


export const options :NextAuthOptions = {
    pages:{
        signIn : '/login'
    },
    callbacks:{
        async jwt({token , user, account}){
          console.log("data is here" , account);
          
          return {...token , ...user, ...account}
        },
       async session({session , token}){
          return{...session , ...token}
       }
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
            async authorize(credentials){
                try{
                    const res =await axios.post('https://exam.elevateegy.com/api/v1/auth/signin', {
                        email : credentials?.email,
                        password : credentials?.password
                    })
                    if (res.status === 200 && res.data){
                        console.log(res.data);
                        
                        return res.data
                    }
                    return null
                } catch(error){
                    if(axios.isAxiosError(error)){
                        if(error.status === 401){
                            console.log("wrong data" , credentials)
                        }
                    }
                }
                },
                credentials : {
                    email: { label: "Username", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password" }
                }
        })
    ]
}

const handler = NextAuth(options);

export {handler as GET , handler as POST}