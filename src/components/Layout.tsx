import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  Calendar,
  Home,
  MessageSquare,
  Settings as SettingsIcon,
  Users,
  BarChart3,
  ChevronsUpDown,
  Building2,
  ShieldCheck,
  LogOut,
  Cloud,
} from 'lucide-react'
import { Button } from './ui/button'
import useAppStore from '@/stores/useAppStore'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { authUser, role, studios, currentStudioId, setCurrentStudioId, logout } = useAppStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentStudio = studios.find((s) => s.id === currentStudioId)

  const studioNavItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Atendimento', path: '/conversas', icon: MessageSquare },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Relatórios', path: '/relatorios', icon: BarChart3 },
    { name: 'Configurações', path: '/configuracoes', icon: SettingsIcon },
  ]

  const adminNavItems = [
    { name: 'Visão Geral (SaaS)', path: '/admin', icon: BarChart3 },
    { name: 'Estúdios Parceiros', path: '/admin/estudios', icon: Building2 },
  ]

  const navItems = role === 'admin' ? adminNavItems : studioNavItems

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border">
          <SidebarHeader className="border-b border-border p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="w-full justify-between hover:bg-accent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <div className="flex items-center gap-2 overflow-hidden w-full">
                        <div className="size-8 rounded-md bg-primary flex items-center justify-center font-bold text-primary-foreground shrink-0 shadow-sm">
                          {role === 'admin' ? (
                            <ShieldCheck className="size-4" />
                          ) : (
                            currentStudio?.name.charAt(0)
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none truncate text-left">
                          <span className="font-bold text-sm truncate">
                            {role === 'admin' ? 'Super Admin' : currentStudio?.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate uppercase">
                            {role === 'admin' ? 'Plataforma' : 'Studio Isolado'}
                          </span>
                        </div>
                      </div>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" side="bottom">
                    {role === 'admin' ? (
                      <DropdownMenuItem disabled>Modo Global</DropdownMenuItem>
                    ) : (
                      studios.map((s) => (
                        <DropdownMenuItem
                          key={s.id}
                          onClick={() => setCurrentStudioId(s.id)}
                          className="cursor-pointer"
                        >
                          {s.name}{' '}
                          {s.id === currentStudioId && (
                            <span className="ml-auto flex size-2 rounded-full bg-primary" />
                          )}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.name}
                  >
                    <Link to={item.path} className="flex items-center gap-2 w-full">
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-3">
                <h1 className="text-sm font-medium text-muted-foreground">
                  {role === 'admin'
                    ? 'Gestão da Plataforma'
                    : `Dashboard - ${currentStudio?.name || 'Estúdio'}`}
                </h1>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 shadow-sm animate-fade-in cursor-help"
                  title={`Conectado a: ${import.meta.env.VITE_POCKETBASE_URL || 'Local'}`}
                >
                  <Cloud className="size-3.5" />
                  <span>Skip Cloud Ativo</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hidden sm:flex"
              >
                <Bell className="size-5" />
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium leading-none">
                    {authUser?.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {role === 'admin' ? 'Super Admin' : 'Studio Partner'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="size-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4 mr-2" /> Sair do Sistema
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-card/30 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
