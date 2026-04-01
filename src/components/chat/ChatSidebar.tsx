import { Card } from '@/components/ui/card'
import { FileCheck, AlertCircle, Calculator, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

type ClientData = {
  style: string
  size: string
  location: string
  priceEstimate: number
  depositAmount: number
  health: string
  legalAccepted: boolean
}

export function ChatSidebar({ step, clientData }: { step: number; clientData: ClientData }) {
  return (
    <Card className="border-border/50 bg-card/50 p-6 hidden lg:flex flex-col gap-6">
      <h3 className="font-semibold border-b border-border pb-2 flex items-center gap-2">
        <FileCheck className="size-4" /> Resumo do Projeto (Extração IA)
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Status da Triagem</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((step / 6) * 100, 100)}%` }}
              />
            </div>
            {Math.min(step, 6)}/6
          </div>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-2">Especificações Técnicas</p>
          {clientData.style ? (
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold text-foreground">Estilo:</span> {clientData.style}
              </p>
              <p>
                <span className="font-semibold text-foreground">Tamanho:</span> {clientData.size}
              </p>
              <p>
                <span className="font-semibold text-foreground">Local:</span> {clientData.location}
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">Aguardando dados...</p>
          )}
        </div>

        <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-2 flex justify-between">
            <span>Módulo Legal & Compliance</span>
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Termos (5 itens):</span>
              <span
                className={cn(
                  'font-semibold text-xs px-2 py-0.5 rounded',
                  clientData.legalAccepted
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {clientData.legalAccepted ? 'Aceitos ✓' : 'Pendente'}
              </span>
            </div>
          </div>
        </div>

        {step >= 4 && (
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 animate-fade-in-up">
            <p className="text-xs text-secondary mb-2 font-bold flex items-center gap-1">
              <Calculator className="size-3" /> Precificação (Motor IA)
            </p>
            <div className="flex justify-between text-base mt-2">
              <span>Valor Total:</span>{' '}
              <span className="font-bold">R$ {clientData.priceEstimate}</span>
            </div>
            {step >= 4 && (
              <>
                <div className="border-t border-secondary/20 my-3" />
                <div className="flex justify-between text-sm text-secondary font-bold items-center">
                  <span className="flex items-center gap-1">
                    <CreditCard className="size-4" /> Sinal Exigido:
                  </span>
                  <span>R$ {clientData.depositAmount}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
