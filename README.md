# Embrione Member Portal

A modern, responsive member recruitment and management portal built for **Embrione, PES University**. The platform allows students to apply for membership, administrators to review applications, and visitors to explore approved team members.

## ✨ Features

### 1. Member Registration
- Register for different domains within Embrione.
- Enter personal, academic, and professional details.
- Upload a profile picture with image conversion to WebP format.
- Store registration details in Supabase.
- Prevent duplicate SRN submissions.
- Track application status, including pending, approved, and rejected.

### 2. Admin Dashboard
- Secure administrator authentication using Supabase Auth.
- Restrict dashboard access to authorized administrators.
- View submitted applications and application statistics.
- Approve or reject membership applications.
- Select and remove multiple applications.
- Refresh the application list and manage submissions.

### 3. Team Directory
- Display approved Embrione members.
- Filter members by domain and position.
- Show member profiles and available social links.
- Provide a responsive, visually appealing team directory.

### 4. User Interface
- Modern dark-themed design with lime-green and purple accents.
- 3D-inspired cards, layered shadows, and hover animations.
- Responsive layouts for desktop, tablet, and mobile.
- Navigation between registration, administration, and team pages.

## 🛠️ Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** CSS, responsive layouts, CSS animations
- **Backend and Database:** Supabase
- **Authentication:** Supabase Auth
- **Image Storage:** Supabase Storage
- **Version Control:** Git and GitHub
- **Deployment:** Vercel

## 📁 Main Application Routes

| Route | Description |
|---|---|
| `/` | Homepage and portal navigation |
| `/register` | Member registration form |
| `/admin` | Administrator login and dashboard |
| `/team` | Approved member directory |

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/akashshetiya147/embrione-task.git
cd embrione-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Use the appropriate public key provided by your Supabase project and keep private or service-role keys out of the frontend.

### 4. Configure Supabase

Set up the required database tables, access policies, authentication, and storage:

- `members` — stores member registration details and application status.
- `admin_users` — identifies authorized administrators.
- `member-photos` — stores uploaded member profile pictures.

Configure Row Level Security (RLS) policies to protect member information and restrict administrative operations to authorized users.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for production

```bash
npm run build
```

## 🌐 Live Demo

**Deployed Application:** https://akash-embrione-task.vercel.app/

## 📦 Repository

**GitHub:** https://github.com/akashshetiya147/embrione-task

## 🔐 Security Notes

- Administrative access is restricted to authorized accounts.
- Database access should be protected by appropriate RLS policies.
- Never commit `.env.local` or private credentials.
- Validate submitted data and protect sensitive member information.
- Administrative actions should be authorized on the server or through secure database policies.

## 🎯 Project Objective

The objective of this project is to develop a complete member recruitment portal that simplifies student registration, application review, and team discovery through a responsive and user-friendly web application.

## 👨‍💻 Developer

**Akash Kiran Shetiya**  
PES University, Bengaluru

---

*Built with Next.js and Supabase for the Embrione community.*
