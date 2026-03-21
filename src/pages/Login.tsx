import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/useAppStore'
import { Building2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAppStore()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) {
      navigate('/')
    } else {
      setError('Credenciais inválidas.')
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
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

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
