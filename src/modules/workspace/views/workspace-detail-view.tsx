"use client";
import useAppFormContext from "../lib/hooks/useAppFormContext";
import { WorkspaceSelectionHeader } from "../components";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@hookform/error-message";
import { Textarea } from "@/components/ui/textarea";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../components/dropzone";
import Image from "next/image";

export const WorkspaceDetailView = () => {
  const { register, formState, watch, setValue } = useAppFormContext();

  const { errors, isSubmitting, isValidating } = formState;
  const image = watch("image");
  const pending = isSubmitting && isValidating;

  return (
    <>
      <WorkspaceSelectionHeader
        title='Give your workspace a name!'
        subtitle='Help you stay organized'
      />
      <div className='w-full grid gap-4'>
        <Dropzone
          accept={{ "image/*": [] }}
          maxSize={5 * 1024 * 1024} // 5MB
          src={image ? [image] : undefined}
          setValue={setValue}
          disabled={pending}
        >
          <DropzoneEmptyState />
          <DropzoneContent>
            {!!image && (
              <div className=' w-full aspect-square'>
                <Image
                  alt='Preview'
                  className='absolute top-0 left-0 h-full w-full object-cover'
                  src={URL.createObjectURL(image)}
                  fill
                />
              </div>
            )}
          </DropzoneContent>
        </Dropzone>
        <ErrorMessage
          name='image'
          errors={errors}
          as={<span className='text-red-500' />}
        />

        <div className='grid gap-1'>
          <Label>Name</Label>
          <Input {...register("name")} disabled={pending} />
          <ErrorMessage
            name='name'
            errors={errors}
            as={<span className='text-red-500' />}
          />
        </div>
        <div className='grid gap-1'>
          <Label>Description</Label>
          <Textarea {...register("description")} disabled={pending} />
          <ErrorMessage
            name='description'
            errors={errors}
            as={<span className='text-red-500' />}
          />
        </div>
        <Button type='submit' disabled={pending}>
          Continue
        </Button>
      </div>
    </>
  );
};
