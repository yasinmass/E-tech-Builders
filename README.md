# E TECH BUILDERS 
Building Supervisor Management System

A professional local management system designed for construction supervisors to efficiently manage multiple building projects, workers, labour assignments, accounts, and reports.

The application is built for single-user (Supervisor/Admin) usage and runs locally using Django and SQLite without requiring cloud deployment.

---

## 🚀 Features

### 🏢 Building Management
- Register construction sites
- Store building details
- Owner information
- Owner photo
- Site photo
- Phone number
- Building-wise management

### 👷 Member Management
- Register workers
- Store worker photo
- Contact details
- Address
- Easy worker management

### 📋 E Tech Assignment
Assign registered workers to individual buildings.

Track:
- Building
- Member
- Worker count
- Date & Time

### 🛠 Builder Assignment
Maintain daily labour category records.

Supported Categories:
- Electrician
- Plumber
- Painter
- Centering
- Carpenter
- Mason
- Men Worker
- Women Worker

Track:
- Category
- Count
- Building
- Date & Time

### 💰 Accounts
Maintain building-wise accounts.

Track:
- Owner Payments
- Material Expenses
- Labour Expenses
- Current Balance
- Transaction History

### 🔍 Filter & Search
Search records by:
- Building
- Member
- Category
- Date

### 📄 CSV Export
Generate downloadable reports for:
- E Tech Assignments
- Builder Category Records

### 💾 Backup
- Manual CSV Backup
- Automatic Weekly Backup

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Axios

### Backend
- Django
- Django REST Framework
- SQLite
- Pillow
- APScheduler

---

## 📂 Project Structure

```
BuildingSupervisorSystem
│
├── frontend
│   ├── src
│   ├── components
│   ├── routes
│   ├── hooks
│   └── api
│
├── backend
│   ├── accounts
│   ├── buildings
│   ├── members
│   ├── assignments
│   ├── media
│   └── backups
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

## 🗄 Database

- SQLite
- Local Storage
- Single Supervisor Access

---

## 📊 System Modules

- Login
- Dashboard
- Buildings
- Members
- E Tech Assignments
- Builder Assignments
- Accounts
- Filter
- CSV Export
- Weekly Backup

---

## 📜 License

Private Client Project

---

## 👨‍💻 Developed By

Mohammed Yasin A
