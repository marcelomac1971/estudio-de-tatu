import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/useAppStore'
import { Building2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { addStudio } = useAppStore()
  const { toast } = useToast()
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await signUp(formData.email, formData.password)
    if (error) {
      toast({ variant: 'destructive', title: 'Erro no cadastro', description: error.message })
      setIsLoading(false)
      return
    }

    if (data?.user) {
      addStudio({
        id: data.user.id,
        name: formData.name,
        contactPhone: formData.phone,
        contactEmail: formData.email,
        address: formData.address,
        location: formData.address.split(',')[0] || 'Brasil',
        status: 'active',
        mrr: 299,
        botFirstMessage: 'Olá! Bem-vindo ao atendimento do nosso estúdio.',
        recoveryMessage: '',
        depositPercentage: 20,
        availabilitySearchMargin: 3,
        tattooStyleConfigs: [
          {
            name: 'Realismo',
            enabled: true,
            basePrice: 500,
            referenceSize: 10,
            referenceLocation: 'Antebraço',
            sizeSurcharge: 50,
            complexLocations: ['Costela', 'Pescoço'],
            locationSurcharge: 150,
          },
        ],
        zapiInstanceId: '',
        zapiToken: '',
        googleCalendarConnected: false,
        billingCycleEnd: '',
      })
      toast({ title: 'Estúdio registrado com sucesso!', description: 'Bem-vindo à plataforma.' })
      navigate('/')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl bg-card/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <Building2 className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Cadastrar Estúdio</CardTitle>
          <CardDescription>Junte-se à plataforma Modern Noir.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Estúdio *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone (WhatsApp) *</Label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço Completo *</Label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já possui conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
