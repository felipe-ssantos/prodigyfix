# Bootpedia - Hiren's Boot Tools Guide

A comprehensive web application for learning and mastering Hiren's Boot tools and system recovery techniques. Built with React, TypeScript, and Bootstrap 5.

## 🚀 Features

### Core Features
- **Tutorial Management**: Browse tutorials by categories with detailed step-by-step guides
- **Search & Filter**: Advanced search functionality with filters by category, difficulty, and time
- **Favorites System**: Save tutorials to localStorage for quick access
- **Responsive Design**: Mobile-friendly interface with Bootstrap 5
- **SEO Optimized**: Clean URLs and meta tags for better search visibility

### Admin Features
- **Authentication**: Firebase-based admin login system
- **Dashboard**: Comprehensive admin panel with statistics and quick actions
- **Tutorial CRUD**: Create, read, update, and delete tutorials
- **Category Management**: Organize tutorials by categories
- **Analytics**: View tutorial statistics and performance metrics

### User Experience
- **Navigation**: Next/Previous tutorial navigation
- **Share & Print**: Easy sharing and printing of tutorials
- **Related Content**: Suggested tutorials based on current content
- **Progress Tracking**: View counts and estimated reading times

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Bootstrap 5 + Custom CSS
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Backend**: Firebase (Firestore + Authentication)
- **Build Tool**: Vite
- **Hosting**: Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (for production)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bootpedia.git
   cd bootpedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FB_CONFIG_A=your_firebase_api_key
   VITE_FB_CONFIG_B=your_firebase_auth_domain
   VITE_FB_CONFIG_C=your_firebase_project_id
   VITE_FB_CONFIG_D=your_firebase_storage_bucket
   VITE_FB_CONFIG_E=your_firebase_messaging_sender_id
   VITE_FB_CONFIG_F=your_firebase_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Add your Firebase config to environment variables

### Mock Data

The application includes comprehensive mock data for development:
- 4 sample tutorials with detailed content
- 6 categories covering different aspects of system recovery
- Admin user for testing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── ui/            # UI components (Cards, Forms)
├── contexts/           # React contexts for state management
├── data/              # Mock data and static content
├── pages/             # Page components
│   └── admin/         # Admin pages
├── services/          # API services and Firebase config
├── types/             # TypeScript type definitions
└── App.tsx           # Main application component
```

## 🎯 Key Components

### Tutorial System
- **TutorialCard**: Displays tutorial previews with metadata
- **TutorialPage**: Full tutorial view with navigation
- **SearchResults**: Advanced search with filters

### Admin System
- **AdminLogin**: Secure authentication page
- **AdminDashboard**: Comprehensive admin interface
- **Tutorial Management**: CRUD operations for tutorials

### User Features
- **Favorites**: localStorage-based favorite system
- **Categories**: Organized content browsing
- **Search**: Full-text search with filters

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy automatically** on git push

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## 🔒 Security

- Firebase Authentication for admin access
- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS enforcement in production

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap 5 grid system
- Custom responsive breakpoints
- Touch-friendly interface

## 🎨 Customization

### Styling
- Custom CSS in `src/App.css`
- Bootstrap 5 variables
- Component-specific styles

### Content
- Mock data in `src/data/mockData.ts`
- Easy to add new tutorials and categories
- Markdown support for rich content

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- React best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hiren's BootCD](https://www.hirensbootcd.org/) for the amazing toolkit
- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [React](https://reactjs.org/) for the frontend framework
- [Firebase](https://firebase.google.com/) for backend services

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/bootpedia/issues)
- **Email**: contact@bootpedia.com
- **Documentation**: [Wiki](https://github.com/yourusername/bootpedia/wiki)

## 🔮 Roadmap

- [ ] Real-time collaboration features
- [ ] Video tutorial support
- [ ] User comments and ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA)

---

**Bootpedia** - Your comprehensive guide to Hiren's Boot tools and system recovery techniques.
