import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Plus, X } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { Badge } from '@/components/ui/badge'

export function AgentTab() {
  const { currentStudioId, studios, updateStudio } = useAppStore()
  const studio = studios.find((s) => s.id === currentStudioId)
  const [newStyle, setNewStyle] = useState('')

  if (!studio) return null

  const handleAddStyle = () => {
    if (newStyle && !studio.tattooStyles?.includes(newStyle)) {
      updateStudio({ ...studio, tattooStyles: [...(studio.tattooStyles || []), newStyle] })
      setNewStyle('')
    }
  }

  const handleRemoveStyle = (style: string) => {
    updateStudio({ ...studio, tattooStyles: studio.tattooStyles?.filter((s) => s !== style) })
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
          <div className="space-y-2">
            <Label>Mensagem Inicial (Boas-vindas)</Label>
            <Textarea
              rows={4}
              value={studio.botFirstMessage || ''}
              onChange={(e) => updateStudio({ ...studio, botFirstMessage: e.target.value })}
              className="bg-background resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Esta é a primeira mensagem que o robô enviará ao novo contato.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <Label>Estilos de Tatuagem (Modelos Obrigatórios)</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Essas opções serão apresentadas ao cliente pelo bot para auxiliar no cálculo do
                orçamento.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                value={newStyle}
                onChange={(e) => setNewStyle(e.target.value)}
                placeholder="Ex: Aquarela"
                className="bg-background max-w-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStyle()}
              />
              <Button onClick={handleAddStyle} type="button" variant="secondary">
                <Plus className="size-4 mr-2" /> Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {studio.tattooStyles?.map((style) => (
                <Badge
                  key={style}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 flex items-center gap-1 bg-secondary/20"
                >
                  {style}
                  <button
                    onClick={() => handleRemoveStyle(style)}
                    className="p-0.5 rounded-full hover:bg-secondary/30 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {(!studio.tattooStyles || studio.tattooStyles.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Nenhum estilo configurado.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
