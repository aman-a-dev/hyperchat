import Ably from 'ably'

export const ablyServer = new Ably.Rest({
   key: process.env.ABLY_API_KEY!
})
