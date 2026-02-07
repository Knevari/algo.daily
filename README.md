# AlgoDaily 🦉

> **Master Technical Interviews, Two Problems at a Time.**

AlgoDaily is a gamified coding interview preparation platform. It focuses on consistency through a streak system, curated daily problems, and a seamless developer experience.

![Dashboard Preview](/public/dashboard-preview.png)

## ✨ Features

- **Daily Duo**: A curated pair of problems every day.
- **Linear Progression**: Strict daily limits to prevent burnout and ensure long-term retention.
- **Streak System**: Gamified consistency tracking.
- **Live Code Compiler**: Integrated Monaco Editor with persistent **Vim Mode**.
- **AI Code Hints**: Conceptual nudges to help solve tough problems without spoiling solutions (O(1) hints).
- **Leaderboards**: Compete with other users globally.
- **Curriculum Track**: Guided path through data structures and algorithms.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma](https://www.prisma.io/) + SQLite (Dev) / Postgres (Prod)
- **Auth**: [NextAuth.js](https://next-auth.js.org/) (GitHub Provider)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **PWA**: Fully installable Progressive Web App

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/algodaily.git
    cd algodaily
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy the example env file and fill in your credentials:
    ```bash
    cp .env.example .env
    ```
    *You will need a GitHub OAuth App for NextAuth and a `DATABASE_URL` (defaults to local SQLite).*

4.  **Database Setup**
    ```bash
    npx prisma db push
    npm run prisma:seed  # Seeds the curriculum data
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🧪 Testing

We use **Jest** for unit tests and **Playwright** for End-to-End (E2E) testing.

### Unit Tests
Run the test suite for components and utilities:
```bash
npm run test
```

### E2E Tests
Run the end-to-end user flow tests:
```bash
npm run test:e2e
```

## 📂 Project Structure

- `src/pages`: Next.js pages and API routes.
- `src/components`: Reusable UI components (Stats, Editors, Cards).
- `src/lib`: Utilities (Database, Test Runner, Sounds).
- `prisma`: Database schema and seed scripts.

## 🎨 Design System

The UI is built on a "Deep Space" theme:
- **Background**: `#05050A` (Deep Black)
- **Primary Accent**: `#D946EF` (Neon Fuchsia)
- **Secondary Accent**: `#06B6D4` (Cyan)
- **Typography**: `Inter` (UI) + `JetBrains Mono` (Code/Data)



---
*Built with ❤️ by [Knevari](https://github.com/knevari)*
