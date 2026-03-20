export type Client = {
  id: string
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
}

export type Appointment = {
  id: string
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
  financialStatus?: 'regular' | 'Compensação de Agenda'
  rescheduleLink?: string
}

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
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
  },
  {
    id: 'c2',
    name: 'Mariana Costa',
    phone: '+55 11 98888-2222',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    history: [],
    healthAlerts: [],
    totalSpent: 0,
  },
  {
    id: 'c3',
    name: 'Pedro Alves',
    phone: '+55 11 97777-3333',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    history: ['https://img.usecurling.com/p/200/200?q=skull%20tattoo&color=black'],
    healthAlerts: ['Pressão Alta (Controlada)'],
    totalSpent: 850,
    referenceType: 'Foto de parente',
    referenceImage: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=10',
    healthDataConsent: true,
    imageRights: false,
  },
]

// Helper to get today's date in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
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
    financialStatus: 'regular',
  },
  {
    id: 'a2',
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
    financialStatus: 'regular',
  },
  {
    id: 'a3',
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
    financialStatus: 'regular',
  },
  {
    id: 'a4',
    clientId: 'c3',
    date: today,
    time: '18:00',
    duration: 1,
    description: 'Retoque Letreiro',
    totalValue: 200,
    depositPaid: 50,
    status: 'cancelled',
    financialStatus: 'Compensação de Agenda',
  },
]
