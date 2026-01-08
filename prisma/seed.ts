import { prisma } from '../src/lib/prisma.ts'

async function main() {
  const updatedUser = await prisma.user.update({
  where: {
    email: 'goku@gmail.com',
  },
  data: {
    job: 'Full Stack Web Developer',
  },
});
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async e => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })
