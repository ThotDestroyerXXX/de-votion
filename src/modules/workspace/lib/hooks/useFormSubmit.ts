import { FormValues } from "../schema";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { genUploader } from "uploadthing/client";
import { OurFileRouter } from "@/app/api/uploadthing/core";

export const useFormSubmit = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.workspace.createWorkspace.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      router.push("/");
    },
    onError: (error) => {
      console.error("Failed to update application status:", error);
      throw new Error("Failed to create workspace");
    },
  });

  const { mutateAsync: deleteWorkspace } =
    trpc.workspace.deleteWorkspace.useMutation({
      onSuccess: async () => {
        await utils.invalidate();
        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        console.error("Failed to delete application status:", error);
        throw new Error("Failed to delete workspace");
      },
    });

  const handleContinue = async (data: FormValues) => {
    if (data.name && data.description && data.image && data.type) {
      const { uploadFiles } = genUploader<OurFileRouter>();
      const response = await uploadFiles("imageUploader", {
        files: [data.image],
      });
      console.log(response[0].ufsUrl);
      try {
        await mutateAsync({
          name: data.name,
          description: data.description,
          type: data.type,
          image: response[0].ufsUrl,
        });
      } catch (error) {
        console.error("Failed to create workspace:", error);
        throw new Error("Failed to create workspace");
      }
    } else if (!data.name || !data.description || !data.image) {
      return;
    } else {
      router.replace("/workspace");
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspace();
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      throw new Error("Failed to delete workspace");
    }
  };

  return {
    handleContinue,
    handleDeleteWorkspace,
  };
};
