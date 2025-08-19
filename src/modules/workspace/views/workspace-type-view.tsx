"use client";

import { Button } from "@/components/ui/button";
import { WorkspaceTypeCard, WorkspaceSelectionHeader } from "../components";
import { WORKSPACE_TYPES } from "../constants";
import { WorkspaceType } from "../types";
import { useRouter } from "next/navigation";
import useAppFormContext from "../lib/hooks/useAppFormContext";

export const WorkspaceTypeView = () => {
  const router = useRouter();
  const { watch, setValue, trigger } = useAppFormContext();
  const type = watch("type") as WorkspaceType;

  const handleContinue = async () => {
    const isValid = await trigger("type");
    if (isValid) {
      router.push("/workspace/detail");
    }
  };

  return (
    <>
      <WorkspaceSelectionHeader
        title='How do you want to use DeVotion?'
        subtitle='This helps customize your experience'
      />

      <div className='grid grid-cols-2 gap-8'>
        {WORKSPACE_TYPES.map((workspace) => (
          <WorkspaceTypeCard
            key={workspace.type}
            type={workspace.type}
            title={workspace.title}
            imageSrc={workspace.imageSrc}
            isSelected={type === workspace.type}
            setValue={setValue}
          />
        ))}
      </div>

      <div className='w-full px-10'>
        <Button
          variant='default'
          className='w-full'
          disabled={!type}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleContinue();
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
};
