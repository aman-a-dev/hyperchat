# npm install @better-auth/prisma-adapter

npm install @types/pg --save-dev
npm install @prisma/adapter-pg pg
npx prisma init --output ../src/generated/prisma

npx prisma migrate dev --name init
npx prisma generate