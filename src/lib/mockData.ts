export type Client = {
  id: string
  name: string
  phone: string
  avatar: string
  history: string[]
  healthAlerts: string[]
  totalSpent: number
}

export type Appointment = {
  id: string
  clientId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  duration: number // hours
  description: string
  totalValue: number
  depositPaid: number
  status: 'confirmed' | 'pending' | 'completed'
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
  },
]

// Helper to get today's date in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientId: 'c1',
    date: today,
    time: '14:00',
    duration: 3,
    description: 'Fechamento de braço - Lobo (Sessão 2)',
    totalValue: 900,
    depositPaid: 200,
    status: 'confirmed',
  },
  {
    id: 'a2',
    clientId: 'c3',
    date: today,
    time: '10:00',
    duration: 2,
    description: 'Caveira Old School - Panturrilha',
    totalValue: 600,
    depositPaid: 150,
    status: 'completed',
  },
]
