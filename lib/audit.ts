import { prisma } from "@/lib/prisma";

export async function createAuditEvent(
  actorId: string,
  entity: string,
  entityId: string,
  action: string,
  diff: any
) {
  try {
    await prisma.auditEvent.create({
      data: {
        actorId,
        entity,
        entityId,
        action,
        diff: JSON.stringify(diff),
      },
    });
  } catch (error) {
    console.error("Failed to create audit event:", error);
  }
}
