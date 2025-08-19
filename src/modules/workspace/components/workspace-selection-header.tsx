"use client";

import { WorkspaceSelectionHeaderProps } from "../types";

export const WorkspaceSelectionHeader = ({
  title,
  subtitle,
}: WorkspaceSelectionHeaderProps) => {
  return (
    <div className='text-center'>
      <h2 className='font-bold text-lg'>{title}</h2>
      <h1 className='font-medium text-xl text-gray-500'>{subtitle}</h1>
    </div>
  );
};
