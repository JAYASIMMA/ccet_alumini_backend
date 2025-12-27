# CCET Alumni Backend

This is the backend server for the CCET Alumni App, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a cloud URI)

## Installation

1. Navigate to the backend directory:

    ```bash
    cd ccet_alumini_backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Ensure you have a `.env` file in the root directory (`d:\ccet\ccet_alumini_backend\.env`).
2. The file should contain:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/ccet_alumini
    ```

## Running the Server

To start the server, run:

```bash
npm start
# OR if using nodemon
npx nodemon server.js
```

## Troubleshooting: "Port already in use" Error

If you see an error like `Error: listen EADDRINUSE: address already in use :::3000`, it means another process is already using port 3000.

### Solution 1: Find and Kill the Process

**On Windows (PowerShell/CMD):**

1. Find the Process ID (PID) using port 3000:

    ```powershell
    netstat -ano | findstr :3000
    ```

    Output example:

    ```
    TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       1234
    ```

    (Where `1234` is the PID)

2. Kill the process using the PID:

    ```powershell
    taskkill /PID 1234 /F
    ```

    *Replace `1234` with the actual PID from the previous step.*

**On Linux/Mac:**

1. Find the PID: `lsof -i :3000`
2. Kill it: `kill -9 <PID>`

### Solution 2: Change the Port

If you cannot kill the process or want to run this server alongside others:

1. Open the `.env` file.
2. Change the `PORT` value to something else (e.g., 3001, 4000).

    ```env
    PORT=3001
    ```

3. Restart the server.
    *Note: You will also need to update the frontend API base URL to match the new port.*

## API Endpoints

- `GET /`: Health check ("CCET Alumni API is running")
- `/api/auth`: Authentication routes
- `/api/user`: User profile routes
- `/api/posts`: Post management
- `/api/connections`: Networking features
- `/api/messages`: Chat functionality
- `/api/events`: Event management
- `/api/jobs`: Job board
