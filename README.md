# SiteMate AI

<div align="center">
  <img src="assets/imgs/logo.png" alt="SiteMate AI Logo" width="200"/>
</div>

SiteMate AI is an easy-to-use app that checks your website's health. It finds problems, suggests quick fixes, and helps your website perform better - no tech skills needed.

SiteMate AI is like a mechanic for your website. It checks for problems to keep your website running fast and your visitors happy. When issues are found, you can instantly request for verified professionals to fix them.

<div align="center">
  <img src="assets/imgs/onboarding.png" alt="SiteMate AI Onboarding" width="600"/>
</div>

## Features

- 🔍 **Website Health Checks** - Automatically scans your website for issues
- 🛠️ **Quick Fix Suggestions** - Get actionable recommendations to improve performance
- 👨‍💼 **Professional Services** - Request verified professionals to fix issues instantly
- 📱 **Cross-Platform** - Available on iOS, Android, and Web
- 🎯 **No Tech Skills Required** - Simple and intuitive interface for everyone

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npm start
   ```

   Or use specific platform commands:

   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## Project Structure

```
site-audit-ai-fe/
├── app/              # Main application code (file-based routing)
├── assets/           # Images, fonts, and other static assets
│   └── imgs/         # Logo and onboarding images
├── components/       # Reusable React components
├── constants/        # App constants and configuration
└── hooks/            # Custom React hooks
```

## Development

This project uses:
- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **ESLint** for code linting
- **Prettier** for code formatting

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run lint` - Run ESLint to check for linting errors
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes

### Code Quality

This project uses Husky and lint-staged to ensure code quality:
- Pre-commit hooks automatically run ESLint on staged files
- Code must pass linting checks before commits are allowed

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## License

Private project
