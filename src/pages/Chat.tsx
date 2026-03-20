import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatBubble } from '@/components/chat/ChatBubble'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  Users,
  PenTool,
  Calculator,
  FileCheck,
  CreditCard,
} from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

type Message = { id: string; text: string; isBot: boolean; time: string }

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [lastAppId, setLastAppId] = useState<string | null>(null)

  const [clientData, setClientData] = useState({
    style: '',
    size: '',
    location: '',
    priceEstimate: 0,
    health: '',
    healthConsent: false,
    imageRights: false,
    referenceType: '',
    referenceImage: '',
    signatureIp: '',
    signatureTime: '',
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const {
    addAppointment,
    activeClients,
    updateClient,
    whatsappStatus,
    currentStudioId,
    activeAppointments,
  } = useAppStore()

  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const addMsg = (text: string, isBot: boolean) => {
    setMessages((prev) => [...prev, { id: Math.random().toString(), text, isBot, time: now() }])
  }

  // Initial bot message
  useEffect(() => {
    if (step === 0 && messages.length === 0) {
      addMsg(
        'Olá! Bem-vindo ao atendimento automatizado do Studio Noir. Como posso te ajudar hoje?',
        true,
      )
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, step])

  // Check if checkout was completed on the background/other tab
  useEffect(() => {
    if (lastAppId && step === 7) {
      const app = activeAppointments.find((a) => a.id === lastAppId)
      if (app && app.paymentStatus === 'approved') {
        setStep(8)
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          addMsg(
            'Pagamento aprovado via Mercado Pago! 🎉\n\nSeu agendamento foi oficialmente confirmado e os dados enviados para a agenda do estúdio. Um lembrete será enviado 48 horas antes da sessão. Muito obrigado pela preferência!',
            true,
          )
          toast({
            title: 'Checkout Concluído',
            description: 'O bot detectou a aprovação do Mercado Pago e confirmou a agenda.',
          })
        }, 1500)
      }
    }
  }, [activeAppointments, lastAppId, step])

  const calculateEstimate = (text: string) => {
    let base = 300
    if (text.toLowerCase().includes('realismo')) base += 500
    if (text.toLowerCase().includes('costas')) base += 300
    if (text.toLowerCase().includes('15cm')) base += 200
    if (text.toLowerCase().includes('blackwork')) base += 100
    if (text.toLowerCase().includes('5cm')) base += 50
    if (text.toLowerCase().includes('pulso')) base += 100
    return base
  }

  const handleOption = (text: string, nextStep: number) => {
    addMsg(text, false)
    setIsTyping(true)
    setStep(-1)

    setTimeout(() => {
      setIsTyping(false)
      setStep(nextStep)

      switch (nextStep) {
        case 1:
          addMsg(
            'Perfeito! Vamos usar nosso Motor de Precificação Automático. Por favor, selecione as características do seu projeto:',
            true,
          )
          break
        case 2: {
          const parts = text.split(',').map((s) => s.trim())
          const est = calculateEstimate(text)
          setClientData((prev) => ({
            ...prev,
            style: parts[0],
            size: parts[1],
            location: parts[2],
            priceEstimate: est,
          }))
          addMsg(
            `Processando dados...\n\nEstilo: ${parts[0]}\nTamanho: ${parts[1]}\nLocal: ${parts[2]}\n\nA estimativa base para esse projeto é de R$ ${est}. Qual o formato da sua imagem de referência?`,
            true,
          )
          break
        }
        case 3:
          setClientData((prev) => ({ ...prev, referenceType: text }))
          addMsg(
            `Categoria "${text}" selecionada. Por favor, anexe a imagem de referência para que o artista possa avaliar.`,
            true,
          )
          break
        case 4:
          setClientData((prev) => ({ ...prev, referenceImage: text }))
          addMsg(
            'Imagem recebida e anexada à ficha! 📄\n\nAntes de passarmos para a triagem médica, precisamos do seu **consentimento digital** (Termos e LGPD) para tratar dados de saúde e uso de imagem.\n\nPor favor, confirme abaixo para assinar digitalmente.',
            true,
          )
          break
        case 5: {
          if (text === 'Li e Aceito') {
            const ip = `189.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1`
            const timestamp = new Date().toLocaleString('pt-BR')
            setClientData((prev) => ({
              ...prev,
              healthConsent: true,
              signatureIp: ip,
              signatureTime: timestamp,
            }))
            addMsg(
              `Assinatura eletrônica registrada com sucesso ✔️\n[IP: ${ip} - Data: ${timestamp}]\n\nVocê possui alguma alergia (ex: látex, agulha, pigmento) ou faz uso de medicação contínua?`,
              true,
            )

            // Update mock client with digital signature
            const targetClient = activeClients.find((c) => c.id === 'c2')
            if (targetClient) {
              updateClient({
                ...targetClient,
                healthDataConsent: true,
                consentIp: ip,
                consentTimestamp: timestamp,
              })
            }
          } else {
            addMsg(
              'Sem a assinatura do termo LGPD não podemos prosseguir com o agendamento por questões de segurança e normas legais.',
              true,
            )
            setStep(99) // End flow
          }
          break
        }
        case 6: {
          setClientData((prev) => ({ ...prev, health: text }))
          const hasAlert = text.toLowerCase().includes('sim')
          const msg = hasAlert
            ? 'Anotado. AVISO DE SAÚDE REGISTRADO no sistema.'
            : 'Tudo certo com a triagem!'
          addMsg(
            `${msg}\n\nPara nosso portfólio, você autoriza a postagem da foto da sua tatuagem finalizada em nossas redes sociais (Instagram/TikTok)?`,
            true,
          )
          break
        }
        case 7: {
          setClientData((prev) => ({ ...prev, imageRights: text === 'Sim, autorizo' }))
          const deposit = 200

          // Generate a temp pending appointment
          const newAppId = `app-${Date.now()}`
          addAppointment({
            id: newAppId,
            studioId: currentStudioId,
            clientId: 'c2', // assuming Mariana Costa mock
            date: new Date().toISOString().split('T')[0], // just for UI placement
            time: 'A definir',
            duration: 3,
            description: `Tattoo ${clientData.style || 'A definir'} - ${clientData.location}`,
            style: clientData.style,
            size: clientData.size,
            bodyLocation: clientData.location,
            totalValue: clientData.priceEstimate || 800,
            depositPaid: deposit,
            status: 'pending',
            paymentStatus: 'pending',
          })

          setLastAppId(newAppId)

          addMsg(
            `Suas preferências foram salvas! 📝\n\nO valor base foi fixado em R$ ${clientData.priceEstimate || 800}.\n\nPara oficializar o agendamento, solicitamos um SINAL de R$ ${deposit} via Mercado Pago. O link seguro de checkout foi gerado exclusivamente para você:\n\n[CHECKOUT_LINK:${newAppId}]`,
            true,
          )

          toast({
            title: 'Checkout Gerado',
            description: 'O bot enviou o link do Mercado Pago e está aguardando o pagamento.',
          })
          break
        }
      }
    }, 1200)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      <Card className="lg:col-span-2 flex flex-col border-border/50 bg-background overflow-hidden relative">
        {whatsappStatus !== 'connected' && (
          <div className="bg-destructive/10 border-b border-destructive/20 p-3 shrink-0 flex items-start gap-3 z-10 animate-fade-in-down">
            <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-destructive">
                Aviso: WhatsApp Desconectado
              </h4>
              <p className="text-xs text-destructive-foreground mt-1">
                O painel está rodando em modo simulação. Conecte seu aparelho nas{' '}
                <strong>Configurações</strong> para enviar mensagens reais.
              </p>
            </div>
          </div>
        )}

        <div className="h-16 border-b border-border bg-card/50 flex items-center px-4 gap-3 shrink-0">
          <Avatar>
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=8" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Novo Cliente (Automação de Triagem)</h3>
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

        <div className="p-4 border-t border-border bg-card/30 shrink-0">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Simular Ação do Cliente:</p>
          <div className="flex flex-wrap gap-2">
            {step === 0 && (
              <Button onClick={() => handleOption('Quero fazer um orçamento', 1)}>
                Iniciar Orçamento
              </Button>
            )}
            {step === 1 && (
              <>
                <Button variant="outline" onClick={() => handleOption('Realismo, 15cm, Costas', 2)}>
                  <Calculator className="size-4 mr-2" /> Realismo, 15cm, Costas
                </Button>
                <Button variant="outline" onClick={() => handleOption('Blackwork, 5cm, Pulso', 2)}>
                  <Calculator className="size-4 mr-2" /> Blackwork, 5cm, Pulso
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button variant="outline" onClick={() => handleOption('Foto de parente', 3)}>
                  <Users className="size-4 mr-2" /> Foto de parente
                </Button>
                <Button variant="outline" onClick={() => handleOption('Imagem autoral', 3)}>
                  <PenTool className="size-4 mr-2" /> Imagem autoral
                </Button>
              </>
            )}
            {step === 3 && (
              <Button
                onClick={() =>
                  handleOption(
                    'https://img.usecurling.com/p/300/300?q=tattoo%20model&color=gray',
                    4,
                  )
                }
                className="bg-primary text-primary-foreground"
              >
                <Upload className="size-4 mr-2" /> Anexar Imagem
              </Button>
            )}
            {step === 4 && (
              <>
                <Button
                  onClick={() => handleOption('Li e Aceito', 5)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileCheck className="size-4 mr-2" /> Li e Aceito (Assinar)
                </Button>
                <Button variant="outline" onClick={() => handleOption('Não aceito', 5)}>
                  Não aceito
                </Button>
              </>
            )}
            {step === 5 && (
              <>
                <Button variant="outline" onClick={() => handleOption('Não, tudo 100%!', 6)}>
                  Não, sem alergias
                </Button>
                <Button
                  variant="destructive"
                  className="bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30"
                  onClick={() => handleOption('Sim, tenho alergia a látex', 6)}
                >
                  Sim, alergia a látex
                </Button>
              </>
            )}
            {step === 6 && (
              <>
                <Button variant="outline" onClick={() => handleOption('Sim, autorizo', 7)}>
                  Sim, autorizo postagem
                </Button>
                <Button variant="outline" onClick={() => handleOption('Não, prefiro que não', 7)}>
                  Não autorizo
                </Button>
              </>
            )}
            {step === 7 && (
              <p className="text-sm text-yellow-500 font-medium flex items-center gap-2 px-2 py-1 bg-yellow-500/10 rounded-md">
                <CreditCard className="size-4" /> Aguardando clique no checkout (Mercado Pago)...
              </p>
            )}
            {step === 8 && (
              <p className="text-sm text-secondary font-medium flex items-center gap-2 px-2 py-1 bg-secondary/10 rounded-md">
                <CheckCircle2 className="size-4" /> Automação Concluída (Agendado)
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="border-border/50 bg-card/50 p-6 hidden lg:flex flex-col gap-6">
        <h3 className="font-semibold border-b border-border pb-2 flex items-center gap-2">
          <FileCheck className="size-4" /> Resumo Digital da Ficha
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status do Funil de Atendimento</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min((step / 8) * 100, 100)}%` }}
                />
              </div>
              {Math.min(step, 8)}/8
            </div>
          </div>

          <div className="bg-background rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Especificações Técnicas</p>
            {clientData.style ? (
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-semibold">Estilo:</span> {clientData.style}
                </p>
                <p>
                  <span className="font-semibold">Tamanho:</span> {clientData.size}
                </p>
                <p>
                  <span className="font-semibold">Local:</span> {clientData.location}
                </p>
              </div>
            ) : (
              <p className="text-sm font-medium">Aguardando dados...</p>
            )}
          </div>

          <div className="bg-background rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-2 flex justify-between">
              <span>Compliance e Assinatura</span>
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>LGPD e Saúde:</span>
                <span
                  className={cn(
                    'font-semibold',
                    step > 4 ? 'text-green-500' : 'text-muted-foreground',
                  )}
                >
                  {step > 4 ? (clientData.healthConsent ? 'Assinado ✓' : 'Negado') : 'Pendente'}
                </span>
              </div>
              {clientData.healthConsent && (
                <div className="text-[10px] text-muted-foreground bg-muted p-1.5 rounded font-mono">
                  IP: {clientData.signatureIp} <br />
                  Data: {clientData.signatureTime}
                </div>
              )}
              <div className="flex justify-between items-center text-sm mt-2">
                <span>Uso de Imagem:</span>
                <span
                  className={cn(
                    'font-semibold',
                    step > 6
                      ? clientData.imageRights
                        ? 'text-primary'
                        : 'text-destructive'
                      : 'text-muted-foreground',
                  )}
                >
                  {step > 6 ? (clientData.imageRights ? 'Autorizado' : 'Negado') : 'Pendente'}
                </span>
              </div>
            </div>
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
              {step > 5 ? clientData.health : 'Aguardando...'}
            </p>
          </div>

          {step >= 2 && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 animate-fade-in-up">
              <p className="text-xs text-secondary mb-1 font-medium flex items-center gap-1">
                <Calculator className="size-3" /> Precificação e Checkout
              </p>
              <div className="flex justify-between text-sm mt-2">
                <span>Valor Calculado:</span>{' '}
                <span className="font-bold">R$ {clientData.priceEstimate}</span>
              </div>
              {step >= 7 && (
                <>
                  <div className="border-t border-secondary/20 my-2" />
                  <div className="flex justify-between text-sm text-secondary font-bold mt-1 items-center">
                    <span>Sinal Mercado Pago:</span> <span>R$ 200</span>
                  </div>
                  <div className="mt-2 text-xs flex items-center gap-1">
                    Status:{' '}
                    <span className={step >= 8 ? 'text-secondary font-bold' : 'text-yellow-500'}>
                      {step >= 8 ? 'Pago e Confirmado' : 'Pendente no Link'}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
