import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, CheckCircle2 } from 'lucide-react'

export function LegalTab() {
  const terms = [
    {
      title: 'Procedimento',
      text: 'Compreendo que a tatuagem é um procedimento invasivo e permanente.',
    },
    {
      title: 'Saúde (LGPD)',
      text: 'Autorizo o tratamento dos meus dados de saúde exclusivamente para segurança do procedimento.',
    },
    { title: 'Direito de Imagem', text: 'Autorizo a publicação de fotos da obra para portfólio.' },
    { title: 'Cuidados', text: 'Comprometo-me a seguir as orientações de aftercare.' },
    {
      title: 'Sinal Financeiro',
      text: 'Compreendo que o valor garante a agenda e não é reembolsável em faltas sem aviso de 24h.',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-border/50 bg-card/50 shadow-elevation">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" /> Módulo Legal Obrigatório
          </CardTitle>
          <CardDescription>
            Estes termos são apresentados e exigidos obrigatoriamente pelo bot antes de permitir o
            pagamento do sinal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" /> Módulo Ativo para o Estúdio
            </p>
          </div>

          <div className="space-y-3">
            {terms.map((term, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-background p-3 rounded-md border border-border"
              >
                <span className="flex items-center justify-center shrink-0 size-6 rounded bg-muted text-xs font-bold text-muted-foreground mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-0.5">{term.title}</h4>
                  <p className="text-sm text-muted-foreground">{term.text}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
