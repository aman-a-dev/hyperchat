'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Field,
  FieldLabel,
  FieldLegend
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sparkles, UploadCloud } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { validateImage } from '@/actions/validation'
import { updateAvatarAction } from '@/actions/update'

interface AvatarOperationProps {
  session: {
    user: {
      name: string
      image?: string | null
    }
  }
  onAvatarUpdated?: (newImageUrl: string) => void
}

export function AvatarOperation({ session, onAvatarUpdated }: AvatarOperationProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState(session?.user?.image || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { valid, error } = validateImage(file)
    if (!valid) {
      toast.error(error)
      e.target.value = ''
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    // Create preview
    const url = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(url)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Please choose an image before saving.')
      return
    }

    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('avatar', selectedFile)

    try {
      const result = await updateAvatarAction(formData)
      
      if (result.success && result.imageUrl) {
        setCurrentImage(result.imageUrl)
        onAvatarUpdated?.(result.imageUrl)
        toast.success('Profile picture updated successfully')
        
        // Reset file input
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        toast.error('Update failed', {
          description: result.error || 'An error occurred'
        })
      }
    } catch (err) {
      toast.error('An Error Occurred', {
        description: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='p-5'>
      <Field>
        <FieldLegend className='text-center'>
          Update your Avatar
        </FieldLegend>

        <FieldLabel
          htmlFor='avatar-upload'
          className='flex items-center justify-center relative cursor-pointer group'
        >
          <div className='inset-0 bg-background/80 absolute flex items-center justify-center flex-col z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[30%/30%]'>
            <UploadCloud className='size-8' />
            <span className='text-sm font-medium'>Click to upload</span>
          </div>

          <Avatar className='rounded-[30%/30%] h-36 w-36 border-2 border-border group-hover:border-primary transition-colors'>
            <AvatarImage 
              src={previewUrl || currentImage} 
              className="object-cover"
            />
            <AvatarFallback className='rounded-[30%/30%] text-2xl'>
              {session?.user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </FieldLabel>

        <Input
          ref={fileInputRef}
          id='avatar-upload'
          type='file'
          name='avatar'
          accept='image/*'
          onChange={handleFileChange}
          className='sr-only'
          disabled={isLoading}
        />

        <div className='text-xs text-center text-muted-foreground mt-1'>
          Max file size: 5MB • JPG, PNG, GIF
        </div>

        <hr className='my-4' />

        <div className='flex flex-col gap-2'>
          <Link href='/ai/profile' className='w-full'>
            <Button type='button' variant="outline" className='w-full' disabled={isLoading}>
              <Sparkles className='mr-2 size-4' />
              Generate AI Avatar
            </Button>
          </Link>

          <Button 
            type='submit' 
            disabled={isLoading || !selectedFile}
            className='w-full'
          >
            {isLoading ? <Spinner className='mr-2' /> : <UploadCloud className='mr-2 size-4' />}
            {isLoading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </div>
      </Field>
    </form>
  )
}