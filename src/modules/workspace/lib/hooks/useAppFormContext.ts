import { useFormContext } from "react-hook-form";
import { FormValues } from "../schema";

export default function useAppFormContext() {
  return useFormContext<FormValues>();
}
