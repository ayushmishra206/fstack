# Fstack App

This project is a full-stack application featuring:
- A **GraphQL backend** (Node.js, Apollo Server, JWT authentication, bcrypt)
- A **React frontend** (Vite, Apollo Client, Tailwind CSS)

## Project Structure

```
/graphql-backend   # Node.js GraphQL API
/tail-manage       # React frontend (Vite + Tailwind)
```

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   cd graphql-backend
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file in `/graphql-backend`:
     ```
     JWT_SECRET=your-very-secret-key
     ```

3. **Start the backend (with auto-reload):**
   ```sh
   npm run dev
   ```
   *(Requires `nodemon` in your devDependencies)*

### Frontend

1. **Install dependencies:**
   ```sh
   cd tail-manage
   npm install
   ```

2. **Start the frontend:**
   ```sh
   npm run dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port Vite shows).

## Features

- **Register & Login** with JWT authentication
- **GraphQL API** for user management
- **Styled with Tailwind CSS**
- **Hot reload** for both frontend and backend

## Development

- Backend changes auto-reload with `nodemon`
- Frontend uses Vite for fast refresh

## License

MIT

---

**Feel free to contribute or open issues!**