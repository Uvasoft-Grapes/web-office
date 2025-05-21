"use client"

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useAuth } from "@context/AuthContext";
import { API_PATHS } from "@utils/apiPaths";
import axiosInstance from "@utils/axiosInstance";
import { getAvatars } from "@utils/avatars";
import { validateEmail } from "@utils/helper";
import AuthLayout from "@components/layouts/AuthLayout";
import EmailInput from "@components/inputs/Email";
import PasswordInput from "@components/inputs/Password";
import TextInput from "@components/inputs/Text";
import ProfilePhotoSelector from "@components/inputs/ProfilePhoto";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [profilePic, setProfilePic] = useState<string>(getAvatars()[0].src);
  const [error, setError] = useState<string|undefined>();

  const signup = async (data:{ name:string, email:string, password:string, token:string }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { profilePic, ...data });
      if(res.status === 201) {
        toast.success(res.data.message);
        updateUser(res.data.user);
        router.push("/");
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error register user", error);
      if(error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      };
    };
  };

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

//! Get form data
    const formData = new FormData(e.currentTarget);
    const name = formData.get('user-name')?.toString() || "";
    const email = formData.get("user-email")?.toString() || "";
    const password = formData.get("user-password")?.toString() || "";
    const token = formData.get("user-token")?.toString() || "";

//! Validate form data
    if(!profilePic) return setError("Selecciona una imagen de perfil.");
    if(!name?.trim()) return setError("Nombre obligatorio.");
    if(!validateEmail(email)) return setError("Por favor introduzca una dirección de correo electrónico válida.");
    if(password.trim().length < 8) return setError("La contraseña debe tener mínimo 8 caracteres.");
    if(!token.trim()) return setError("Por favor solicita un token de registro.");

//! Signup
    signup({ name, email, password, token });
  };

  return(
    <AuthLayout>
      <div className="flex flex-col justify-center md:h-full">
        <h3 className="text-xl font-semibold text-basic">Crear Cuenta</h3>
        <p className="text-xs font-medium text-quaternary mt-[5px] mb-6">Introduce tus datos a continuación para registrarte</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ProfilePhotoSelector imageUrl={profilePic} setImageUrl={(file:string)=>setProfilePic(file)}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput name="user-name" label="Nombre completo" placeholder="Nombre Apellido" autoComplete="nickname"/>
            <EmailInput name="user-email" label="Correo Electrónico" placeholder="Nombre@Ejemplo.com"/>
            <PasswordInput name="user-password" label="Contraseña" placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
            <TextInput name="user-token" label="Token" placeholder="Token de registro" autoComplete="none"/>
          </div>
        {error && 
          <p className="text-red-500 text-xs pb-2.5">{error}</p>
        }
          <button className="w-full p-[10px] my-1 rounded-md font-medium text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-primary-light bg-primary-dark dark:bg-primary-light hover:bg-tertiary-light dark:hover:bg-tertiary-dark shadow-lg shadow-quaternary/5 dark:shadow-quaternary/10 cursor-pointer duration-300">Crear cuenta</button>
          <div className="flex flex-wrap items-center gap-1 mt-3 text-[13px]">
            <p className="text-nowrap font-medium text-quaternary">¿Ya tienes una cuenta?</p>
            <Link href="/auth/login" className="text-nowrap font-medium text-blue-light dark:text-blue-dark hover:text-primary-dark dark:hover:text-primary-light underline duration-300">Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};