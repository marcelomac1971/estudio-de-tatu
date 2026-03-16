import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Client, Appointment, MOCK_CLIENTS, MOCK_APPOINTMENTS } from '@/lib/mockData'

type AppStore = {
  clients: Client[]
  appointments: Appointment[]
  addAppointment: (app: Appointment) => void
  updateClient: (client: Client) => void
  metrics: {
    leads: number
    todayAppointments: number
    totalDeposits: number
    activeChats: number
  }
}

const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS)
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)

  const addAppointment = (app: Appointment) => {
    setAppointments((prev) => [...prev, app])
  }

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  // Calculate metrics based on data
  const today = new Date().toISOString().split('T')[0]
  const todayApps = appointments.filter((a) => a.date === today)
  const totalDeposits = todayApps.reduce((acc, a) => acc + a.depositPaid, 0)

  const metrics = {
    leads: 12, // Mocked for demo
    todayAppointments: todayApps.length,
    totalDeposits,
    activeChats: 3, // Mocked
  }

  return React.createElement(
    AppContext.Provider,
    { value: { clients, appointments, addAppointment, updateClient, metrics } },
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
