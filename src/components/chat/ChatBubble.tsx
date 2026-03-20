import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  text: string
  isBot: boolean
  time: string
}

export function ChatBubble({ text, isBot, time }: ChatBubbleProps) {
  return (
    <div
      className={cn('flex w-full mb-4', isBot ? 'justify-start' : 'justify-end animate-fade-in-up')}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl relative group',
          isBot
            ? 'bg-card border border-border text-card-foreground rounded-tl-none chat-tail-left'
            : 'bg-primary text-primary-foreground rounded-tr-none chat-tail-right',
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
        <span
          className={cn(
            'text-[10px] absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
            isBot ? 'left-1 text-muted-foreground' : 'right-1 text-muted-foreground',
          )}
        >
          {time} {isBot ? '• Bot Automático' : '• Cliente'}
        </span>
      </div>
    </div>
  )
}
