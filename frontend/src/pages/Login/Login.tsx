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
import { IApiError } from "@/utils/errors";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
      toast.error(error.message);
      form.setError("username", { message: error.message });
    });
  };

  return (
    <div className="grid grid-cols-1 justify-items-center">
      <Card className="max-w-sm p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
