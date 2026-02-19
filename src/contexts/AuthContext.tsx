import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/types"; // Importando do arquivo global

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>; // O nome precisa ser signIn
  signOut: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('rathole_token');
    const storedUser = localStorage.getItem('rathole_user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('rathole_user');
      }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // O backend deve retornar { token, user }
      const { token, user: apiUser } = response.data;

      // Montamos o objeto user com segurança
      const userFormatted: User = {
        id: apiUser.id,
        username: apiUser.name || apiUser.username,
        email: email, // O email vem do formulário ou do retorno
        role: apiUser.role,
        avatar_url: apiUser.avatar_url || apiUser.avatar,
        created_at: new Date().toISOString() // Fallback
      };

      localStorage.setItem('rathole_token', token);
      localStorage.setItem('rathole_user', JSON.stringify(userFormatted));
      
      // Atualiza o header do Axios para futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userFormatted);
    } catch (error) {
      console.error("Erro no signIn:", error);
      throw error; // Lança o erro para o Auth.tsx tratar
    }
  }

  function signOut() {
    localStorage.removeItem('rathole_token');
    localStorage.removeItem('rathole_user');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, // Agora a função existe e é passada aqui
      signOut, 
      loading, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);