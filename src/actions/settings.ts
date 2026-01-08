// app/actions/settings.ts (or keep in utilities but mark as server-only)
'use server'

import { prisma } from '@/lib/prisma'
import { authClient } from '@/lib/auth-client'

type ChangeSettingsInput = {
   avatar?: string
   name?: string
   email?: string
   bio?: string
   job?: string
   country?: string
}

export async function updateUserDataSettings(data: ChangeSettingsInput) {
   const { data: session } = await authClient.getSession()

   if (!session?.user?.email) {
      throw new Error('Unauthorized: No active session found')
   }

   const updatedUser = await prisma.user.update({
      where: {
         email: session.user.email
      },
      data: {
         ...data
      }
   })

   return updatedUser
}