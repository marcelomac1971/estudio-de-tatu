import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/stores/useAppStore'
import { Lock } from 'lucide-react'
import { WhatsAppConnection } from '@/components/WhatsAppConnection'

export default function Settings() {
  const { toast } = useToast()
  const { subscriptionStatus, setSubscriptionStatus } = useAppStore()

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'As preferências da automação foram atualizadas com sucesso.',
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Studio</h2>
        <p className="text-muted-foreground">
          Gerencie o comportamento do seu bot e regras de negócio.
        </p>
      </div>

      <WhatsAppConnection />

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Bot de Atendimento</CardTitle>
          <CardDescription>Ajuste o comportamento do simulador de WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Automação Ativa</Label>
              <p className="text-sm text-muted-foreground">
                O bot responderá automaticamente novos leads.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Label>Mensagem de Boas-Vindas</Label>
            <Input
              defaultValue="Olá! Bem-vindo ao atendimento automatizado do Studio Noir. Como posso te ajudar hoje?"
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Regras Financeiras</CardTitle>
          <CardDescription>Defina as regras padrão para orçamentos e sinais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Porcentagem padrão de Sinal (Entrada)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" defaultValue="25" className="w-24 bg-background" />
              <span className="text-muted-foreground">% do valor total</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Chave PIX para recebimento</Label>
            <Input defaultValue="CNPJ: 12.345.678/0001-90" className="bg-background" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="size-4 text-destructive" />
            Status da Assinatura
          </CardTitle>
          <CardDescription>Gerencie o plano de acesso à automação.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Assinatura Ativa</Label>
              <p className="text-sm text-muted-foreground">
                Desativar a assinatura bloqueará o acesso ao sistema imediatamente.
              </p>
            </div>
            <Switch
              checked={subscriptionStatus === 'ativo'}
              onCheckedChange={(checked) => setSubscriptionStatus(checked ? 'ativo' : 'inativo')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-12">
        <Button onClick={handleSave} size="lg">
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
