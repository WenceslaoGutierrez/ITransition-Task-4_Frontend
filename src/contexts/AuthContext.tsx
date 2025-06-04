import * as React from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  type AuthUser,
  type AuthSuccessResponse,
  type LoginCredentials,
  type RegisterData
} from '@/services/authService';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: AuthUser } }
  | { type: 'REGISTER_SUCCESS'; payload: { token: string; user: AuthUser } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE_AUTH'; payload: { token: string | null; user: AuthUser | null } };

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        token: null,
        user: null,
        isAuthenticated: false
      };
    case 'LOGOUT':
      return {
        ...initialState
      };
    case 'INITIALIZE_AUTH':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: !!action.payload.token && !!action.payload.user,
        isLoading: false
      };
    default:
      return state;
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserString = localStorage.getItem('authUser');
      let user = null;
      if (storedUserString) {
        user = JSON.parse(storedUserString) as AuthUser;
      }

      if (storedToken && user) {
        dispatch({ type: 'INITIALIZE_AUTH', payload: { token: storedToken, user } });
      } else {
        dispatch({ type: 'INITIALIZE_AUTH', payload: { token: null, user: null } });
      }
    } catch (error) {
      console.error('Failed to initialize auth state from localStorage', error);
      dispatch({ type: 'INITIALIZE_AUTH', payload: { token: null, user: null } });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const data: AuthSuccessResponse = await apiLogin(credentials);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token: data.token, user: data.user } });
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Login failed' });
      throw err;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const data: AuthSuccessResponse = await apiRegister(userData);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      dispatch({ type: 'REGISTER_SUCCESS', payload: { token: data.token, user: data.user } });
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Registration failed' });
      throw err;
    }
  };

  const logout = async () => {
    const currentToken = state.token;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    dispatch({ type: 'LOGOUT' });

    if (currentToken) {
      try {
        await apiLogout(currentToken);
      } catch (err: any) {
        console.error('Server logout failed, but client session cleared:', err.message);
      }
    }
  };

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
