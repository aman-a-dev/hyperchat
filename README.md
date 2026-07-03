# Hyperchat 💬

A real-time communication chat application built with modern web technologies.

## Overview

Hyperchat is a full-stack real-time chat application that enables users to communicate instantly with low-latency message delivery. The application leverages cutting-edge technologies to provide a seamless and responsive user experience.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) - React framework for production
- **Backend**: Next.js API routes
- **Database**: [Prisma ORM](https://www.prisma.io/) - Type-safe database access
- **Authentication**: [Better Auth](https://better-auth.vercel.app/) - Modern authentication solution
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Real-time Communication**: [Ably](https://ably.io/) - Real-time messaging platform
- **Email**: [Resend](https://resend.com/) - Transactional email service
- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## Features

- ✨ Real-time messaging with WebSocket support
- 🤖 AI-powered smart reply suggestions
- 💬 Conversation summarization capabilities
- 😊 Sentiment analysis for conversations
- 🎨 Dark/Light mode theme switching
- 🔐 Secure authentication with Better Auth & Google OAuth
- 📱 Responsive and modern UI with Tailwind CSS
- 🎭 Emoji & reaction support
- 👁️ Read receipts and typing indicators
- 🔔 Customizable notifications
- 🌐 Real-time user presence detection
- ✍️ AI profile picture generator

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- MySQL database
- Prisma v7+
- Next.js v16+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aman-a-dev/hyperchat.git
cd hyperchat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=your-database-connection-string
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=chatDB
DATABASE_HOST=localhost
DATABASE_PORT=3306

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_CLIENT_ID=your-google-client-id
AUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
RESEND_API_KEY=your-resend-api-key

# Real-time Communication
ABLY_API_KEY=your-ably-api-key
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
hyperchat/
├── app/                    # Next.js app directory
├── components/             # Reusable React components
├── lib/                    # Utility functions and helpers
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── styles/                # CSS/styling
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
└── README.md              # This file
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to manage database

## Database Schema

This project uses Prisma ORM for database management. The schema is defined in `prisma/schema.prisma`.

### Key Commands

Update schema and run migrations:
```bash
npx prisma migrate dev
```

Generate Prisma client:
```bash
npx prisma generate
```

Open Prisma Studio:
```bash
npx prisma studio
```

## Authentication

The application uses **Better Auth** for authentication with support for:

- Email/Password authentication
- Google OAuth integration
- User session management
- Secure token handling

Configure your Google OAuth credentials in the `.env.local` file for OAuth functionality.

## Real-time Features

Real-time communication is powered by **Ably**, enabling:

- Instant message delivery
- Typing indicators
- Read receipts
- User presence updates
- Live notifications

## AI Features

The application includes AI-powered features for an enhanced chat experience:

- Smart reply suggestions using Vercel AI SDK
- Conversation sentiment analysis
- Automatic conversation summarization
- AI-generated profile pictures

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Issues & Support

If you encounter any issues or have questions, please open an [issue](https://github.com/aman-a-dev/hyperchat/issues) on GitHub.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - ORM for Node.js
- [Better Auth](https://better-auth.vercel.app/) - Authentication Solution
- [Ably](https://ably.io/) - Real-time Messaging
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI Integration
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

---

Built with ❤️ by [aman-a-dev](https://github.com/aman-a-dev)
