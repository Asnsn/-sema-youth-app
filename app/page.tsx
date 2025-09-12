import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, BookOpen, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-blue-600 text-white px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-8 w-8" />
          <h1 className="text-3xl font-bold">SEMA</h1>
        </div>
        <p className="text-blue-100 text-sm">Sistema de Gestão Educacional</p>
        <p className="text-blue-200 text-xs mt-1 max-w-sm mx-auto">Transformando vidas através da educação</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">620+</div>
              <div className="text-xs text-gray-600">Crianças</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-xs text-gray-600">Unidades</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 px-1">Nossas Unidades</h2>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Brasil
              </CardTitle>
              <CardDescription className="text-sm">4 unidades ativas</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm space-y-1 text-gray-600">
                <div>• Carmem Cristina - Hortolândia</div>
                <div>• São Clemente - Monte Mor</div>
                <div>• Nova Hortolândia - Hortolândia</div>
                <div>• Jardim Paulista - Monte Mor</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                Uganda
              </CardTitle>
              <CardDescription className="text-sm">1 unidade ativa</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-600">• Nawampity - Uganda África</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3 pt-4">
          <Button asChild className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/login">
              <Users className="h-5 w-5 mr-2" />
              Fazer Login
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-12 text-base border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Link href="/auth/sign-up">
              <Heart className="h-5 w-5 mr-2" />
              Cadastrar-se
            </Link>
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 pt-2">Acesse como aluno, professor ou administrador</div>
      </div>

      <div className="h-8"></div>
    </div>
  )
}
