import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">SEMA</h1>
          <p className="text-green-700 dark:text-green-300">Sistema de Gestão Educacional</p>
        </div>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-700 dark:text-green-300">
              Conta Criada com Sucesso!
            </CardTitle>
            <CardDescription className="text-center">Verifique seu email para confirmar</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Você se cadastrou com sucesso no sistema SEMA. Por favor, verifique seu email e clique no link de
              confirmação antes de fazer login.
            </p>
            <p className="text-sm text-muted-foreground">
              Após a confirmação, você poderá acessar seu portal e começar a usar todas as funcionalidades do sistema.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/login">Ir para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
