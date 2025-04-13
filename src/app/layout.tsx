import type { Metadata } from "next";
import { fontPoppins } from "@hooks/fonts";
import "./globals.css";
import UserProvider from "@context/UserContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Web Office",
  description: "Oficina virtual para la gestión de proyectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-lt-installed="true" suppressHydrationWarning={true}>
      <body
        className={`${fontPoppins.className} antialiased bg-primary-light dark:bg-primary-dark scroll-smooth`}
      >
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster toastOptions={{ className:"font-medium text-sm text-primary-dark dark:text-primary-light bg-primary-light dark:bg-primary-dark border border-quaternary", duration:5000 }}/>
      </body>
    </html>
  );
}
