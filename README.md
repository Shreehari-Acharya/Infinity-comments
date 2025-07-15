
# Infinity-comments

This is a full-stack web application that allows users to post comments and engage in discussions in real-time. It features a NestJS backend, a Next.js frontend, and a PostgreSQL database.

## Features

- **User Authentication**: Users can sign up and log in to their accounts.
- **Real-time Comments**: Post and view comments in real-time without needing to refresh the page.
- **Nested Comments**: Reply to comments and create nested discussion threads.
- **Notifications (soon)**: Receive notifications when someone replies to your comment.

## Tech Stack

### Backend

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Prisma](https://www.prisma.io/) - A next-generation ORM for Node.js and TypeScript.
- [PostgreSQL](https://www.postgresql.org/) - A powerful, open source object-relational database system.
- [Redis](https://redis.io/) - An in-memory data structure store, used as a database, cache and message broker.
- [Socket.IO](https://socket.io/) - A library that enables real-time, bidirectional and event-based communication between the browser and the server.
- [BullMQ](https://bullmq.io/) - A fast and robust queue system for Node.js.

### Frontend

- [Next.js](https://nextjs.org/) - A React framework for building full-stack web applications.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom user interfaces.
- [Socket.IO Client](https://socket.io/docs/v4/client-initialization/) - The client-side library for Socket.IO.
- [Three.js](https://threejs.org/) - A 3D graphics library for creating and displaying animated 3D computer graphics in a web browser.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v22.10.x or later)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Shreehari-Acharya/Infinity-comments.git
   cd Infinity-comments
   ```

2. **Backend Setup:**

   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pnpm install
     ```
   - Start the database and Redis using Docker:
     ```bash
     docker-compose up -d
     ```
   - Apply database migrations:
     ```bash
     pnpm prisma migrate dev
     ```
   - Start the backend server:
     ```bash
     pnpm start:dev
     ```

3. **Frontend Setup:**

   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     pnpm install
     ```
   - Start the frontend development server:
     ```bash
     pnpm dev
     ```

### Usage

- Open your browser and navigate to `http://localhost:3000`.
- Sign up for a new account or log in with an existing one.
- Start posting comments and engaging in discussions.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

- **`backend/`**: Contains the NestJS application, including the API, database schema, and real-time services.
- **`frontend/`**: Contains the Next.js application, including the UI components, pages, and client-side logic.


