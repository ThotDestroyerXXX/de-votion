import { z } from "zod";

export const LOGIN_FORM_SCHEMA = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const REGISTER_FORM_SCHEMA = z
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

export type LoginFormValues = z.infer<typeof LOGIN_FORM_SCHEMA>;
export type RegisterFormValues = z.infer<typeof REGISTER_FORM_SCHEMA>;
