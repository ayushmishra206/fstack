# Fstack - A Social Media Platform

## Current State
The project is a full-stack application with:

### Backend
- Node.js + Express server
- PostgreSQL database with Prisma ORM
- User authentication (register/login)
- Profile management
- REST API endpoints

### Frontend
- React + Vite for UI
- Tailwind CSS for styling
- React Router for navigation
- Responsive design
- Authentication forms
- Profile editing

### Development Tools
- Concurrent development servers (frontend + backend)
- Hot reload support
- Prisma Studio for database management
- ESLint for code quality

## Planned Features

### Core Features
- [ ] News feed with posts
- [ ] Create and edit posts
- [ ] Like and comment system
- [ ] Follow/unfollow users
- [ ] User profiles with posts and stats

### Enhanced Social Features
- [ ] Image uploads for posts
- [ ] User mentions (@username)
- [ ] Post sharing
- [ ] Hashtag support
- [ ] Direct messaging

### Technical Roadmap
- [ ] Password hashing (bcrypt)
- [ ] JWT authentication
- [ ] File upload system
- [ ] Real-time updates
- [ ] Feed pagination
- [ ] Search functionality

## Setup & Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation
1. Clone and install dependencies:
```bash
git clone <repository-url>
cd fstack
npm install
```

2. Set up database:
```bash
cd server
npx prisma migrate dev
```

3. Start development servers:
```bash
npm run dev
```

### Available Scripts
- `npm run dev` - Start frontend & backend
- `npm run dev:fe` - Frontend only
- `npm run dev:be` - Backend only
- `npm run build` - Production build
- `npm run preview` - Preview build

### Database Management
Launch Prisma Studio:
```bash
npx prisma studio
```
Access at http://localhost:5555

## Project Structure
```
fstack/
├── src/              # Frontend React code
│   ├── components/   # React components
│   ├── App.jsx      # Main React component
│   └── main.jsx     # Entry point
├── server/          # Backend
│   ├── src/         # Express server code
│   └── prisma/      # Database schema & migrations
└── public/          # Static assets
```

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## License
MIT