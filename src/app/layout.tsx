import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer';
import { isAuthenticated } from '@/lib/auth';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Navbar isAuthenticated={authed} />
        <div className="flex min-h-screen flex-col lg:pl-64 print:pl-0">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}