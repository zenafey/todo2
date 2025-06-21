import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token');
    const {pathname} = request.nextUrl;
// Если нет токена и пользователь пытается зайти не на страницу логина/регистрации
    if (!token && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        console.log(request.cookies)
        return NextResponse.redirect(new URL('/login', request.url));
    }
// Если есть токен и пользователь пытается зайти на страницу логина/регистрации
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}
// Указываем, к каким путям применять middleware
export const config = {
matcher: ['/', '/login', '/register'],
};