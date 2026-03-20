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
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

// Mock Data for the charts
const convData = [
  { month: 'Jan', triagens: 45, agendamentos: 28 },
  { month: 'Fev', triagens: 52, agendamentos: 35 },
  { month: 'Mar', triagens: 61, agendamentos: 42 },
  { month: 'Abr', triagens: 58, agendamentos: 39 },
  { month: 'Mai', triagens: 70, agendamentos: 51 },
  { month: 'Jun', triagens: 85, agendamentos: 68 },
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

const convConfig = {
  triagens: { label: 'Triagens Iniciadas', color: 'hsl(var(--muted-foreground))' },
  agendamentos: { label: 'Agendamentos Concluídos', color: 'hsl(var(--primary))' },
}

const finConfig = {
  sinais: { label: 'Sinais Recebidos (R$)', color: 'hsl(var(--secondary))' },
}

const noShowConfig = {
  value: { label: 'Agendamentos' },
}

export default function Reports() {
  const { currentStudioId, studios } = useAppStore()
  const currentStudio = studios.find((s) => s.id === currentStudioId)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="size-6 text-primary" /> Painel de Relatórios
        </h2>
        <p className="text-muted-foreground text-sm">
          Métricas avançadas e conversão do {currentStudio?.name}.
        </p>
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
              <BarChart data={convData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="triagens" fill="var(--color-triagens)" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="agendamentos"
                  fill="var(--color-agendamentos)"
                  radius={[4, 4, 0, 0]}
                />
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

        <Card className="border-border/50 bg-card/50 lg:col-span-2 max-w-3xl mx-auto w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-base flex items-center justify-center gap-2">
              <DollarSign className="size-4" /> Retenção e Faltas (No-Show)
            </CardTitle>
            <CardDescription>
              Percentual de clientes que cancelaram com menos de 24h ou não compareceram.
            </CardDescription>
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
      </div>
    </div>
  )
}
