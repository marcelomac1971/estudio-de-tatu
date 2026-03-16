import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('overflow-hidden border-border/50 bg-card/50 backdrop-blur', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 rounded-md">
            <Icon className="size-4 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{value}</h2>
          {trend && (
            <span
              className={cn('text-xs font-medium', trendUp ? 'text-secondary' : 'text-destructive')}
            >
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
