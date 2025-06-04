import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  if (!isAuthenticated) return null;

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <NavLink to="/dashboard" className="flex-shrink-0 flex items-center">
              <img className="h-5 w-auto" src="/img/Logo.svg" alt="The App Logo" />
            </NavLink>
            <NavLink to="/dashboard" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </NavLink>
          </div>

          <div className="flex items-center">
            <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-primary">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
