import {NextRequest, NextResponse} from "next/server";

export async function middleware(req: NextRequest) {

    // if (req.nextUrl.pathname.includes('/my-list')) {
    //     return NextResponse.redirect(new URL('/', req.url))
    // }
    const {pathname} = req.nextUrl;
    const token = req?.cookies?.get('token');
    let userId: string | null = null;


    // if ((token && userId) || pathname.includes('/login')) {
    //     return NextResponse.next()
    // }
    // if (!token ) {
    //     return NextResponse.redirect(new URL('/login', req.url))
    // }
    return NextResponse.next()
}
