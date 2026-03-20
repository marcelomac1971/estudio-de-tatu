import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Client, Appointment, MOCK_CLIENTS, MOCK_APPOINTMENTS } from '@/lib/mockData'

type SubscriptionStatus = 'ativo' | 'inativo'
type WhatsappStatus = 'connected' | 'disconnected' | 'connecting'

type AppStore = {
  clients: Client[]
  appointments: Appointment[]
  addAppointment: (app: Appointment) => void
  updateAppointment: (app: Appointment) => void
  updateClient: (client: Client) => void
  subscriptionStatus: SubscriptionStatus
  setSubscriptionStatus: (status: SubscriptionStatus) => void
  whatsappStatus: WhatsappStatus
  setWhatsappStatus: (status: WhatsappStatus) => void
  whatsappNumber: string | null
  setWhatsappNumber: (num: string | null) => void
  metrics: {
    leads: number
    todayAppointments: number
    totalDeposits: number
    activeChats: number
    retainedDeposits: number
  }
}

const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS)
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsappStatus>('disconnected')
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)

  const [subscriptionStatus, setSubStatus] = useState<SubscriptionStatus>(() => {
    return (localStorage.getItem('studio_subscription_status') as SubscriptionStatus) || 'ativo'
  })

  const addAppointment = (app: Appointment) => {
    setAppointments((prev) => [...prev, app])
  }

  const updateAppointment = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const setSubscriptionStatus = (status: SubscriptionStatus) => {
    localStorage.setItem('studio_subscription_status', status)
    setSubStatus(status)
  }

  const today = new Date().toISOString().split('T')[0]
  const todayApps = appointments.filter((a) => a.date === today && a.status !== 'cancelled')
  const totalDeposits = todayApps.reduce((acc, a) => acc + a.depositPaid, 0)

  const retainedDeposits = appointments
    .filter((a) => a.financialStatus === 'Compensação de Agenda')
    .reduce((acc, a) => acc + a.depositPaid, 0)

  const metrics = {
    leads: 12,
    todayAppointments: todayApps.length,
    totalDeposits,
    activeChats: 3,
    retainedDeposits,
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        clients,
        appointments,
        addAppointment,
        updateAppointment,
        updateClient,
        subscriptionStatus,
        setSubscriptionStatus,
        whatsappStatus,
        setWhatsappStatus,
        whatsappNumber,
        setWhatsappNumber,
        metrics,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider')
  }
  return context
}
