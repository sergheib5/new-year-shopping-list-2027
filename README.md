# New Year Shopping List 2027 🎉

A collaborative Progressive Web App (PWA) for managing shopping lists and menus for your New Year party. Built with React, Vite, and Firebase.

## Features

- 🛒 **Shopping List**: Add items with store, quantity, and notes
- 🍽️ **Menu Planner**: Plan daily meals, salads, and snacks
- ⏰ **New Year Countdown**: Live countdown to New Year 2027 in the header
- 📱 **Mobile-Friendly**: Optimized for mobile devices (Android & iOS)
- 🔄 **Real-time Sync**: Changes sync instantly across all users via Firebase
- 📲 **PWA**: Install as an app on your device
- 🎨 **Modern Design**: Sleek New Year 2027 themed interface

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for now - we'll update security rules)
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click the web icon (`</>`) to add a web app
   - Copy the Firebase configuration object

### 3. Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` and fill in your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firebase Security Rules

In Firebase Console > Firestore Database > Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (no authentication required)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: This allows anyone with the link to edit. For production, consider adding authentication or link-based access control.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
new-year-shopping-list-2027/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.jsx     # Header with countdown
│   │   ├── BottomNav.jsx  # Bottom navigation
│   │   ├── NewYearCountdown.jsx
│   │   ├── ShoppingItemForm.jsx
│   │   └── MenuItemForm.jsx
│   ├── pages/             # Page components
│   │   ├── ShoppingList.jsx
│   │   └── Menu.jsx
│   ├── firebase/          # Firebase configuration
│   │   ├── config.js
│   │   └── db.js
│   ├── hooks/             # Custom hooks
│   │   └── useNewYearCountdown.js
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
├── .env                   # Environment variables (create from .env.example)
└── package.json
```

## Usage

1. **Shopping List**:
   - Tap "+ Add Item" to add new items
   - Check items off as you shop (they'll show strikethrough)
   - Tap an item to edit it
   - Hover over items to see delete button

2. **Menu**:
   - Switch to Menu tab
   - Add daily menu items (date, lunch, dinner)
   - Add salads with who's preparing them
   - Add snacks

3. **Sharing**:
   - Share the app URL with your group
   - Everyone with the link can view and edit
   - Changes sync in real-time

## Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Other Hosting Options

- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Firebase Firestore** - Real-time database
- **PWA** - Progressive Web App capabilities

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for New Year 2027 🎉
