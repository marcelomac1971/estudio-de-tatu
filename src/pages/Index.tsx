import { Users, Calendar, Wallet, Activity, ArrowRight, Ban, AlertCircle } from 'lucide-react'
import { MetricCard } from '@/components/MetricCard'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Index() {
  const { metrics, activeAppointments } = useAppStore()
  const today = new Date().toISOString().split('T')[0]
  const upcoming = activeAppointments
    .filter((a) => a.date >= today && a.status !== 'cancelled')
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4)

  const pendingConfirmations = activeAppointments.filter((a) => a.status === 'pending_confirmation')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {pendingConfirmations.length > 0 && (
        <Alert className="bg-orange-500/10 border-orange-500/20 text-orange-600 animate-fade-in">
          <AlertCircle className="h-4 w-4 stroke-orange-600" />
          <AlertTitle className="font-bold">Atenção Requerida (Automação de Agenda)</AlertTitle>
          <AlertDescription className="mt-1">
            Existem <strong>{pendingConfirmations.length} agendamentos</strong> aguardando
            confirmação do cliente (Lembrete T-24h disparado). Se não houver resposta, o horário
            poderá ficar disponível na agenda.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Novos Leads"
          value={metrics.leads}
          icon={Users}
          trend="+12% essa semana"
          trendUp={true}
        />
        <MetricCard title="Agendamentos Hoje" value={metrics.todayAppointments} icon={Calendar} />
        <MetricCard
          title="Total em Sinais"
          value={`R$ ${metrics.totalDeposits}`}
          icon={Wallet}
          trend="+R$ 450 hoje"
          trendUp={true}
        />
        <MetricCard
          title="Conversas Ativas"
          value={metrics.activeChats}
          icon={Activity}
          className="border-primary/20 relative"
        />
        <MetricCard
          title="Retenções (Sinais)"
          value={`R$ ${metrics.retainedDeposits}`}
          icon={Ban}
          className="border-destructive/20 relative bg-destructive/5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Atividade Recente (Bot)</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/conversas" className="flex items-center gap-1 text-primary">
                Ver Conversas <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  time: 'Há 5 min',
                  text: 'Cliente assinou o termo LGPD digitalmente e pagou o sinal via Mercado Pago.',
                  type: 'reminder',
                },
                {
                  time: 'Há 12 min',
                  text: 'Novo agendamento gerado automaticamente para Mariana Costa.',
                  type: 'legal',
                },
                {
                  time: 'Há 1 hora',
                  text: 'Cancelamento < 24h detectado. Compensação de Agenda aplicada ao sinal (R$ 50).',
                  type: 'finance',
                },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 size-2 rounded-full bg-primary shrink-0 relative">
                    {i === 0 && (
                      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Próximas Sessões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcoming.length > 0 ? (
                upcoming.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <div>
                      <p className="text-sm font-semibold">{app.time}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {app.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-medium px-2 py-1 rounded ${
                          app.status === 'confirmed'
                            ? 'bg-secondary/10 text-secondary'
                            : app.status === 'pending_confirmation'
                              ? 'bg-orange-500/10 text-orange-600'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {app.status === 'confirmed'
                          ? 'Confirmado'
                          : app.status === 'pending_confirmation'
                            ? 'Aguardando (24h)'
                            : 'Concluído'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma sessão próxima no estúdio atual.
                </p>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/agenda">Abrir Agenda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
