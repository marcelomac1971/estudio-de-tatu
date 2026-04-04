import { useState } from 'react'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatArea } from '@/components/chat/ChatArea'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Hand, Bot } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function Chat() {
  const [step, setStep] = useState(0)
  const [clientData, setClientData] = useState({
    style: '',
    size: '',
    location: '',
    priceEstimate: 0,
    health: '',
    legalAccepted: false,
  })

  const { humanTakeover, setHumanTakeover } = useAppStore()
  const { toast } = useToast()

  const toggleTakeover = () => {
    setHumanTakeover(!humanTakeover)
    toast({
      title: !humanTakeover ? 'Atendimento Humano Iniciado' : 'Bot Reativado',
      description: !humanTakeover
        ? 'O bot foi pausado para este lead. Você agora está no controle.'
        : 'O bot voltou a responder automaticamente.',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 bg-card p-4 rounded-xl border border-border gap-4 shrink-0 shadow-sm">
        <div>
          <h2 className="text-lg font-bold">Atendimento em Tempo Real</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe a triagem da IA ou assuma o controle (Human Takeover).
          </p>
        </div>
        <Button
          variant={humanTakeover ? 'default' : 'outline'}
          className={
            humanTakeover
              ? 'bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md'
              : 'shadow-sm'
          }
          onClick={toggleTakeover}
        >
          {humanTakeover ? (
            <>
              <Hand className="size-4 mr-2" /> Controle Humano Ativo
            </>
          ) : (
            <>
              <Bot className="size-4 mr-2" /> Assumir Atendimento (Pausar Bot)
            </>
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 h-full overflow-hidden relative rounded-xl border border-border shadow-sm">
          {humanTakeover && (
            <div className="absolute top-0 inset-x-0 bg-orange-500/90 text-white text-xs font-bold text-center py-1.5 z-10 animate-fade-in shadow-md flex items-center justify-center gap-2">
              <Hand className="size-3" /> MODO MANUAL ATIVADO - O BOT ESTÁ PAUSADO
            </div>
          )}
          <ChatArea
            step={step}
            setStep={setStep}
            clientData={clientData}
            setClientData={setClientData}
          />
        </div>
        <div className="h-full overflow-hidden rounded-xl border border-border shadow-sm hidden lg:block">
          <ChatSidebar step={step} clientData={clientData} />
        </div>
      </div>
    </div>
  )
}
