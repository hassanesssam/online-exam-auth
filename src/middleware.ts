import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authPages = ['/auth/login' , '/auth/register', '/auth/forget-password'];
const privatePages = ['/dashboard', '/']

export default async function middleware(request : NextRequest){
    // const token = request.cookies.get("next-auth.session-token")
    const token = await getToken({req : request})
    const url = request.nextUrl.pathname;

    if(token && authPages.includes(url)){
        const redirectUrl = new URL("/dashboard" , request.nextUrl.origin)

        return NextResponse.rewrite(redirectUrl)
    }
    if(!token && privatePages.includes(url)){
        const redirectUrl = new URL("/auth/login" , request.nextUrl.origin)
        
        return NextResponse.rewrite(redirectUrl)
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
  }