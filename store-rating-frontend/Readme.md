# 🌟 Store Rating Platform - Frontend

A comprehensive, modern React application for rating and reviewing stores built with cutting-edge technologies and best practices.

![Store Rating Platform](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.9-646CFF.svg)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-1.9.7-764ABC.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38B2AC.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-4285F4.svg)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🎯 User Roles & Permissions](#-user-roles--permissions)
- [🔐 Authentication](#-authentication)
- [📱 Progressive Web App](#-progressive-web-app)
- [🎨 UI/UX Features](#-uiux-features)
- [📊 Performance](#-performance)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🎯 Core Functionality (Challenge Requirements)

#### System Administrator
- 📊 **Comprehensive Dashboard** - Total users, stores, and ratings statistics
- 👥 **User Management** - Add, view, filter users (Name, Email, Address, Role)
- 🏪 **Store Management** - Complete CRUD operations for stores
- 🔍 **Advanced Filtering** - Sort and filter all listings with multiple criteria
- 👤 **Detailed User Views** - Complete user profiles with role-specific information

#### Normal User
- 📝 **User Registration** - Sign up with Name, Email, Address, Password validation
- 🔑 **Secure Authentication** - Login with role-based access control
- 🔒 **Password Management** - Update password after authentication
- 🏪 **Store Discovery** - Browse and search stores by Name and Address
- ⭐ **Rating System** - Submit and modify ratings (1-5 stars) for stores
- 📱 **Personal Dashboard** - View submitted ratings and account information

#### Store Owner
- 🏪 **Store Dashboard** - View users who rated their store
- 📊 **Rating Analytics** - See average rating and detailed statistics
- 🔒 **Profile Management** - Update password and store information
- 📈 **Real-time Updates** - Live notifications for new ratings

### 🚀 Advanced Features

#### Progressive Web App (PWA)
- 📱 **App Installation** - Install like a native mobile app
- 🔄 **Offline Functionality** - Works without internet connection
- 🔔 **Push Notifications** - Real-time notifications for ratings and updates
- ⚡ **Background Sync** - Sync data when connection is restored
- 🎯 **Smart Caching** - Intelligent caching strategies for optimal performance

#### Real-time Features
- 🔄 **Live Updates** - Real-time rating submissions and modifications
- 👥 **Online Presence** - See who's currently active
- 📡 **WebSocket Integration** - Instant communication and updates
- 🔔 **Live Notifications** - Real-time alerts for important events

#### User Experience
- 🎨 **Modern UI/UX** - Beautiful, responsive design with animations
- 🌙 **Dark/Light Theme** - Automatic theme switching based on preference
- 📱 **Mobile-First Design** - Optimized for all screen sizes
- ♿ **Accessibility** - WCAG 2.1 AA compliant
- 🌐 **Internationalization Ready** - Multi-language support infrastructure

#### Performance & Security
- ⚡ **Lightning Fast** - Optimized bundle splitting and lazy loading
- 🛡️ **Security First** - JWT authentication, CSRF protection, secure headers
- 📊 **Analytics Integration** - Comprehensive user behavior tracking
- 🔍 **SEO Optimized** - Meta tags, structured data, sitemap generation

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2.0** - Modern React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server

### State Management
- **Redux Toolkit** - Efficient Redux state management
- **Redux Persist** - Persistent state across sessions
- **React Query** - Server state management and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled, accessible UI components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons

### Routing & Navigation
- **React Router v6** - Declarative routing
- **Protected Routes** - Role-based access control
- **Lazy Loading** - Code splitting for optimal performance

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Yup** - Schema-based validation
- **Custom Validators** - Challenge-specific validation rules

### Real-time & Communication
- **Socket.io Client** - Real-time bidirectional communication
- **WebSocket API** - Native WebSocket support
- **Push Notifications** - Web Push API integration

### PWA & Offline
- **Workbox** - Service worker management
- **IndexedDB** - Client-side database
- **Background Sync** - Offline data synchronization

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint Staged** - Pre-commit linting

### Testing
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking

## 🏗️ Project Structure

