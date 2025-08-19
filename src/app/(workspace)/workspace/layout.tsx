import { Provider } from "@/modules/workspace/components/index";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <div className='flex flex-col gap-8 justify-center items-center w-full h-full max-w-lg mx-auto min-h-screen px-4 py-16'>
        {children}
      </div>
    </Provider>
  );
}
