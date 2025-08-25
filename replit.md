# Caymus Wine Tank Calculator

## Overview

The Caymus Wine Tank Calculator is a specialized web application designed for the wine industry to calculate tank volume measurements. The application converts between space measurements (in inches) and volume measurements (in gallons) for various wine storage tanks. It features a modern React frontend with a Node.js/Express backend, designed to handle precise calculations for winery operations.

The system includes comprehensive tank specifications for different tank series (BL, BR, A, B, C) and provides both space-to-gallons and gallons-to-space conversion calculations. It features a dark, premium UI design that reflects the wine industry aesthetic with real-time tank visualizations and calculation history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with a custom dark theme and wine industry-inspired color palette
- **UI Components**: Radix UI primitives via shadcn/ui for accessible, customizable components
- **State Management**: React hooks with custom tank calculator hook (`useTankCalculator`)
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Animations**: Framer Motion for smooth tank fill animations and visual feedback

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with JSON responses
- **Development Server**: Vite integration for hot module replacement in development
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **In-Memory Storage**: Fallback MemStorage implementation for development/testing
- **Local Storage**: Browser localStorage for calculation history and user preferences
- **Tank Data**: Static JSON configuration with comprehensive tank specifications

### Authentication and Authorization
- **Current State**: Basic user schema defined but not implemented in UI
- **Prepared Infrastructure**: Drizzle schema with users table including username/password fields
- **Session Management**: Prepared for connect-pg-simple session storage
- **Future Implementation**: Ready for login/registration system expansion

### External Dependencies
- **Database**: Neon serverless PostgreSQL for production data persistence
- **Development Tools**: 
  - ESBuild for fast production bundling
  - TypeScript compiler for type checking
  - Replit development environment integration
- **UI Libraries**: Comprehensive Radix UI component set for consistent user experience
- **Validation**: Zod for runtime type validation and schema generation
- **Date Handling**: date-fns for calculation timestamps and history management

### Core Calculation Engine
The application implements sophisticated tank volume calculations that account for:
- **Tank Geometry**: Different gallon-per-inch ratios for main body vs top sections
- **Precision Calculations**: Handles both positive and negative space measurements
- **Multiple Tank Types**: Support for BL, BR, A, B, and C series tanks with unique specifications
- **Bidirectional Conversion**: Space-to-gallons and gallons-to-space calculations
- **Visual Feedback**: Real-time tank fill percentage visualization

### Configuration Management
- **Build Configuration**: Vite config with path aliases and plugin system
- **TypeScript Configuration**: Strict mode with modern ES features and path mapping
- **Tailwind Configuration**: Custom color scheme and component styling
- **Drizzle Configuration**: Database connection and migration management
- **Component Configuration**: shadcn/ui setup with custom theme integration