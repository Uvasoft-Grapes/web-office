import Link from "next/link";
import { ReactNode } from "react";
import { PiDesktopDuotone } from "react-icons/pi";

export default function AuthLayout({ children }:{ children:ReactNode }) {
  return(
    <main className="flex">
      <section className="flex flex-col gap-6 w-screen lg:w-[60vw] h-fit lg:h-screen px-12 pt-4 pb-12">
        <Link href="/" className="flex items-center gap-1 w-fit text-primary-dark dark:text-primary-light">
          <PiDesktopDuotone className="text-xl"/>
          <h2 className="text-lg font-medium">Web Office</h2>
        </Link>
        {children}
      </section>
      <section className="hidden lg:flex items-center justify-center w-[40vw] h-screen bg-stone-950 dark:bg-stone-100 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <p className="text-stone-100 dark:text-stone-950 text-6xl">Imagen</p>
        {/* <Image src="" alt="" className="w-64 lg:w-[90%]"/> */}
      </section>
    </main>
  );
};