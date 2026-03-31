import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'

export function ChatBubble({
  text,
  isBot,
  time,
  type = 'text',
}: {
  text: string
  isBot: boolean
  time: string
  type?: 'text' | 'terms' | 'system'
}) {
  const parts = text.split(/(\[CHECKOUT_LINK:[^\]]+\])/)

  if (type === 'system') {
    return (
      <div className="flex w-full mb-4 justify-center animate-fade-in-up">
        <span className="bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-full border border-destructive/20 text-center flex items-center gap-2 max-w-[90%]">
          {text}
        </span>
      </div>
    )
  }

  if (type === 'terms') {
    const terms = [
      {
        title: 'Procedimento',
        text: 'Compreendo que a tatuagem é um procedimento invasivo e permanente.',
      },
      {
        title: 'Saúde (LGPD)',
        text: 'Autorizo o tratamento dos meus dados de saúde exclusivamente para segurança do procedimento.',
      },
      {
        title: 'Direito de Imagem',
        text: 'Autorizo a publicação de fotos da obra para portfólio.',
      },
      { title: 'Cuidados', text: 'Comprometo-me a seguir as orientações de aftercare.' },
      {
        title: 'Sinal Financeiro',
        text: 'Compreendo que o valor garante a agenda e não é reembolsável em faltas sem aviso de 24h.',
      },
    ]

    return (
      <div className="flex w-full mb-4 justify-start animate-fade-in-up">
        <Card className="border-border/50 bg-card shadow-sm max-w-[90%] md:max-w-[80%] rounded-2xl rounded-tl-none">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm flex items-center gap-2 text-primary">
              <ShieldAlert className="size-4" /> Módulo Legal Obrigatório
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground mb-2">
              Para avançarmos com a reserva, você precisa concordar com os seguintes termos do
              estúdio:
            </p>
            <div className="space-y-2.5">
              {terms.map((term, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-start bg-background/50 p-2.5 rounded-lg border border-border/50"
                >
                  <span className="flex items-center justify-center shrink-0 size-4 rounded bg-muted text-[10px] font-bold text-muted-foreground mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-foreground mb-0.5">{term.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-tight">{term.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[10px] mt-2 block font-medium text-muted-foreground">{time}</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={cn('flex w-full mb-4 animate-fade-in-up', isBot ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'px-4 py-3 rounded-2xl max-w-[80%]',
          isBot
            ? 'bg-card text-foreground rounded-tl-none border border-border shadow-sm'
            : 'bg-primary text-primary-foreground rounded-tr-none shadow-sm',
        )}
      >
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('[CHECKOUT_LINK:')) {
              const id = part.replace('[CHECKOUT_LINK:', '').replace(']', '')
              return (
                <Link
                  key={i}
                  to={`/checkout/${id}`}
                  className="mt-3 flex items-center justify-center gap-2 bg-[#009EE3] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#0080B7] transition-colors w-full shadow-md"
                >
                  💳 Pagar Sinal (Mercado Pago)
                </Link>
              )
            }
            return <span key={i}>{part}</span>
          })}
        </div>
        <span
          className={cn(
            'text-[10px] mt-1.5 block font-medium',
            isBot ? 'text-muted-foreground' : 'text-primary-foreground/70',
          )}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
