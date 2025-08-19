"use client";

import useAppForm from "../lib/hooks/useAppForm";
import { SubmitHandler, FormProvider } from "react-hook-form";
import { FormValues } from "../lib/schema";
import { useFormSubmit } from "../lib/hooks/useFormSubmit";

export function Provider({ children }: Readonly<FormProviderProps>) {
  const { handleContinue } = useFormSubmit();
  const methods = useAppForm({
    name: "",
    description: "",
    type: undefined,
    image: undefined,
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Form submitted with data:", data);
    await handleContinue(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className='flex w-full'>
        {children}
      </form>
    </FormProvider>
  );
}

interface FormProviderProps {
  children: React.ReactNode;
}
