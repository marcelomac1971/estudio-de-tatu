import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'

export type Role = 'admin' | 'studio'

export type TattooStyleConfig = {
  name: string
  enabled: boolean
  basePrice: number
  referenceSize: number
  referenceLocation: string
  sizeSurcharge: number
  complexLocations: string[]
  locationSurcharge: number
}

export type Studio = {
  id: string
  name: string
  description: string
  contactPhone: string
  contactEmail: string
  address: string
  location: string
  status: string
  mrr: number
  botFirstMessage: string
  recoveryMessage: string
  depositPercentage: number
  availabilitySearchMargin: number
  tattooStyleConfigs: TattooStyleConfig[]
  zapiInstanceId: string
  zapiToken: string
  googleCalendarConnected: boolean
  billingCycleEnd: string
}

export type Client = {
  id: string
  studioId?: string
  name: string
  phone: string
  email: string
  avatar: string
  totalSpent: number
  healthDataConsent: boolean
  imageRights: boolean
  consentTimestamp: string
  consentIp: string
  referenceType: string
  referenceImage: string
  history: string[]
  healthAlerts: string[]
}

export type Appointment = {
  id: string
  studioId?: string
  clientId: string
  date: string
  time: string
  duration: number
  description: string
  notes: string
  totalValue: number
  depositPaid: number
  status: string
  paymentStatus: string
  financialStatus: string
  rescheduleLink: string
}

type AppStore = {
  studios: Studio[]
  currentStudioId: string
  setCurrentStudioId: (id: string) => void
  addStudio: (studio: Partial<Studio>) => Promise<void>
  updateStudio: (studio: Studio) => Promise<void>
  activeClients: Client[]
  activeAppointments: Appointment[]
  addAppointment: (app: Partial<Appointment>) => Promise<void>
  updateAppointment: (app: Appointment) => Promise<void>
  updateClient: (client: Client) => Promise<void>
  adminConfig: { supabaseUrl: string; supabaseKey: string }
  setAdminConfig: (config: { supabaseUrl: string; supabaseKey: string }) => void
  metrics: any
  adminMetrics: any
  whatsappStatus: 'connected' | 'disconnected' | 'connecting'
  setWhatsappStatus: (status: 'connected' | 'disconnected' | 'connecting') => void
  whatsappNumber: string | null
  setWhatsappNumber: (num: string | null) => void
  humanTakeover: boolean
  setHumanTakeover: (val: boolean) => void
  refreshData: () => Promise<void>
  role: Role
  authUser: any
  logout: () => void
}

const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser, signOut } = useAuth()

  const [studios, setStudios] = useState<Studio[]>([])
  const [currentStudioId, setCurrentStudioIdState] = useState<string>('')
  const [clients, setClients] = useState<Client[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [adminConfig, setAdminConfig] = useState({
    supabaseUrl: '',
    supabaseKey: '',
  })

  const [whatsappStatus, setWhatsappStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
    'disconnected',
  )
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)
  const [humanTakeover, setHumanTakeover] = useState(false)

  const role: Role = authUser?.email === 'marcelomacbook@me.com' ? 'admin' : 'studio'

  const loadData = useCallback(async () => {
    if (!authUser) return

    try {
      const est = await pb.collection('studios').getFullList()
      if (est && est.length > 0) {
        setStudios(
          est.map((e: any) => ({
            id: e.id,
            name: e.name,
            description: e.description || '',
            contactPhone: e.contactPhone || '',
            contactEmail: e.contactEmail || '',
            address: e.address || '',
            location: e.location || '',
            status: e.status || 'active',
            mrr: e.mrr || 0,
            botFirstMessage: e.botFirstMessage || '',
            recoveryMessage: e.recoveryMessage || '',
            depositPercentage: e.depositPercentage || 20,
            availabilitySearchMargin: e.availabilitySearchMargin || 3,
            tattooStyleConfigs: e.tattooStyleConfigs || [],
            zapiInstanceId: e.zapiInstanceId || '',
            zapiToken: e.zapiToken || '',
            googleCalendarConnected: e.googleCalendarConnected || false,
            billingCycleEnd: e.billingCycleEnd || '',
          })),
        )

        const userStudio = est.find((s: any) => s.owner === authUser.id)
        if (userStudio) setCurrentStudioIdState(userStudio.id)
        else setCurrentStudioIdState(est[0].id)
      } else {
        setCurrentStudioIdState('default-studio')
      }

      const cli = await pb.collection('clients').getFullList()
      setClients(
        cli.map((c: any) => ({
          id: c.id,
          studioId: c.studio || '',
          name: c.name || '',
          phone: c.phone || '',
          email: c.email || '',
          avatar: c.avatar || 'https://img.usecurling.com/ppl/thumbnail',
          totalSpent: c.totalSpent || 0,
          healthDataConsent: c.healthDataConsent || false,
          imageRights: c.imageRights || false,
          consentTimestamp: c.consentTimestamp || '',
          consentIp: c.consentIp || '',
          referenceType: c.referenceType || '',
          referenceImage: c.referenceImage || '',
          history: c.history || [],
          healthAlerts: c.healthAlerts ? c.healthAlerts.split(',') : [],
        })),
      )

      const appts = await pb.collection('appointments').getFullList()
      setAppointments(
        appts.map((a: any) => ({
          id: a.id,
          studioId: a.studio || '',
          clientId: a.client || '',
          date: a.date ? a.date.split(' ')[0] : '',
          time: a.time || '',
          duration: a.duration || 1,
          description: a.description || '',
          notes: a.notes || '',
          totalValue: a.totalValue || 0,
          depositPaid: a.depositPaid || 0,
          status: a.status || 'pending',
          paymentStatus: a.paymentStatus || 'pending',
          financialStatus: a.financialStatus || '',
          rescheduleLink: a.rescheduleLink || '',
        })),
      )
    } catch (err) {
      console.error('Error loading data', err)
    }
  }, [authUser])

  useEffect(() => {
    if (authUser) loadData()
  }, [authUser, loadData])

  useRealtime(
    'studios',
    () => {
      if (authUser) loadData()
    },
    !!authUser,
  )
  useRealtime(
    'clients',
    () => {
      if (authUser) loadData()
    },
    !!authUser,
  )
  useRealtime(
    'appointments',
    () => {
      if (authUser) loadData()
    },
    !!authUser,
  )

  const setCurrentStudioId = (id: string) => setCurrentStudioIdState(id)

  const addStudio = async (studio: Partial<Studio>) => {
    await pb.collection('studios').create({
      name: studio.name,
      contactPhone: studio.contactPhone,
      contactEmail: studio.contactEmail,
      owner: authUser?.id,
      status: 'active',
    })
  }

  const updateStudio = async (updated: Studio) => {
    await pb.collection('studios').update(updated.id, {
      name: updated.name,
      contactPhone: updated.contactPhone,
      contactEmail: updated.contactEmail,
      address: updated.address,
      location: updated.location,
      status: updated.status,
      mrr: updated.mrr,
      botFirstMessage: updated.botFirstMessage,
      recoveryMessage: updated.recoveryMessage,
      depositPercentage: updated.depositPercentage,
      availabilitySearchMargin: updated.availabilitySearchMargin,
      tattooStyleConfigs: updated.tattooStyleConfigs,
      zapiInstanceId: updated.zapiInstanceId,
      zapiToken: updated.zapiToken,
      googleCalendarConnected: updated.googleCalendarConnected,
      billingCycleEnd: updated.billingCycleEnd,
    })
  }

  const addAppointment = async (app: Partial<Appointment>) => {
    await pb.collection('appointments').create({
      studio: app.studioId,
      client: app.clientId,
      date: app.date ? new Date(app.date).toISOString() : undefined,
      time: app.time,
      duration: app.duration,
      description: app.description,
      totalValue: app.totalValue,
      depositPaid: app.depositPaid,
      status: app.status,
      paymentStatus: app.paymentStatus,
    })
  }

  const updateAppointment = async (updated: Appointment) => {
    await pb.collection('appointments').update(updated.id, {
      status: updated.status,
      paymentStatus: updated.paymentStatus,
      financialStatus: updated.financialStatus,
      rescheduleLink: updated.rescheduleLink,
    })
  }

  const updateClient = async (updated: Client) => {
    await pb.collection('clients').update(updated.id, {
      name: updated.name,
      phone: updated.phone,
      avatar: updated.avatar,
      totalSpent: updated.totalSpent,
      healthDataConsent: updated.healthDataConsent,
      imageRights: updated.imageRights,
      consentTimestamp: updated.consentTimestamp,
      consentIp: updated.consentIp,
      referenceType: updated.referenceType,
      referenceImage: updated.referenceImage,
      history: updated.history,
      healthAlerts: updated.healthAlerts.join(','),
    })
  }

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
        refreshData: loadData,
        role,
        authUser,
        logout: signOut,
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
