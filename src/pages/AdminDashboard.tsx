import { Users, DollarSign, Activity, Settings, ShieldCheck } from 'lucide-react'
import { MetricCard } from '@/components/MetricCard'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AdminDashboard() {
  const { adminMetrics, adminConfig, setAdminConfig } = useAppStore()
  const { toast } = useToast()

  const handleSaveConfig = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'Chaves do Supabase atualizadas com sucesso.',
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="size-8 text-primary" /> Super Admin Dashboard
        </h2>
        <p className="text-muted-foreground mt-2">
          Visão global da plataforma e configuração de serviços essenciais (Login Supremo).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total de Leads (Global)"
          value={adminMetrics.globalLeads}
          icon={Users}
          trend="+12% este mês"
          trendUp={true}
        />
        <MetricCard
          title="Taxa de Conversão Global"
          value={`${Math.round((adminMetrics.totalConversions / adminMetrics.globalLeads) * 100)}%`}
          icon={Activity}
          trend="+2.5% este mês"
          trendUp={true}
        />
        <MetricCard
          title="MRR (Plataforma)"
          value={`R$ ${adminMetrics.mrr.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          trend="+R$ 299 hoje"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/50 shadow-elevation">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="size-5" /> Configurações Globais (Supabase)
            </CardTitle>
            <CardDescription>Gerencie a conexão master do banco de dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Supabase URL</Label>
              <Input
                value={adminConfig.supabaseUrl}
                onChange={(e) => setAdminConfig({ ...adminConfig, supabaseUrl: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Supabase Service Role Key (Master Key)</Label>
              <Input
                type="password"
                value={adminConfig.supabaseKey}
                onChange={(e) => setAdminConfig({ ...adminConfig, supabaseKey: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={handleSaveConfig} className="w-full mt-2">
              Salvar Chaves
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 shadow-elevation flex items-center justify-center p-8">
          <div className="text-center space-y-4 w-full">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Activity className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Saúde do Sistema</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Temos <strong>{adminMetrics.totalStudios} estúdios ativos</strong> operando
                normalmente na plataforma.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Volume Sinais Processados</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ {adminMetrics.globalDeposits.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Instâncias Z-API Ativas</p>
                  <p className="text-lg font-bold text-foreground">
                    {(adminMetrics.totalStudios * 0.9).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
