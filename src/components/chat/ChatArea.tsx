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
  depositAmount: number
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

  useEffect(() => {
    if (step === 5 && isAiActive) {
      timeoutRef.current = setTimeout(() => {
        setIsAiActive(false)
        setStep(7)
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

  const calculatePrice = (styleName: string, sizeCm: number, loc: string) => {
    const cfg = studio?.tattooStyleConfigs?.find((c) => c.name === styleName)
    const pct = studio?.depositPercentage || 20
    if (!cfg) return { total: 0, deposit: 0 }
    let total = cfg.basePrice
    if (sizeCm > cfg.referenceSize) total += (sizeCm - cfg.referenceSize) * cfg.sizeSurcharge
    if (cfg.complexLocations.some((c) => c.toLowerCase() === loc.toLowerCase())) {
      total += cfg.locationSurcharge
    }
    return { total, deposit: total * (pct / 100) }
  }

  const handleOption = (text: string, nextStep: number) => {
    if (!isAiActive && nextStep !== 7) return
    addMsg(text, false)
    setIsTyping(true)
    setStep(-1)

    setTimeout(() => {
      setIsTyping(false)
      setStep(nextStep)

      if (nextStep === 1) {
        addMsg('Perfeito! Qual estilo de tatuagem você busca?', true)
      } else if (nextStep === 2) {
        setClientData((p: any) => ({ ...p, style: text }))
        addMsg('Qual o tamanho aproximado da tatuagem em centímetros (cm)?', true)
      } else if (nextStep === 3) {
        setClientData((p: any) => ({ ...p, size: text }))
        addMsg('Em qual parte do corpo você pretende fazer?', true)
      } else if (nextStep === 4) {
        setClientData((p: any) => {
          const sizeVal = parseInt(p.size) || 15
          const { total, deposit } = calculatePrice(p.style, sizeVal, text)
          setTimeout(() => {
            addMsg(
              `Com base no estilo ${p.style}, tamanho ${p.size} e local ${text}, o valor total estimado é R$ ${total}.\n\nPara agendar, o valor do sinal é R$ ${deposit}.\n\nPor favor, envie sua imagem de referência.`,
              true,
            )
          }, 100)
          return { ...p, location: text, priceEstimate: total, depositAmount: deposit }
        })
      } else if (nextStep === 5) {
        addMsg('Imagem recebida 📸.', true)
        setTimeout(() => addMsg('', true, 'terms'), 600)
      } else if (nextStep === 6) {
        setClientData((p: any) => {
          const newAppId = `app-${Date.now()}`
          const ipMock = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          const ts = new Date().toISOString()
          setTimeout(() => {
            addMsg(
              `Termos aceitos digitalmente! ✔️\n(Registro: IP ${ipMock} - ${ts})\n\nPara oficializar, exigimos o SINAL de R$ ${p.depositAmount || 200}.`,
              true,
            )
            setTimeout(
              () =>
                addMsg(`Acesse o checkout do Mercado Pago:\n\n[CHECKOUT_LINK:${newAppId}]`, true),
              1500,
            )
          }, 100)
          addAppointment({
            id: newAppId,
            studioId: studio!.id,
            clientId: 'c2',
            date: '2024-12-01',
            time: 'A definir',
            duration: 3,
            description: `Tattoo ${p.style}`,
            totalValue: p.priceEstimate,
            depositPaid: p.depositAmount || 200,
            status: 'pending',
            paymentStatus: 'pending',
          })
          return { ...p, legalAccepted: true }
        })
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
              {step === 7 ? 'Sessão Cancelada (Inatividade)' : 'Triagem em andamento'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
          {step === 7 ? (
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
              disabled={step === 7}
              className="data-[state=checked]:bg-primary"
            />
            <Label className="text-xs font-bold cursor-pointer">
              {step === 7 ? 'IA Parada' : isAiActive ? 'IA Ligada' : 'IA Desligada'}
            </Label>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-2xl mx-auto flex flex-col justify-end min-h-full pb-4">
          {!isAiActive && step !== 7 && (
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
        {step === 7 ? (
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
                studio?.tattooStyleConfigs
                  ?.filter((c) => c.enabled)
                  .map((s) => (
                    <Button key={s.name} variant="outline" onClick={() => handleOption(s.name, 2)}>
                      {s.name}
                    </Button>
                  ))}
              {step === 2 && (
                <>
                  <Button variant="outline" onClick={() => handleOption('10cm', 3)}>
                    10cm
                  </Button>
                  <Button variant="outline" onClick={() => handleOption('15cm', 3)}>
                    15cm
                  </Button>
                  <Button variant="outline" onClick={() => handleOption('25cm', 3)}>
                    25cm
                  </Button>
                </>
              )}
              {step === 3 && (
                <>
                  <Button variant="outline" onClick={() => handleOption('Antebraço', 4)}>
                    Antebraço
                  </Button>
                  <Button variant="outline" onClick={() => handleOption('Costela', 4)}>
                    Costela
                  </Button>
                  <Button variant="outline" onClick={() => handleOption('Pescoço', 4)}>
                    Pescoço
                  </Button>
                </>
              )}
              {step === 4 && (
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={() => handleOption('[Anexa Imagem]', 5)}
                >
                  Anexar Referência
                </Button>
              )}
              {step === 5 && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg animate-fade-in-up"
                  onClick={() => handleOption('Li e aceito os 5 termos.', 6)}
                >
                  <FileCheck className="size-4 mr-2" /> Confirmar Termos
                </Button>
              )}
              {step >= 6 && (
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
