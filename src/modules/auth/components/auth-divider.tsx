"use client";

export const AuthDivider = () => {
  return (
    <div className='my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3'>
      <hr className='border-dashed' />
      <span className='text-muted-foreground text-xs'>Or continue with</span>
      <hr className='border-dashed' />
    </div>
  );
};
