import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuthentication from '@/context/AuthContext';
import { isApiError } from '@/utils/errors';

const loginSchema = z.object({
  username: z.string({ required_error: 'validation.required' }).nonempty('validation.required'),
  password: z.string({ required_error: 'validation.required' }).nonempty('validation.required'),
});

type FormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const { t } = useTranslation();
  const auth = useAuthentication();
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: FormData) => {
    await auth.login(values.username, values.password).catch((error) => {
      if (isApiError(error)) {
        if (error.fields) {
          Object.entries(error.fields).forEach(([key, value]) => {
            form.setError(key as keyof FormData, {
              message: t(`validation.${value}`),
            });
          });
        } else {
          form.setError('root', {
            message: t(`api.${error.message}`),
          });
        }
      } else {
        toast.error(error.message);
      }
    });
  };

  const isLoading = form.formState.isSubmitting;

  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">{t('login.title')}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.username')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('login.usernamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('login.passwordPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="[http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="ml-2">{t('login.loading')}</span>
                  </div>
                </>
              ) : (
                t('login.submit')
              )}
            </Button>
          </form>
        </Form>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:underline">
            {t('login.forgotPassword')}
          </Link>
          <Link to="/register" className="hover:underline">
            {t('login.createAccount')}
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
