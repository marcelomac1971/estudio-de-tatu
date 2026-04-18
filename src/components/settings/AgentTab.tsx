import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Bot, Settings2 } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { TattooStyleConfig } from '@/stores/useAppStore'

const COMMON_STYLES = [
  'Realismo',
  'Fineline',
  'Blackwork',
  'Old School / Tradicional',
  'Oriental',
  'Tribal',
  'Geométrico',
  'Sketch',
  'Minimalista',
  'Aquarela',
]

export function AgentTab() {
  const { currentStudioId, studios, updateStudio } = useAppStore()
  const studio = studios.find((s) => s.id === currentStudioId)

  if (!studio) return null

  const configs = studio.tattooStyleConfigs || []

  const mergedConfigs = COMMON_STYLES.map((name) => {
    const existing = configs.find((c) => c.name === name)
    return (
      existing || {
        name,
        enabled: false,
        basePrice: 0,
        referenceSize: 0,
        referenceLocation: '',
        sizeSurcharge: 0,
        complexLocations: [],
        locationSurcharge: 0,
      }
    )
  })

  const handleUpdateConfig = (name: string, updates: Partial<TattooStyleConfig>) => {
    const updated = mergedConfigs.map((c) => (c.name === name ? { ...c, ...updates } : c))
    updateStudio({ ...studio, tattooStyleConfigs: updated })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-border/50 bg-card/50 shadow-elevation">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="size-5 text-primary" /> Personalização da IA
          </CardTitle>
          <CardDescription>
            Ajuste o comportamento do agente inteligente para o seu estúdio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Mensagem Inicial (Boas-vindas)</Label>
              <Textarea
                rows={3}
                value={studio.botFirstMessage || ''}
                onChange={(e) => updateStudio({ ...studio, botFirstMessage: e.target.value })}
                className="bg-background resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Mensagem de Recuperação (24h)</Label>
              <Textarea
                rows={3}
                value={studio.recoveryMessage || ''}
                onChange={(e) => updateStudio({ ...studio, recoveryMessage: e.target.value })}
                className="bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Enviada automaticamente 24h após o abandono do fluxo.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Percentual de Sinal (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={studio.depositPercentage || 0}
                onChange={(e) =>
                  updateStudio({ ...studio, depositPercentage: Number(e.target.value) })
                }
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Porcentagem do valor total cobrada antecipadamente.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Margem de Busca de Disponibilidade (Dias)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={studio.availabilitySearchMargin || 3}
                onChange={(e) =>
                  updateStudio({ ...studio, availabilitySearchMargin: Number(e.target.value) })
                }
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Dias para buscar alternativas caso a data solicitada esteja ocupada.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4" />
              <Label className="text-base">Estilos de Tatuagem (Precificação Dinâmica)</Label>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {mergedConfigs.map((cfg) => (
                <AccordionItem key={cfg.name} value={cfg.name} className="border-border">
                  <div className="flex items-center justify-between py-4 w-full">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={cfg.enabled}
                        onCheckedChange={(checked) =>
                          handleUpdateConfig(cfg.name, { enabled: checked })
                        }
                      />
                      <span className={cfg.enabled ? 'font-medium' : 'text-muted-foreground'}>
                        {cfg.name}
                      </span>
                    </div>
                    {cfg.enabled && <AccordionTrigger className="py-0 hover:no-underline" />}
                  </div>
                  {cfg.enabled && (
                    <AccordionContent className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preço Base (R$)</Label>
                          <Input
                            type="number"
                            value={cfg.basePrice}
                            onChange={(e) =>
                              handleUpdateConfig(cfg.name, { basePrice: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tamanho Ref. (cm)</Label>
                          <Input
                            type="number"
                            value={cfg.referenceSize}
                            onChange={(e) =>
                              handleUpdateConfig(cfg.name, {
                                referenceSize: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Local Ref.</Label>
                          <Input
                            placeholder="Ex: Antebraço"
                            value={cfg.referenceLocation}
                            onChange={(e) =>
                              handleUpdateConfig(cfg.name, { referenceLocation: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Acréscimo por cm (R$)</Label>
                          <Input
                            type="number"
                            value={cfg.sizeSurcharge}
                            onChange={(e) =>
                              handleUpdateConfig(cfg.name, {
                                sizeSurcharge: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Locais Complexos (Separados por vírgula)</Label>
                          <Input
                            placeholder="Ex: Costela, Pescoço"
                            value={cfg.complexLocations.join(', ')}
                            onChange={(e) =>
                              handleUpdateConfig(cfg.name, {
                                complexLocations: e.target.value.split(',').map((s) => s.trim()),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Acréscimo Locais Complexos (R$)</Label>
                          <Input
                            type="number"
                            value={cfg.locationSurcharge}
                            onChange={(e) =>
                              handleUpdateConfig(cfg.name, {
                                locationSurcharge: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
