# Quick Setup Guide

## Step 1: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and update the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://your-laravel-api-url/api
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

### Without Authentication:
- ✅ Visit home page
- ✅ Browse blogs list
- ✅ View blog details
- ✅ Browse categories
- ✅ View category details

### With Authentication:
1. Register a new account at `/auth/register`
2. Login at `/auth/login`
3. Create a new blog post at `/blogs/create`
4. Edit your blog posts
5. Delete your blog posts
6. View your profile at `/auth/profile`

## Laravel Backend Requirements

Your Laravel API must have these endpoints ready:

### Authentication
- `POST /api/login` - Returns `{ user: {...}, token: "..." }`
- `POST /api/register` - Returns `{ user: {...}, token: "..." }`
- `GET /api/profile` - Returns `{ data: {...} }` (requires Bearer token)
- `POST /api/logout` - Returns success message

### Blogs
- `GET /api/blogs` - Returns paginated blogs
- `GET /api/blogs/{id}` - Returns single blog
- `POST /api/blogs` - Creates blog (requires Bearer token)
- `PUT /api/blogs/{id}` - Updates blog (requires Bearer token)
- `DELETE /api/blogs/{id}` - Deletes blog (requires Bearer token)

### Categories
- `GET /api/categories` - Returns all categories
- `GET /api/categories/{id}` - Returns single category

## Common Issues

### 1. CORS Error
Add your Next.js URL to Laravel's CORS configuration:
```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
```

### 2. 401 Unauthorized
- Check if token is being sent in headers
- Verify Laravel Sanctum is configured correctly
- Check if token is expired

### 3. Network Error
- Ensure Laravel backend is running
- Verify API URL in `.env.local`
- Check if ports are correct

## Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Features Checklist

- ✅ User authentication (login, register, logout)
- ✅ User profile page
- ✅ Blog CRUD operations
- ✅ Category listing and filtering
- ✅ Pagination for blog posts
- ✅ Protected routes
- ✅ Responsive design with DaisyUI
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **DaisyUI** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Laravel Sanctum** - API authentication

## Project Structure Overview

```
src/
├── app/                    # Pages (App Router)
├── components/             # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Utilities and configurations
├── services/              # API service functions
└── types/                 # TypeScript type definitions
```

## Need Help?

Check the main README.md for detailed documentation and troubleshooting guide.
