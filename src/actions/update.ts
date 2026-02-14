'use server'

import { authClient } from '@/lib/auth-client'
import { revalidatePath } from 'next/cache'

export async function updatePersonalDetails(formData: FormData) {
  try {
    // Only include fields that were actually changed
    const updates: Record<string, string> = {}
    
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const job = formData.get('job') as string
    const country = formData.get('country') as string
    
    if (name) updates.name = name
    if (bio !== undefined) updates.bio = bio
    if (job !== undefined) updates.job = job
    if (country !== undefined) updates.country = country
    
    const { error } = await authClient.updateUser(updates)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    revalidatePath('/settings/account')
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    }
  }
}

export async function updateAvatarAction(formData: FormData) {
  try {
    const file = formData.get('avatar') as File
    
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Convert file to base64 for Better Auth
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Image}`

    // Update user with new image
    const { error } = await authClient.updateUser({
      image: dataUrl
    })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/settings/account')
    return { success: true, imageUrl: dataUrl }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update avatar' 
    }
  }
}

export async function updateEmailAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    
    const { error } = await authClient.changeEmail({
      newEmail: email,
      callbackURL: '/settings/account'
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update email' 
    }
  }
}

export async function updatePasswordAction(formData: FormData) {
  try {
    const currentPassword = formData.get('current-password') as string
    const newPassword = formData.get('new-password') as string
    
    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update password' 
    }
  }
}