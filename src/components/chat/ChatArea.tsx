import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, FileCheck, BrainCircuit, MessageSquareText, TimerOff } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase/client'

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
  date?: string
  time?: string
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
  const { toast } = useToast()

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

  const trigger24hFollowUp = () => {
    addMsg(
      'Oi! Vi que você não finalizou seu agendamento. Ainda tem interesse? As vagas estão acabando!',
      true,
    )
    setStep(99)
  }

  const trigger2hEnd = () => {
    setIsAiActive(false)
    setStep(100)
    addMsg(
      'Sessão encerrada por inatividade. Quando quiser retornar, basta mandar um "Oi".',
      false,
      'system',
    )
  }

  useEffect(() => {
    let timeout24: NodeJS.Timeout
    let timeout2: NodeJS.Timeout

    if (isAiActive && step > 0 && step < 99 && step !== 7 && step !== 100) {
      timeout24 = setTimeout(
        () => {
          trigger24hFollowUp()
        },
        24 * 60 * 60 * 1000,
      )
    }

    if (isAiActive && step === 99) {
      timeout2 = setTimeout(
        () => {
          trigger2hEnd()
        },
        2 * 60 * 60 * 1000,
      )
    }

    return () => {
      if (timeout24) clearTimeout(timeout24)
      if (timeout2) clearTimeout(timeout2)
    }
  }, [step, isAiActive])

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
    if (!isAiActive && nextStep !== 99 && nextStep !== 100) return
    if (nextStep !== -2) {
      addMsg(text, false)
    }
    setIsTyping(true)
    setStep(-1)

    setTimeout(() => {
      setIsTyping(false)
      if (nextStep !== -2) setStep(nextStep)

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
              `Com base no estilo ${p.style}, tamanho ${p.size} e local ${text}, o valor total estimado é R$ ${total}.\n\nPara agendar, o valor do sinal é R$ ${deposit}.\n\nPara quando você gostaria de agendar? (Ex: Amanhã às 14:00)`,
              true,
            )
          }, 100)
          return { ...p, location: text, priceEstimate: total, depositAmount: deposit }
        })
      } else if (nextStep === 4.1) {
        const inputStr = text
        setIsTyping(true)
        setStep(-1)

        setTimeout(async () => {
          addMsg(`Consultando a agenda do estúdio...`, true)

          try {
            const { data } = await supabase
              .from('agendamentos')
              .select('data_hora')
              .gte('data_hora', new Date().toISOString())

            const occupiedDates = (data || []).map((a) => {
              const d = new Date(a.data_hora!)
              return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} às ${d.getHours()}:00`
            })

            let baseDate = inputStr.split(' às ')[0]
            if (baseDate === 'Amanhã') {
              const tmrw = new Date()
              tmrw.setDate(tmrw.getDate() + 1)
              baseDate = `${tmrw.getDate().toString().padStart(2, '0')}/${(tmrw.getMonth() + 1).toString().padStart(2, '0')}`
            }

            const possibleSlots = [
              `${baseDate} às 10:00`,
              `${baseDate} às 14:00`,
              `${baseDate} às 16:00`,
              `${baseDate} às 18:00`,
            ]

            const availableSlots = possibleSlots.filter((s) => !occupiedDates.includes(s))

            setTimeout(() => {
              if (availableSlots.length > 0) {
                const slotsText = availableSlots
                  .slice(0, 3)
                  .map((s) => `- ${s}`)
                  .join('\n')
                addMsg(
                  `Encontrei os seguintes horários livres próximos:\n${slotsText}\n\nPodemos confirmar algum desses?`,
                  true,
                )
              } else {
                addMsg(`Infelizmente não encontrei horários livres próximos.`, true)
              }
              setIsTyping(false)
              setStep(4.5)
            }, 1000)
          } catch (err) {
            setIsTyping(false)
            setStep(4.5)
          }
        }, 1000)
      } else if (nextStep === 4.2) {
        let selectedDate = '01/12'
        let selectedTime = '16:00'
        if (text.includes('às')) {
          selectedDate = text.split(' às ')[0].trim()
          selectedTime = text.split(' às ')[1].trim()
        }
        setClientData((p: any) => ({ ...p, date: selectedDate, time: selectedTime }))
        setTimeout(() => {
          addMsg(
            `Data e horário (${text}) pré-reservados com sucesso!\n\nPor favor, envie sua imagem de referência para o projeto.`,
            true,
          )
        }, 100)
        setStep(5)
      } else if (nextStep === 6) {
        addMsg('Imagem recebida 📸.', true)
        setTimeout(() => addMsg('', true, 'terms'), 600)
      } else if (nextStep === 7) {
        setClientData((p: any) => {
          const newAppId = `app-${Date.now()}`
          const ipMock = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          const ts = new Date().toISOString()

          const saveDb = async () => {
            const currentYear = new Date().getFullYear()
            let isoDate = new Date().toISOString()
            if (p.date && p.time) {
              try {
                const [day, month] = p.date.split('/')
                if (day && month) {
                  const timePart = p.time.split(':')
                  isoDate = new Date(
                    currentYear,
                    parseInt(month) - 1,
                    parseInt(day),
                    parseInt(timePart[0]),
                    parseInt(timePart[1]),
                  ).toISOString()
                }
              } catch (e) {
                console.error(e)
              }
            }

            await supabase.from('agendamentos').insert({
              estudio_id: studio?.id,
              data_hora: isoDate,
              valor_sinal: p.depositAmount || 200,
              status_pagamento: 'pendente',
              duration: 3,
              description: `Tattoo ${p.style} (${p.size}) em ${p.location}`,
              total_value: p.priceEstimate,
              date: p.date || '2024-12-01',
              time: p.time || '10:00',
              status: 'pending',
              payment_status: 'pending',
            })
          }
          saveDb()

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
            studioId: studio?.id || 's1',
            clientId: 'c2',
            date: p.date || '2024-12-01',
            time: p.time || '10:00',
            duration: 3,
            description: `Tattoo ${p.style} (${p.size}) em ${p.location}`,
            totalValue: p.priceEstimate,
            depositPaid: p.depositAmount || 200,
            status: 'pending',
            paymentStatus: 'pending',
          })
          return { ...p, legalAccepted: true }
        })
      } else if (nextStep === -2) {
        trigger24hFollowUp()
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
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Mariana Costa</h3>
            <p className="text-xs text-muted-foreground">
              {step === 100
                ? 'Sessão Encerrada'
                : step === 99
                  ? 'Aguardando Retorno'
                  : 'Triagem em andamento'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
          {step === 100 ? (
            <TimerOff className="size-4 text-destructive" />
          ) : (
            <BrainCircuit
              className={`size-4 ${isAiActive ? 'text-primary' : 'text-muted-foreground'}`}
            />
          )}
          <div className="flex items-center gap-2">
            <Button
              variant={isAiActive ? 'destructive' : 'default'}
              size="sm"
              onClick={() => setIsAiActive(!isAiActive)}
              disabled={step === 100}
              className="h-7 text-xs font-bold px-3"
            >
              {step === 100 ? 'Sessão Expirada' : isAiActive ? 'Assumir Conversa' : 'Reativar IA'}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-2xl mx-auto flex flex-col justify-end min-h-full pb-4">
          {!isAiActive && step !== 100 && (
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
        {step === 100 ? (
          <div className="text-center py-3 text-sm text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-lg">
            Esta sessão foi encerrada automaticamente para liberar o agente.
          </div>
        ) : isAiActive ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <MessageSquareText className="size-3" /> Simular Ações do Usuário:
              </p>
              <div className="flex gap-2">
                {step > 0 && step < 99 && step !== 7 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={trigger24hFollowUp}
                  >
                    Simular 24h
                  </Button>
                )}
                {step === 99 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={trigger2hEnd}
                  >
                    Simular +2h
                  </Button>
                )}
              </div>
            </div>
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
                <>
                  <Button variant="outline" onClick={() => handleOption('Amanhã às 14:00', 4.1)}>
                    Amanhã às 14:00
                  </Button>
                  <Button variant="outline" onClick={() => handleOption('25/12 às 10:00', 4.1)}>
                    25/12 às 10:00
                  </Button>
                </>
              )}
              {step === 4.5 && (
                <>
                  <Button variant="outline" onClick={() => handleOption('Amanhã às 16:00', 4.2)}>
                    Aceitar: Amanhã às 16:00
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOption('Depois de amanhã às 10:00', 4.2)}
                  >
                    Aceitar: Depois de amanhã às 10:00
                  </Button>
                </>
              )}
              {step === 5 && (
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={() => handleOption('[Anexa Imagem]', 6)}
                >
                  Anexar Referência
                </Button>
              )}
              {step === 6 && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg animate-fade-in-up"
                  onClick={() => handleOption('Li e aceito os 5 termos.', 7)}
                >
                  <FileCheck className="size-4 mr-2" /> Confirmar Termos
                </Button>
              )}
              {step === 7 && (
                <>
                  <p className="text-sm font-medium text-secondary flex-1 pt-2">
                    Agendamento salvo no Banco. Aguardando Checkout...
                  </p>
                </>
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
