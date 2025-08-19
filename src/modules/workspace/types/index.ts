import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "../lib/schema";

export type WorkspaceType = "personal" | "team";

export interface WorkspaceTypeCardProps {
  type: WorkspaceType;
  isSelected: boolean;
  setValue: UseFormSetValue<FormValues>;
  title: string;
  imageSrc: string;
}

export interface WorkspaceSelectionHeaderProps {
  title: string;
  subtitle: string;
}
