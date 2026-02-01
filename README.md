# Round0 - AI-Powered Mock Interview Platform

Round0 is a comprehensive mock interview platform built with Next.js, Bun, and AI technologies. The platform allows candidates to practice technical and behavioral interviews with AI-powered assessment and feedback.

## 🎯 Overview

Round0 focuses exclusively on **mock interviews** for multiple role categories including:
- Software Engineering
- Data & Analytics
- Business (Product, Sales, Marketing)
- Other roles (QA, Finance, HR, Operations)

The platform features role-specific interview tools, difficulty levels, real-time AI assessment, and personalized mentoring.

## 🏗️ Architecture

This is a **Turborepo monorepo** using **Bun** as the package manager.

### Applications

#### 1. Admin Dashboard (`apps/admin-dashboard`)
- **Port:** 3001
- **Purpose:** Platform administration
- **Features:**
  - Create and manage mock interviews
  - Configure role categories and difficulty levels
  - View platform-wide analytics
  - Monitor candidate progress
  - Manage users and settings

#### 2. Candidate Dashboard (`apps/candidate-dashboard`)
- **Port:** 3002
- **Purpose:** Candidate interview experience
- **Features:**
  - Browse and discover mock interviews
  - Start mock interview sessions
  - Real-time AI interviewer with voice interaction
  - Role-specific tools:
    - Code editor (Monaco/CodeMirror) for engineering roles
    - Excalidraw whiteboard for system design
    - File upload for business roles
  - View detailed performance reports
  - AI mentor bot for personalized feedback
  - Track progress and improvement trends

#### 3. Backend (`apps/backend`)
- **Port:** 8080
- **Runtime:** Bun
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **AI Services:**
  - OpenAI GPT-4 (evaluation, mentoring, scoring)
  - ElevenLabs (voice-based interviews)
- **Storage:** AWS S3 (recordings, resumes)
- **Email:** AWS SES
- **Caching:** Redis

### Packages

- `@repo/typescript-config` - Shared TypeScript configurations
- `@repo/eslint-config` - Shared ESLint configurations

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **Bun** >= 1.2.16
- **PostgreSQL** database (Supabase recommended)
- **Redis** instance
- **OpenAI API key**
- **ElevenLabs API key**
- **AWS credentials** (S3, SES)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd round0
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:

Create `.env` files in each app directory:

**Backend** (`apps/backend/.env`):
```env
PORT=8080
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=...
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3002
```

**Admin Dashboard** (`apps/admin-dashboard/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
```

**Candidate Dashboard** (`apps/candidate-dashboard/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Set up the database:
```bash
cd apps/backend
bun prisma generate
bun prisma migrate dev
```

### Development

Run all applications in development mode:
```bash
bun run dev
```

This starts:
- Admin Dashboard on `http://localhost:3001`
- Candidate Dashboard on `http://localhost:3002`
- Backend API on `http://localhost:8080`

Run individual apps:
```bash
cd apps/admin-dashboard && bun run dev
cd apps/candidate-dashboard && bun run dev
cd apps/backend && bun run dev
```

### Build

Build all applications for production:
```bash
bun run build
```

### Production Deployment

Using PM2:
```bash
# Build all apps first
bun run build

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 logs
pm2 status
```

## 📋 Features

### Role-Specific Interview Tools

**Engineering & Data Roles:**
- Code editor with syntax highlighting
- Support for multiple programming languages
- Real-time AI code evaluation
- System design whiteboard (Excalidraw)

**Business & Other Roles:**
- Collaborative whiteboard
- File upload for presentations/documents
- Case study evaluation

### Difficulty Levels

- **Entry Level:** Basic concepts, foundational knowledge (0-2 years)
- **Mid Level:** Practical application, real-world scenarios (2-5 years)
- **Senior Level:** Architecture, leadership, complex problems (5-10 years)
- **Expert Level:** Strategic thinking, innovation, large-scale systems (10+ years)

### AI-Powered Features

1. **AI Interviewer:**
   - Voice-based interaction via ElevenLabs
   - Dynamic questioning based on role and difficulty
   - Real-time feedback and hints

2. **Automated Scoring:**
   - Multi-dimensional evaluation (technical skills, communication, reasoning)
   - Percentile scoring (ZeroScore)
   - Detailed performance breakdowns

3. **AI Mentor Bot:**
   - Context-aware coaching
   - Interview-specific feedback
   - Improvement suggestions
   - Progress tracking

### Analytics & Insights

**Admin Analytics:**
- Total mock interviews and attempts
- Completion rates and average scores
- Performance by role category
- Candidate leaderboards
- Time-series trends

**Candidate Progress:**
- Personal statistics and trends
- Score history across attempts
- Role-specific performance
- Improvement recommendations

## 🗂️ Project Structure

```
round0/
├── apps/
│   ├── admin-dashboard/          # Admin web interface
│   │   ├── app/(routes)/
│   │   │   ├── mockinterviews/   # Mock interview management
│   │   │   │   ├── create/       # Create new mock interview
│   │   │   │   ├── edit/[id]/    # Edit existing mock interview
│   │   │   │   └── analytics/    # Platform analytics
│   │   │   ├── dashboard/        # Admin dashboard home
│   │   │   ├── jobs/             # Real job management (legacy)
│   │   │   ├── candidates/       # Candidate management
│   │   │   └── recruiters/       # Recruiter management
│   │   ├── api/operations/       # API client functions
│   │   └── components/           # React components
│   │
│   ├── candidate-dashboard/      # Candidate web interface
│   │   ├── app/(routes)/
│   │   │   ├── dashboard/        # Candidate home with stats
│   │   │   ├── mockinterview/    # Mock interview discovery
│   │   │   ├── interview/        # Live interview room
│   │   │   ├── mentor/           # AI mentor coaching
│   │   │   └── reports/          # Performance reports
│   │   ├── components/
│   │   │   ├── join-interview.tsx          # Interview room UI
│   │   │   ├── code-ide.tsx                # Code editor
│   │   │   ├── excalidraw-wrapper.tsx      # Whiteboard
│   │   │   ├── mock-interview-stats.tsx    # Progress stats
│   │   │   └── attempt-history-card.tsx    # Attempt display
│   │   └── context/
│   │       └── conversation-context.tsx    # Interview state
│   │
│   └── backend/                  # Express API server
│       ├── src/
│       │   ├── controllers/      # Request handlers
│       │   │   ├── job_posting.controller.ts
│       │   │   ├── mockinterview.controller.ts
│       │   │   ├── interview.controller.ts
│       │   │   ├── mentor.controller.ts
│       │   │   └── ...
│       │   ├── services/         # Business logic
│       │   │   ├── mentor.ts     # AI mentor service
│       │   │   ├── scoring-engine.ts
│       │   │   └── ...
│       │   ├── lib/              # Utilities
│       │   │   ├── interview-token.ts      # JWT tokens
│       │   │   ├── round-specific-instruction.ts  # AI prompts
│       │   │   └── prisma.ts
│       │   ├── routers/          # Route definitions
│       │   ├── middlewares/      # Auth, validation
│       │   └── index.ts          # App entry point
│       └── prisma/
│           └── schema.prisma     # Database schema
│
├── packages/
│   ├── typescript-config/        # Shared TS configs
│   └── eslint-config/            # Shared linting configs
│
├── archived/
│   └── recruiter-dashboard/      # Deprecated (moved from apps/)
│
├── turbo.json                    # Turborepo configuration
├── package.json                  # Root package config
├── ecosystem.config.js           # PM2 deployment config
└── README.md                     # This file
```

## 🔑 Key Technologies

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Express.js, Bun runtime, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **AI/ML:** OpenAI GPT-4, ElevenLabs Voice AI
- **Real-time:** LiveKit WebRTC
- **Storage:** AWS S3, Redis cache
- **Deployment:** PM2 process manager
- **Monorepo:** Turborepo v2.5.4

## 📊 Database Schema

Key models:
- `user` - User authentication and roles (admin, candidate, recruiter)
- `candidate_profile` - Extended candidate information
- `job_description` - Mock interviews and job postings (with `is_mock` flag)
- `job_application` - Interview attempts and status
- `interview_session` - Overall interview session
- `interview_round` - Individual rounds with scores
- `message` - Interview conversation history
- `tool_result` - Code/design evaluation results
- `mentor_session` - AI mentoring sessions
- `mentor_message` - Mentor conversation history

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Candidate, Recruiter)
- Interview-specific tokens for secure session access
- Supabase Auth integration

## 🎨 UI Components

Built with:
- Radix UI primitives
- Shadcn/ui component library
- Lucide React icons
- Tailwind CSS v4
- Sonner toast notifications

## 📝 API Endpoints

### Mock Interview
- `POST /mockinterview/start_mockinterview` - Start new attempt
- `GET /mockinterview/get_mockinterviews` - List all mock interviews
- `GET /mockinterview/get_mockinterview_details_and_attempts` - Attempt history
- `GET /mockinterview/get_report` - Detailed performance report
- `GET /mockinterview/candidate_stats` - Personal statistics
- `GET /mockinterview/analytics` - Admin analytics (admin-only)

### Interview
- `POST /interview/verify` - Start interview round
- `POST /interview/end` - Complete interview round
- `POST /interview/evaluate-code` - AI code evaluation
- `POST /interview/evaluate-design` - AI design evaluation
- `POST /interview/message` - Save interview messages
- `POST /interview/tool-result` - Save tool execution results

### Mentor
- `POST /mentor/create-session` - Create mentor session
- `POST /mentor/message` - Send message to mentor
- `GET /mentor/get-sessions` - List mentor sessions
- `GET /mentor/get-messages` - Get session messages

### Job Posting (Admin)
- `POST /job_posting/create_mock_job` - Create mock interview
- `GET /job_posting/get_all_mock_jobs` - List all mock interviews
- `PUT /job_posting/update_mock_job_by_id` - Update mock interview
- `DELETE /job_posting/delete_mock_job_by_id` - Delete mock interview

## 🧪 Testing

```bash
# Type checking
bun run check-types

# Linting
bun run lint

# Format code
bun run format
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Submit a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Turborepo](https://turborepo.com/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- AI powered by [OpenAI](https://openai.com/) and [ElevenLabs](https://elevenlabs.io/)
