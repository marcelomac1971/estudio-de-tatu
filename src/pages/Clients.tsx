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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/useAppStore'
import { AlertTriangle, ImageIcon, User, Image as IconImage, FileCheck, Camera } from 'lucide-react'

export default function Clients() {
  const { clients } = useAppStore()
  const [selectedClient, setSelectedClient] = useState<any>(null)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Banco de Clientes</h2>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>Status Saúde</TableHead>
                <TableHead>Termos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell className="font-medium flex items-center gap-3">
                    <img src={client.avatar} alt="avatar" className="size-8 rounded-full" />
                    {client.name}
                  </TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>R$ {client.totalSpent}</TableCell>
                  <TableCell>
                    {client.healthAlerts.length > 0 ? (
                      <Badge
                        variant="destructive"
                        className="bg-destructive/20 text-destructive border-destructive/30"
                      >
                        <AlertTriangle className="size-3 mr-1" /> Alerta
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-border">
                        Limpo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {client.healthDataConsent && (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-green-500 border-green-500/30"
                          title="LGPD Aceita"
                        >
                          LGPD
                        </Badge>
                      )}
                      {client.imageRights && (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-primary border-primary/30"
                          title="Uso de Imagem Autorizado"
                        >
                          Imagem
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="sm:max-w-[500px] border-border bg-card">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img
                    src={selectedClient.avatar}
                    className="size-12 rounded-full ring-2 ring-primary/20"
                    alt="avatar"
                  />
                  <div>
                    <span className="text-xl">{selectedClient.name}</span>
                    <p className="text-sm text-muted-foreground font-normal">
                      {selectedClient.phone}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-3 border border-border flex items-start gap-3">
                    <FileCheck className="size-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Consentimento LGPD</p>
                      <p className="text-sm font-medium">
                        {selectedClient.healthDataConsent ? 'Aceito Digitalmente' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border flex items-start gap-3">
                    <Camera className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Uso de Imagem</p>
                      <p className="text-sm font-medium">
                        {selectedClient.imageRights ? 'Autorizado' : 'Não Autorizado'}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedClient.healthAlerts.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 animate-shake">
                    <h4 className="flex items-center gap-2 text-destructive font-bold text-sm mb-2">
                      <AlertTriangle className="size-4" /> FICHA MÉDICA - ATENÇÃO
                    </h4>
                    <ul className="list-disc list-inside pl-4 text-sm text-destructive-foreground">
                      {selectedClient.healthAlerts.map((alert: string, i: number) => (
                        <li key={i}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedClient.referenceType && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                      <IconImage className="size-4" /> Referência Visual
                    </h4>
                    <div className="bg-background rounded-lg p-4 border border-border flex items-start gap-4">
                      {selectedClient.referenceImage && (
                        <img
                          src={selectedClient.referenceImage}
                          alt="Ref"
                          className="size-20 rounded-md object-cover border border-border bg-muted shrink-0"
                        />
                      )}
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {selectedClient.referenceType}
                        </Badge>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Modelo anexado pelo cliente durante a triagem automática.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                    <User className="size-4" /> Histórico Financeiro
                  </h4>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <p className="text-sm">Total Investido no Studio:</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      R$ {selectedClient.totalSpent}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                    <ImageIcon className="size-4" /> Galeria de Trabalhos
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedClient.history.length > 0 ? (
                      selectedClient.history.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted">
                          <img
                            src={img}
                            alt="Tattoo history"
                            className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground col-span-3">
                        Nenhum trabalho finalizado ainda.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
