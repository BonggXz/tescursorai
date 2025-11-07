import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { FileText } from 'lucide-react'

async function getAuditLogs() {
  return await prisma.auditEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { actor: true },
  })
}

export default async function AdminAuditPage() {
  const logs = await getAuditLogs()

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-600 bg-green-50'
      case 'UPDATE':
        return 'text-blue-600 bg-blue-50'
      case 'DELETE':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audit Log</h1>
        <p className="text-muted-foreground">Track all administrative actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mt-0.5">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                      <span className="font-medium">{log.entity}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {log.actor?.email || 'System'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(log.createdAt)}
                    </p>
                    {log.diff && log.diff !== '{}' && (
                      <pre className="text-xs bg-slate-50 p-2 rounded mt-2 max-w-xl overflow-x-auto">
                        {log.diff}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No audit logs yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
