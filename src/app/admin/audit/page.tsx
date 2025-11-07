import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

async function getAuditEvents() {
  return prisma.auditEvent.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { actor: true },
  })
}

export default async function AdminAuditPage() {
  const events = await getAuditEvents()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Audit Log</h2>
        <p className="text-muted-foreground">Recent administrative actions</p>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge>{event.action}</Badge>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{event.actor?.email || 'System'}</span>
                      {' '}{event.action.toLowerCase()}{' '}
                      <span className="font-medium">{event.entity}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No audit events yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
