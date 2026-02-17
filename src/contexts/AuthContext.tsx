import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  role: 'admin' | 'reader';
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a página, verifica se já tem token salvo
    const storedToken = localStorage.getItem('rathole_token');
    const storedUser = localStorage.getItem('rathole_user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    try {
      // Bate na SUA API agora, não mais no Supabase
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      localStorage.setItem('rathole_token', token);
      localStorage.setItem('rathole_user', JSON.stringify(user));
      
      setUser(user);
    } catch (error) {
      console.error("Erro ao logar:", error);
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('rathole_token');
    localStorage.removeItem('rathole_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut, 
      loading, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);