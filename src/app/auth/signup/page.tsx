"use client"

import InputEmail from "@components/inputs/Email";
import InputPassword from "@components/inputs/Password";
import ProfilePhotoSelector from "@components/inputs/ProfilePhotoSelector";
import InputText from "@components/inputs/Text";
import { userContext } from "@context/UserContext";
import { API_PATHS } from "@utils/apiPaths";
import { getAvatars } from "@utils/avatars";
import axiosInstance from "@utils/axiosInstance";
import { validateEmail } from "@utils/helper";
import AuthLayout from "@components/layouts/AuthLayout";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const { updateUser } = useContext(userContext);

  const [profilePic, setProfilePic] = useState<string>(getAvatars()[0].src);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState<string|undefined>();

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if(!fullName) {
      setError("Por favor introduzca un nombre.");
      return;
    };
    if(!validateEmail(email)) {
      setError("Por favor introduzca una dirección de correo electrónico válida.");
      return;
    };
    if(!password) {
      setError("Por favor introduzca una contraseña válida.");
      return;
    };
    if(!adminInviteToken) {
      setError("Por favor introduzca un token.");
      return;
    };

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        profileImageUrl:profilePic,
        name:fullName,
        email,
        password,
        adminInviteToken,
      });

      const { token } = res.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(res.data);
        router.push("/dashboard");
      };

    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error register user", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    };
  };

  return(
    <AuthLayout>
      <div className="flex flex-col justify-center md:h-full">
        <h3 className="text-xl font-semibold text-primary-dark dark:text-primary-light">Crear Cuenta</h3>
        <p className="text-xs font-medium text-quaternary mt-[5px] mb-6">Únete a nosotros hoy mismo introduciendo tus datos a continuación</p>
        <form onSubmit={handleSubmit} className="">
          <ProfilePhotoSelector imageUrl={profilePic} setImageUrl={(file:string)=>setProfilePic(file)}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <InputText value={fullName} onChange={(value:string) => setFullName(value)} label="Nombre completo" placeholder="Nombre Apellido" autoComplete="name" />
            <InputEmail value={email} onChange={(value:string) => setEmail(value)} label="Correo Electrónico" placeholder="Nombre@Ejemplo.com"/>
            <InputPassword value={password} onChange={(value:string) => setPassword(value)} label="Contraseña" placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
            <InputText value={adminInviteToken} onChange={(value:string) => setAdminInviteToken(value)} label="Token" placeholder="Token de invitación"/>
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