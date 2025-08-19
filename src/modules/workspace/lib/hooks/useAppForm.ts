import { useForm, DefaultValues } from "react-hook-form";
import { FORM_SCHEMA, FormValues } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useAppForm(defaultValues?: DefaultValues<FormValues>) {
  return useForm<FormValues>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues,
  });
}
