import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import TutorialPage from './pages/TutorialPage'
import AboutPage from './pages/AboutPage'
import UsefulLinksPage from './pages/UsefulLinksPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import SearchResults from './pages/SearchResults'
import CreateTutorial from './pages/admin/CreateTutorial'
import EditTutorial from './pages/admin/EditTutorial'
import TutorialList from './pages/admin/TutorialList'
import AdminCategories from './pages/admin/AdminCategories'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'

// Context
import { AuthProvider } from './contexts/AuthContext'
import { TutorialProvider } from './contexts/TutorialContext'

function App () {
  return (
    <AuthProvider>
      <TutorialProvider>
        <Router>
          <div className='App'>
            <Navbar />
            <main className='main-content'>
              <Routes>
                {/* Rotas públicas */}
                <Route path='/' element={<HomePage />} />
                <Route path='/tutorial/:id' element={<TutorialPage />} />
                <Route path='/search' element={<SearchResults />} />
                <Route path='/about' element={<AboutPage />} />                
                <Route path='/useful-links' element={<UsefulLinksPage />} />
                <Route path='/admin/login' element={<AdminLogin />} />

                {/* Rotas protegidas - Admin */}
                <Route
                  path='/admin/dashboard'
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/admin/tutorials/new'
                  element={
                    <ProtectedRoute>
                      <CreateTutorial />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/admin/tutorials/:id/edit'
                  element={
                    <ProtectedRoute>
                      <EditTutorial />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/admin/tutorials'
                  element={
                    <ProtectedRoute>
                      <TutorialList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path='/admin/categories'
                  element={
                    <ProtectedRoute>
                      <AdminCategories />
                    </ProtectedRoute>
                  }
                />

                {/* Rota para página não encontrada */}
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </TutorialProvider>
    </AuthProvider>
  )
}

export default App
