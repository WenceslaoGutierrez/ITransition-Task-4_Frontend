import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { InputWithLabelIcon } from '../ui/InputWithLabelIcon';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { PasswordInput } from '../ui/PasswordInput';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading, error: authError } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ email, password });
      console.log('Login successful from form');
    } catch (err) {
      console.error('Login failed in form:', err);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-start gap-2">
        <p className="text-muted-foreground text-sm text-balance">Start your journey</p>
        <h1 className="text-2xl font-bold">Sign In to The App</h1>
      </div>

      {authError && <p className="text-sm text-red-600">{authError}</p>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <InputWithLabelIcon
            id="email"
            type="email"
            label="E-mail"
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-3">
          <PasswordInput
            id="password"
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember-me"
            className="h-4 w-4 rounded border-gray-100 text-blue-600 focus:ring-blue-500"
            checked={rememberMe}
            disabled={isLoading}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Label htmlFor="remember-me" className="text-sm font-medium select-none text-gray-700 dark:text-gray-300">
            Remember me
          </Label>
        </div>
        <Button type="submit" className="w-full bg-blue-500 text-white" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}
