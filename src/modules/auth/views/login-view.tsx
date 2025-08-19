"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { GoogleIcon } from "@/components/icon/google";
import { authClient, signInGoogle } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthCard,
  AuthDivider,
  AuthErrorAlert,
  AuthFormFooter,
  AuthSocialButton,
  LoginFormFields,
} from "../components";
import { AUTH_ROUTES } from "../constant";
import { LOGIN_FORM_SCHEMA, LoginFormValues } from "../lib";

export const LoginView = () => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleError = (errorMessage: string) => {
    console.error("Login failed:", errorMessage);
    setError(errorMessage || "Login failed. Please try again.");
  };

  const handleGoogleSignIn = async () => {
    setPending(true);
    await signInGoogle();
  };

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setPending(true);
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            form.reset();
            router.push(AUTH_ROUTES.WORKSPACE);
          },
          onError: ({ error }) => handleError(error.message),
        }
      );
    } catch (error) {
      console.log(error);
      handleError("Login failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthCard
      title='Welcome Back!'
      description='Welcome back! Please log in to your account'
      footer={
        <AuthFormFooter
          label="Don't have an account?"
          linkText='Sign Up'
          linkHref={AUTH_ROUTES.REGISTER}
          disabled={pending}
        />
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div>
              <AuthSocialButton
                icon={<GoogleIcon />}
                label='Google'
                onClick={handleGoogleSignIn}
                disabled={pending}
              />
            </div>

            <AuthDivider />

            <div className='space-y-6'>
              <LoginFormFields disabled={pending} />
              {!!error && <AuthErrorAlert error={error} />}
              <Button className='w-full' disabled={pending}>
                Continue
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
