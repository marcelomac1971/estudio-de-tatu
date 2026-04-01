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
  location: string
  address?: string
  mpAccessToken?: string
  googleCalendarConnected?: boolean
  botFirstMessage?: string
  tattooStyles?: string[]
  tattooStyleConfigs?: TattooStyleConfig[]
  depositPercentage?: number
  status: 'active' | 'inactive'
  mrr?: number
  contactEmail?: string
  contactPhone?: string
}

export type Client = {
  id: string
  studioId: string
  name: string
  phone: string
  avatar: string
  history: string[]
  healthAlerts: string[]
  totalSpent: number
  referenceType?: string
  referenceImage?: string
  healthDataConsent?: boolean
  imageRights?: boolean
  consentTimestamp?: string
  consentIp?: string
}

export type Appointment = {
  id: string
  studioId: string
  clientId: string
  date: string
  time: string
  duration: number
  description: string
  style?: string
  size?: string
  bodyLocation?: string
  totalValue: number
  depositPaid: number
  status: 'confirmed' | 'pending' | 'completed' | 'pending_confirmation' | 'cancelled'
  paymentStatus?: 'pending' | 'approved' | 'rejected'
  financialStatus?: 'regular' | 'Compensação de Agenda'
  rescheduleLink?: string
}

export const MOCK_STUDIOS: Studio[] = [
  {
    id: 's1',
    name: 'Studio Noir - Matriz',
    location: 'São Paulo, SP',
    address: 'Av. Paulista, 1000',
    mpAccessToken: 'TEST-123',
    googleCalendarConnected: false,
    botFirstMessage:
      'Olá! Bem-vindo ao atendimento automatizado do Studio Noir. Como posso te ajudar hoje?',
    tattooStyles: ['Realismo', 'Fine Line', 'Blackwork', 'Old School'],
    depositPercentage: 30,
    tattooStyleConfigs: [
      {
        name: 'Realismo',
        enabled: true,
        basePrice: 800,
        referenceSize: 15,
        referenceLocation: 'Antebraço',
        sizeSurcharge: 50,
        complexLocations: ['Costela', 'Pescoço'],
        locationSurcharge: 200,
      },
      {
        name: 'Fineline',
        enabled: true,
        basePrice: 400,
        referenceSize: 10,
        referenceLocation: 'Antebraço',
        sizeSurcharge: 30,
        complexLocations: ['Costela', 'Mão'],
        locationSurcharge: 100,
      },
    ],
    status: 'active',
    mrr: 299,
    contactEmail: 'matriz@noir.com',
    contactPhone: '+55 11 9999-9999',
  },
  {
    id: 's2',
    name: 'Ink & Blood Studio',
    location: 'Curitiba, PR',
    address: 'Rua XV de Novembro, 500',
    googleCalendarConnected: true,
    botFirstMessage: 'E aí! Bem-vindo ao Ink & Blood. Bora rabiscar?',
    tattooStyles: ['Tradicional', 'Aquarela', 'Oriental'],
    depositPercentage: 20,
    tattooStyleConfigs: [],
    status: 'active',
    mrr: 299,
    contactEmail: 'ink@blood.com',
    contactPhone: '+55 41 7777-7777',
  },
]

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    studioId: 's1',
    name: 'João Silva',
    phone: '+55 11 99999-1111',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    history: ['https://img.usecurling.com/p/200/200?q=wolf%20tattoo&color=black'],
    healthAlerts: ['Alergia a Dipirona'],
    totalSpent: 1200,
    healthDataConsent: true,
    imageRights: true,
  },
  {
    id: 'c2',
    studioId: 's1',
    name: 'Mariana Costa',
    phone: '+55 11 98888-2222',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    history: [],
    healthAlerts: [],
    totalSpent: 0,
  },
]

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    studioId: 's1',
    clientId: 'c1',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 3,
    description: 'Fechamento de braço - Lobo',
    style: 'Realismo',
    totalValue: 900,
    depositPaid: 200,
    status: 'confirmed',
    paymentStatus: 'approved',
  },
]
