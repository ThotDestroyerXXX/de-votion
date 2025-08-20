import { trpc } from "@/trpc/client";
import { TeamspaceValues } from "../schema";

export const useFormSubmit = (
  setError: (error: string) => void,
  setOpen: (open: boolean) => void
) => {
  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.teamspace.createTeamspace.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update application status:", error);
      setError("Failed to create workspace");
    },
  });
  const handleSubmit = async (data: TeamspaceValues) => {
    await mutateAsync(data);
  };

  return {
    handleSubmit,
  };
};
