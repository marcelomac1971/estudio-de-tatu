import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/useAppStore'
import { Smartphone, RefreshCw, CheckCircle2, LogOut, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

// A robust matrix representation of a standard QR Code pattern
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
  const { whatsappStatus, whatsappNumber, setWhatsappStatus, setWhatsappNumber } = useAppStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [qrExpired, setQrExpired] = useState(false)

  // Simulate QR Code expiration after 20 seconds
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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="size-5" />
            Conexão WhatsApp
          </CardTitle>
          <CardDescription>
            Vincule seu dispositivo para automação real com seus clientes.
          </CardDescription>
        </div>
        {whatsappStatus === 'connected' ? (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none shrink-0 flex gap-1.5 items-center px-3 py-1 text-sm">
            <span className="size-2 rounded-full bg-primary animate-pulse" /> Status: Conectado
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
            <span className="size-2 rounded-full bg-destructive" /> Status: Desconectado
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {whatsappStatus === 'connected' ? (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-background border border-border rounded-xl p-4 sm:p-6 animate-fade-in gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  Aparelho Vinculado
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
              <LogOut className="size-4 mr-2" /> Desconectar Conta
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start animate-fade-in">
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
                      <RefreshCw className="size-4 mr-2" /> Recarregar QR Code
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
                  Como vincular seu aparelho:
                </h4>
                <ol className="space-y-3 text-sm text-muted-foreground text-left max-w-md mx-auto md:mx-0 list-decimal list-inside marker:text-primary marker:font-bold">
                  <li>Abra o WhatsApp no seu celular.</li>
                  <li>
                    Toque em <strong className="text-foreground">Menu</strong> (três pontos) ou{' '}
                    <strong className="text-foreground">Configurações</strong> e selecione
                    "Aparelhos Conectados".
                  </li>
                  <li>
                    Toque em <strong className="text-foreground">Conectar um Aparelho</strong>.
                  </li>
                  <li>Aponte a câmera do seu celular para esta tela para escanear o QR Code.</li>
                </ol>
              </div>
              <div className="pt-2 flex justify-center md:justify-start">
                <Button
                  variant="secondary"
                  onClick={simulateConnection}
                  disabled={whatsappStatus === 'connecting' || qrExpired}
                >
                  {whatsappStatus === 'connecting'
                    ? 'Aguardando confirmação...'
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
