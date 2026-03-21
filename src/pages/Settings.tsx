import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConnectionsTab } from '@/components/settings/ConnectionsTab'
import { AgentTab } from '@/components/settings/AgentTab'
import { LegalTab } from '@/components/settings/LegalTab'
import { Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="size-8 text-primary" /> Configurações do Estúdio
        </h2>
        <p className="text-muted-foreground mt-1">
          Gerencie integrações, IA e compliance do seu ambiente isolado (Tenant).
        </p>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border border-border/50">
          <TabsTrigger value="connections" className="data-[state=active]:bg-primary/10">
            Conexões Avançadas
          </TabsTrigger>
          <TabsTrigger value="agent" className="data-[state=active]:bg-primary/10">
            Agente Personalizado
          </TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-primary/10">
            Módulo Legal
          </TabsTrigger>
        </TabsList>
        <TabsContent value="connections">
          <ConnectionsTab />
        </TabsContent>
        <TabsContent value="agent">
          <AgentTab />
        </TabsContent>
        <TabsContent value="legal">
          <LegalTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
