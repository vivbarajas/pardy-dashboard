import 'server-only'
import { db } from '@/db/db'
import { attendees, events, rsvps } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { delay } from './delay'
import { memoize } from 'nextjs-better-unstable-cache'

export const getAttendeesCountForDashboard = memoize(
  async (userId: string) => {
    await delay()
    //   we want to select this field this field etc
    const counts = await db

      .select({
        // field - runs a sql query  that does de dupe these attended by id
        totalAttendees: sql`count(distinct ${attendees.id})`,
      })
      .from(events)
      .leftJoin(rsvps, eq(rsvps.eventId, events.id))
      .leftJoin(attendees, eq(attendees.id, rsvps.attendeeId))
      .where(eq(events.createdById, userId))
      .groupBy(events.id)
      .execute()
    const total = counts.reduce((acc, count) => acc + count.totalAttendees, 0)
    return total
  },
  {
    persist: true,
    revalidateTags: () => ['dashboard:attendees'],
    suppressWarnings: true,
    log: ['datacache', 'verbose'],
    logid: 'dashboard:attendees',
  }
)
