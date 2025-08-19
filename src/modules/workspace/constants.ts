import { WorkspaceType } from "./types";

export const WORKSPACE_TYPES = [
  {
    type: "personal" as WorkspaceType,
    title: "Personal",
    imageSrc: "/images/workspace/workspace-type-personal.png",
  },
  {
    type: "team" as WorkspaceType,
    title: "Team",
    imageSrc: "/images/workspace/workspace-type-team.png",
  },
];

export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
