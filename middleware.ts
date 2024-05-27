import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	if (pathname === '/') {
		const response = NextResponse.next();
		response.cookies.set('middleware-cookie', 'hello!');
		return response;
	}
	if (pathname === '/profile') {
		return Response.redirect(new URL('/', request.url));
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
