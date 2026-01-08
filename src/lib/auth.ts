// auth
import { betterAuth } from 'better-auth'
// orm
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
// email
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
// plugins
import { customSession } from 'better-auth/plugins'

export const auth = betterAuth({
   baseURL: process.env.BETTER_AUTH_URL,
   database: prismaAdapter(prisma, {
      provider: 'mysql'
   }),
   account: {
		accountLinking: {
			enabled: true,
		}
	},
   emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendOnSignUp: true
   },
   socialProviders: {
      google: {
         accessType: 'offline',
         prompt: 'select_account consent',
         clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string
      }
   },
   advanced: {
      cookiePrefix: 'hyper-chat'
   },
   user: {
      changeEmail: {
         enabled: true
      },
      deleteUser: {
         enabled: true,
         sendDeleteAccountVerification: async (
            { user, url, token },
            request
         ) => {
            const { error } = await resend.emails.send({
               from: 'Hyper-Chat <onboarding@yourdomain.com>',
               to: user.email,
               subject: 'Delete Hyperchat account',
               html: `
        <div style="display:flex;justify-content:center;text-align:center;flex-direction: column;align-items:center">
          <h1 style="font-weight: bold;color: #cab300;">Delete Hyper-Chat Account ️🗑</h1>
          <p>Please click the link below 👇 to confirm Delete Account</p>
          <a href="${url}" style="background-color:#FFD700;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;max-width: 300px;">Verify my Email</a>
          <p><b>${user.email}</b> Delete my account</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        `
            })
         }
      }
   },
   emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
         const { error } = await resend.emails.send({
            from: 'Hyper-Chat <onboarding@hyper-chat.com>',
            to: user.email,
            subject: 'Verify your email address',
            html: `
        <div style="display:flex;justify-content:center;text-align:center;flex-direction: column;align-items:center">
          <h1 style="font-weight: bold;color: #cab300;">Welcome to Hyper-Chat ✋️</h1>
          <p>Please click the link below 👇 to verify your email address:</p>
          <a href="${url}" style="background-color:#FFD700;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;max-width: 300px;">Verify my Email</a>
          <p><b>${user.email}</b> is going  to verify</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        `
         })

         if (error) {
            console.error('Failed to send verification email:', error)
         }
      }
   },
   user: {
      additionalFields: {
         bio: {
            type: 'string',
            required: false,
            input: false
         },
         job: {
            type: 'string',
            required: false,
            input: false
         },
         country: {
            type: 'string',
            required: false,
            input: false
         }
      }
   },
   plugins: [
      customSession(async ({ user, session }) => {
         return {
            user: {
               ...user,
               bio: user.bio,
               job: user.job,
               country: user.country
            },
            session
         }
      })
   ]
})
