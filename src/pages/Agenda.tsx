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
import { CheckCircle2, Clock, MapPin, AlertTriangle } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const { appointments, clients } = useAppStore()

  const selectedDateStr = date ? date.toISOString().split('T')[0] : ''
  const dayApps = appointments
    .filter((a) => a.date === selectedDateStr)
    .sort((a, b) => a.time.localeCompare(b.time))

  // Generate hourly slots from 10:00 to 20:00
  const hours = Array.from({ length: 11 }, (_, i) => `${i + 10}:00`)

  const handleSlotClick = (app: any) => {
    if (app) setSelectedApp(app)
  }

  const getClientInfo = (id: string) => clients.find((c) => c.id === id)

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
                            : 'bg-card border-border',
                          client.healthAlerts.length > 0 && 'border-l-4 border-l-destructive',
                        )}
                        style={{ height: `calc(${app.duration * 80}px - 16px)`, zIndex: 10 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm">{client.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {app.description}
                            </p>
                          </div>
                          {app.depositPaid > 0 && (
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
                      <SheetTitle className="text-xl">Detalhes da Sessão</SheetTitle>
                      <SheetDescription>
                        {format(date!, "d 'de' MMMM", { locale: ptBR })} às {selectedApp.time}
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

                    <div>
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
                    </div>

                    <Separator className="bg-border" />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Projeto</h4>
                      <p className="text-sm bg-muted p-3 rounded-md">{selectedApp.description}</p>
                      <div className="flex items-center gap-2 text-sm mt-3 text-muted-foreground">
                        <Clock className="size-4" /> Duração estimada: {selectedApp.duration} horas
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                        Financeiro
                      </h4>
                      <div className="space-y-2 bg-card rounded-lg p-4 border border-border">
                        <div className="flex justify-between text-sm">
                          <span>Valor Total Acordado</span>
                          <span className="font-medium">R$ {selectedApp.totalValue}</span>
                        </div>
                        <div className="flex justify-between text-sm text-secondary">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Sinal Recebido (Bot)
                          </span>
                          <span className="font-bold">- R$ {selectedApp.depositPaid}</span>
                        </div>
                        <Separator className="my-2 bg-border/50" />
                        <div className="flex justify-between text-base font-bold text-primary">
                          <span>Restante a Receber</span>
                          <span>R$ {restante}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}
