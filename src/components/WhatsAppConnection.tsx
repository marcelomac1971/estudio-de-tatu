import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppStore from '@/stores/useAppStore'
import { Smartphone, RefreshCw, CheckCircle2, LogOut, Phone, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const QR_PATTERN = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
]

export function WhatsAppConnection() {
  const {
    whatsappStatus,
    whatsappNumber,
    setWhatsappStatus,
    setWhatsappNumber,
    currentStudioId,
    studios,
    updateStudio,
  } = useAppStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [qrExpired, setQrExpired] = useState(false)

  const studio = studios.find((s) => s.id === currentStudioId)

  useEffect(() => {
    if (whatsappStatus === 'disconnected' && !isRefreshing && !qrExpired) {
      const timer = setTimeout(() => setQrExpired(true), 20000)
      return () => clearTimeout(timer)
    }
  }, [whatsappStatus, isRefreshing, qrExpired])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setQrExpired(false)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const simulateConnection = () => {
    if (!studio?.zapiInstanceId || !studio?.zapiToken) {
      alert('Preencha o Instance ID e Token primeiro!')
      return
    }
    setWhatsappStatus('connecting')
    setTimeout(() => {
      setWhatsappStatus('connected')
      setWhatsappNumber('+55 11 99999-9999')
    }, 2500)
  }

  const handleDisconnect = () => {
    setWhatsappStatus('disconnected')
    setWhatsappNumber(null)
    setQrExpired(false)
  }

  return (
    <Card
      className={cn(
        'border-border/50 transition-all duration-300',
        whatsappStatus === 'connected' ? 'bg-primary/5 border-primary/20' : 'bg-card/50',
      )}
    >
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/30">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="size-5 text-green-500" />
            Z-API WhatsApp Integration
          </CardTitle>
          <CardDescription>
            Gerencie a instância multitenant do Z-API para este estúdio.
          </CardDescription>
        </div>
        {whatsappStatus === 'connected' ? (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none shrink-0 flex gap-1.5 items-center px-3 py-1 text-sm">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" /> CONNECTED
          </Badge>
        ) : whatsappStatus === 'connecting' ? (
          <Badge
            variant="outline"
            className="shrink-0 flex gap-1.5 items-center px-3 py-1 text-sm bg-background"
          >
            <RefreshCw className="size-3 animate-spin" /> Conectando...
          </Badge>
        ) : (
          <Badge
            variant="destructive"
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none shrink-0 flex gap-1.5 items-center px-3 py-1 text-sm"
          >
            <span className="size-2 rounded-full bg-destructive" /> DISCONNECTED
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3" /> Instance ID
            </Label>
            <Input
              placeholder="Ex: 3A5B9C8D"
              className="font-mono bg-background"
              value={studio?.zapiInstanceId || ''}
              onChange={(e) =>
                studio && updateStudio({ ...studio, zapiInstanceId: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3" /> Instance Token
            </Label>
            <Input
              type="password"
              placeholder="Ex: tok_12345"
              className="font-mono bg-background"
              value={studio?.zapiToken || ''}
              onChange={(e) => studio && updateStudio({ ...studio, zapiToken: e.target.value })}
            />
          </div>
        </div>

        {whatsappStatus === 'connected' ? (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-background border border-border rounded-xl p-4 sm:p-6 animate-fade-in gap-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  Instância Ativa e Roteando Webhooks
                </p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                  <Phone className="size-3.5" /> {whatsappNumber}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 transition-colors"
              onClick={handleDisconnect}
            >
              <LogOut className="size-4 mr-2" /> Desconectar Instância
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start animate-fade-in mt-4 bg-muted/20 p-6 rounded-xl border border-border/50">
            <div className="relative shrink-0 flex flex-col items-center gap-3">
              <div
                className={cn(
                  'p-4 bg-white rounded-xl relative overflow-hidden transition-opacity duration-300 ring-4 ring-background shadow-lg',
                  (isRefreshing || qrExpired || whatsappStatus === 'connecting') && 'opacity-40',
                )}
              >
                {qrExpired && !isRefreshing && whatsappStatus !== 'connecting' && (
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 text-center">
                    <span className="text-sm font-semibold mb-3 text-foreground">
                      QR Code Expirado
                    </span>
                    <Button size="sm" onClick={handleRefresh} className="rounded-full shadow-md">
                      <RefreshCw className="size-4 mr-2" /> Gerar Novo
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-[2px] w-48 h-48 md:w-52 md:h-52">
                  {QR_PATTERN.map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={cn(
                          'w-full h-full rounded-[1px]',
                          cell ? 'bg-zinc-900' : 'bg-transparent',
                        )}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-5 flex-1 w-full text-center md:text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-base">
                  Autenticação Z-API:
                </h4>
                <ol className="space-y-3 text-sm text-muted-foreground text-left max-w-md mx-auto md:mx-0 list-decimal list-inside marker:text-green-500 marker:font-bold">
                  <li>
                    Preencha o <strong>Instance ID</strong> e <strong>Token</strong> acima.
                  </li>
                  <li>Aponte o WhatsApp do estúdio para este QR Code.</li>
                  <li>
                    Os webhooks serão automaticamente configurados para sua instância do Supabase.
                  </li>
                </ol>
              </div>
              <div className="pt-2 flex justify-center md:justify-start">
                <Button
                  variant="secondary"
                  onClick={simulateConnection}
                  disabled={whatsappStatus === 'connecting' || qrExpired}
                >
                  {whatsappStatus === 'connecting'
                    ? 'Aguardando Z-API...'
                    : '[Demo] Simular Leitura do QR'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
