import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Mail, User, Users, Building2, BookUser } from 'lucide-react';
import { InputWithLabelIcon } from '../ui/InputWithLabelIcon';
import { PasswordInput } from '../ui/PasswordInput';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function SignUpForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error: authError } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      job_title: jobTitle || undefined,
      company: company || undefined
    };
    try {
      await register(userData);
      console.log('Registration successful from form, user is now logged in.');
    } catch (err) {
      console.error('Registration failed in form:', err);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-start gap-2">
        <p className="text-muted-foreground text-sm text-balance">Start your journey</p>
        <h1 className="text-2xl font-bold">Create an account</h1>
      </div>

      {authError && <p className="text-sm text-red-600">{authError}</p>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <InputWithLabelIcon
            id="first_name"
            type="text"
            label="First Name"
            icon={<User className="h-5 w-5 text-muted-foreground" />}
            disabled={isLoading}
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <InputWithLabelIcon
            id="last_name"
            type="text"
            label="Last Name"
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
            disabled={isLoading}
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <InputWithLabelIcon
            id="job_title"
            type="text"
            label="Job Title (Optional)"
            icon={<BookUser className="h-5 w-5 text-muted-foreground" />}
            disabled={isLoading}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <InputWithLabelIcon
            id="company"
            type="text"
            label="Company (Optional)"
            icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
            disabled={isLoading}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <InputWithLabelIcon
            id="email"
            type="email"
            label="E-mail"
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            disabled={isLoading}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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

        <Button type="submit" className="w-full bg-blue-500 text-white">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
