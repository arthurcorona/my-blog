import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Suggestions from './pages/Suggestions';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

// Componente para proteger a rota de Perfil
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;

  // Se não estiver logado, manda pro Login (e não mais para /auth)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Index />} />
        
        {/* AQUI ESTÁ O SEGREDO: Tem que ser /login, igual ao Header */}
        <Route path="/login" element={<Auth />} />
        
        {/* Outras Rotas */}
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        
        {/* Rota Privada */}
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />

        {/* Catch-All: Se não achar nada, volta pra Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;