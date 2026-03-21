import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreditCard, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'
import { WhatsAppConnection } from '@/components/WhatsAppConnection'
import useAppStore from '@/stores/useAppStore'
import { useToast } from '@/components/ui/use-toast'

export function ConnectionsTab() {
  const { currentStudioId, studios, updateStudio } = useAppStore()
  const { toast } = useToast()
  const studio = studios.find((s) => s.id === currentStudioId)

  if (!studio) return null

  const handleSaveToken = (val: string) => updateStudio({ ...studio, mpAccessToken: val })

  const toggleCalendar = () => {
    updateStudio({ ...studio, googleCalendarConnected: !studio.googleCalendarConnected })
    toast({
      title: studio.googleCalendarConnected
        ? 'Google Calendar Desconectado'
        : 'Google Calendar Conectado (OAuth Simulado)',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <WhatsAppConnection />

      <Card className="border-border/50 bg-card/50 shadow-elevation">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-[#009EE3]">
            <CreditCard className="size-5" /> Integração Mercado Pago
          </CardTitle>
          <CardDescription>Token único deste estúdio para recebimento de sinais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Access Token (Produção)</Label>
            <Input
              type="password"
              value={studio.mpAccessToken || ''}
              onChange={(e) => handleSaveToken(e.target.value)}
              placeholder="APP_USR-..."
              className="font-mono bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 shadow-elevation">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-500">
            <CalendarIcon className="size-5" /> Google Calendar (OAuth)
          </CardTitle>
          <CardDescription>
            Sincronize o calendário do estúdio para criação automática de eventos (Invite
            Inteligente).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studio.googleCalendarConnected ? (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-500" />
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-500">
                    Conectado via OAuth
                  </p>
                  <p className="text-xs text-green-600/80 dark:text-green-500/80">
                    Eventos serão criados na agenda "Studio Noir".
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={toggleCalendar}
                className="text-destructive hover:bg-destructive/10 border-none"
              >
                Desconectar
              </Button>
            </div>
          ) : (
            <Button
              onClick={toggleCalendar}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Conectar Google Calendar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
