"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleIcon } from "@/components/icon/google";
import { authClient, signInGoogle } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const RegisterView = () => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
            router.push("/");
          },
          onError: ({ error }) => {
            console.error("Registration failed:", error);
            setError(error.message || "Registration failed. Please try again.");
          },
        }
      );
    } catch (error) {
      console.log(error);
      setError("Registration failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className='flex pt-16 px-4'>
      <Card className=' m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 gap-4'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl font-semibold'>
            Create a Tailark Account
          </CardTitle>
          <CardDescription>
            Welcome! Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
              <div>
                <div>
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                    disabled={pending}
                    onClick={async () => {
                      setPending(true);
                      await signInGoogle();
                    }}
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </Button>
                </div>

                <div className='my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3'>
                  <hr className='border-dashed' />
                  <span className='text-muted-foreground text-xs'>
                    Or continue With
                  </span>
                  <hr className='border-dashed' />
                </div>

                <div className='space-y-6'>
                  <div className='grid md:grid-cols-2 w-full gap-4'>
                    <FormField
                      control={form.control}
                      disabled={pending}
                      name='username'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type='text'
                              placeholder='john doe'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={pending}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='john@example.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={pending}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='••••••••'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      disabled={pending}
                      name='confirmPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='••••••••'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {!!error && (
                    <Alert className='bg-destructive/10 text-center border-none'>
                      <OctagonAlertIcon className='size-4 !text-destructive' />
                      <AlertTitle>{error}</AlertTitle>
                    </Alert>
                  )}
                  <Button className='w-full' disabled={pending}>
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='justify-center'>
          <p className='text-accent-foreground text-center text-sm'>
            Have an account ?
            <Button asChild variant='link' className='px-2' disabled={pending}>
              <Link href='/login'>Sign In</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
