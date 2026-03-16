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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Calendar, Home, MessageSquare, Settings, Users } from 'lucide-react'
import { Button } from './ui/button'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Conversas', path: '/conversas', icon: MessageSquare, badge: '3' },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Configurações', path: '/configuracoes', icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border">
          <SidebarHeader className="flex h-14 items-center justify-center border-b border-border px-4 py-0">
            <div className="flex items-center gap-2 overflow-hidden w-full">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground shrink-0">
                N
              </div>
              <span className="font-bold text-lg truncate group-data-[collapsible=icon]:hidden">
                Studio Noir
              </span>
            </div>
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
                Painel de Automação
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-pulse-ring" />
              </Button>
              <div className="flex items-center gap-2 pl-4 border-l border-border">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium leading-none">Alex Artista</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
                <Avatar className="size-8">
                  <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=9" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
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
