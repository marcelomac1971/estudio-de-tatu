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

  const handleToggleStatus = (studio: any) => {
    updateStudio({ ...studio, status: studio.status === 'active' ? 'inactive' : 'active' })
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
                <TableHead>Localização</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>MRR (Plano)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studios.map((studio) => (
                <TableRow
                  key={studio.id}
                  className="border-border transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-medium">{studio.name}</TableCell>
                  <TableCell className="text-muted-foreground">{studio.location}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {studio.contactEmail}
                    <br />
                    {studio.contactPhone}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">R$ {studio.mrr || 0}</TableCell>
                  <TableCell>
                    <Badge
                      variant={studio.status === 'active' ? 'secondary' : 'destructive'}
                      className={
                        studio.status === 'active'
                          ? 'bg-secondary/10 text-secondary hover:bg-secondary/20 border-none'
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-none'
                      }
                    >
                      {studio.status === 'active' ? 'Ativo' : 'Inativo'}
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
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(studio)}
                          className={
                            studio.status === 'active'
                              ? 'text-destructive focus:text-destructive'
                              : 'text-secondary focus:text-secondary'
                          }
                        >
                          {studio.status === 'active' ? 'Desativar Estúdio' : 'Ativar Estúdio'}
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
