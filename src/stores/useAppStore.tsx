import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

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
  addStudio: (studio: Studio) => void
  updateStudio: (studio: Studio) => void
  activeClients: Client[]
  activeAppointments: Appointment[]
  addAppointment: (app: Appointment) => void
  updateAppointment: (app: Appointment) => void
  updateClient: (client: Client) => void
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
}

const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [studios, setStudios] = useState<Studio[]>([])
  const [currentStudioId, setCurrentStudioIdState] = useState<string>('')
  const [clients, setClients] = useState<Client[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [adminConfig, setAdminConfig] = useState({
    supabaseUrl: 'https://ncohzpajxzzljdgvmxsk.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })

  const [whatsappStatus, setWhatsappStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
    'disconnected',
  )
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null)
  const [humanTakeover, setHumanTakeover] = useState(false)

  const role: Role = user?.email === 'marcelomacbook@me.com' ? 'admin' : 'studio'

  const loadData = useCallback(async () => {
    if (!user) return

    const { data: est } = await supabase.from('estudios').select('*')
    if (est) {
      setStudios(
        est.map((e: any) => ({
          id: e.id,
          name: e.nome,
          contactPhone: e.whatsapp_vinculado || '',
          contactEmail: e.contact_email || '',
          address: e.address || '',
          location: e.location || '',
          status: e.status_assinatura || 'active',
          mrr: e.mrr || 0,
          botFirstMessage: e.bot_first_message || '',
          recoveryMessage: e.recovery_message || '',
          depositPercentage: e.deposit_percentage || 20,
          availabilitySearchMargin: e.availability_search_margin || 3,
          tattooStyleConfigs: e.tattoo_style_configs || [],
          zapiInstanceId: e.zapi_instance_id || '',
          zapiToken: e.zapi_token || '',
          googleCalendarConnected: e.google_calendar_connected || false,
          billingCycleEnd: e.billing_cycle_end || '',
        })),
      )

      const userStudio = est.find((s: any) => s.id === user.id)
      if (userStudio) setCurrentStudioIdState(user.id)
      else if (est.length > 0) setCurrentStudioIdState(est[0].id)
    }

    const { data: cli } = await supabase.from('clientes').select('*').eq('estudio_id', user.id)
    if (cli) {
      setClients(
        cli.map((c: any) => ({
          id: c.id,
          studioId: c.estudio_id || '',
          name: c.nome || '',
          phone: c.telefone || '',
          avatar: c.avatar || 'https://img.usecurling.com/ppl/thumbnail',
          totalSpent: c.total_spent || 0,
          healthDataConsent: c.health_data_consent || false,
          imageRights: c.image_rights || false,
          consentTimestamp: c.consent_timestamp || '',
          consentIp: c.consent_ip || '',
          referenceType: c.reference_type || '',
          referenceImage: c.reference_image || '',
          history: c.history || [],
          healthAlerts: c.alergias ? c.alergias.split(',') : [],
        })),
      )
    }

    const { data: appts } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('estudio_id', user.id)
    if (appts) {
      setAppointments(
        appts.map((a: any) => ({
          id: a.id,
          studioId: a.estudio_id || '',
          clientId: a.cliente_id || '',
          date: a.date || a.data_hora?.split('T')[0] || '',
          time: a.time || a.data_hora?.split('T')[1]?.substring(0, 5) || '',
          duration: a.duration || 1,
          description: a.description || '',
          totalValue: a.total_value || 0,
          depositPaid: a.valor_sinal || 0,
          status: a.status || 'pending',
          paymentStatus: a.payment_status || 'pending',
          financialStatus: a.financial_status || '',
          rescheduleLink: a.reschedule_link || '',
        })),
      )
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  const setCurrentStudioId = (id: string) => setCurrentStudioIdState(id)

  const addStudio = async (studio: Studio) => {
    setStudios((prev) => [...prev, studio])
    await supabase.from('estudios').insert({
      id: studio.id,
      nome: studio.name,
      whatsapp_vinculado: studio.contactPhone,
      contact_email: studio.contactEmail,
      address: studio.address,
      location: studio.location,
      status_assinatura: studio.status,
      mrr: studio.mrr,
      bot_first_message: studio.botFirstMessage,
      recovery_message: studio.recoveryMessage,
      deposit_percentage: studio.depositPercentage,
      availability_search_margin: studio.availabilitySearchMargin,
      tattoo_style_configs: studio.tattooStyleConfigs,
      zapi_instance_id: studio.zapiInstanceId,
      zapi_token: studio.zapiToken,
      google_calendar_connected: studio.googleCalendarConnected,
      billing_cycle_end: studio.billingCycleEnd,
      user_id: user?.id,
    })
  }

  const updateStudio = async (updated: Studio) => {
    setStudios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    await supabase
      .from('estudios')
      .update({
        nome: updated.name,
        whatsapp_vinculado: updated.contactPhone,
        contact_email: updated.contactEmail,
        address: updated.address,
        location: updated.location,
        status_assinatura: updated.status,
        mrr: updated.mrr,
        bot_first_message: updated.botFirstMessage,
        recovery_message: updated.recoveryMessage,
        deposit_percentage: updated.depositPercentage,
        availability_search_margin: updated.availabilitySearchMargin,
        tattoo_style_configs: updated.tattooStyleConfigs,
        zapi_instance_id: updated.zapiInstanceId,
        zapi_token: updated.zapiToken,
        google_calendar_connected: updated.googleCalendarConnected,
        billing_cycle_end: updated.billingCycleEnd,
      })
      .eq('id', updated.id)
  }

  const addAppointment = (app: Appointment) => setAppointments((prev) => [...prev, app])

  const updateAppointment = async (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    await supabase
      .from('agendamentos')
      .update({
        status: updated.status,
        payment_status: updated.paymentStatus,
        financial_status: updated.financialStatus,
        reschedule_link: updated.rescheduleLink,
      })
      .eq('id', updated.id)
  }

  const updateClient = async (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    await supabase
      .from('clientes')
      .update({
        nome: updated.name,
        telefone: updated.phone,
        avatar: updated.avatar,
        total_spent: updated.totalSpent,
        health_data_consent: updated.healthDataConsent,
        image_rights: updated.imageRights,
        consent_timestamp: updated.consentTimestamp,
        consent_ip: updated.consentIp,
        reference_type: updated.referenceType,
        reference_image: updated.referenceImage,
        history: updated.history,
        alergias: updated.healthAlerts.join(','),
      })
      .eq('id', updated.id)
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
