import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function ChatBubble({ text, isBot, time }: { text: string; isBot: boolean; time: string }) {
  const parts = text.split(/(\[CHECKOUT_LINK:[^\]]+\])/)
  return (
    <div className={cn('flex w-full mb-4', isBot ? 'justify-start' : 'justify-end')}>
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
