"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceTypeCardProps } from "../types";

export const WorkspaceTypeCard = ({
  type,
  isSelected,
  setValue,
  title,
  imageSrc,
}: WorkspaceTypeCardProps) => {
  return (
    <Card
      className={cn(
        "relative border-2 shadow-sm h-full items-center p-4 cursor-pointer transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-muted-foreground hover:border-primary/50"
      )}
      onClick={() => setValue("type", type)}
    >
      {isSelected && (
        <div className='absolute top-2 right-2 text-primary'>
          <CheckCircle className='size-5' />
        </div>
      )}
      <Image
        src={imageSrc}
        alt={`${title} Workspace`}
        width={300}
        height={200}
        className='size-full object-cover'
      />
      <p className='mt-2 font-medium'>{title}</p>
    </Card>
  );
};
