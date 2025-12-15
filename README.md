# Collaborative-Task-Manager

A full-stack, real-time task management application built with modern TypeScript best practices.
The app enables multiple users to collaborate on tasks with live updates, secure authentication, and a responsive dashboard.

🚀 Live Demo

Frontend: https://your-frontend-url.vercel.app

Backend API: https://your-backend-url.render.com

Socket Server: Integrated with backend

🎯 Features
🔐 Authentication & Authorization

Secure user registration & login

Password hashing using bcrypt

JWT-based authentication stored in HttpOnly cookies

Protected routes and role-aware access

User profile management (name updates)

📋 Task Management

Full CRUD for tasks

Task attributes:

Title (max 100 chars)

Description

Due Date

Priority (Low, Medium, High, Urgent)

Status (To Do, In Progress, Review, Completed)

Creator

Assigned User

⚡ Real-Time Collaboration (Socket.io)

Live updates when:

Task status changes

Task priority changes

Task assignment changes

Instant in-app notification when a task is assigned

Real-time sync across all connected users

📊 Dashboard & Data Exploration

Tasks assigned to the current user

Tasks created by the current user

Overdue tasks (based on due date)

Filtering by status and priority

Sorting by due date

Fully responsive UI (mobile + desktop)

🛠️ Tech Stack
Frontend

React (Vite) + TypeScript

Tailwind CSS

React Query (server state & caching)

React Hook Form + Zod (form handling & validation)

Socket.io-client

Backend

Node.js + Express + TypeScript

Prisma ORM

PostgreSQL

Socket.io

Zod (DTO validation)

JWT + bcrypt

Testing

Jest

Unit tests for core business logic and socket events

Deployment

Frontend: Vercel

Backend + DB: Render / Railway

🧠 Architecture Overview

The backend follows a clean, layered architecture to ensure maintainability and scalability.

Controller → Service → Repository → Database

Why This Architecture?

Clear separation of concerns

Easier testing of business logic

Scales well as features grow

Industry-standard backend structure

🗄️ Database Choice: PostgreSQL

Why PostgreSQL?

Strong relational data integrity (Users ↔ Tasks)

Enum support for priority & status

Referential constraints for creator/assignee

Excellent compatibility with Prisma

Suitable for production-grade systems

🧬 Prisma Schema (Core Models)
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Task {
  id           String   @id @default(uuid())
  title        String
  description  String
  dueDate      DateTime
  priority     Priority
  status       Status
  creatorId    String
  assignedToId String
  createdAt    DateTime @default(now())
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Status {
  TODO
  IN_PROGRESS
  REVIEW
  COMPLETED
}

🔐 Authentication Flow

User logs in

Server validates credentials

JWT issued and stored in HttpOnly cookie

Auth middleware validates token on protected routes

User context injected into request

⚡ Real-Time Events
Socket Events
Event	Description
task:created	Broadcast new task
task:updated	Live task updates
task:assigned	Notify assigned user
Example
io.emit("task:updated", updatedTask);
io.to(userId).emit("task:assigned", task);

🧪 Testing Strategy
Covered Scenarios

Task creation validation

Overdue task detection

Socket notification on assignment

Example Test
it("should throw error for past due date", () => {
  expect(() => createTask({ dueDate: pastDate }))
    .toThrow("Due date cannot be in the past");
});

📁 Project Structure
src/
├── controllers/
├── services/
├── repositories/
├── dto/
├── middlewares/
├── sockets/
├── tests/
├── prisma/

⚙️ Environment Variables
Backend
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=

Frontend
VITE_API_URL=
VITE_SOCKET_URL=

🧑‍💻 Local Setup
Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

Frontend
cd frontend
npm install
npm run dev

🚀 Deployment Notes

Backend supports WebSockets on Render/Railway

Frontend configured with environment-based API URLs

Database migrations handled via Prisma

✅ Assessment Highlights

✔ Clean architecture
✔ Strong TypeScript usage
✔ Real-time collaboration
✔ Secure authentication
✔ Scalable data model
✔ Production-grade validation
✔ Unit testing for critical logic

📌 Future Improvements

Role-based access (Admin / Member)

Comment threads on tasks

Activity logs

Email notifications

Offline-first support

👤 Author

Vivek Patel
Full-Stack Engineer
📍 India
