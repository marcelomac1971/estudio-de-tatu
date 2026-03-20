import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import useAppStore from '@/stores/useAppStore'
import { Lock, Calculator, ShieldCheck, BellRing } from 'lucide-react'
import { WhatsAppConnection } from '@/components/WhatsAppConnection'

export default function Settings() {
  const { toast } = useToast()
  const { subscriptionStatus, setSubscriptionStatus } = useAppStore()

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'As preferências da automação e regras do estúdio foram atualizadas.',
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Studio</h2>
        <p className="text-muted-foreground">
          Gerencie regras financeiras, automações e compliance do seu estúdio.
        </p>
      </div>

      <WhatsAppConnection />

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="size-4" />
            Precificação e Orçamento
          </CardTitle>
          <CardDescription>Ajuste o comportamento do motor de cálculo automático.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Motor Automático Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Fornece estimativas baseadas em estilo, tamanho e local.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Label>Valor Base (Tamanho Mínimo)</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">R$</span>
              <Input type="number" defaultValue="300" className="w-32 bg-background" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Termos Legais e Financeiros
          </CardTitle>
          <CardDescription>Configure retenção de sinal e consentimentos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Coleta de Consentimento LGPD</Label>
              <p className="text-sm text-muted-foreground">
                Exige botão "Aceito" antes de perguntas médicas.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-0.5">
              <Label className="text-base">Autorização de Direitos de Imagem</Label>
              <p className="text-sm text-muted-foreground">
                Inclui no fluxo a pergunta para postagem em redes sociais.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Label>Porcentagem padrão de Sinal (Entrada)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" defaultValue="25" className="w-24 bg-background" />
              <span className="text-muted-foreground">% do valor total</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Este valor será retido sob "Compensação de Agenda" caso cancelem {'<'} 24h.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BellRing className="size-4" />
            Lembretes Automáticos (Anti-Idle)
          </CardTitle>
          <CardDescription>Fluxo de comunicação pré-sessão para reduzir faltas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Aviso T-48h (Preparação)</Label>
              <p className="text-sm text-muted-foreground">
                Envia instruções sobre alimentação e hidratação.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-0.5">
              <Label className="text-base">Confirmação T-24h (Obrigatória)</Label>
              <p className="text-sm text-muted-foreground">
                Exige o clique no botão "Confirmar Agendamento".
              </p>
            </div>
            <Switch defaultChecked />
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
                Desativar a assinatura bloqueia o acesso ao sistema imediatamente.
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
