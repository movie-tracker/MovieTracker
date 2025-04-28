import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthentication from "@/context/AuthContext";
import { isApiError } from "@/utils/errors";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type LoginFormData = {
  username: string;
  password: string;
};

function LoginPage() {
  const auth = useAuthentication();
  const form = useForm<LoginFormData>();
  const { t } = useTranslation();

  const onSubmit = async (values: LoginFormData) => {
    await auth.login(values.username, values.password).catch((error) => {
      if (isApiError(error)) {
        if (error.fields) {
          Object.entries(error.fields).forEach(([key, value]) => {
            form.setError(key as keyof LoginFormData, {
              message: t(`validation.${value}`),
            });
          });
        }
      } else {
        toast.error(error.message);
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:underline">
            Forgot your password?
          </Link>
          <Link to="/register" className="hover:underline">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
