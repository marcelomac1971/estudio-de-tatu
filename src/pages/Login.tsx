import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Building2, Info } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user, signIn } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(
          error.message === 'Invalid login credentials' ? 'Credenciais inválidas.' : error.message,
        )
      }
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao realizar login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <Building2 className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Modern Noir SaaS</CardTitle>
          <CardDescription>Faça login para acessar seu estúdio ou painel admin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@estudio.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <Alert className="mt-6 bg-muted/50 border-border/50">
            <Info className="size-4 text-primary" />
            <AlertDescription className="text-xs text-left ml-2">
              <span className="block mb-1 font-medium">Credenciais de teste:</span>
              <span className="block text-muted-foreground">E-mail: marcelomacbook@me.com</span>
              <span className="block text-muted-foreground">Senha: Skip@Pass</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2 h-7 text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  setEmail('marcelomacbook@me.com')
                  setPassword('Skip@Pass')
                }}
              >
                Preencher credenciais
              </Button>
            </AlertDescription>
          </Alert>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem um estúdio cadastrado?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
