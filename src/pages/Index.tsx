import { Users, Calendar, Wallet, Activity, ArrowRight } from 'lucide-react'
import { MetricCard } from '@/components/MetricCard'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Index() {
  const { metrics, appointments } = useAppStore()
  const today = new Date().toISOString().split('T')[0]
  const upcoming = appointments
    .filter((a) => a.date >= today)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  text: 'Cliente Mariana Costa finalizou o questionário de saúde.',
                  type: 'health',
                },
                {
                  time: 'Há 12 min',
                  text: 'Novo sinal de R$ 150 recebido de Pedro Alves.',
                  type: 'payment',
                },
                {
                  time: 'Há 1 hora',
                  text: 'Nova conversa iniciada: "Orçamento Realismo Costas".',
                  type: 'lead',
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
                      <span className="text-xs font-medium px-2 py-1 rounded bg-secondary/10 text-secondary">
                        {app.status === 'confirmed' ? 'Confirmado' : 'Concluído'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma sessão próxima.
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
