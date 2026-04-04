import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  Client,
  Appointment,
  Studio,
  MOCK_CLIENTS,
  MOCK_APPOINTMENTS,
  MOCK_STUDIOS,
} from '@/lib/mockData'

type Role = 'admin' | 'studio'
type AuthUser = { email: string; role: Role; studioId?: string }

type AppStore = {
  isAuthenticated: boolean
  authUser: AuthUser | null
  login: (email: string, pass: string) => boolean
  logout: () => void
  role: Role
  studios: Studio[]
  currentStudioId: string
  setCurrentStudioId: (id: string) => void
  addStudio: (studio: Studio) => void
  updateStudio: (studio: Studio) => void
  activeClients: Client[]
  activeAppointments: Appointment[]
  addAppointment: (app: Appointment) => void
  updateAppointment: (app: Appointment) => void
  updateClient: (client: Client) => void
  adminConfig: { supabaseUrl: string; supabaseKey: string }
  setAdminConfig: (config: { supabaseUrl: string; supabaseKey: string }) => void
  metrics: {
    leads: number
    todayAppointments: number
    totalDeposits: number
    retainedDeposits: number
  }
  adminMetrics: {
    totalStudios: number
    mrr: number
    totalConversions: number
    globalLeads: number
    globalDeposits: number
  }
  whatsappStatus: 'connected' | 'disconnected' | 'connecting'
  setWhatsappStatus: (status: 'connected' | 'disconnected' | 'connecting') => void
  whatsappNumber: string | null
  setWhatsappNumber: (num: string | null) => void
  humanTakeover: boolean
  setHumanTakeover: (val: boolean) => void
}

const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const initSession = () => {
    try {
      const stored = localStorage.getItem('modern-noir-session')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.authUser && parsed.role) {
          return parsed
        }
        localStorage.removeItem('modern-noir-session')
      }
    } catch {
      localStorage.removeItem('modern-noir-session')
    }
    return null
  }

  const session = initSession()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!session)
  const [authUser, setAuthUser] = useState<AuthUser | null>(session?.authUser || null)
  const [role, setRole] = useState<Role>(session?.role || 'studio')

  const [studios, setStudios] = useState<Studio[]>(MOCK_STUDIOS)
  const [currentStudioId, setCurrentStudioIdState] = useState<string>(
    session?.currentStudioId || 's1',
  )

  const setCurrentStudioId = (id: string) => {
    setCurrentStudioIdState(id)
    if (isAuthenticated && authUser) {
      localStorage.setItem(
        'modern-noir-session',
        JSON.stringify({ authUser, role, currentStudioId: id }),
      )
    }
  }
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS)
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)

  const [adminConfig, setAdminConfig] = useState({
    supabaseUrl: 'https://ncohzpajxzzljdgvmxsk.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })

  const [whatsappStatus, setWhatsappStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
    'disconnected',
  )
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)
  const [humanTakeover, setHumanTakeover] = useState(false)

  const login = (email: string, pass: string) => {
    if (email === 'marcelomac762@gmail.com' && pass === 'uber1971*') {
      const user = { email, role: 'admin' as Role }
      setIsAuthenticated(true)
      setAuthUser(user)
      setRole('admin')
      localStorage.setItem(
        'modern-noir-session',
        JSON.stringify({ authUser: user, role: 'admin', currentStudioId }),
      )
      return true
    }
    if (email && pass) {
      const user = { email, role: 'studio' as Role, studioId: 's1' }
      setIsAuthenticated(true)
      setAuthUser(user)
      setRole('studio')
      setCurrentStudioIdState('s1')
      localStorage.setItem(
        'modern-noir-session',
        JSON.stringify({ authUser: user, role: 'studio', currentStudioId: 's1' }),
      )
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAuthUser(null)
    localStorage.removeItem('modern-noir-session')
  }

  const addStudio = (studio: Studio) => setStudios((prev) => [...prev, studio])
  const updateStudio = (updated: Studio) =>
    setStudios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  const addAppointment = (app: Appointment) =>
    setAppointments((prev) => [...prev, { ...app, studioId: app.studioId || currentStudioId }])
  const updateAppointment = (updated: Appointment) =>
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  const updateClient = (updated: Client) =>
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))

  const activeAppointments = appointments.filter((a) => a.studioId === currentStudioId)
  const activeClients = clients.filter((c) => c.studioId === currentStudioId)

  const metrics = {
    leads: activeClients.length * 3 + 12,
    todayAppointments: activeAppointments.filter(
      (a) => a.date === new Date().toISOString().split('T')[0],
    ).length,
    totalDeposits: activeAppointments.reduce((acc, a) => acc + (a.depositPaid || 0), 0),
    retainedDeposits: activeAppointments
      .filter((a) => a.financialStatus === 'Compensação de Agenda')
      .reduce((acc, a) => acc + a.depositPaid, 0),
  }

  const adminMetrics = {
    totalStudios: studios.filter((s) => s.status === 'active').length,
    mrr: studios.filter((s) => s.status === 'active').reduce((acc, s) => acc + (s.mrr || 0), 0),
    totalConversions: appointments.filter(
      (a) => a.status === 'confirmed' || a.status === 'completed',
    ).length,
    globalLeads: clients.length * 4 + 45,
    globalDeposits: appointments.reduce((acc, a) => acc + (a.depositPaid || 0), 0),
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        isAuthenticated,
        authUser,
        login,
        logout,
        role,
        studios,
        currentStudioId,
        setCurrentStudioId,
        addStudio,
        updateStudio,
        activeClients,
        activeAppointments,
        addAppointment,
        updateAppointment,
        updateClient,
        adminConfig,
        setAdminConfig,
        metrics,
        adminMetrics,
        whatsappStatus,
        setWhatsappStatus,
        whatsappNumber,
        setWhatsappNumber,
        humanTakeover,
        setHumanTakeover,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within an AppProvider')
  return context
}
