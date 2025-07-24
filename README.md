# Howdy

A full-stack chat application with real-time messaging, channels, direct messages, authentication, and profile management. Built with React, Vite, Redux Toolkit, Tailwind CSS, and a Node.js/Express/MongoDB backend with Socket.IO for real-time communication.

---

## Features

- **Authentication**: Register, login, and logout with JWT-based authentication and secure cookies.
- **Direct Messaging**: One-on-one real-time chat with other users.
- **Channels**: Create, join, and manage group channels with real-time messaging.
- **Profile Management**: Update user and channel profiles, including profile images and bios.
- **File Uploads**: Upload and share files in chats and channels.
- **Responsive UI**: Modern, responsive design using Tailwind CSS and Radix UI components.
- **Real-time Updates**: Instant message delivery and channel/member updates via Socket.IO.



## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd howdy
```

### 2. Setup Environment Variables

#### Server (`server/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/howdy
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

#### Client (`client/.env`):
```
VITE_HOST=http://localhost:5000
```

### 3. Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd ../client
npm install
```

### 4. Run the Applications

#### Start the Backend
```bash
cd server
npm start
```

#### Start the Frontend
```bash
cd ../client
npm run dev
```

---

## Usage

- Register a new account or login with existing credentials.
- Start direct messages or create/join channels.
- Upload profile images and files in chats.
- Manage channel members and channel profiles.
- All chat and channel updates happen in real-time.

---