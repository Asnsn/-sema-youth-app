import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Para desenvolvimento, permitir acesso a todas as rotas
  // Em produção, implementar autenticação real
  
  const protectedRoutes = ['/admin', '/teacher', '/student']
  const authRoutes = ['/auth/login', '/auth/sign-up']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Por enquanto, permitir acesso a todas as rotas para desenvolvimento
  // TODO: Implementar autenticação real quando Supabase estiver configurado
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
