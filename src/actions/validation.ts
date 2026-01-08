import { toast } from 'sonner'

const validateEmail = email => {
   return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
}

export function validateSignUp(name, email, password) {
   if (!name || !email || !password) {
      toast.error('Missing Fields', { description: 'All inputs are required.' })
      return false
   }

   if (name.trim().length < 2) {
      toast.error('Invalid Name', {
         description: 'Name must be at least 2 characters.'
      })
      return false
   }

   if (!validateEmail(email)) {
      toast.error('Invalid Email', {
         description: 'Please enter a valid email address.'
      })
      return false
   }

   if (password.length < 8) {
      toast.error('Weak Password', {
         description: 'Password must be at least 8 characters long.'
      })
      return false
   }

   return true
}

export function validateSignIn(email, password) {
   if (!email || !password) {
      toast.error('Missing Fields', {
         description: 'Email and password are required.'
      })
      return false
   }

   if (!validateEmail(email)) {
      toast.error('Invalid Email', {
         description: 'Please enter a valid email format.'
      })
      return false
   }

   return true
}

