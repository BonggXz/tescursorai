import { prisma } from "@/lib/prisma";

export async function createAuditEvent(data: {
  actorId: string | null;
  entity: string;
  entityId: string;
  action: string;
  diff: string | null;
}) {
  await prisma.auditEvent.create({
    data,
  });
}
