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
  AuthFormFooter,
  AuthSocialButton,
  RegisterFormFields,
} from "../components";
import { AUTH_ROUTES } from "../constant";

import { REGISTER_FORM_SCHEMA, RegisterFormValues } from "../lib/schemas";
import { ErrorAlert } from "@/components/error-alert";

export const RegisterView = () => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(REGISTER_FORM_SCHEMA),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleError = (errorMessage: string) => {
    console.error("Registration failed:", errorMessage);
    setError(errorMessage || "Registration failed. Please try again.");
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setPending(true);
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.username,
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
      handleError("Registration failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setPending(true);
    await signInGoogle();
  };

  return (
    <AuthCard
      description='Welcome! Create an account to get started'
      title='Create an Account'
      footer={
        <AuthFormFooter
          label='Already have an account?'
          linkText='Sign in'
          linkHref={AUTH_ROUTES.SIGN_IN}
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
              <RegisterFormFields disabled={pending} />
              {!!error && <ErrorAlert message={error} />}
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
