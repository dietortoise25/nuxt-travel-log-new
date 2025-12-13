# Nuxt Travel Log

A modern travel logging application built with Nuxt 4, featuring GitHub OAuth authentication and location tracking.

## ✨ Features

- 🔐 **GitHub OAuth Authentication** - Secure login with GitHub account
- 📍 **Location Tracking** - Record precise coordinates of travel destinations
- 🌙 **Dark/Light Theme** - Support for DaisyUI theme switching
- 📱 **Responsive Design** - Optimized for all device sizes
- 🗂️ **Sidebar Navigation** - Collapsible dashboard sidebar
- 🚀 **Modern Tech Stack** - Built with Nuxt 4 and latest frontend technologies

## 🛠️ Tech Stack

### Frontend

- **Nuxt 4** - Modern Vue.js full-stack framework
- **Vue 3** - Using Composition API
- **TypeScript** - Full type safety throughout
- **Tailwind CSS v4** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind
- **Pinia** - Vue state management
- **@vee-validate/zod** - Form validation
- **@nuxt/icon** - Icon management

### Backend

- **SQLite/Turso** - Lightweight distributed database
- **Drizzle ORM** - Type-safe database ORM
- **Better Auth** - Modern authentication solution
- **LibSQL** - SQLite-compatible database client

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Environment Configuration

Create a `.env` file:

```env
NODE_ENV=development
TURSO_DATABASE_URL=http://127.0.0.1:8080
TURSO_AUTH_TOKEN=123456
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
AUTH_GITHUB_CLIENT_ID=your-github-client-id
AUTH_GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Start Development Server

```bash
pnpm dev
```

This will start both the Nuxt frontend server and Turso database concurrently.

### Start Database Separately

```bash
pnpm dev:db
```

## 📱 Usage

1. **First Visit** - Click "Sign in with GitHub" button
2. **Authorize Login** - Complete OAuth authorization with your GitHub account
3. **Record Locations** - Add new travel destinations in the dashboard
4. **Manage Records** - View and manage all your travel logs

## 📁 Project Structure

```
├── app/                 # Frontend code
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── layouts/        # Layout components
│   ├── stores/         # Pinia state management
│   └── assets/         # Static assets
├── server/             # Backend code
│   ├── api/           # API routes
│   ├── middleware/    # Server middleware
│   ├── lib/           # Library files
│   └── db/            # Database related
├── shared/             # Shared utilities
└── public/             # Public static files
```

## 🔧 Development Commands

```bash
pnpm dev              # Start development server (frontend + database)
pnpm dev:db           # Start database only
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run ESLint checks
pnpm lint:fix         # Fix ESLint issues automatically
```

## 💾 Database Design

The application uses the following main data tables:

- **users** - GitHub OAuth user information
- **locations** - Travel destination information (coordinates, name, etc.)
- **location_logs** - Visit records (user, location, timestamp)
- **location_log_images** - Location image attachments

## 🌐 Deployment

### Build Application

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

This is a modern travel logging application built with the latest tech stack, providing a complete user experience and developer-friendly code structure.
