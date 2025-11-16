**📌 Bookify Hotel Reservation System**

Bookify is a full-stack ASP.NET Core web application designed to simplify hotel reservations.
It allows customers to search rooms, view details, and book with secure Stripe payments.
Admins can manage rooms, types, and bookings through a powerful dashboard.
The system follows N-Tier architecture with Repository and Unit of Work patterns for scalability, maintainability, and clean code.

## 🚀 Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended) or SQL Server

### Option 1: Using Docker (Recommended)

This is the easiest way to get started as it automatically sets up SQL Server for you.

1. Start the SQL Server container:
```bash
docker-compose up -d
```

2. Navigate to the backend directory and apply database migrations:
```bash
cd backend
dotnet ef database update
```

3. Run the backend API:
```bash
dotnet run
```

4. In a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

5. Run the frontend development server:
```bash
npm run dev
```

6. Access the application at `http://localhost:5173`

### Option 2: Using Local SQL Server

If you have SQL Server installed locally:

1. Update the connection string in `backend/appsettings.json` if your SQL Server configuration differs from the default

2. Navigate to the backend directory:
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

3. In a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

4. Access the application at `http://localhost:5173`

### Default Admin Credentials

The application automatically seeds an admin user on startup:
- **Email:** `admin@bookify.com`
- **Password:** `Admin@123`

### Stopping the Application

- Frontend/Backend: Press `Ctrl+C` in the terminal
- Docker SQL Server: `docker-compose down`

📂**Project Files**

You can access the full project files here:
👉 [Google Drive Link](https://drive.google.com/drive/folders/1aASzAOELCOFJ17qxE-LM8e_veMD-ZgR1?usp=drive_link)

