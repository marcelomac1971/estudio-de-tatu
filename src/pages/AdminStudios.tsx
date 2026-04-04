import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, MoreHorizontal } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminStudios() {
  const { studios, updateStudio } = useAppStore()
  const [editingStudio, setEditingStudio] = useState<any>(null)

  const handleStatusChange = (studio: any, newStatus: string) => {
    updateStudio({ ...studio, status: newStatus })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none'
      case 'expiring':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-none'
      case 'grace_period':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-none'
      case 'suspended':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none'
      case 'reactivated':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none'
      default:
        return 'bg-muted text-muted-foreground border-none'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo'
      case 'expiring':
        return 'Expirando'
      case 'grace_period':
        return 'Grace Period'
      case 'suspended':
        return 'Suspenso'
      case 'reactivated':
        return 'Reativado'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estúdios Parceiros</h2>
          <p className="text-muted-foreground mt-1">Gerencie os tenants da plataforma SaaS.</p>
        </div>
        <Button className="shadow-lg">
          <Plus className="size-4 mr-2" /> Novo Estúdio
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 shadow-elevation">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Nome do Estúdio</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Status SaaS</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studios.map((studio) => (
                <TableRow
                  key={studio.id}
                  className="border-border transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-medium">
                    {studio.name}
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {studio.contactEmail}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    R$ {studio.mrr || 0}/mês
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    Vence em:
                    <br />
                    {studio.billingCycleEnd || 'N/D'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(studio.status)}>
                      {getStatusLabel(studio.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingStudio(studio)}>
                          <Edit className="size-4 mr-2" /> Editar Dados
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(studio, 'active')}>
                          Marcar como Ativo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(studio, 'grace_period')}
                        >
                          Marcar Grace Period (3 dias)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(studio, 'suspended')}
                          className="text-red-500"
                        >
                          Suspender Acesso
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingStudio} onOpenChange={() => setEditingStudio(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Estúdio</DialogTitle>
          </DialogHeader>
          {editingStudio && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={editingStudio.name} className="bg-background" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  defaultValue={editingStudio.location}
                  className="bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail de Contato</Label>
                <Input
                  id="email"
                  defaultValue={editingStudio.contactEmail}
                  className="bg-background"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudio(null)}>
              Cancelar
            </Button>
            <Button onClick={() => setEditingStudio(null)}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
