import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, CheckCircle2 } from 'lucide-react'

export function LegalTab() {
  const terms = [
    {
      title: 'Nature of Procedure',
      text: 'Compreendo que a tatuagem é um procedimento invasivo e permanente.',
    },
    {
      title: 'LGPD Data Treatment',
      text: 'Autorizo o tratamento dos meus dados de saúde (alergias e condições médicas) exclusivamente para fins de segurança do procedimento, conforme a Lei Geral de Proteção de Dados.',
    },
    {
      title: 'Image Use',
      text: 'Autorizo a captura e publicação de fotos da obra finalizada em redes sociais para fins de portfólio, preservando minha identidade sempre que possível.',
    },
    {
      title: 'Aftercare',
      text: 'Comprometo-me a seguir todas as orientações de aftercare (pós-tatuagem) fornecidas pelo profissional.',
    },
    {
      title: 'Signal Policy',
      text: 'Compreendo que o valor do sinal garante a reserva da agenda e não será reembolsado em caso de falta sem aviso prévio de 24h.',
    },
    {
      title: 'Final Declaration',
      text: 'Declaro que todas as informações fornecidas são verdadeiras e assumo total responsabilidade por elas.',
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
            O aceite do "TERMO DE CONSENTIMENTO INFORMADO, USO DE IMAGEM E TRATAMENTO DE DADOS" é
            exigido obrigatoriamente pelo bot antes do pagamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" /> Conformidade LGPD Ativa
            </p>
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              Auditoria ativada: IP e Timestamp serão gravados no registro de cada cliente.
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
