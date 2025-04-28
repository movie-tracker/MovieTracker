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
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          {t("login.title")}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.username")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("login.usernamePlaceholder")}
                      {...field}
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
                  <FormLabel>{t("login.password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("login.passwordPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t("login.submit")}
            </Button>
          </form>
        </Form>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:underline">
            {t("login.forgotPassword")}
          </Link>
          <Link to="/register" className="hover:underline">
            {t("login.createAccount")}
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
