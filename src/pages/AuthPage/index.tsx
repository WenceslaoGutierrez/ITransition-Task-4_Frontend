import { LoginForm } from '@/components/LoginForm';
import { SignUpForm } from '@/components/SignUpForm';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/ui/Spinner';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, isAuthLoading, navigate]);

  const toggleView = () => {
    setIsLoginView((prev) => !prev);
  };
  if (isAuthenticated && !isAuthLoading) return <Spinner />;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 justify-between">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 text-4xl font-medium">
            <img src="/img/Logo.svg" />
          </a>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">{isLoginView ? <LoginForm /> : <SignUpForm />}</div>
          </div>
        </div>
        <div className={cn('grid gap-2 text-sm text-center', isLoginView ? 'lg:grid-cols-2' : 'lg:grid-cols-1')}>
          {isLoginView ? (
            <p>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={toggleView} className="font-medium underline underline-offset-4 text-blue-600 hover:text-blue-700">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={toggleView} className="font-medium underline underline-offset-4 text-blue-600 hover:text-blue-700">
                Sign in
              </button>
            </p>
          )}
          {isLoginView && (
            <a href="#" className="underline underline-offset-4 text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          )}
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <img src="/img/login_screen.webp" alt="Images" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale blur-sm" />
      </div>
    </div>
  );
}
