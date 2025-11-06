# BlogApp - Simple Blog Post Application

A modern blog application built with **Next.js 16**, **App Router**, **DaisyUI**, and **Laravel Sanctum** authentication.

## Features

### Authentication
- ✅ User Login
- ✅ User Registration
- ✅ User Profile
- ✅ User Logout
- ✅ Protected Routes

### Blog Management
- ✅ List all blog posts with pagination
- ✅ View blog post details
- ✅ Create new blog posts
- ✅ Update existing blog posts
- ✅ Delete blog posts
- ✅ Category filtering

### Category Management
- ✅ List all categories
- ✅ View category details
- ✅ View posts by category

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: DaisyUI (Tailwind CSS)
- **HTTP Client**: Axios
- **Authentication**: Laravel Sanctum (Bearer Token)
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ or npm
- Laravel backend API running with Sanctum authentication

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   
   Replace `http://localhost:8000/api` with your Laravel API URL.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── profile/         # User profile page
│   ├── blogs/               # Blog pages
│   │   ├── [id]/            # Blog detail & edit pages
│   │   ├── create/          # Create blog page
│   │   └── page.tsx         # Blog list page
│   ├── categories/          # Category pages
│   │   ├── [id]/            # Category detail page
│   │   └── page.tsx         # Category list page
│   ├── layout.tsx           # Root layout with AuthProvider
│   └── page.tsx             # Home page
├── components/              # Reusable components
│   └── Navbar.tsx           # Navigation bar
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── lib/                     # Utilities
│   └── api.ts               # Axios instance with interceptors
├── services/                # API services
│   └── blogService.ts       # Blog & category API calls
└── types/                   # TypeScript types
    └── index.ts             # Type definitions

```

## API Integration

The application integrates with a Laravel Sanctum backend. Ensure your Laravel API has the following endpoints:

### Auth Routes
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/profile` - Get authenticated user profile
- `POST /api/logout` - User logout

### Blog Routes
- `GET /api/blogs` - List all blogs (with pagination)
- `GET /api/blogs/{id}` - Get single blog
- `POST /api/blogs` - Create new blog (authenticated)
- `PUT /api/blogs/{id}` - Update blog (authenticated)
- `DELETE /api/blogs/{id}` - Delete blog (authenticated)

### Category Routes
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get single category

## Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns a Bearer token
3. Token is stored in `localStorage`
4. Axios interceptor adds token to all subsequent requests
5. On 401 response, user is redirected to login

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## DaisyUI Themes

The application uses DaisyUI with multiple theme support:
- Light theme
- Dark theme
- Cupcake theme

Themes automatically switch based on system preferences.

## Key Features Implementation

### Protected Routes
Routes like blog creation and editing check for authentication and redirect to login if needed.

### Form Validation
All forms include client-side validation and display server-side error messages.

### Loading States
Loading spinners are shown during API calls for better UX.

### Error Handling
Comprehensive error handling with user-friendly error messages.

### Responsive Design
Fully responsive layout using DaisyUI and Tailwind CSS utilities.

## Troubleshooting

### CORS Issues
Ensure your Laravel backend has CORS properly configured for your Next.js frontend URL.

### Authentication Not Working
1. Check that `NEXT_PUBLIC_API_URL` is correctly set in `.env.local`
2. Verify Laravel Sanctum is properly configured
3. Check browser console for error messages

### API Connection Failed
1. Ensure Laravel backend is running
2. Verify the API URL in `.env.local`
3. Check network tab in browser dev tools

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open-source and available under the MIT License.
