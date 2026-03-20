import { Outlet, Link, useLocation } from 'react-router-dom'
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
  Lock,
  BarChart3,
  ChevronsUpDown,
  Building2,
  ShieldCheck,
} from 'lucide-react'
import { Button } from './ui/button'
import useAppStore from '@/stores/useAppStore'

export default function Layout() {
  const location = useLocation()
  const {
    role,
    setRole,
    subscriptionStatus,
    setSubscriptionStatus,
    studios,
    currentStudioId,
    setCurrentStudioId,
  } = useAppStore()

  if (subscriptionStatus === 'inativo') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 animate-fade-in">
        <div className="max-w-md w-full border border-border/50 bg-card p-8 rounded-xl flex flex-col items-center text-center space-y-6 shadow-elevation">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="size-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Assinatura Expirada</h1>
            <p className="text-sm text-muted-foreground">
              O acesso aos recursos de automação, agenda e base de clientes do estúdio foi
              bloqueado.
            </p>
          </div>
          <Button
            onClick={() => setSubscriptionStatus('ativo')}
            variant="outline"
            className="w-full"
          >
            [Demo] Reativar Assinatura
          </Button>
        </div>
      </div>
    )
  }

  const currentStudio = studios.find((s) => s.id === currentStudioId)

  const studioNavItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Conversas', path: '/conversas', icon: MessageSquare, badge: '3' },
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
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground dark">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border">
          <SidebarHeader className="flex flex-col border-b border-border px-2 py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="w-full justify-between hover:bg-accent hover:text-accent-foreground group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden w-full">
                        <div className="size-8 rounded-md bg-primary flex items-center justify-center font-bold text-primary-foreground shrink-0 shadow-sm">
                          {role === 'admin' ? (
                            <ShieldCheck className="size-4" />
                          ) : (
                            currentStudio?.name.charAt(0) || 'S'
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none truncate group-data-[collapsible=icon]:hidden text-left">
                          <span className="font-bold text-sm truncate">
                            {role === 'admin' ? 'SaaS Admin' : currentStudio?.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate uppercase font-semibold tracking-wider">
                            {role === 'admin' ? 'Plataforma' : 'Multi-tenant'}
                          </span>
                        </div>
                      </div>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={8}>
                    {role === 'admin' ? (
                      <DropdownMenuItem disabled className="font-medium text-muted-foreground">
                        Modo Global
                      </DropdownMenuItem>
                    ) : (
                      studios.map((s) => (
                        <DropdownMenuItem
                          key={s.id}
                          onClick={() => setCurrentStudioId(s.id)}
                          className="cursor-pointer font-medium"
                        >
                          {s.name}
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
                    <Link to={item.path} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </span>
                      )}
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
              <h1 className="text-sm font-medium text-muted-foreground hidden sm:block">
                {role === 'admin'
                  ? 'Gestão da Plataforma Modern Noir'
                  : 'Painel de Automação do Estúdio'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground hidden sm:flex"
              >
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-pulse-ring" />
              </Button>
              <div className="flex items-center gap-2 pl-4 border-l border-border">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium leading-none">Alex Admin</p>
                  <p className="text-xs text-muted-foreground">
                    {role === 'admin' ? 'Plataforma Owner' : 'Studio Owner'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="size-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=9" />
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => setRole('admin')}
                      className={role === 'admin' ? 'bg-accent font-bold' : ''}
                    >
                      <ShieldCheck className="size-4 mr-2" /> Acessar como Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setRole('studio')}
                      className={role === 'studio' ? 'bg-accent font-bold' : ''}
                    >
                      <Building2 className="size-4 mr-2" /> Acessar como Studio
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
