import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from '@context/AuthContext';
import { fontPoppins } from "@hooks/fonts";
import { BRAND_NAME } from "@utils/data";
import "@app/globals.css";

export const metadata: Metadata = {
  title:BRAND_NAME,
  description: "Oficina virtual para la gestión de proyectos",
};

export default function RootLayout({ children }: Readonly<{ children:React.ReactNode }>) {
  return (
    <html lang="es" data-lt-installed="true" suppressHydrationWarning={true}>
      <body
        className={`${fontPoppins.className} antialiased bg-primary-light dark:bg-primary-dark scroll-smooth`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster toastOptions={{ className:"font-medium text-sm text-basic bg-primary-light dark:bg-primary-dark border border-quaternary", duration:5000 }}/>
      </body>
    </html>
  );
};
