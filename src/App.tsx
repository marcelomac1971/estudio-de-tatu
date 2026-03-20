import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Chat from './pages/Chat'
import Agenda from './pages/Agenda'
import Clients from './pages/Clients'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'
import { AppProvider } from './stores/useAppStore'

const App = () => (
  <AppProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/conversas" element={<Chat />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProvider>
)

export default App
