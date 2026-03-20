import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  CheckCircle2,
  Clock,
  Ban,
  AlertTriangle,
  BellRing,
  ShieldAlert,
  Copy,
  CreditCard,
} from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const { activeAppointments, activeClients, updateAppointment } = useAppStore()
  const { toast } = useToast()

  const selectedDateStr = date ? date.toISOString().split('T')[0] : ''
  const dayApps = activeAppointments
    .filter((a) => a.date === selectedDateStr)
    .sort((a, b) => a.time.localeCompare(b.time))

  // Generate hourly slots from 10:00 to 20:00
  const hours = Array.from({ length: 11 }, (_, i) => `${i + 10}:00`)

  const handleSlotClick = (app: any) => {
    if (app) setSelectedApp(app)
  }

  const getClientInfo = (id: string) => activeClients.find((c) => c.id === id)

  const handleRemind = (app: any, type: string) => {
    if (type === '48h') {
      toast({
        title: 'Lembrete T-48h Disparado',
        description: 'Instruções de preparação e alimentação enviadas ao cliente via WhatsApp.',
      })
    } else if (type === '24h') {
      updateAppointment({ ...app, status: 'pending_confirmation' })
      setSelectedApp({ ...app, status: 'pending_confirmation' })
      toast({
        title: 'Confirmação T-24h Exigida',
        description: 'Mensagem com botão de confirmação obrigatória enviada ao cliente.',
      })
    }
  }

  const handleConfirm = (app: any) => {
    updateAppointment({ ...app, status: 'confirmed' })
    setSelectedApp({ ...app, status: 'confirmed' })
    toast({
      title: 'Agendamento Confirmado',
      description: 'O cliente clicou em Confirmar Agendamento no WhatsApp.',
    })
  }

  const handleCancel = (app: any, type: string) => {
    if (type === '<24h') {
      updateAppointment({ ...app, status: 'cancelled', financialStatus: 'Compensação de Agenda' })
      setSelectedApp({ ...app, status: 'cancelled', financialStatus: 'Compensação de Agenda' })
      toast({
        variant: 'destructive',
        title: 'Compensação de Agenda Aplicada',
        description: 'Sinal retido devido ao cancelamento fora do prazo / no-show.',
      })
    } else {
      const link = `https://studionoir.app/reagendar/${app.id}`
      updateAppointment({ ...app, status: 'cancelled', rescheduleLink: link })
      setSelectedApp({ ...app, status: 'cancelled', rescheduleLink: link })
      toast({
        title: 'Link de Reagendamento Gerado',
        description: 'O cliente manteve o sinal e recebeu o link para reagendar (>24h).',
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
      <Card className="lg:col-span-1 border-border/50 bg-card/50 h-fit">
        <CardContent className="p-4 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            locale={ptBR}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 border-border/50 bg-card/50">
        <CardHeader className="pb-2 border-b border-border">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Agenda:{' '}
            {date ? format(date, "EEEE, d 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col divide-y divide-border">
            {hours.map((hour) => {
              const app = dayApps.find((a) => a.time.startsWith(hour.split(':')[0]))
              const client = app ? getClientInfo(app.clientId) : null

              return (
                <div
                  key={hour}
                  className="flex min-h-[80px] group transition-colors hover:bg-muted/20"
                >
                  <div className="w-20 shrink-0 p-4 text-sm font-medium text-muted-foreground border-r border-border flex items-start justify-end">
                    {hour}
                  </div>
                  <div className="flex-1 p-2 relative">
                    {app && client && (
                      <div
                        onClick={() => handleSlotClick(app)}
                        className={cn(
                          'absolute inset-x-2 top-2 rounded-lg p-3 cursor-pointer shadow-sm border transition-all hover:scale-[1.01]',
                          app.status === 'confirmed'
                            ? 'bg-primary/20 border-primary/30'
                            : app.status === 'pending_confirmation'
                              ? 'bg-orange-500/10 border-orange-500/30'
                              : app.status === 'pending'
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : app.status === 'cancelled'
                                  ? 'bg-muted border-border/50 opacity-60'
                                  : 'bg-card border-border',
                          client.healthAlerts.length > 0 && 'border-l-4 border-l-destructive',
                        )}
                        style={{ height: `calc(${app.duration * 80}px - 16px)`, zIndex: 10 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p
                              className={cn(
                                'font-semibold text-sm',
                                app.status === 'cancelled' && 'line-through text-muted-foreground',
                              )}
                            >
                              {client.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {app.description}
                            </p>
                          </div>
                          {app.status === 'pending_confirmation' && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-orange-500/50 text-orange-600 bg-orange-500/10"
                            >
                              Pend. Confirmação
                            </Badge>
                          )}
                          {app.status === 'pending' && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-yellow-500/50 text-yellow-600 bg-yellow-500/10"
                            >
                              Aguardando Pgto
                            </Badge>
                          )}
                          {app.financialStatus === 'Compensação de Agenda' && (
                            <Badge variant="destructive" className="text-[10px] px-1.5">
                              Retido
                            </Badge>
                          )}
                          {app.paymentStatus === 'approved' &&
                            app.status !== 'cancelled' &&
                            app.depositPaid > 0 && (
                              <Badge
                                variant="secondary"
                                className="bg-secondary/20 text-secondary border-none text-[10px]"
                              >
                                Sinal OK
                              </Badge>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <SheetContent className="w-full sm:max-w-md border-l border-border bg-background p-0 flex flex-col">
          {selectedApp &&
            (() => {
              const client = getClientInfo(selectedApp.clientId)
              const restante = selectedApp.totalValue - selectedApp.depositPaid

              return (
                <>
                  <div className="p-6 bg-card border-b border-border">
                    <SheetHeader>
                      <SheetTitle className="text-xl flex items-center gap-2">
                        {selectedApp.status === 'cancelled' && (
                          <Ban className="size-5 text-destructive" />
                        )}
                        Detalhes da Sessão
                      </SheetTitle>
                      <SheetDescription>
                        {format(date!, "d 'de' MMMM", { locale: ptBR })} às {selectedApp.time}
                        {selectedApp.status === 'cancelled' && ' (Cancelado)'}
                        {selectedApp.status === 'pending' && ' (Aguardando Pagamento do Sinal)'}
                      </SheetDescription>
                    </SheetHeader>
                  </div>

                  <div className="flex-1 overflow-auto p-6 space-y-6">
                    {client?.healthAlerts && client.healthAlerts.length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 animate-shake">
                        <h4 className="flex items-center gap-2 text-destructive font-bold text-sm mb-2">
                          <AlertTriangle className="size-4" /> ALERTA MÉDICO
                        </h4>
                        <ul className="list-disc list-inside pl-4 text-sm text-destructive-foreground">
                          {client.healthAlerts.map((alert, i) => (
                            <li key={i}>{alert}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={cn(selectedApp.status === 'cancelled' && 'opacity-50')}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Cliente</h4>
                      <div className="flex items-center gap-3">
                        <img
                          src={client?.avatar}
                          alt="Avatar"
                          className="size-10 rounded-full bg-muted"
                        />
                        <div>
                          <p className="font-semibold">{client?.name}</p>
                          <p className="text-sm text-muted-foreground">{client?.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Badge
                          variant="outline"
                          className={
                            client?.healthDataConsent
                              ? 'text-green-500 border-green-500/30'
                              : 'text-muted-foreground'
                          }
                        >
                          LGPD: {client?.healthDataConsent ? 'Aceito' : 'Pendente'}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            client?.imageRights
                              ? 'text-primary border-primary/30'
                              : 'text-muted-foreground'
                          }
                        >
                          Imagem: {client?.imageRights ? 'Autorizada' : 'Não Autorizada'}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div
                      className={cn(
                        selectedApp.status === 'cancelled' && 'opacity-50 line-through',
                      )}
                    >
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Projeto</h4>
                      <p className="text-sm bg-muted p-3 rounded-md">{selectedApp.description}</p>
                      <div className="flex items-center gap-2 text-sm mt-3 text-muted-foreground">
                        <Clock className="size-4" /> Duração estimada: {selectedApp.duration} horas
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        Financeiro (Mercado Pago)
                      </h4>
                      {selectedApp.financialStatus === 'Compensação de Agenda' ? (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
                          <p className="font-bold flex items-center gap-2">
                            <Ban className="size-4" /> Compensação de Agenda
                          </p>
                          <p className="text-sm mt-2 text-destructive-foreground">
                            O sinal de <strong>R$ {selectedApp.depositPaid}</strong> foi retido
                            automaticamente devido ao cancelamento com menos de 24h de antecedência
                            (No-show).
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-card rounded-lg p-4 border border-border">
                          <div className="flex justify-between text-sm">
                            <span>Valor Total Acordado</span>
                            <span className="font-medium">R$ {selectedApp.totalValue}</span>
                          </div>
                          <div className="flex justify-between text-sm items-center">
                            <span className="flex items-center gap-1 text-secondary">
                              {selectedApp.paymentStatus === 'approved' ? (
                                <CheckCircle2 className="size-3" />
                              ) : (
                                <Clock className="size-3 text-yellow-500" />
                              )}
                              Sinal Checkout
                            </span>
                            <span
                              className={cn(
                                'font-bold',
                                selectedApp.paymentStatus === 'approved'
                                  ? 'text-secondary'
                                  : 'text-yellow-500',
                              )}
                            >
                              - R$ {selectedApp.depositPaid}
                            </span>
                          </div>
                          {selectedApp.paymentStatus === 'approved' && (
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                              <CreditCard className="size-3" /> Pago via Mercado Pago
                            </p>
                          )}
                          <Separator className="my-2 bg-border/50" />
                          <div className="flex justify-between text-base font-bold text-primary">
                            <span>Restante a Receber</span>
                            <span>R$ {restante}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedApp.status !== 'completed' && selectedApp.status !== 'pending' && (
                      <>
                        <Separator className="bg-border" />
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Controle e Lembretes
                          </h4>

                          {selectedApp.rescheduleLink && (
                            <div className="bg-muted p-3 rounded-md mb-4 flex items-center justify-between border border-border">
                              <div className="truncate pr-4">
                                <p className="text-xs font-bold text-foreground mb-1">
                                  Link de Reagendamento Ativo
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {selectedApp.rescheduleLink}
                                </p>
                              </div>
                              <Button size="icon" variant="ghost" className="shrink-0">
                                <Copy className="size-4" />
                              </Button>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemind(selectedApp, '48h')}
                              disabled={selectedApp.status === 'cancelled'}
                            >
                              <BellRing className="size-4 mr-2" /> Disparar Lembrete (T-48h)
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemind(selectedApp, '24h')}
                              disabled={selectedApp.status === 'cancelled'}
                            >
                              <ShieldAlert className="size-4 mr-2" /> Solicitar Confirmação (T-24h)
                            </Button>

                            {selectedApp.status === 'pending_confirmation' && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-full justify-start bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                onClick={() => handleConfirm(selectedApp)}
                              >
                                <CheckCircle2 className="size-4 mr-2" /> [Mock] Cliente Confirmou
                              </Button>
                            )}

                            {selectedApp.status !== 'cancelled' && (
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs"
                                  onClick={() => handleCancel(selectedApp, '<24h')}
                                >
                                  Cancelou {'<'} 24h
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleCancel(selectedApp, '>24h')}
                                >
                                  Reagendar {'>'} 24h
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )
            })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}
