---
description: Repository Information Overview
alwaysApply: true
---

# IAIIEA Site Information

## Summary
The **IAIIEA Site** is a comprehensive web platform built with **Next.js 14**, designed for the International Association of Internal Integrity and Evaluation Agencies. It features public landing pages, an administrative dashboard, and a members-only portal. The application integrates authentication, payment processing, image management, and event scheduling.

## Structure
- **[./src/app](./src/app)**: Contains the main application routes using the Next.js App Router, organized into logical groups (admin, auth, members-dashboard, landing-pages).
- **[./src/components](./src/components)**: Housing UI components, including a dedicated `ui/` folder for primitive components (based on Shadcn UI) and layout-specific components (header, footer, sidebar).
- **[./src/action](./src/action)**: Contains API interaction logic and server-side actions, primarily using **Axios**.
- **[./src/types](./src/types)**: TypeScript type definitions and shared interfaces.
- **[./public](./public)**: Static assets, including a large collection of images, icons, and fonts used across the site.

## Language & Runtime
**Language**: TypeScript  
**Version**: Next.js 14.2.5, React 18  
**Build System**: Next.js Build Pipeline  
**Package Manager**: npm (v10.x recommended)

## Dependencies
**Main Dependencies**:
- **Next.js**: Core framework for SSR and routing.
- **NextAuth.js & Clerk**: Hybrid authentication setup.
- **Tailwind CSS**: Utility-first CSS framework.
- **MUI (Material UI) & Radix UI**: Component libraries for advanced UI elements.
- **Flutterwave**: Payment gateway integration for memberships or conferences.
- **Cloudinary**: Cloud-based image and video management.
- **Framer Motion**: Animation library for smooth transitions.
- **React Hook Form**: Form management and validation.
- **FullCalendar**: Comprehensive calendar component for events.

**Development Dependencies**:
- **TypeScript**: Static typing for enhanced developer experience.
- **ESLint**: Linting and code quality enforcement.
- **PostCSS**: CSS processing.

## Build & Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Main Files & Resources
- **[./middleware.ts](./middleware.ts)**: Handles route protection and authentication checks for the members-dashboard.
- **[./next.config.mjs](./next.config.mjs)**: Configures image domains (Cloudinary, Unsplash) and build settings.
- **[./src/app/layout.tsx](./src/app/layout.tsx)**: Root layout providing global providers and metadata.
- **[./tailwind.config.ts](./tailwind.config.ts)**: Tailwind CSS theme and plugin configuration.

## Key Features
1. **Authentication**: Secure login and registration for members and admins via NextAuth and Clerk.
2. **Dashboards**: Dedicated interfaces for administrators to manage site content and for members to access exclusive resources.
3. **Payment Integration**: Seamless payment processing via Flutterwave.
4. **Media Management**: Efficient image and video handling using Cloudinary.
5. **Event Management**: Integrated calendar system for scheduling and displaying association activities.
6. **Responsive Design**: Mobile-friendly UI built with Tailwind CSS and responsive components.
