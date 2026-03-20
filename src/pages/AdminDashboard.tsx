import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/MetricCard'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const mrrConfig = {
  mrr: { label: 'MRR (R$)', color: 'hsl(var(--primary))' },
}

export default function AdminDashboard() {
  const { adminMetrics, studios } = useAppStore()

  const mrrData = [
    { month: 'Jan', mrr: 1200 },
    { month: 'Fev', mrr: 1500 },
    { month: 'Mar', mrr: 1800 },
    { month: 'Abr', mrr: 2100 },
    { month: 'Mai', mrr: 2400 },
    { month: 'Jun', mrr: adminMetrics.mrr },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral (SaaS)</h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Acompanhe o crescimento da plataforma Modern Noir e a saúde dos estúdios parceiros.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Estúdios Ativos"
          value={adminMetrics.totalStudios}
          icon={Users}
          trend="+2 este mês"
          trendUp={true}
        />
        <MetricCard
          title="MRR (Receita Recorrente)"
          value={`R$ ${adminMetrics.mrr.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          trend="+15% este mês"
          trendUp={true}
        />
        <MetricCard
          title="Conversões Totais"
          value={adminMetrics.totalConversions}
          icon={Activity}
          trend="+42 esta semana"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/50 shadow-elevation">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" /> Crescimento de MRR
            </CardTitle>
            <CardDescription>Evolução da receita recorrente da plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={mrrConfig} className="h-[300px] w-full">
              <LineChart data={mrrData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="var(--color-mrr)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-mrr)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 shadow-elevation">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Estúdios</CardTitle>
            <CardDescription>Status atual de todos os tenants cadastrados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {studios.map((studio) => (
                <div
                  key={studio.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
                >
                  <div>
                    <p className="font-semibold text-foreground">{studio.name}</p>
                    <p className="text-xs text-muted-foreground">{studio.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">R$ {studio.mrr || 0}/mês</p>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                        studio.status === 'active'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {studio.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
