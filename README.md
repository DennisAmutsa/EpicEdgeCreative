# EpicEdge Creative - Project Management System

A full-stack project management system built for creative agencies to manage client projects, track progress, and collaborate effectively.

## 🚀 Features

- **User Authentication** - Secure login/register for clients and admins
- **Project Management** - Create, track, and manage creative projects
- **Role-Based Access** - Different permissions for clients and administrators
- **Real-time Progress Tracking** - Monitor project status and milestones
- **Client Dashboard** - Clients can view their projects and progress
- **Admin Panel** - Full project and user management capabilities
- **Responsive Design** - Modern UI with Tailwind CSS
- **MongoDB Atlas Integration** - Cloud-based database storage
- **Complete SEO Optimization** - Structured data, meta tags, sitemaps

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Helmet Async** - SEO meta tag management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **pnpm** (v8 or higher)
- **MongoDB Atlas** account (for database)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd epicedgecreative
```

### 2. Install Dependencies
```bash
# Install all dependencies for both frontend and backend
pnpm run install:all

# Or install them separately:
# Backend dependencies
cd backend && pnpm install

# Frontend dependencies  
cd frontend && pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory with the following:
```env
MONGODB_URI=mongodb+srv://epicedgecreative:oHCZ9gxcXdWcYLwm@cluster0.xkfgiwj.mongodb.net/epicedgecreative?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=epicedge_creative_super_secret_key_2024
PORT=5000
NODE_ENV=development
```

### 4. Running the Application

You have several options to run the application:

#### Option 1: Run Both Servers Concurrently
```bash
# From the root directory
pnpm run dev
```

#### Option 2: Run Servers Separately 

**Start Backend Server (Port 5000):**
```bash
cd backend
pnpm run dev
```

**Start Frontend Server (Port 3000):**
```bash
cd frontend  
pnpm start
```

#### Option 3: Production Build
```bash
# Build frontend for production
cd frontend
pnpm run build

# Start backend in production mode
cd backend
pnpm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Default Admin Account

To create an admin account:

1. Register a new account through the frontend at http://localhost:3000/register
2. In MongoDB Atlas, find the user document in the `users` collection
3. Change the `role` field from `'client'` to `'admin'`
4. The user will now have admin access to manage users and projects

## 📁 Project Structure

```
epicedgecreative/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── users.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── sitemap.xml
│   │   ├── robots.txt
│   │   ├── manifest.json
│   │   └── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Contact.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Projects.js
│   │   │   ├── ProjectDetails.js
│   │   │   ├── Profile.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── AdminProjects.js
│   │   │   ├── CreateProject.js
│   │   │   └── EditProject.js
│   │   ├── utils/
│   │   │   └── webVitals.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🎯 User Roles

### Client Users
- View assigned projects
- Track project progress
- View project details and milestones
- Update personal profile
- View public project notes

### Admin Users
- All client permissions
- Create and manage projects
- Manage user accounts
- Full project CRUD operations
- Add private notes to projects
- View analytics and reports

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get projects (filtered by role)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `POST /api/projects/:id/notes` - Add note to project
- `GET /api/projects/stats/dashboard` - Get dashboard statistics

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/status` - Toggle user status
- `GET /api/users/clients/list` - Get clients list

## 🎨 UI Components

The application uses a custom component system built with Tailwind CSS:

- **Buttons**: Primary, secondary, success, danger, ghost variants
- **Forms**: Styled inputs, selects, textareas with validation
- **Cards**: Consistent card layouts for content
- **Badges**: Status and priority indicators
- **Loading Spinners**: Various sizes for loading states
- **SEO Components**: Dynamic meta tags and structured data

## 🔍 SEO Features

- **Complete meta tags** for all pages
- **Open Graph** and Twitter Card support
- **Structured data** (Schema.org) markup
- **XML sitemap** with automatic generation
- **Robots.txt** with proper directives
- **Breadcrumb navigation** with schema markup
- **Performance monitoring** with Web Vitals
- **Local business** optimization for Nairobi, Kenya

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)  
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas is accessible
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production bundle: `pnpm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update API base URL in production

## 🔧 Development Scripts

### Root Scripts
```bash
pnpm run install:all    # Install all dependencies
pnpm run dev           # Run both servers concurrently
pnpm run dev:backend   # Run backend only
pnpm run dev:frontend  # Run frontend only
```

### Backend Scripts
```bash
pnpm start          # Start production server
pnpm run dev        # Start development server with nodemon
```

### Frontend Scripts
```bash
pnpm start          # Start development server
pnpm run build      # Build for production
pnpm test           # Run tests
```

## 📞 Contact Information

- **Phone**: 0787205456
- **Email**: epicedgecreative@gmail.com
- **Location**: Nairobi, Kenya
- **Business Hours**: Mon - Fri: 9AM - 6PM (EAT)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email epicedgecreative@gmail.com or create an issue in the repository.

---

Built with ❤️ by EpicEdge Creative Team

**Empowering Your Brand with Design, Code, and Care**#   E p i c E d g e C r e a t i v e  
 #   E p i c E d g e C r e a t i v e  
 