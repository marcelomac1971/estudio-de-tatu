import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
  YAxis,
} from 'recharts'
import useAppStore from '@/stores/useAppStore'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  MessageCircle,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock Data for the charts
const convData = [
  { step: 'Total Leads', users: 150 },
  { step: 'Screening', users: 120 },
  { step: 'Terms Accepted', users: 85 },
  { step: 'Payment Confirmed', users: 65 },
]

const finData = [
  { month: 'Jan', sinais: 1200 },
  { month: 'Fev', sinais: 1800 },
  { month: 'Mar', sinais: 2200 },
  { month: 'Abr', sinais: 2100 },
  { month: 'Mai', sinais: 3000 },
  { month: 'Jun', sinais: 3800 },
]

const noShowData = [
  { name: 'Concluídos', value: 85, color: 'hsl(var(--secondary))' },
  { name: 'No-Show / Cancelado', value: 15, color: 'hsl(var(--destructive))' },
]

const styleData = [
  { name: 'Realismo', value: 40, color: 'hsl(var(--chart-1))' },
  { name: 'Fineline', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Blackwork', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Old School', value: 10, color: 'hsl(var(--chart-4))' },
]

const convConfig = {
  users: { label: 'Usuários', color: 'hsl(var(--primary))' },
}

const finConfig = {
  sinais: { label: 'Sinais Recebidos (R$)', color: 'hsl(var(--secondary))' },
}

const noShowConfig = {
  value: { label: 'Agendamentos' },
}

const styleConfig = {
  value: { label: 'Trabalhos' },
}

export default function Reports() {
  const { currentStudioId, studios } = useAppStore()
  const currentStudio = studios.find((s) => s.id === currentStudioId)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="size-6 text-primary" /> Painel de Relatórios
          </h2>
          <p className="text-muted-foreground text-sm">
            Métricas avançadas e conversão do {currentStudio?.name}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" /> Exportar PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="py-4 border-b border-border/30">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
              <MessageCircle className="size-4 text-primary" /> Recuperação de Leads (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mensagens automáticas enviadas hoje para leads que abandonaram o checkout.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="py-4 border-b border-border/30">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
              <Bell className="size-4 text-secondary" /> Lembretes de Agendamento (T-24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mensagens de confirmação enviadas para clientes com agendamento para amanhã.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="size-4" /> Funil de Conversão (Bot)
            </CardTitle>
            <CardDescription>
              Comparativo entre triagens iniciadas e agendamentos finalizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={convConfig} className="h-[300px] w-full">
              <BarChart
                data={convData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 60, bottom: 0 }}
              >
                <CartesianGrid
                  horizontal={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis
                  dataKey="step"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-users)" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-secondary">
              <TrendingUp className="size-4" /> Receita de Sinais (Mercado Pago)
            </CardTitle>
            <CardDescription>
              Volume financeiro retido como sinal no momento do checkout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={finConfig} className="h-[300px] w-full">
              <LineChart data={finData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
                  dataKey="sinais"
                  stroke="var(--color-sinais)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-sinais)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <DollarSign className="size-4" /> Retenção e Faltas (No-Show)
            </CardTitle>
            <CardDescription>Percentual de cancelamentos em {'<'} 24h.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={noShowConfig} className="h-[250px] w-full max-w-sm">
              <PieChart>
                <Pie
                  data={noShowData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {noShowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <BarChart3 className="size-4" /> Style Analysis
            </CardTitle>
            <CardDescription>Distribuição de estilos mais solicitados.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={styleConfig} className="h-[250px] w-full max-w-sm">
              <PieChart>
                <Pie
                  data={styleData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {styleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
