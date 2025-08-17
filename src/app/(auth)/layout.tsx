export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='flex flex-col gap-6'>
      {children}
      <div className='m-auto max-w-md text-center'>
        <span>
          Your name and photo are displayed to users who invite you to a
          workspace using your email. By Continuing, you acknowledge that you
          have read and understood the Terms of Service and Privacy Policy.
        </span>
      </div>
    </div>
  );
}
