import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type Message = { id: string; text: string; isBot: boolean; time: string }

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [clientData, setClientData] = useState({ style: '', size: '', health: '' })
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addAppointment } = useAppStore()

  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const addMsg = (text: string, isBot: boolean) => {
    setMessages((prev) => [...prev, { id: Math.random().toString(), text, isBot, time: now() }])
  }

  useEffect(() => {
    // Initial Greeting
    if (step === 0 && messages.length === 0) {
      addMsg(
        'Olá! Bem-vindo ao atendimento automatizado do Studio Noir. Como posso te ajudar hoje?',
        true,
      )
    }
    // Auto-scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, step])

  const handleOption = (text: string, nextStep: number) => {
    addMsg(text, false)
    setIsTyping(true)
    setStep(-1) // Disable buttons temporarily

    setTimeout(() => {
      setIsTyping(false)
      setStep(nextStep)

      switch (nextStep) {
        case 1:
          addMsg(
            'Perfeito! Para começarmos o orçamento, qual é o estilo da tatuagem e o tamanho aproximado em cm? (Ex: Realismo, 15cm)',
            true,
          )
          break
        case 2:
          setClientData((prev) => ({ ...prev, style: text }))
          addMsg(
            'Legal! Anotei o estilo. Antes de prosseguir, é obrigatório passarmos por uma rápida checagem de saúde.\n\nVocê possui alguma alergia (ex: látex, agulha, pigmento) ou faz uso de medicação contínua?',
            true,
          )
          break
        case 3: {
          setClientData((prev) => ({ ...prev, health: text }))
          const hasAlert = text.toLowerCase().includes('sim')
          addMsg(
            hasAlert
              ? 'Anotado. AVISO DE SAÚDE REGISTRADO para o artista. Para esse projeto, o valor base será R$ 800. Para confirmar o agendamento, pedimos um SINAL de R$ 200 via PIX. Deseja prosseguir?'
              : 'Tudo certo! Para esse projeto, o valor base será R$ 800. Para confirmar o agendamento, pedimos um SINAL de R$ 200 via PIX. Deseja prosseguir?',
            true,
          )
          break
        }
        case 4:
          addMsg(
            'Sinal confirmado! 🎉 Seu agendamento foi pré-confirmado na agenda do artista. Em breve ele entrará em contato para definir a data e horário exatos. Obrigado!',
            true,
          )
          toast({
            title: 'Agendamento Criado',
            description: 'O bot registrou um novo agendamento com sinal pago.',
          })
          addAppointment({
            id: `a-${Date.now()}`,
            clientId: 'c2',
            date: new Date().toISOString().split('T')[0],
            time: 'A definir',
            duration: 3,
            description: `Nova Tatto: ${clientData.style || 'A definir'}`,
            totalValue: 800,
            depositPaid: 200,
            status: 'pending',
          })
          break
      }
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      {/* Chat Area */}
      <Card className="lg:col-span-2 flex flex-col border-border/50 bg-background overflow-hidden relative">
        <div className="h-16 border-b border-border bg-card/50 flex items-center px-4 gap-3 shrink-0">
          <Avatar>
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=8" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Novo Cliente (Automação)</h3>
            <p className="text-xs text-secondary flex items-center gap-1">
              <span className="size-2 rounded-full bg-secondary animate-pulse" /> Bot Ativo
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-2xl mx-auto flex flex-col justify-end min-h-full">
            {messages.map((m) => (
              <ChatBubble key={m.id} text={m.text} isBot={m.isBot} time={m.time} />
            ))}
            {isTyping && (
              <div className="flex w-full mb-4 justify-start">
                <div className="bg-card px-4 py-3 rounded-2xl rounded-tl-none chat-tail-left flex gap-1 items-center">
                  <span
                    className="size-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="size-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="size-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons mimicking user input */}
        <div className="p-4 border-t border-border bg-card/30 shrink-0">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Simular Resposta do Cliente:
          </p>
          <div className="flex flex-wrap gap-2">
            {step === 0 && (
              <Button onClick={() => handleOption('Quero fazer um orçamento', 1)}>
                Fazer Orçamento
              </Button>
            )}
            {step === 1 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleOption('Realismo, uns 15cm no braço', 2)}
                >
                  Realismo, 15cm
                </Button>
                <Button variant="outline" onClick={() => handleOption('Blackwork pequeno, 5cm', 2)}>
                  Blackwork, 5cm
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button variant="outline" onClick={() => handleOption('Não, tudo 100%!', 3)}>
                  Não, tudo certo
                </Button>
                <Button
                  variant="destructive"
                  className="bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30"
                  onClick={() => handleOption('Sim, tenho alergia a látex', 3)}
                >
                  Sim, alergia a látex
                </Button>
              </>
            )}
            {step === 3 && (
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={() => handleOption('Sim, vou mandar o pix agora', 4)}
              >
                Pagar Sinal (PIX)
              </Button>
            )}
            {step === 4 && (
              <p className="text-sm text-secondary font-medium flex items-center gap-2">
                <CheckCircle2 className="size-4" /> Fluxo Concluído
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Client Details Sidebar */}
      <Card className="border-border/50 bg-card/50 p-6 hidden lg:flex flex-col gap-6">
        <h3 className="font-semibold border-b border-border pb-2">Resumo da Ficha</h3>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status do Funil</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min((step / 4) * 100, 100)}%` }}
                />
              </div>
              {Math.min(step, 4)}/4
            </div>
          </div>

          <div className="bg-background rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Ideia / Estilo</p>
            <p className="text-sm font-medium">{clientData.style || 'Aguardando...'}</p>
          </div>

          <div
            className={cn(
              'rounded-lg p-3 border transition-colors',
              clientData.health.toLowerCase().includes('sim')
                ? 'bg-destructive/10 border-destructive/50 animate-shake'
                : 'bg-background border-border',
            )}
          >
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <AlertCircle className="size-3" /> Questionário de Saúde
            </p>
            <p
              className={cn(
                'text-sm font-medium',
                clientData.health.toLowerCase().includes('sim') && 'text-destructive',
              )}
            >
              {clientData.health || 'Aguardando...'}
            </p>
            {clientData.health.toLowerCase().includes('sim') && (
              <p className="text-xs text-destructive mt-2 flex items-start gap-1 font-bold">
                <ShieldAlert className="size-4 shrink-0" /> ATENÇÃO REQUERIDA PELO ARTISTA
              </p>
            )}
          </div>

          {step >= 3 && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3">
              <p className="text-xs text-secondary mb-1 font-medium">Orçamento Gerado</p>
              <div className="flex justify-between text-sm mt-2">
                <span>Valor Total:</span> <span>R$ 800</span>
              </div>
              <div className="flex justify-between text-sm text-secondary font-bold mt-1">
                <span>Sinal Pendente:</span> <span>R$ 200</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
