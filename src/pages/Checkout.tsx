import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle2, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function Checkout() {
  const { id } = useParams()
  const { activeAppointments, updateAppointment, studios } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const app = activeAppointments.find((a) => a.id === id)
  const studio = app ? studios.find((s) => s.id === app.studioId) : null

  // Auto detect if it's already paid
  useEffect(() => {
    if (app?.paymentStatus === 'approved') {
      setIsSuccess(true)
    }
  }, [app])

  if (!app) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex flex-col items-center justify-center p-4">
        <p>Agendamento não encontrado ou link expirado.</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline flex items-center gap-2">
          <ArrowLeft className="size-4" /> Voltar ao Painel
        </Link>
      </div>
    )
  }

  const handlePay = () => {
    setIsProcessing(true)
    setTimeout(() => {
      // Confirm payment in store
      updateAppointment({ ...app, status: 'confirmed', paymentStatus: 'approved' })
      setIsSuccess(true)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="w-full max-w-md absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          asChild
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          <Link to="/conversas">
            <ArrowLeft className="size-4 mr-2" /> Simular Retorno ao Bot
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 shadow-2xl relative overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 inset-x-0 h-1 bg-[#009EE3]" />

        <CardHeader className="text-center pb-4 border-b border-zinc-800/50">
          <div className="flex justify-center mb-6">
            <div className="bg-[#009EE3]/10 p-4 rounded-full ring-8 ring-[#009EE3]/5">
              <CreditCard className="size-8 text-[#009EE3]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Pagamento de Sinal</CardTitle>
          <CardDescription className="text-zinc-400 mt-2 font-medium">
            {studio?.name || 'Studio Noir'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CheckCircle2 className="size-12 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-100">Pagamento Aprovado!</h3>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                Seu agendamento está confirmado. Um recibo foi enviado para você e o estúdio já foi
                notificado.
              </p>
              <Button asChild className="mt-8 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 w-full">
                <Link to="/conversas">Fechar e Voltar</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-zinc-950 rounded-xl p-5 space-y-3 border border-zinc-800/80">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-zinc-500">Serviço</span>
                  <span className="font-medium text-zinc-200 text-right max-w-[180px] truncate">
                    {app.description}
                  </span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-zinc-500">Data e Hora</span>
                  <span className="font-medium text-zinc-200">{app.time} (Estimado)</span>
                </div>
                <div className="h-px w-full bg-zinc-800/50 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-medium">Total a Pagar Hoje</span>
                  <span className="text-2xl font-bold text-[#009EE3]">
                    R$ {app.depositPaid.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
                <ShieldCheck className="size-4 text-green-500/70" />
                Ambiente Seguro Mercado Pago
              </div>

              <Button
                className="w-full bg-[#009EE3] hover:bg-[#0080B7] text-white py-6 text-lg rounded-xl transition-all shadow-lg shadow-[#009EE3]/20"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-5 mr-2 animate-spin" /> Processando...
                  </>
                ) : (
                  `Pagar R$ ${app.depositPaid}`
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
