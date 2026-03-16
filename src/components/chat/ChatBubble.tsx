import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  text: string
  isBot: boolean
  time?: string
}

export function ChatBubble({ text, isBot, time }: ChatBubbleProps) {
  return (
    <div className={cn('flex w-full mb-4', isBot ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'relative max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm',
          isBot
            ? 'bg-card text-foreground rounded-tl-none chat-tail-left'
            : 'bg-primary text-primary-foreground rounded-tr-none chat-tail-right',
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        {time && (
          <span
            className={cn(
              'text-[10px] mt-1 block text-right opacity-70',
              isBot ? 'text-muted-foreground' : 'text-primary-foreground/80',
            )}
          >
            {time}
          </span>
        )}
      </div>
    </div>
  )
}
