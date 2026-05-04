import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import AuthCard from '../components/AuthCard';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const ForgotPasswordPage = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (_data: ForgotFormData): Promise<void> => {
    setIsLoading(true);
    // TODO: wire up to authService.forgotPassword(data.email)
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      }
    >
      {isSent ? (
        // Success state
        <div className="flex flex-col items-center text-center py-4 gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
            <MailCheck className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Check Your Email</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We've sent a password reset link to{' '}
              <span className="text-foreground font-medium">{getValues('email')}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn't receive it?{' '}
            <button onClick={() => setIsSent(false)} className="text-primary hover:underline">
              Try again
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-semibold rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
