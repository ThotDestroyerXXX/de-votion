"use client";

import { UploadIcon } from "lucide-react";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type { DropEvent, DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { FormValues } from "../lib/schema";

type DropzoneContextType = {
  src?: File[];
  accept?: DropzoneOptions["accept"];
  maxSize?: DropzoneOptions["maxSize"];
  minSize?: DropzoneOptions["minSize"];
  maxFiles?: DropzoneOptions["maxFiles"];
};

const renderBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

export type DropzoneProps = Omit<DropzoneOptions, "onDrop"> & {
  src?: File[];
  className?: string;
  onDrop?: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  children?: ReactNode;
  setValue?: UseFormSetValue<FormValues>;
};

export const Dropzone = ({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  className,
  children,
  setValue,
  ...props
}: DropzoneProps) => {
  // Create a custom onDrop handler that updates the form
  const handleDrop = (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    if (fileRejections.length > 0) {
      const message = fileRejections.at(0)?.errors.at(0)?.message;
      onError?.(new Error(message));
      return;
    }

    if (acceptedFiles.length > 0) {
      // Get the accepted file
      const file = acceptedFiles[0];

      // If setValue is provided, use it directly (cleaner approach)
      if (setValue) {
        setValue("image", file, { shouldValidate: true });
      }
    }

    // Call the user's onDrop handler if provided
    onDrop?.(acceptedFiles, fileRejections, event);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: handleDrop,
    ...props,
  });

  const contextValue = useMemo(
    () => ({ src, accept, maxSize, minSize, maxFiles }),
    [src, accept, maxSize, minSize, maxFiles]
  );

  return (
    <DropzoneContext.Provider value={contextValue}>
      <Button
        className={cn(
          "relative h-auto w-full flex-col overflow-hidden p-8",
          isDragActive && "outline-none ring-1 ring-ring",
          className
        )}
        disabled={disabled}
        type='button'
        variant='outline'
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={disabled} name='image' />
        {children}
      </Button>
    </DropzoneContext.Provider>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export type DropzoneContentProps = {
  children?: ReactNode;
  className?: string;
};

const maxLabelItems = 3;

export const DropzoneContent = ({
  children,
  className,
}: DropzoneContentProps) => {
  const { src } = useDropzoneContext();

  if (!src) {
    return null;
  }

  if (children) {
    return children;
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className='flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground'>
        <UploadIcon size={16} />
      </div>
      <p className='my-2 w-full truncate font-medium text-sm'>
        {src.length > maxLabelItems
          ? `${new Intl.ListFormat("en").format(
              src.slice(0, maxLabelItems).map((file) => file.name)
            )} and ${src.length - maxLabelItems} more`
          : new Intl.ListFormat("en").format(src.map((file) => file.name))}
      </p>
      <p className='w-full text-wrap text-muted-foreground text-xs'>
        Drag and drop or click to replace
      </p>
    </div>
  );
};

export type DropzoneEmptyStateProps = {
  children?: ReactNode;
  className?: string;
};

export const DropzoneEmptyState = ({
  children,
  className,
}: DropzoneEmptyStateProps) => {
  const { src, accept, maxSize, minSize, maxFiles } = useDropzoneContext();

  if (src) {
    return null;
  }

  if (children) {
    return children;
  }

  let caption = "";

  if (accept) {
    caption += "Accepts ";
    caption += new Intl.ListFormat("en").format(Object.keys(accept));
  }

  if (minSize && maxSize) {
    caption += ` between ${renderBytes(minSize)} and ${renderBytes(maxSize)}`;
  } else if (minSize) {
    caption += ` at least ${renderBytes(minSize)}`;
  } else if (maxSize) {
    caption += ` less than ${renderBytes(maxSize)}`;
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className='flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground'>
        <UploadIcon size={16} />
      </div>
      <p className='my-2 w-full truncate text-wrap font-medium text-sm'>
        Upload {maxFiles === 1 ? "a file" : "files"}
      </p>
      <p className='w-full truncate text-wrap text-muted-foreground text-xs'>
        Drag and drop or click to upload
      </p>
      {caption && (
        <p className='text-wrap text-muted-foreground text-xs'>{caption}.</p>
      )}
    </div>
  );
};
