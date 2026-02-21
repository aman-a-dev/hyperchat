// auth
import { betterAuth } from 'better-auth'
// orm
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
// plugins
import { customSession } from 'better-auth/plugins'
// email
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.BETTER_AUTH_EMAIL || 'delivered@resend.dev'
const to = process.env.TEST_EMAIL || ''

export const auth = betterAuth({
   appName: 'Hyperchat',
   baseURL: process.env.BETTER_AUTH_URL,
   database: prismaAdapter(prisma, {
      provider: 'mysql'
   }),
   account: {
      accountLinking: {
         trustedProviders: ['google']
      }
   },
   emailAndPassword: {
      enabled: true,
      //requireEmailVerification: true,
      //sendOnSignUp: true,
      async sendResetPassword({ user, url }) {
         await resend.emails.send({
            from,
            to: user.email,
            subject: 'Reset your password',
            html: `<a href=${url}>Reset your password</a>`
         })
      }
   },
   socialProviders: {
      google: {
         clientId: process.env.AUTH_GOOGLE_CLIENT_ID || '',
         clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || ''
      }
   },
   advanced: {
      cookiePrefix: 'hyper-chat'
   },
   user: {
      deleteUser: {
         enabled: true
      },
      changeEmail: {
         enabled: true
      },
      changeEmail: {
         enabled: true,
         sendChangeEmailConfirmation: async (
            { user, newEmail, url, token },
            request
         ) => {
            await resend.emails.send({
               to: user.email,
               subject: 'Approve email change',
               text: `Click the link to approve the change to ${newEmail}: ${url}`
            })
         }
      },
      deleteUser: {
         enabled: true,
         sendDeleteAccountVerification: async (
            { user, url, token },
            request
         ) => {
            const { error } = await resend.emails.send({
               from,
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
      },
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
      },
      emailVerification: {
         sendVerificationEmail: async ({ user, url }) => {
            const { error } = await resend.emails.send({
               from,
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
               console.error('‼️ Failed to send verification email:', error)
            }
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
               country: user.country,
            },
            session
         }
      })
   ]
})
