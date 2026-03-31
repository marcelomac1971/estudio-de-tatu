import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AlertCircle, FileCheck, BrainCircuit, MessageSquareText, TimerOff } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

type Message = {
  id: string
  text: string
  isBot: boolean
  time: string
  type?: 'text' | 'terms' | 'system'
}

type ClientData = {
  style: string
  size: string
  location: string
  priceEstimate: number
  health: string
  legalAccepted: boolean
}

export function ChatArea({
  step,
  setStep,
  clientData,
  setClientData,
}: {
  step: number
  setStep: (s: number) => void
  clientData: ClientData
  setClientData: (d: any) => void
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isAiActive, setIsAiActive] = useState(true)
  const [humanText, setHumanText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { currentStudioId, studios, addAppointment } = useAppStore()
  const studio = studios.find((s) => s.id === currentStudioId)

  const addMsg = (text: string, isBot: boolean, type: 'text' | 'terms' | 'system' = 'text') =>
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        text,
        isBot,
        type,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ])

  useEffect(() => {
    if (step === 0 && messages.length === 0 && studio?.botFirstMessage) {
      addMsg(studio.botFirstMessage, true)
    }
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, step, studio])

  // Session Expiration Logic: 1 hour (3600000ms) cancellation if inactive on legal step
  useEffect(() => {
    if (step === 3 && isAiActive) {
      timeoutRef.current = setTimeout(() => {
        setIsAiActive(false)
        setStep(6) // 6 represents 'Canceled' state
        addMsg(
          'Sessão expirada: O cliente não interagiu dentro de 1 hora. Atendimento cancelado automaticamente para desocupar a fila.',
          false,
          'system',
        )
      }, 3600000)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [step, isAiActive, setStep])

  const handleOption = (text: string, nextStep: number) => {
    if (!isAiActive && nextStep !== 6) return
    addMsg(text, false)
    setIsTyping(true)
    setStep(-1)

    setTimeout(() => {
      setIsTyping(false)
      setStep(nextStep)

      if (nextStep === 1) {
        addMsg('Perfeito! Qual estilo de tatuagem você busca?', true)
      } else if (nextStep === 2) {
        setClientData((p: any) => ({
          ...p,
          style: text,
          size: '15cm',
          location: 'Antebraço',
          priceEstimate: 800,
        }))
        addMsg(
          `Entendi! Baseado no estilo ${text} (aprox 15cm no antebraço), o valor estimado é R$ 800.\n\nPor favor, envie sua imagem de referência.`,
          true,
        )
      } else if (nextStep === 3) {
        addMsg('Imagem recebida 📸.', true)
        setTimeout(() => {
          addMsg('', true, 'terms')
        }, 600)
      } else if (nextStep === 4) {
        setClientData((p: any) => ({ ...p, legalAccepted: true }))

        // Simulating IP and timestamp capture for legal compliance
        const ipMock = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        const ts = new Date().toISOString()

        addMsg(
          `Termos aceitos digitalmente! ✔️\n(Registro: IP ${ipMock} - ${ts})\n\nPara oficializar e reservar seu horário na agenda, exigimos um SINAL de R$ 200.`,
          true,
        )

        const newAppId = `app-${Date.now()}`
        addAppointment({
          id: newAppId,
          studioId: studio!.id,
          clientId: 'c2',
          date: '2024-12-01',
          time: 'A definir',
          duration: 3,
          description: `Tattoo ${clientData.style || text}`,
          totalValue: 800,
          depositPaid: 200,
          status: 'pending',
          paymentStatus: 'pending',
        })
        setTimeout(
          () =>
            addMsg(
              `Acesse o checkout seguro do Mercado Pago para realizar o pagamento do sinal e bloquear a agenda:\n\n[CHECKOUT_LINK:${newAppId}]`,
              true,
            ),
          1500,
        )
        setStep(5)
      }
    }, 1000)
  }

  const handleHumanSend = () => {
    if (humanText.trim()) {
      addMsg(humanText, true)
      setHumanText('')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden rounded-xl border border-border shadow-elevation">
      <div className="h-16 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=15" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Mariana Costa</h3>
            <p className="text-xs text-muted-foreground">
              {step === 6 ? 'Sessão Cancelada (Inatividade)' : 'Triagem em andamento'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
          {step === 6 ? (
            <TimerOff className="size-4 text-destructive" />
          ) : (
            <BrainCircuit
              className={`size-4 ${isAiActive ? 'text-primary' : 'text-muted-foreground'}`}
            />
          )}
          <div className="flex items-center gap-2">
            <Switch
              checked={isAiActive}
              onCheckedChange={setIsAiActive}
              disabled={step === 6}
              className="data-[state=checked]:bg-primary"
            />
            <Label className="text-xs font-bold cursor-pointer">
              {step === 6 ? 'IA Parada' : isAiActive ? 'IA Ligada' : 'IA Desligada'}
            </Label>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-2xl mx-auto flex flex-col justify-end min-h-full pb-4">
          {!isAiActive && step !== 6 && (
            <div className="flex justify-center mb-6">
              <span className="bg-destructive/10 text-destructive text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-destructive/20">
                <AlertCircle className="size-3" /> Intervenção Humana Ativa (IA Pausada)
              </span>
            </div>
          )}
          {messages.map((m) => (
            <ChatBubble key={m.id} text={m.text} isBot={m.isBot} time={m.time} type={m.type} />
          ))}
          {isTyping && (
            <div className="flex w-full mb-4 justify-start">
              <div className="bg-card px-4 py-3 rounded-2xl rounded-tl-none border border-border flex gap-1 items-center">
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

      <div className="p-4 border-t border-border bg-card/50 shrink-0">
        {step === 6 ? (
          <div className="text-center py-3 text-sm text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-lg">
            Esta sessão foi cancelada automaticamente devido à inatividade.
          </div>
        ) : isAiActive ? (
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
              <MessageSquareText className="size-3" /> Simular Resposta do Cliente:
            </p>
            <div className="flex flex-wrap gap-2">
              {step === 0 && (
                <Button onClick={() => handleOption('Quero fazer um orçamento', 1)}>
                  Iniciar Orçamento
                </Button>
              )}
              {step === 1 &&
                studio?.tattooStyles?.map((s) => (
                  <Button key={s} variant="outline" onClick={() => handleOption(s, 2)}>
                    {s}
                  </Button>
                ))}
              {step === 2 && (
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={() => handleOption('[Anexa Imagem]', 3)}
                >
                  Anexar Referência
                </Button>
              )}
              {step === 3 && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg animate-fade-in-up"
                  onClick={() => handleOption('Li e aceito os 5 termos.', 4)}
                >
                  <FileCheck className="size-4 mr-2" /> Confirmar Termos
                </Button>
              )}
              {step >= 5 && (
                <p className="text-sm font-medium text-secondary">
                  Aguardando pagamento no Checkout Mercado Pago...
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Digite como humano (O bot está pausado)..."
              value={humanText}
              onChange={(e) => setHumanText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleHumanSend()}
            />
            <Button onClick={handleHumanSend}>Enviar</Button>
          </div>
        )}
      </div>
    </div>
  )
}
