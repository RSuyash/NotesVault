# NotesVault MVP - React Frontend

This directory contains the React frontend application for the NotesVault MVP, built using Vite, TypeScript, and CSS Modules.

## Project Structure

The frontend follows a feature-based structure:

```
notesvault-react-mvp/
├── public/             # Static assets (logo, etc.)
├── src/
│   ├── assets/         # Static assets processed by Vite (e.g., SVGs)
│   ├── components/     # Shared reusable UI components
│   │   ├── layout/     # Layout components (Navbar, Footer)
│   │   └── ui/         # General UI elements (Buttons, Icons, Background)
│   ├── context/        # React Context providers (e.g., ThemeContext)
│   ├── features/       # Feature-specific components and logic
│   │   ├── document-generator/ # (If applicable later)
│   │   └── home/       # Components specific to the homepage sections
│   ├── hooks/          # Custom React hooks (e.g., useMousePositionEffect)
│   ├── pages/          # Top-level page components mapped to routes
│   ├── App.css         # Minimal global resets (mostly unused now)
│   ├── App.tsx         # Main application component (routing setup)
│   ├── index.css       # Global styles, CSS variables (theming)
│   ├── main.tsx        # Application entry point (renders App)
│   └── vite-env.d.ts   # Vite TypeScript environment types
├── .gitignore
├── eslint.config.js    # ESLint configuration
├── index.html          # Main HTML entry point
├── package.json        # Project dependencies and scripts
├── postcss.config.cjs  # PostCSS configuration (used by Tailwind initially, now minimal)
├── tailwind.config.js  # Tailwind configuration (currently unused due to CSS Modules switch)
├── tsconfig.app.json   # TypeScript config for the application
├── tsconfig.json       # Base TypeScript config
├── tsconfig.node.json  # TypeScript config for Node environment (e.g., Vite config)
└── vite.config.ts      # Vite build tool configuration (includes proxy)
```

## Key Technologies

*   **Framework:** React 19
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Routing:** React Router DOM v7
*   **Styling:** CSS Modules (per-component), Global CSS Variables (`src/index.css`) for theming (Light/Dark)
*   **State Management:** React Context (`ThemeContext`), component state (`useState`)
*   **Linting:** ESLint with TypeScript support

## Development Setup

1.  **Navigate to Frontend Directory:**
    ```bash
    cd notesvault-react-mvp
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:5174` (check terminal output for the exact port). The server includes Hot Module Replacement (HMR) for fast updates.

    *Note:* The frontend expects the backend API server (from the `/backend` directory) to be running concurrently, typically on `http://127.0.0.1:8000`. The Vite config includes a proxy to forward `/api` requests to the backend.

## Available Scripts

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Compiles and bundles the application for production into the `dist/` folder.
*   `npm run lint`: Runs ESLint to check for code style issues.
*   `npm run preview`: Starts a local server to preview the production build from the `dist/` folder.

## Styling Approach

*   **Global Styles & Theming:** Base styles, resets, and CSS variables for light/dark themes are defined in `src/index.css`.
*   **Component Styles:** Each component has its own corresponding `.module.css` file (e.g., `Navbar.module.css`). Styles are imported and used within the component (e.g., `styles.navbar`). This ensures styles are scoped locally to the component.
*   **Interactive Background:** The animated background grid is rendered using HTML Canvas in the `src/components/ui/InteractiveBackground.tsx` component.
*   **Tailwind CSS (Currently Disabled):** Tailwind CSS was initially used but was replaced with CSS Modules due to configuration issues during development. The config files (`tailwind.config.js`, `postcss.config.cjs`) remain but are not actively used for styling the current components.

## Key Features Implemented

*   Homepage Layout (Hero, Features Overview)
*   Features Page Layout
*   Basic Static Pages (About, Contact, Privacy, Copyright, Terms)
*   Login/Sign Up Page Placeholders
*   Light/Dark Theme Toggle (persisted in localStorage)
*   Interactive Grid Background Effect
*   Cursor Spotlight Effect (on specific homepage sections)
*   Animated Buttons (Hero section)
*   Responsive Design Considerations (Basic)
