import { protectedProcedure } from '~/server/trpc/trpc'
import { z } from 'zod'
import { toDataURL } from 'qrcode'
import { randomUUID } from 'crypto'
import { env } from '~/env/server.mjs'
import eventCollection from '~/server/db/collections/EventCollection'
import { Timestamp } from 'firebase/firestore'
import userCollection from '~/server/db/collections/UserCollection'
import logCollection from '~/server/db/collections/LogCollection'

export const createEvent = protectedProcedure
  .input(
    z.object({
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      departments: z.array(z.string()),
      attendees: z.array(z.string()),
      isQrRequired: z.boolean(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      let qr_code: string | undefined
      const id = randomUUID()

      if (input.isQrRequired) {
        qr_code = await toDataURL(`${env.DOMAIN}/events/${id}`)
      }

      const users = await Promise.all(
        input.attendees.map(async (attendee) => {
          const data = await userCollection.getById(attendee)
          return {
            name: data.name,
            id: data.id as string,
            attended: false,
            department: data.department,
            role: data.role,
          }
        })
      )

      await eventCollection.add({
        attendees: 0,
        endDate: Timestamp.fromDate(input.endDate),
        hasStarted: false,
        invitedAttendees: users,
        name: input.name,
        startDate: Timestamp.fromDate(input.startDate),
        qrCode: qr_code || '',
      })
    } catch (e) {
      await logCollection.add({
        createdAt: Timestamp.fromDate(new Date()),
        level: 'INFO',
        description: (e as Error).message,
        title: 'Create event failed',
      })
    }
  })
