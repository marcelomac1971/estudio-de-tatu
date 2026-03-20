export type Studio = {
  id: string
  name: string
  location: string
  mpAccessToken?: string
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
  date: string // YYYY-MM-DD
  time: string // HH:MM
  duration: number // hours
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
  { id: 's1', name: 'Studio Noir - Matriz', location: 'São Paulo, SP', mpAccessToken: 'TEST-123' },
  { id: 's2', name: 'Studio Noir - Filial', location: 'Rio de Janeiro, RJ' },
]

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

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
    referenceType: 'Imagem autoral',
    referenceImage: 'https://img.usecurling.com/p/200/200?q=wolf%20drawing&color=black',
    healthDataConsent: true,
    imageRights: true,
    consentTimestamp: '10/10/2023, 14:32:01',
    consentIp: '177.34.12.98',
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
  {
    id: 'c3',
    studioId: 's2',
    name: 'Pedro Alves',
    phone: '+55 21 97777-3333',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    history: ['https://img.usecurling.com/p/200/200?q=skull%20tattoo&color=black'],
    healthAlerts: ['Pressão Alta (Controlada)'],
    totalSpent: 850,
    referenceType: 'Foto de parente',
    referenceImage: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=10',
    healthDataConsent: true,
    imageRights: false,
    consentTimestamp: '12/10/2023, 09:15:22',
    consentIp: '189.10.44.12',
  },
]

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    studioId: 's1',
    clientId: 'c1',
    date: today,
    time: '14:00',
    duration: 3,
    description: 'Fechamento de braço - Lobo (Sessão 2)',
    style: 'Realismo',
    size: '20cm',
    bodyLocation: 'Braço',
    totalValue: 900,
    depositPaid: 200,
    status: 'confirmed',
    paymentStatus: 'approved',
    financialStatus: 'regular',
  },
  {
    id: 'a2',
    studioId: 's1',
    clientId: 'c2',
    date: tomorrow,
    time: '16:00',
    duration: 2,
    description: 'Borboleta Fine Line',
    style: 'Fine Line',
    size: '5cm',
    bodyLocation: 'Costela',
    totalValue: 400,
    depositPaid: 100,
    status: 'pending_confirmation',
    paymentStatus: 'approved',
    financialStatus: 'regular',
  },
  {
    id: 'a3',
    studioId: 's2',
    clientId: 'c3',
    date: today,
    time: '10:00',
    duration: 2,
    description: 'Caveira Old School - Panturrilha',
    style: 'Old School',
    size: '10cm',
    bodyLocation: 'Panturrilha',
    totalValue: 600,
    depositPaid: 150,
    status: 'completed',
    paymentStatus: 'approved',
    financialStatus: 'regular',
  },
  {
    id: 'a4',
    studioId: 's1',
    clientId: 'c1',
    date: today,
    time: '18:00',
    duration: 1,
    description: 'Retoque Letreiro',
    totalValue: 200,
    depositPaid: 50,
    status: 'cancelled',
    paymentStatus: 'approved',
    financialStatus: 'Compensação de Agenda',
  },
]
