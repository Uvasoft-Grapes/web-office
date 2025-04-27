"use client"

import InputEmail from "@components/inputs/Email";
import InputPassword from "@components/inputs/Password";
import axiosInstance from "@utils/axiosInstance";
import { validateEmail } from "@utils/helper";
import AuthLayout from "@components/layouts/AuthLayout";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import { API_PATHS } from "@utils/apiPaths";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { userContext } from "@context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { updateUser } = useContext(userContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string|undefined>();

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if(!validateEmail(email)) {
      setError("Por favor introduzca una dirección de correo electrónico válida.");
      return;
    }
    if(!password) {
      setError("Por favor introduzca una contraseña válida.");
      return;
    };

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token } = res.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(res.data);
        router.push("/auth/desk");
      };

    } catch (error) {
      if(!isAxiosError(error)) return console.error(error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    };
  }; 

  return(
    <AuthLayout>
      <div className="flex flex-col justify-center lg:w-[70%] md:h-full">
        <h3 className="text-xl font-semibold text-primary-dark dark:text-primary-light">Bienvenido</h3>
        <p className="text-xs font-medium text-quaternary mt-[5px] mb-6">Por favor introduzca sus datos para iniciar sesión</p>
        <form onSubmit={handleSubmit}>
          <InputEmail value={email} onChange={(value:string) => setEmail(value)} label="Correo Electrónico" placeholder="Nombre@Ejemplo.com"/>
          <InputPassword value={password} onChange={(value:string) => setPassword(value)} label="Contraseña" placeholder="Mínimo 8 caracteres" autoComplete="current-password" />
        {error && 
          <p className="text-red-500 text-xs pb-2.5">{error}</p>
        }
          <button type="submit" className="w-full p-[10px] my-1 rounded-md font-medium text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light bg-primary-dark dark:bg-primary-light hover:bg-tertiary-light dark:hover:bg-tertiary-dark shadow-lg shadow-quaternary/5 dark:shadow-quaternary/10 cursor-pointer duration-300">Iniciar sesión</button>
          <div className="flex flex-wrap items-center gap-1 mt-3 text-[13px]">
            <p className="text-nowrap font-medium text-quaternary">¿No tienes una cuenta?</p>
            <Link href="/auth/signup" className="text-nowrap font-medium text-blue-light dark:text-blue-dark hover:text-primary-dark dark:hover:text-primary-light underline duration-300">Crear cuenta</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};