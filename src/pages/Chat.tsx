import { useState } from 'react'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatArea } from '@/components/chat/ChatArea'

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)] animate-fade-in-up">
      <div className="lg:col-span-2 h-full">
        <ChatArea
          step={step}
          setStep={setStep}
          clientData={clientData}
          setClientData={setClientData}
        />
      </div>
      <div className="h-full">
        <ChatSidebar step={step} clientData={clientData} />
      </div>
    </div>
  )
}
