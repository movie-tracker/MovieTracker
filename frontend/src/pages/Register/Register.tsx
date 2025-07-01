import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Film } from "lucide-react";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuthentication from '@/context/AuthContext';
import { authService } from '@/services/authService';

const registerSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }).min(2, 'Nome deve ter pelo menos 2 caracteres'),
  username: z.string({ required_error: 'Nome de usuário é obrigatório' }).min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string({ required_error: 'Email é obrigatório' }).email('Email inválido'),
  phone: z.string().optional(),
  password: z.string({ required_error: 'Senha é obrigatória' }).min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string({ required_error: 'Confirme sua senha' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const auth = useAuthentication();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: FormData) => {
    try {
      await authService.register({
        name: values.name,
        username: values.username,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });
      
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      // Redirecionar para login após registro bem-sucedido
      window.location.href = '/login';
    } catch (error: any) {
      // Tratar erros de registro de forma mais específica
      if (error.message) {
        toast.error(error.message);
        
        // Limpar campos específicos em caso de erro
        if (error.message.includes('email já está em uso')) {
          form.setValue('email', '');
          form.setFocus('email');
        } else if (error.message.includes('nome de usuário já está em uso')) {
          form.setValue('username', '');
          form.setFocus('username');
        }
      } else {
        toast.error('Erro inesperado ao criar conta. Tente novamente.');
      }
    }
  };

  const isLoading = form.formState.isSubmitting;

  if (auth.isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Movie Tracker</h1>
        </div>
      </nav>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Card className="w-full max-w-md p-6 shadow-lg bg-white/5 border-white/10">
          <h1 className="text-2xl font-semibold text-center mb-6 text-white">Criar Conta</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome" 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome de usuário" 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Digite seu email" 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="Digite seu telefone" 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
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
                    <FormLabel className="text-white">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Digite sua senha" 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirme sua senha" 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="ml-2">Criando conta...</span>
                    </div>
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>
          </Form>
          <div className="flex justify-center items-center mt-4 text-sm text-gray-400">
            <span>Já tem uma conta?</span>
            <Link to="/login" className="ml-1 text-yellow-400 hover:text-yellow-300 underline">
              Fazer Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage; 