"use client";
import { Invitation } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "../ui/button";
import { ErrorAlert } from "../error-alert";

export function InvitationCard({
  invitation,
  userName,
  organizationName,
}: Readonly<{
  invitation: Invitation;
  userName: string;
  organizationName: string;
}>) {
  const [error, setError] = useState<string | undefined>(undefined);
  const onAccept = async () => {
    const { error } = await authClient.organization.acceptInvitation({
      invitationId: invitation.id, // required
    });
    if (error) {
      setError(error.message);
    }
  };

  const onDecline = async () => {
    const { error } = await authClient.organization.rejectInvitation({
      invitationId: invitation.id, // required
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className='p-4 border rounded-lg shadow-sm mb-3'>
      <h3 className='font-medium text-lg'>{organizationName}</h3>
      <p className='text-sm text-muted-foreground'>Invited by {userName}</p>
      <p className='text-sm'>Role: {invitation.role || "Member"}</p>
      <p className='text-xs mt-1'>
        Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
      </p>
      <div className='flex gap-2 mt-3'>
        <Button variant='default' onClick={onAccept}>
          Accept
        </Button>
        <Button variant='outline' onClick={onDecline}>
          Decline
        </Button>
      </div>
      {error && <ErrorAlert message={error} />}
    </div>
  );
}
