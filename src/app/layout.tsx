import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from '@context/AuthContext';
import { fontPoppins } from "@hooks/fonts";
import { BRAND_NAME } from "@utils/data";
// import { ThemeContext } from "../context/ThemeContext";
import "@app/globals.css";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata: Metadata = {
  title:BRAND_NAME,
  description: "Oficina virtual para la gestión de proyectos",
};


export default function RootLayout({ children }: Readonly<{ children:React.ReactNode }>) {
  return (
    <html lang="es" data-lt-installed="true" suppressHydrationWarning={true} className="light">
      <body
        className={`${fontPoppins.variable} antialiased bg-primary-light dark:bg-primary-dark scroll-smooth`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster toastOptions={{ className:"font-medium text-sm text-primary-dark dark:text-blue-dark bg-primary-light dark:bg-primary-dark border border-quaternary", duration:5000 }}/>
        </ThemeProvider>
      </body>
    </html>
  );
};
