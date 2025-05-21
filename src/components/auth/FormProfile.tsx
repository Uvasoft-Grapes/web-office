import { FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { useAuth } from "@context/AuthContext";
import axiosInstance from "@utils/axiosInstance";
import { API_PATHS } from "@utils/apiPaths";
import { validateEmail } from "@utils/helper";
import EmailInput from "@components/inputs/Email";
import PasswordInput from "@components/inputs/Password";
import TextInput from "@components/inputs/Text";
import ProfilePhotoSelector from "@components/inputs/ProfilePhoto";
import toast from "react-hot-toast";
import { LuCheck } from "react-icons/lu";

export default function FormProfile({ closeForm }:{ closeForm:()=>void }) {
  const { user, updateUser } = useAuth();

  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");
  const [error, setError] = useState("");

  const updateUserData = async ({ name, email, profileImageUrl, newPassword, password }:{ name:string, email:string, profileImageUrl:string, newPassword:string, password:string }) => {
    if(!user) return;
    try {
      const res = await axiosInstance.put(API_PATHS.USERS.UPDATE_USER(user._id), { name, email, profileImageUrl, newPassword, password });
      if(res.status === 201) {
        toast.success(res.data.message);
        updateUser(res.data.user);
        closeForm();
      };
    } catch (error) {
      if(!isAxiosError(error)) return console.error("Error updating user:", error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      };
    }
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get('user-name')?.toString() || "";
    const email = formData.get('user-email')?.toString() || "";
    const newPassword = formData.get('new-password')?.toString() || "";
    const password = formData.get('user-password')?.toString() || "";

//! Validate form data
    if(!profileImageUrl) return setError("Selecciona una imagen de perfil.");
    if(!name?.trim()) return setError("Nombre obligatorio.");
    if(!validateEmail(email)) return setError("Por favor introduzca una dirección de correo electrónico válida.");
    if(newPassword.trim().length > 0 && newPassword.trim().length < 8) return setError("La contraseña debe tener mínimo 8 caracteres.");
    if(password.trim().length < 8) return setError("La contraseña debe tener mínimo 8 caracteres.");

    updateUserData({ name, email, profileImageUrl, newPassword, password });
  };

  return(
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-full">
      <div className="flex flex-col gap-6 overflow-y-auto">
        <ProfilePhotoSelector imageUrl={profileImageUrl} setImageUrl={setProfileImageUrl}/>
        <TextInput name="user-name" label="*Nombre" placeholder="Nombre Completo" autoComplete="name" defaultValue={user?.name}/>
        <EmailInput name="user-email" label="*Correo" placeholder="Correo@Ejemplo.com" defaultValue={user?.email}/>
        <PasswordInput name="new-password" label="Contraseña nueva" autoComplete="new-password" placeholder="Mínimo 8 caracteres"/>
        <PasswordInput name="user-password" label="*Contraseña actual" autoComplete="current-password" placeholder="Mínimo 8 caracteres"/>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <p className="flex-1 flex items-center min-h-5 font-medium text-xs text-red-light dark:text-red-dark overflow-hidden">{error}</p>
        <div className="flex flex-wrap-reverse gap-2">
          <button type="submit" className="flex-1 sm:flex-auto card-btn-fill w-fit sm:min-w-52">
            <LuCheck className="text-xl"/>
            Confirmar
          </button>
        </div>
      </div>
    </form>
  );
};