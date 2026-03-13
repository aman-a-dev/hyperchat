import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}

export function randomHiEmoji() {
   const emojiArr = ['👋', '✋️', '😁', '🤟', '🖐', '🙋‍♂️', '🙋‍♀️']
   const randomIndex = Math.floor(Math.random() * emojiArr.length) + 1
   return emojiArr.slice(randomIndex, randomIndex + 1).toString()
}
