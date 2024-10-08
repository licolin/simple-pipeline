import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import {Metadata} from 'next';
import {auth} from '@/auth';
import {SessionProvider} from "next-auth/react";
// import "../build.css";
// import "antd/dist/reset.css" // Import the Ant Design CSS
// import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'pipeline',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
export default async function RootLayout({
                                           children,
                                         }: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("session user " + session?.user?.email);


  return (
      <html lang="en">
      <body className={`${inter.className} antialiased scrollbar-w-2 scrollbar-h-0 scrollbar`}>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
      </body>
      </html>
  );
}
