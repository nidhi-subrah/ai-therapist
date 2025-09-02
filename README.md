# TheraMind- Your Personalized AI Therapist

An AI-powered mental health coach and therapist application built with Next.js 14, featuring chat therapy, daily mood check-ins, and progress tracking.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 App Router with TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Node.js with Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js (credentials provider)
- **AI Integration**: Gemini API with streaming chat
- **Data Validation**: Zod schemas
- **Charts & Analytics**: Recharts for progress visualization
- **Utilities**: bcrypt, lucide-react, class-variance-authority, clsx, date-fns

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-therapist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   - `NEXTAUTH_SECRET`: Generate a random string for NextAuth
   - `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
   - `MONGODB_URI`: Your MongoDB connection string
   - `OPENAI_API_KEY`: Your OpenAI API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤝 Collaboration Rules

**Important**: This project uses a simplified workflow for small team collaboration.

### Branch Strategy
- **Main branch only**: We work directly on the `main` branch
- **No feature branches**: All changes go directly to main
- **Sequential editing**: Only one person edits at a time

### Workflow
1. **Before starting work**:
   ```bash
   git pull origin main
   ```

2. **Make your changes** and commit frequently:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. **After finishing work**:
   ```bash
   git push origin main
   ```

### Best Practices
- Always pull before starting work
- Commit frequently with clear messages
- Push when you're done with your session
- Communicate with your collaborator about when you're working
- Test your changes before pushing

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   └── utils.ts           # shadcn/ui utilities
└── components/            # Reusable UI components (to be added)
```

## 🎯 Features

- **AI Chat Therapy**: Streaming conversations with OpenAI-powered therapist
- **Daily Mood Check-ins**: Track emotional patterns over time
- **Progress Tracking**: Visualize mental health journey with charts
- **User Authentication**: Secure login system with NextAuth
- **Responsive Design**: Mobile-first approach with TailwindCSS

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 License

This project is private and proprietary.

## 🆘 Support

For questions or issues, please contact your team members directly.
