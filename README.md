# HyperChat 🚀

An AI-powered realtime chat platform that revolutionizes digital communication with intelligent messaging, smart replies, and seamless collaboration tools.

# ✨ Features

## 🤖 AI-Powered Intelligence

· Smart Reply Suggestions: AI predicts and suggests responses in real-time
· Conversation Summarization: Get concise summaries of long conversations
· Sentiment Analysis: Understand the emotional tone of messages
· Context-Aware Responses: AI remembers conversation context
· AI profile picture generator 

## ⚡ Realtime Communication

· Instant Messaging: Real-time message delivery with WebSocket
· Typing Indicators: See when others are typing
· Read Receipts: Know when messages are read
· Online Status: Real-time user presence detection

## 🎨 User Experience

· Dark/Light Mode: Switch between themes
· Customizable Interface: Personalize your chat experience
· Keyboard Shortcuts: Work faster with shortcuts
· Emoji & Reactions: Express with rich emoji support
· Notifications: Customizable notification settings

## 🚀 Quick Start

Prerequisites

· Node.js 18+
· npm
· Mysql with prisma v7
· Nextjs v16
· better-auth

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/aman-a-dev/Hyperchat
cd Hyperchat
```

## 2. Install dependencies

```bash
npm install
```

1. Set up environment variables
2. create  .env file then
Edit .env with your configuration:

```env
# db
DATABASE_URL=databaur_url
DATABASE_USER=demo_user
DATABASE_PASSWORD=DemoPass123
DATABASE_NAME=chatDB
DATABASE_HOST=localhost
DATABASE_PORT=3306

# auth
BETTER_AUTH_SECRET=EYjVmITiTlckvbaQpnZNi3HifKHUHaEk
BETTER_AUTH_URL=http://localhost:3000

# google auth
AUTH_GOOGLE_CLIENT_ID=

AUTH_GOOGLE_CLIENT_SECRET=

# Email 
RESEND_API_KEY=

# chats
ABLY_API_KEY=
```


```bash
npm run dev
```

* Open your browser
   Navigate to http://localhost:3000

## 🔧 Tech Stack

# Frontend

· Next.js 15 - React framework with App Router
· TypeScript - Type safety and better developer experience
· Tailwind CSS - Utility-first CSS framework
· shadcn/ui - Reusable UI component library
· Framer Motion - Animation library

# Backend

· Next.js API Routes - Serverless functions
· Mysql - NoSQL database
· Prisma - Database ORM
· better-auth - Authentication
· Ably - Real-time communication

# AI & Services

· Vercel ai SDK