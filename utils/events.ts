import 'server-only'
import { db } from '@/db/db'
import { and, asc, count, desc, eq, ne, not } from 'drizzle-orm'
import { events, rsvps } from '@/db/schema'
import { delay } from './delay'

export const getEventsForDashboard = async (userId: string) => {
  await delay()

  const data = await db.query.events.findMany({
    where: eq(events.createdById, userId),
    columns: {
      id: true,
      name: true,
      startOn: true,
      status: true,
    },
    with: {
      rsvps: true,
    },
    limit: 5,
    // oldest one first
    orderBy: [asc(events.startOn)],
  })

  return data ?? []
}
